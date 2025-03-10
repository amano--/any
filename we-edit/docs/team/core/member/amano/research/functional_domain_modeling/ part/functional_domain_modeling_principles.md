# 関数型ドメインモデリングの基本原則
by Scott Wlaschin

## なぜこの解説が必要か

We-Editプロジェクトにおいて、関数型ドメインモデリングの基本原則の理解は不可欠です。なぜなら、このプロジェクトは複雑なドメインロジック（ブックマーク管理、記事管理、グループ階層など）を持ち、それらを型安全かつ保守性の高い方法で実装する必要があるためです。私の著書「Domain Modeling Made Functional」で説明している原則を、We-Editの具体的なコンテキストに適用して解説します。

## 1. イミュータビリティの原則

### 1.1 なぜイミュータビリティが重要か

```typescript
// 従来の可変状態を持つアプローチの問題点
class NewspaperArticle {
  private content: string;
  private status: string;
  private comments: Comment[];

  addComment(comment: Comment) {
    this.comments.push(comment);  // 副作用：状態の直接変更
    this.status = 'updated';      // 隠れた副作用
  }
}

// イミュータブルな設計
type NewspaperArticle = Readonly<{
  content: string;
  status: ArticleStatus;
  comments: ReadonlyArray<Comment>;
}>;

const addComment = (
  article: NewspaperArticle, 
  comment: Comment
): NewspaperArticle => ({
  ...article,
  comments: [...article.comments, comment],
  status: { type: 'UPDATED', lastUpdated: new Date() }
});
```

### 1.2 イミュータブルなデータ構造の設計

```typescript
// グループ階層構造のイミュータブルな表現
type Group = Readonly<{
  id: GroupId;
  name: string;
  children: ReadonlyArray<Group>;
}>;

// グループ操作の純粋関数による実装
const addChildGroup = (
  parent: Group,
  childName: string
): Either<GroupError, Group> =>
  pipe(
    validateGroupDepth(parent),
    map(parent => ({
      ...parent,
      children: [
        ...parent.children,
        {
          id: generateGroupId(),
          name: childName,
          children: []
        }
      ]
    }))
  );
```

## 2. 代数的データ型による状態表現

### 2.1 タグ付き共用体の活用

```typescript
// ポイントシステムの状態表現
type PointTransaction =
  | { type: 'LOGIN_BONUS'; amount: number; expiresAt: Date }
  | { type: 'MISSION_REWARD'; amount: number; missionId: string }
  | { type: 'PURCHASE'; amount: number; orderId: string }
  | { type: 'TRANSFER'; 
      amount: number; 
      fromUserId: string;
      toUserId: string;
    };

// パターンマッチングによる網羅的な処理
const processTransaction = (
  transaction: PointTransaction
): TaskEither<Error, PointBalance> => {
  switch (transaction.type) {
    case 'LOGIN_BONUS':
      return handleLoginBonus(transaction);
    case 'MISSION_REWARD':
      return handleMissionReward(transaction);
    case 'PURCHASE':
      return handlePurchase(transaction);
    case 'TRANSFER':
      return handleTransfer(transaction);
  }
  // 型チェックが全パターンの網羅を保証
};
```

### 2.2 Smart Constructorsによる不変条件の保証

```typescript
// 値オブジェクトの型安全な生成
type NonEmptyString = string & { readonly _brand: unique symbol };
type PositiveNumber = number & { readonly _brand: unique symbol };

const createNonEmptyString = (value: string): Option<NonEmptyString> =>
  value.trim().length > 0
    ? Some(value as NonEmptyString)
    : None;

const createPositiveNumber = (value: number): Option<PositiveNumber> =>
  value > 0
    ? Some(value as PositiveNumber)
    : None;

// ブックマークの安全な生成
type Bookmark = Readonly<{
  title: NonEmptyString;
  url: URL;
  tags: ReadonlyArray<Tag>;
}>;

const createBookmark = (
  title: string,
  url: string,
  tags: string[]
): Either<ValidationError, Bookmark> =>
  pipe(
    sequenceT(option)(
      createNonEmptyString(title),
      parseURL(url),
      validateTags(tags)
    ),
    fromOption(() => new ValidationError('Invalid bookmark data')),
    map(([title, url, tags]) => ({
      title,
      url,
      tags
    }))
  );
```

## 3. 副作用の分離

### 3.1 純粋関数とエフェクトの区別

```typescript
// 純粋なドメインロジック
const calculatePointExpiration = (
  points: Points,
  currentDate: Date
): Points => ({
  ...points,
  amount: points.amount,
  isExpired: points.expiresAt < currentDate
});

// 副作用を含む操作
type PointsEffect = ReaderTaskEither<Dependencies, Error, Points>;

const awardPoints = (
  userId: UserId,
  amount: PositiveNumber
): PointsEffect =>
  pipe(
    ask<Dependencies>(),
    chain(deps =>
      pipe(
        deps.pointRepository.add(userId, amount),
        chain(deps.eventBus.publish('POINTS_AWARDED')),
        chain(deps.notificationService.notify(userId))
      )
    )
  );
```

### 3.2 Effect Systemによる副作用の制御

```typescript
// 依存性の型定義
type Dependencies = Readonly<{
  pointRepository: PointRepository;
  eventBus: EventBus;
  notificationService: NotificationService;
  logger: Logger;
}>;

// 複雑な操作の合成
const processBookmarkCreation = (
  userId: UserId,
  bookmark: Bookmark
): ReaderTaskEither<Dependencies, Error, void> =>
  pipe(
    ask<Dependencies>(),
    chain(deps =>
      pipe(
        // 1. ブックマークの保存
        deps.bookmarkRepository.save(bookmark),
        // 2. ポイントの付与
        chain(() => awardPoints(userId, 10 as PositiveNumber)),
        // 3. 関連ユーザーへの通知
        chain(() => notifyRelatedUsers(bookmark)),
        // 4. 検索インデックスの更新
        chain(() => updateSearchIndex(bookmark)),
        // エラー処理とロギング
        mapError(error => {
          deps.logger.error(error);
          return error;
        })
      )
    )
  );
```

## まとめ

We-Editプロジェクトにおける関数型ドメインモデリングの基本原則は：

1. **イミュータビリティの徹底**
   - 状態変更を明示的に
   - 並行処理の安全性確保
   - デバッグの容易さ

2. **代数的データ型による型安全性**
   - 不正な状態の排除
   - 全パターン網羅の保証
   - ドメインルールの型レベルでの表現

3. **副作用の明示的な管理**
   - 純粋関数とエフェクトの分離
   - 依存性の明示的な注入
   - テスト容易性の確保

これらの原則を適切に適用することで、保守性が高く、バグの少ない堅牢なシステムを構築できます。