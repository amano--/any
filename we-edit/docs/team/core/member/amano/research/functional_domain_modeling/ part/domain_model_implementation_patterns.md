# ドメインモデルの実装パターン
by Scott Wlaschin

## なぜこの解説が必要か

We-Editプロジェクトのような複雑なドメインを持つシステムでは、適切な実装パターンの選択が重要です。特に、ブックマーク管理、記事管理、グループ階層など、様々なドメインモデルが相互に関連する中で、型安全性を保ちながら保守性の高いコードを書く必要があります。この文書では、私の経験に基づいた実践的な実装パターンを、We-Editの具体的なユースケースに適用して解説します。

## 1. Smart Constructorsパターン

### 1.1 基本的な実装

```typescript
// ドメイン固有の型の定義
type GroupName = string & { readonly _brand: unique symbol };
type MemberCount = number & { readonly _brand: unique symbol };
type GroupDepth = number & { readonly _brand: unique symbol };

// Smart Constructors
const createGroupName = (name: string): Either<ValidationError, GroupName> =>
  pipe(
    name.trim(),
    (name) =>
      name.length >= 3 && name.length <= 50
        ? right(name as GroupName)
        : left(new ValidationError('Group name must be between 3 and 50 characters'))
  );

const createMemberCount = (count: number): Either<ValidationError, MemberCount> =>
  count >= 0 && count <= 1000
    ? right(count as MemberCount)
    : left(new ValidationError('Member count must be between 0 and 1000'));

const createGroupDepth = (depth: number): Either<ValidationError, GroupDepth> =>
  depth >= 0 && depth <= 5
    ? right(depth as GroupDepth)
    : left(new ValidationError('Group depth must be between 0 and 5'));
```

### 1.2 複合オブジェクトの構築

```typescript
// グループの定義
type Group = Readonly<{
  name: GroupName;
  memberCount: MemberCount;
  depth: GroupDepth;
  children: ReadonlyArray<Group>;
}>;

// ファクトリ関数
const createGroup = (
  name: string,
  memberCount: number,
  depth: number,
  children: ReadonlyArray<Group> = []
): Either<ValidationError, Group> =>
  pipe(
    sequenceT(either)(
      createGroupName(name),
      createMemberCount(memberCount),
      createGroupDepth(depth)
    ),
    map(([validName, validCount, validDepth]) => ({
      name: validName,
      memberCount: validCount,
      depth: validDepth,
      children
    }))
  );
```

## 2. Effect Systemによる副作用の分離

### 2.1 Effect型の定義

```typescript
// 基本的なEffect型
type Effect<R, E, A> = Reader<R, TaskEither<E, A>>;

// プロジェクト固有の型エイリアス
type BookmarkEffect<A> = Effect<BookmarkDependencies, BookmarkError, A>;
type ArticleEffect<A> = Effect<ArticleDependencies, ArticleError, A>;
type GroupEffect<A> = Effect<GroupDependencies, GroupError, A>;

// 依存性の定義
type BookmarkDependencies = Readonly<{
  bookmarkRepository: BookmarkRepository;
  tagService: TagService;
  searchIndex: SearchIndex;
}>;
```

### 2.2 ユースケースの実装

```typescript
// ブックマーク作成のユースケース
const createBookmark = (
  userId: UserId,
  url: string,
  tags: string[]
): BookmarkEffect<Bookmark> =>
  pipe(
    ask<BookmarkDependencies>(),
    chain(deps =>
      pipe(
        // 1. URLの検証
        validateUrl(url),
        // 2. タグの検証
        chain(validUrl => validateTags(tags, deps.tagService)),
        // 3. ブックマークの作成
        chain(validTags =>
          deps.bookmarkRepository.create({
            userId,
            url: validUrl,
            tags: validTags
          })
        ),
        // 4. 検索インデックスの更新
        chain(bookmark =>
          pipe(
            deps.searchIndex.index(bookmark),
            map(() => bookmark)
          )
        )
      )
    )
  );
```

## 3. 境界コンテキスト間の変換パターン

### 3.1 Anti-Corruption Layer

```typescript
// 異なるコンテキスト間のモデル
type BookmarkContext = {
  Bookmark: Bookmark;
  Tag: Tag;
};

type ArticleContext = {
  Article: Article;
  Category: Category;
};

// 変換レイヤー
const ArticleAdapter = {
  fromBookmark: (
    bookmark: BookmarkContext['Bookmark']
  ): TaskEither<ConversionError, ArticleContext['Article']> =>
    pipe(
      // 1. メタデータの取得
      fetchMetadata(bookmark.url),
      // 2. コンテンツの抽出
      chain(metadata =>
        pipe(
          fetchContent(bookmark.url),
          map(content => ({
            title: metadata.title,
            content,
            source: bookmark.url,
            category: convertTagToCategory(bookmark.tags[0])
          }))
        )
      )
    )
};
```

### 3.2 Shared Kernel

```typescript
// 共有カーネルの定義
type SharedTypes = {
  UserId: UserId;
  DateTime: DateTime;
  URL: URL;
  ValidationError: ValidationError;
};

// 各コンテキストでの使用
type BookmarkAggregate = Readonly<{
  id: UUID;
  userId: SharedTypes['UserId'];
  url: SharedTypes['URL'];
  createdAt: SharedTypes['DateTime'];
}>;

type ArticleAggregate = Readonly<{
  id: UUID;
  userId: SharedTypes['UserId'];
  sourceUrl: SharedTypes['URL'];
  publishedAt: SharedTypes['DateTime'];
}>;
```

## 4. バリデーションパターン

### 4.1 Validation Applicative

```typescript
// バリデーションの合成
type ValidationResult<T> = Either<ReadonlyArray<ValidationError>, T>;

const validateBookmark = (
  title: string,
  url: string,
  tags: string[]
): ValidationResult<NewBookmark> =>
  pipe(
    sequenceT(validateTitle(title), validateUrl(url), validateTags(tags)),
    map(([validTitle, validUrl, validTags]) => ({
      title: validTitle,
      url: validUrl,
      tags: validTags
    }))
  );

// バリデーションの並列実行
const validateBulkBookmarks = (
  bookmarks: ReadonlyArray<NewBookmark>
): ValidationResult<ReadonlyArray<NewBookmark>> =>
  pipe(
    bookmarks,
    traverse(either)(bookmark => validateBookmark(
      bookmark.title,
      bookmark.url,
      bookmark.tags
    ))
  );
```

### 4.2 Railway Oriented Programming

```typescript
// エラー処理の連鎖
const processBookmarkImport = (
  file: File
): TaskEither<ImportError, ImportResult> =>
  pipe(
    // 1. ファイル形式の検証
    validateFileFormat(file),
    // 2. パース処理
    chain(parseBookmarks),
    // 3. バリデーション
    chain(validateBulkBookmarks),
    // 4. 重複チェック
    chain(checkDuplicates),
    // 5. 保存処理
    chain(saveBookmarks),
    // エラーマッピング
    mapError(error => new ImportError(error.message))
  );
```

## まとめ

We-Editプロジェクトのような複雑なドメインモデルを実装する際は、以下のパターンが特に有効です：

1. **Smart Constructors**
   - 型レベルでの不変条件の保証
   - ドメインルールの明示的な表現
   - コンパイル時の安全性確保

2. **Effect System**
   - 副作用の明示的な分離
   - テスト容易性の向上
   - 依存性の管理

3. **境界コンテキスト間の変換**
   - モデルの整合性保持
   - コンテキスト間の明確な境界
   - 変更の影響範囲の制限

4. **バリデーション**
   - 型安全な検証ロジック
   - エラー処理の一貫性
   - ビジネスルールの明確な表現

これらのパターンを適切に組み合わせることで、保守性が高く、型安全な実装を実現できます。