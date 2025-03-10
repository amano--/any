# なぜ今、関数型ドメインモデリングか
by Scott Wlaschin

## はじめに - 解説文書の背景

We-Editプロジェクトのような現代的なWebアプリケーションにおいて、関数型ドメインモデリングの解説が求められる理由は明確です。このプロジェクトは、tRPC、Zod、Drizzle ORMなど、型安全性を重視した最新のTypeScriptエコシステムを採用しています。しかし、これらのツールを最大限に活用するためには、関数型プログラミングの原則に基づいたドメインモデリングの深い理解が不可欠です。

## 現代のソフトウェア開発における課題

### 1. 複雑性の増大

We-Editのようなシステムでは、以下のような複雑な要件が存在します：

- 複数の境界づけられたコンテキスト（会員、ブックマーク、記事、新聞など）
- 階層的なグループ構造（最大100の子グループ）
- 複雑な状態遷移（ブックマークのライフサイクル、通知の配信状態）
- 多様なビジネスルール（ポイントシステム、権限管理）

これらの複雑性を安全に管理するためには、従来の手続き型やオブジェクト指向プログラミングだけでは不十分です。

### 2. 並行処理と状態管理

現代のWebアプリケーションでは：

- リアルタイムな更新
- 非同期処理の複雑な組み合わせ
- 分散システムにおける状態の整合性

これらの課題に対して、イミュータブルなデータ構造と純粋関数による関数型アプローチが特に効果的です。

## 関数型アプローチが提供する解決策

### 1. 型による安全性の保証

```typescript
// 従来のアプローチ
class BookmarkStatus {
  status: string;
  constructor(status: string) {
    this.status = status; // 任意の文字列を許可してしまう
  }
}

// 関数型アプローチ
type BookmarkStatus =
  | { type: 'DRAFT' }
  | { type: 'PUBLISHED'; publishedAt: Date }
  | { type: 'ARCHIVED'; archivedAt: Date };

// コンパイル時に不正な状態遷移を防止
const archiveBookmark = (status: BookmarkStatus): BookmarkStatus => {
  switch (status.type) {
    case 'PUBLISHED':
      return { type: 'ARCHIVED', archivedAt: new Date() };
    default:
      throw new Error('Only published bookmarks can be archived');
  }
};
```

### 2. 副作用の明示的な管理

```typescript
// ポイント付与の副作用を明示的に分離
type PointAwardEffect = Reader<Dependencies, Task<Either<Error, Points>>>;

const awardLoginBonus = (): PointAwardEffect =>
  pipe(
    ask<Dependencies>(),
    chain(deps => () =>
      deps.pointRepository.add({
        type: 'LOGIN_BONUS',
        amount: 100,
        expiresAt: addDays(new Date(), 30)
      })
    )
  );
```

### 3. テスト容易性の向上

```typescript
// プロパティベースドテストによる網羅的な検証
describe('Bookmark Operations', () => {
  it('should maintain invariants after any state transition', () => {
    fc.assert(
      fc.property(
        bookmarkArbitrary,
        operationArbitrary,
        (bookmark, operation) => {
          const result = performOperation(bookmark, operation);
          return validateBookmarkInvariants(result);
        }
      )
    );
  });
});
```

## We-Editプロジェクトへの適用

### 1. 境界づけられたコンテキストの明確な分離

```typescript
// コンテキスト間の明示的な変換
type BookmarkContext = {
  Bookmark: Bookmark;
  Tags: ReadonlyArray<Tag>;
};

type NewspaperContext = {
  Article: Article;
  Section: Section;
};

const convertBookmarkToArticle = (
  bookmark: BookmarkContext['Bookmark']
): Either<Error, NewspaperContext['Article']> =>
  pipe(
    validateUrl(bookmark.url),
    chain(fetchContent),
    map(content => ({
      title: bookmark.title,
      content,
      source: bookmark.url
    }))
  );
```

### 2. ビジネスルールの型レベルでの表現

```typescript
// グループの階層制限を型で表現
type GroupDepth = 0 | 1 | 2 | 3 | 4 | 5;  // 最大5階層まで

type Group<D extends GroupDepth> = {
  id: GroupId;
  name: string;
  children: D extends 5 ? never : ReadonlyArray<Group<AddOne<D>>>;
};

// TypeScript 4.8以降で利用可能な型レベル演算
type AddOne<N extends number> = [
  ...TupleOfLength<N>,
  unknown
]['length'] extends infer R
  ? R extends GroupDepth
    ? R
    : never
  : never;
```

## まとめ

関数型ドメインモデリングは、We-Editプロジェクトが直面する現代的な課題に対する効果的な解決策を提供します：

1. 型安全性による堅牢性の確保
2. 副作用の制御による予測可能性の向上
3. テスト容易性の確保
4. ビジネスルールの明示的な表現

これらの利点は、プロジェクトで採用している最新のTypeScriptエコシステムと完全に整合し、保守性の高い堅牢なシステムの構築を可能にします。