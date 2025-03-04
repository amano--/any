# ノートシステム設計

## 概要

イベントソーシングパターンを活用したノート管理システムの設計仕様です。

## 目次

- [型定義](./type.md) - ノートシステムの型定義
- [データベーススキーマ](./schema.md) - 永続化層の設計

## 設計目標

1. イミュータブルなノートデータ管理
2. リッチなメタデータサポート
3. 効率的な検索と整理機能
4. バージョン管理と変更履歴

## 主要機能

### ノート管理

```typescript
// ノート操作
export type NoteOps = {
    readonly create: (
        title: string,
        content: string
    ) => ValidationResult<Note>;

    readonly update: (
        id: NoteId,
        content: string
    ) => ValidationResult<Note>;

    readonly archive: (
        id: NoteId
    ) => ValidationResult<Note>;

    readonly delete: (
        id: NoteId
    ) => ValidationResult<void>;
};

// 検索機能
export type NoteQueries = {
    readonly findById: (
        id: NoteId
    ) => ValidationResult<Note>;

    readonly search: (
        query: NoteSearchQuery
    ) => ValidationResult<ReadonlyArray<Note>>;

    readonly list: (
        filter: NoteFilter
    ) => ValidationResult<ReadonlyArray<Note>>;
};
```

## イベント統合

### ノートイベント

```typescript
// イベントの生成
const createNoteEvent = (
    title: string,
    content: string
): ValidationResult<CreateEvent<NoteData>> =>
    validateTitle(title)
        .chain(validTitle =>
            validateContent(content)
                .map(validContent => ({
                    title: validTitle,
                    content: validContent
                }))
        )
        .map(data => ({
            ei: generateULID(),
            b: "n",  // note context
            g: "c",  // content group
            f: "c",  // create feature
            a: "create",
            type: "CREATE",
            payload: { data }
        }));

// イベントの適用
const applyNoteEvent = (
    state: NoteState,
    event: Event<NoteData>
): ValidationResult<NoteState> => {
    switch (event.type) {
        case "CREATE":
            return handleCreate(state, event);
        case "UPDATE":
            return handleUpdate(state, event);
        case "DELETE":
            return handleDelete(state, event);
        default:
            return err(createError(
                "INVALID_EVENT",
                `Unknown event type: ${event.type}`,
                "note"
            ));
    }
};
```

## タグとカテゴリ

### タグ管理

```typescript
export type TagOps = {
    readonly addTag: (
        noteId: NoteId,
        tag: string
    ) => ValidationResult<Note>;

    readonly removeTag: (
        noteId: NoteId,
        tag: string
    ) => ValidationResult<Note>;

    readonly findByTag: (
        tag: string
    ) => ValidationResult<ReadonlyArray<Note>>;
};
```

### カテゴリ管理

```typescript
export type CategoryOps = {
    readonly setCategory: (
        noteId: NoteId,
        categoryId: string
    ) => ValidationResult<Note>;

    readonly removeCategory: (
        noteId: NoteId
    ) => ValidationResult<Note>;

    readonly findByCategory: (
        categoryId: string
    ) => ValidationResult<ReadonlyArray<Note>>;
};
```

## 変更履歴管理

```typescript
export type HistoryOps = {
    readonly getHistory: (
        noteId: NoteId
    ) => ValidationResult<ReadonlyArray<NoteEvent>>;

    readonly revertTo: (
        noteId: NoteId,
        version: number
    ) => ValidationResult<Note>;

    readonly diff: (
        noteId: NoteId,
        fromVersion: number,
        toVersion: number
    ) => ValidationResult<NoteDiff>;
};
```

## エラー処理

```typescript
// ノート固有のエラー
export type NoteErrorTag =
    | "INVALID_TITLE"
    | "INVALID_CONTENT"
    | "NOTE_NOT_FOUND"
    | "VERSION_CONFLICT"
    | "TAG_LIMIT_EXCEEDED";

// エラーハンドリング
const handleNoteError = (
    error: DomainError
): void => {
    if (error.tag === "NOTE_NOT_FOUND") {
        showNotFoundError();
    } else if (error.tag === "VERSION_CONFLICT") {
        showConflictResolution();
    } else {
        showGenericError(error);
    }
};
```

## テスト戦略

### ユニットテスト

```typescript
describe("Note Operations", () => {
    test("creates valid note", () => {
        const result = createNote("Title", "Content");
        expect(result.isOk()).toBe(true);
    });

    test("validates title", () => {
        const result = createNote("", "Content");
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().tag).toBe("INVALID_TITLE");
    });
});
```

### イベントテスト

```typescript
describe("Note Events", () => {
    test("applies create event", () => {
        const event = createNoteEvent("Title", "Content");
        const result = applyNoteEvent(initialState, event.unwrap());
        expect(result.isOk()).toBe(true);
    });
});
```

## パフォーマンス最適化

1. インデックス戦略
   - タイトルの全文検索
   - タグベースの検索
   - カテゴリベースのフィルタリング

2. キャッシュ戦略
   - 頻繁にアクセスされるノートのキャッシュ
   - タグクラウドのキャッシュ
   - カテゴリツリーのキャッシュ

3. バッチ処理
   - 一括タグ更新
   - カテゴリ移動
   - アーカイブ処理