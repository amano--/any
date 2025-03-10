# 実践的なパターン適用
by Scott Wlaschin

## なぜこの解説が必要か

We-Editプロジェクトでは、ブックマーク管理、記事管理、グループ階層など、複数の複雑なドメインが相互に関連しています。これらのドメインに関数型プログラミングのパターンを実践的に適用する方法を理解することは、システムの堅牢性と保守性を確保する上で重要です。この文書では、プロジェクトの具体的な課題に対して、どのようにパターンを適用するかを説明します。

## 1. 集約の実装

### 1.1 ブックマークの集約

```typescript
// 値オブジェクト
type BookmarkId = UUID & { readonly _brand: 'BookmarkId' };
type Tag = Readonly<{
  id: UUID;
  name: string;
  type: 'USER' | 'SYSTEM';
}>;

// 集約ルート
type BookmarkAggregate = Readonly<{
  id: BookmarkId;
  url: URL;
  title: string;
  tags: ReadonlyArray<Tag>;
  category: Option<Category>;
  createdAt: Date;
  updatedAt: Date;
  visibility: BookmarkVisibility;
}>;

// 集約操作
const BookmarkOperations = {
  create: (
    url: string,
    title: string
  ): TaskEither<ValidationError, BookmarkAggregate> =>
    pipe(
      validateUrl(url),
      chain(validUrl => ({
        id: generateBookmarkId(),
        url: validUrl,
        title,
        tags: [],
        category: None,
        createdAt: new Date(),
        updatedAt: new Date(),
        visibility: { type: 'PRIVATE' }
      }))
    ),

  addTag: (
    bookmark: BookmarkAggregate,
    tag: Tag
  ): Option<BookmarkAggregate> =>
    pipe(
      validateTagLimit(bookmark.tags),
      map(() => ({
        ...bookmark,
        tags: [...bookmark.tags, tag],
        updatedAt: new Date()
      }))
    ),

  changeVisibility: (
    bookmark: BookmarkAggregate,
    visibility: BookmarkVisibility
  ): BookmarkAggregate => ({
    ...bookmark,
    visibility,
    updatedAt: new Date()
  })
};
```

### 1.2 グループ階層の集約

```typescript
// 値オブジェクト
type GroupId = UUID & { readonly _brand: 'GroupId' };
type MemberRole = 'ADMIN' | 'OPERATOR' | 'MEMBER';

// メンバーシップの値オブジェクト
type GroupMembership = Readonly<{
  userId: UserId;
  role: MemberRole;
  joinedAt: Date;
}>;

// 集約ルート
type GroupAggregate = Readonly<{
  id: GroupId;
  name: string;
  members: ReadonlyArray<GroupMembership>;
  children: ReadonlyArray<GroupAggregate>;
  parentId: Option<GroupId>;
  depth: number;
}>;

// 集約操作
const GroupOperations = {
  create: (
    name: string,
    parentId: Option<GroupId> = None
  ): TaskEither<GroupError, GroupAggregate> =>
    pipe(
      validateGroupName(name),
      chain(validName => ({
        id: generateGroupId(),
        name: validName,
        members: [],
        children: [],
        parentId,
        depth: parentId.isSome() ? getParentDepth(parentId.value) + 1 : 0
      }))
    ),

  addMember: (
    group: GroupAggregate,
    userId: UserId,
    role: MemberRole
  ): Option<GroupAggregate> =>
    pipe(
      validateMemberLimit(group.members),
      map(() => ({
        ...group,
        members: [
          ...group.members,
          {
            userId,
            role,
            joinedAt: new Date()
          }
        ]
      }))
    ),

  addChild: (
    parent: GroupAggregate,
    child: GroupAggregate
  ): Option<GroupAggregate> =>
    pipe(
      validateChildLimit(parent.children),
      chain(() => validateDepthLimit(parent.depth + 1)),
      map(() => ({
        ...parent,
        children: [...parent.children, child]
      }))
    )
};
```

## 2. 複雑なドメインロジックの実装

### 2.1 ポイントシステム

```typescript
// ポイントの種類
type PointType =
  | { type: 'LOGIN_BONUS'; validityDays: number }
  | { type: 'MISSION_REWARD'; missionId: string }
  | { type: 'PURCHASE'; orderId: string }
  | { type: 'FRIEND_GIFT'; fromUserId: UserId };

// ポイントトランザクション
type PointTransaction = Readonly<{
  id: UUID;
  userId: UserId;
  pointType: PointType;
  amount: number;
  createdAt: Date;
  expiresAt: Date;
}>;

// ポイント操作
const PointOperations = {
  awardLoginBonus: (userId: UserId): TaskEither<PointError, PointTransaction> =>
    pipe(
      validateDailyLoginBonus(userId),
      chain(() => ({
        id: generateUUID(),
        userId,
        pointType: { type: 'LOGIN_BONUS', validityDays: 30 },
        amount: 100,
        createdAt: new Date(),
        expiresAt: addDays(new Date(), 30)
      }))
    ),

  calculateBalance: (
    transactions: ReadonlyArray<PointTransaction>,
    asOf: Date = new Date()
  ): number =>
    pipe(
      transactions,
      filter(tx => tx.expiresAt >= asOf),
      reduce((sum, tx) => sum + tx.amount, 0)
    )
};
```

### 2.2 通知システム

```typescript
// 通知の状態遷移
type NotificationStatus =
  | { type: 'DRAFT' }
  | { type: 'SCHEDULED'; scheduledAt: Date }
  | { type: 'SENT'; sentAt: Date }
  | { type: 'DELIVERED'; deliveredAt: Date }
  | { type: 'READ'; readAt: Date }
  | { type: 'FAILED'; error: string };

// 通知集約
type NotificationAggregate = Readonly<{
  id: UUID;
  senderId: UserId;
  recipients: ReadonlyArray<UserId>;
  content: string;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
}>;

// 通知操作
const NotificationOperations = {
  create: (
    senderId: UserId,
    recipients: ReadonlyArray<UserId>,
    content: string
  ): TaskEither<NotificationError, NotificationAggregate> =>
    pipe(
      validateRecipients(recipients),
      chain(validRecipients => ({
        id: generateUUID(),
        senderId,
        recipients: validRecipients,
        content,
        status: { type: 'DRAFT' },
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ),

  send: (
    notification: NotificationAggregate
  ): TaskEither<NotificationError, NotificationAggregate> =>
    pipe(
      validateNotificationStatus(notification),
      chain(() =>
        notification.status.type === 'DRAFT'
          ? right({
              ...notification,
              status: { type: 'SENT', sentAt: new Date() },
              updatedAt: new Date()
            })
          : left(new NotificationError('Invalid status transition'))
      )
    )
};
```

## まとめ

We-Editプロジェクトへの実践的なパターン適用において重要な点：

1. **集約の適切な設計**
   - 整合性境界の明確な定義
   - イミュータブルな操作の実装
   - バリデーションの統合

2. **ドメインロジックのカプセル化**
   - ビジネスルールの明示的な表現
   - 副作用の分離
   - 型安全性の確保

3. **状態遷移の管理**
   - 代数的データ型による状態の表現
   - 遷移の型レベルでの制約
   - バリデーションの一貫性

これらのパターンを適切に組み合わせることで、保守性が高く、バグの少ないシステムを実現できます。