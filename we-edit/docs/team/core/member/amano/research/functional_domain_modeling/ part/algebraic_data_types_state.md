# 代数的データ型による状態表現 - We-Editシステムでの実践的アプローチ

## なぜ代数的データ型による状態表現が必要か

We-Editシステムには、以下のような複雑な状態を持つドメインが存在します：

1. 会員の権限と階層構造
2. ブックマークと記事の分類体系
3. 複数種類のポイントシステム
4. 通知の配信と拡散状態
5. 決済処理のライフサイクル

これらの状態を安全に管理するために、代数的データ型（ADT）による表現が効果的です。TypeScriptでは判別合併型（Discriminated Unions）を使用してADTを表現できます。

## 1. 基本的な状態表現パターン

### 1.1 権限システムの表現

```typescript
// 役割の代数的データ型
type Role =
  | { type: 'SYSTEM_ADMIN' }
  | { type: 'SYSTEM_DEVELOPER' }
  | { type: 'STAFF_ADMIN' }
  | { type: 'STAFF' }
  | { type: 'GROUP_ADMIN'; groupId: string }
  | { type: 'GROUP_OPERATOR'; groupId: string }
  | { type: 'MEMBER' };

// 権限チェックの型安全な実装
const canManageSystem = (role: Role): boolean => {
  switch (role.type) {
    case 'SYSTEM_ADMIN':
      return true;
    case 'SYSTEM_DEVELOPER':
      return false; // 開発はできるが管理はできない
    default:
      return false;
  }
};

// グループ階層の表現
type GroupHierarchy = {
  id: string;
  name: string;
  level: number;
  children: ReadonlyArray<GroupHierarchy>;
  maxChildren: 100; // 制約の明示的な表現
};
```

### 1.2 コンテンツの状態管理

```typescript
// タグの代数的データ型
type Tag =
  | { type: 'OFFICIAL'; id: string; name: string }
  | { type: 'USER'; id: string; name: string; createdBy: string };

// カテゴリの代数的データ型（システム管理のみ）
type Category = {
  id: string;
  name: string;
  readonly type: 'SYSTEM_MANAGED';
};

// ブックマークの状態表現
type BookmarkState =
  | { type: 'DRAFT'; data: BookmarkData }
  | { type: 'ACTIVE'; data: BookmarkData; publishedAt: Date }
  | { type: 'ARCHIVED'; data: BookmarkData; archivedAt: Date }
  | { type: 'DELETED'; id: string; deletedAt: Date };

type BookmarkData = Readonly<{
  id: string;
  url: string;
  title: string;
  category: Category;
  tags: ReadonlyArray<Tag>;
}>;
```

## 2. 複雑な状態遷移の表現

### 2.1 通知システムの状態遷移

```typescript
// 通知の状態遷移を代数的データ型で表現
type NotificationState =
  | { type: 'CREATED'; data: NotificationData }
  | { type: 'SENT'; data: NotificationData; sentAt: Date }
  | { type: 'DELIVERED'; data: NotificationData; deliveredAt: Date }
  | { type: 'READ'; data: NotificationData; readAt: Date }
  | { type: 'FORWARDED'; 
      data: NotificationData; 
      forwardedAt: Date;
      forwardedBy: string;
      forwardCount: number;
    }
  | { type: 'FAILED'; 
      data: NotificationData;
      error: NotificationError;
      attempts: number;
    };

// 通知の状態遷移を制御する関数
const forwardNotification = (
  state: NotificationState,
  forwardedBy: string
): NotificationState => {
  if (state.type !== 'READ') {
    throw new Error('Can only forward read notifications');
  }

  return {
    type: 'FORWARDED',
    data: state.data,
    forwardedAt: new Date(),
    forwardedBy,
    forwardCount: 1
  };
};
```

### 2.2 ポイントシステムの状態管理

```typescript
// ポイントの種類を代数的データ型で表現
type Point =
  | { type: 'FREE'; 
      subtype: 'LOGIN_BONUS' | 'MISSION_BONUS' | 'ACTION_POINT';
      amount: number;
      expiresAt: Date;
    }
  | { type: 'PAID';
      subtype: 'MEMBER_POINT' | 'FRIENDSHIP_POINT' | 'SYSTEM_POINT';
      amount: number;
      expiresAt: Date;
      transactionId?: string;
    };

// ポイント残高の型安全な計算
type PointBalance = Readonly<{
  total: number;
  breakdown: ReadonlyArray<Point>;
}>;

const calculateExpiredPoints = (
  balance: PointBalance,
  asOf: Date
): PointBalance => {
  const validPoints = balance.breakdown.filter(
    point => point.expiresAt > asOf
  );
  
  return {
    total: validPoints.reduce((sum, p) => sum + p.amount, 0),
    breakdown: validPoints
  };
};
```

## 3. 決済システムの状態表現

```typescript
// 決済処理の状態遷移
type PaymentState =
  | { type: 'INITIALIZED';
      amount: number;
      currency: string;
    }
  | { type: 'PROCESSING';
      amount: number;
      currency: string;
      stripeSessionId: string;
    }
  | { type: 'COMPLETED';
      amount: number;
      currency: string;
      stripeSessionId: string;
      completedAt: Date;
      transactionId: string;
    }
  | { type: 'FAILED';
      amount: number;
      currency: string;
      stripeSessionId: string;
      error: PaymentError;
      failedAt: Date;
    }
  | { type: 'REFUNDED';
      amount: number;
      currency: string;
      stripeSessionId: string;
      transactionId: string;
      refundedAt: Date;
      reason: RefundReason;
    };

// 決済状態の遷移を制御する関数
const processPayment = async (
  state: PaymentState,
  stripe: StripeClient
): Promise<PaymentState> => {
  switch (state.type) {
    case 'INITIALIZED':
      // Stripe セッションの作成
      return {
        type: 'PROCESSING',
        amount: state.amount,
        currency: state.currency,
        stripeSessionId: await createStripeSession(state, stripe)
      };
    case 'PROCESSING':
      // 決済の完了確認
      const result = await checkPaymentStatus(state.stripeSessionId, stripe);
      return result.success
        ? {
            type: 'COMPLETED',
            ...state,
            completedAt: new Date(),
            transactionId: result.transactionId
          }
        : {
            type: 'FAILED',
            ...state,
            error: result.error,
            failedAt: new Date()
          };
    default:
      throw new Error(`Invalid state transition from ${state.type}`);
  }
};
```

## 4. 実践的なパターンとベストプラクティス

### 4.1 型の合成と分解

```typescript
// 基本的な型の合成
type UserId = string & { readonly _brand: unique symbol };
type GroupId = string & { readonly _brand: unique symbol };

// ドメインイベントの表現
type DomainEvent =
  | { type: 'BOOKMARK_CREATED'; bookmark: BookmarkState }
  | { type: 'NOTIFICATION_SENT'; notification: NotificationState }
  | { type: 'POINTS_AWARDED'; points: Point }
  | { type: 'PAYMENT_COMPLETED'; payment: PaymentState };

// イベントハンドラの型安全な実装
const handleDomainEvent = (event: DomainEvent): void => {
  switch (event.type) {
    case 'BOOKMARK_CREATED':
      // ブックマーク作成後の処理
      break;
    case 'NOTIFICATION_SENT':
      // 通知送信後の処理
      break;
    case 'POINTS_AWARDED':
      // ポイント付与後の処理
      break;
    case 'PAYMENT_COMPLETED':
      // 決済完了後の処理
      break;
  }
};
```

### 4.2 バリデーションと型の保証

```typescript
// Smart Constructor パターン
const createUserId = (id: string): Option<UserId> =>
  id.match(/^[A-Z0-9]{8}$/)
    ? Some(id as UserId)
    : None;

// 型レベルでの制約
type NonEmptyArray<T> = [T, ...T[]];
type PositiveNumber = number & { readonly _brand: unique symbol };

// バリデーション関数
const createPositiveNumber = (n: number): Option<PositiveNumber> =>
  n > 0 ? Some(n as PositiveNumber) : None;

// 実際の使用例
const createBookmark = (
  url: string,
  tags: NonEmptyArray<Tag>
): Option<BookmarkState> =>
  pipe(
    validateUrl(url),
    map(validUrl => ({
      type: 'DRAFT' as const,
      data: {
        id: generateId(),
        url: validUrl,
        tags: tags,
        createdAt: new Date()
      }
    }))
  );
```

## まとめ

代数的データ型による状態表現は、We-Editシステムにおいて以下の利点をもたらします：

1. **型安全性の確保**
   - コンパイル時に状態の整合性を保証
   - 不正な状態遷移を防止

2. **ドメインの明確な表現**
   - 状態と遷移を明示的に定義
   - ビジネスルールを型システムで表現

3. **保守性の向上**
   - 状態変更の影響範囲を特定しやすい
   - リファクタリングの安全性が向上

4. **テストの容易さ**
   - 状態遷移のテストが明確
   - エッジケースの把握が容易

これらの利点を活かし、We-Editの複雑なドメインロジックを安全に実装することが可能になります。