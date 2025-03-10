# テスト戦略 - 関数型アプローチ
by Scott Wlaschin

## なぜこの解説が必要か

We-Editプロジェクトのような複雑なドメインロジックを持つシステムでは、適切なテスト戦略が不可欠です。関数型プログラミングの特徴である純粋関数、イミュータブルなデータ構造、代数的データ型は、より効果的で信頼性の高いテストを可能にします。この文書では、これらの特徴を活かしたテスト戦略について解説します。

## 1. Property-Based Testing

### 1.1 ドメインルールの検証

```typescript
import * as fc from 'fast-check';

// ブックマークのドメインルール検証
describe('Bookmark Aggregate', () => {
  // タグの数に関する不変条件
  it('should maintain tag limit invariant', () => {
    fc.assert(
      fc.property(
        bookmarkArbitrary,
        tagArbitrary,
        (bookmark, tag) => {
          const result = BookmarkOperations.addTag(bookmark, tag);
          return pipe(
            result,
            map(updated => updated.tags.length <= MAX_TAGS),
            getOrElse(() => true)
          );
        }
      )
    );
  });

  // URL形式の検証
  it('should only allow valid URLs', () => {
    fc.assert(
      fc.property(fc.string(), (url) => {
        const result = BookmarkOperations.create(url, 'Test Title');
        return pipe(
          result,
          fold(
            error => error instanceof ValidationError,
            _ => isValidUrl(url)
          )
        );
      })
    );
  });
});
```

### 1.2 状態遷移の検証

```typescript
// 通知の状態遷移テスト
describe('Notification State Transitions', () => {
  // 状態遷移の有効性検証
  it('should maintain valid state transitions', () => {
    fc.assert(
      fc.property(
        notificationArbitrary,
        stateTransitionArbitrary,
        (notification, transition) => {
          const result = NotificationOperations[transition](notification);
          return pipe(
            result,
            fold(
              error => isValidTransitionError(error),
              updated => isValidStateTransition(
                notification.status,
                updated.status
              )
            )
          );
        }
      )
    );
  });
});

// カスタムArbitraryの定義
const notificationArbitrary = fc.record({
  id: uuidArbitrary,
  status: fc.oneof(
    { type: 'DRAFT' },
    fc.record({ type: fc.constant('SENT'), sentAt: dateArbitrary }),
    fc.record({ type: fc.constant('DELIVERED'), deliveredAt: dateArbitrary })
  ),
  // ... その他のフィールド
});
```

## 2. 副作用のテスト

### 2.1 Effect Systemを使用したテスト

```typescript
// テスト用の依存性
type TestDependencies = Readonly<{
  bookmarkRepository: BookmarkRepository;
  searchIndex: SearchIndex;
  notificationService: NotificationService;
}>;

// モックの作成
const createTestDependencies = (): TestDependencies => ({
  bookmarkRepository: {
    save: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn()
  },
  searchIndex: {
    index: jest.fn(),
    remove: jest.fn()
  },
  notificationService: {
    notify: jest.fn()
  }
});

// Effect Systemを使用したテスト
describe('Bookmark Operations with Effects', () => {
  it('should handle bookmark creation with all effects', async () => {
    const deps = createTestDependencies();
    const bookmark = createTestBookmark();

    // モックの設定
    deps.bookmarkRepository.save.mockResolvedValue(bookmark);
    deps.searchIndex.index.mockResolvedValue(undefined);
    deps.notificationService.notify.mockResolvedValue(undefined);

    const result = await pipe(
      BookmarkOperations.create('https://example.com', 'Test'),
      chain(BookmarkOperations.save),
      provide(deps)
    )();

    expect(result).toBeRight();
    expect(deps.bookmarkRepository.save).toHaveBeenCalled();
    expect(deps.searchIndex.index).toHaveBeenCalled();
    expect(deps.notificationService.notify).toHaveBeenCalled();
  });
});
```

### 2.2 統合テスト

```typescript
// 実際の依存性を使用したテスト
describe('Bookmark Integration', () => {
  let deps: Dependencies;

  beforeAll(async () => {
    deps = await createTestContainer();
  });

  afterAll(async () => {
    await cleanupTestContainer(deps);
  });

  it('should handle complete bookmark lifecycle', async () => {
    const result = await pipe(
      // 1. ブックマークの作成
      BookmarkOperations.create('https://example.com', 'Test'),
      // 2. タグの追加
      chain(bookmark =>
        BookmarkOperations.addTag(bookmark, createTestTag())
      ),
      // 3. カテゴリの設定
      chain(bookmark =>
        BookmarkOperations.setCategory(bookmark, createTestCategory())
      ),
      // 4. 保存
      chain(BookmarkOperations.save),
      provide(deps)
    )();

    expect(result).toBeRight();
    
    // 保存されたブックマークの検証
    const saved = await deps.bookmarkRepository.findById(
      result.right.id
    );
    expect(saved).toBeSome();
    expect(saved.value).toMatchSnapshot({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });
});
```

## 3. テストデータの生成

### 3.1 Smart Constructor Testing

```typescript
describe('Smart Constructors', () => {
  describe('createGroupName', () => {
    it('should validate group name constraints', () => {
      fc.assert(
        fc.property(fc.string(), (name) => {
          const result = createGroupName(name);
          return pipe(
            result,
            fold(
              error => isValidationError(error),
              groupName =>
                name.length >= 3 &&
                name.length <= 50 &&
                groupName === name.trim()
            )
          );
        })
      );
    });
  });
});
```

### 3.2 ドメインジェネレータ

```typescript
// ドメインオブジェクトのジェネレータ
const createTestGroup = (
  depth: number = 0,
  override: Partial<Group> = {}
): Group => ({
  id: generateTestId(),
  name: `Test Group ${depth}`,
  members: [],
  children: depth < 5 ? [createTestGroup(depth + 1)] : [],
  parentId: depth === 0 ? None : Some(generateTestId()),
  depth,
  ...override
});

// プロパティテストでの使用
describe('Group Operations', () => {
  it('should maintain group depth invariant', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        (depth) => {
          const group = createTestGroup(depth);
          return pipe(
            GroupOperations.validate(group),
            fold(
              error => depth > 5,
              _ => depth <= 5
            )
          );
        }
      )
    );
  });
});
```

## まとめ

We-Editプロジェクトにおける関数型テスト戦略の主要ポイント：

1. **Property-Based Testing**
   - ドメインルールの包括的な検証
   - エッジケースの自動的な発見
   - 不変条件の保証

2. **Effect Systemを活用したテスト**
   - 副作用の分離とモック
   - 依存性の明示的な注入
   - テストの再現性確保

3. **テストデータ生成**
   - Smart Constructorのテスト
   - ドメイン固有のジェネレータ
   - 有効なテストデータの保証

これらの戦略により、信頼性の高いテストスイートを構築し、システムの品質を確保できます。