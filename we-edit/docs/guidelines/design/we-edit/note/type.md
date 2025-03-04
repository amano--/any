# ノートシステム型定義

## 基本型

```typescript
// Note Identifier
export type NoteId = string & { readonly __brand: unique symbol };

// Content Format
export type ContentFormat =
    | "plain"
    | "markdown"
    | "rich-text";

// Content Type
export type NoteContent = {
    readonly format: ContentFormat;
    readonly text: string;
    readonly raw?: string;
};

// Metadata
export type NoteMetadata = {
    readonly created: number;
    readonly updated: number;
    readonly archived?: number;
    readonly version: number;
    readonly author: string;
};

// Tags
export type Tag = {
    readonly name: string;
    readonly color?: string;
};

// Category
export type Category = {
    readonly id: string;
    readonly name: string;
    readonly parentId?: string;
};
```

## ノート構造

```typescript
// Base Note Structure
export type Note = {
    readonly id: NoteId;
    readonly title: string;
    readonly content: NoteContent;
    readonly metadata: NoteMetadata;
    readonly tags: ReadonlyArray<Tag>;
    readonly categoryId?: string;
};

// Note State
export type NoteState = {
    readonly current: Note;
    readonly isArchived: boolean;
    readonly isLocked: boolean;
    readonly version: number;
};
```

## 検索・フィルタリング

```typescript
// Search Query
export type NoteSearchQuery = {
    readonly text?: string;
    readonly tags?: ReadonlyArray<string>;
    readonly categoryId?: string;
    readonly from?: number;
    readonly to?: number;
    readonly author?: string;
};

// Filter Options
export type NoteFilter = {
    readonly archived?: boolean;
    readonly format?: ContentFormat;
    readonly hasCategory?: boolean;
    readonly hasTags?: boolean;
    readonly modifiedSince?: number;
};

// Sort Options
export type NoteSortField =
    | "title"
    | "created"
    | "updated"
    | "category";

export type NoteSortOrder = {
    readonly field: NoteSortField;
    readonly ascending: boolean;
};
```

## 変更・更新

```typescript
// Update Operations
export type NoteUpdate = {
    readonly title?: string;
    readonly content?: NoteContent;
    readonly tags?: ReadonlyArray<Tag>;
    readonly categoryId?: string | null;
};

// Change Tracking
export type NoteChange = {
    readonly timestamp: number;
    readonly type: "title" | "content" | "tags" | "category";
    readonly before: unknown;
    readonly after: unknown;
    readonly author: string;
};

// Version Control
export type NoteVersion = {
    readonly number: number;
    readonly timestamp: number;
    readonly changes: ReadonlyArray<NoteChange>;
    readonly author: string;
};
```

## バリデーション

```typescript
// Title Validation
export type TitleValidation = {
    readonly minLength: number;
    readonly maxLength: number;
    readonly pattern: RegExp;
};

// Content Validation
export type ContentValidation = {
    readonly minLength: number;
    readonly maxLength: number;
    readonly allowedFormats: ReadonlyArray<ContentFormat>;
};

// Tag Validation
export type TagValidation = {
    readonly minLength: number;
    readonly maxLength: number;
    readonly maxCount: number;
    readonly pattern: RegExp;
};
```

## エラー型

```typescript
// Note Specific Errors
export type NoteErrorTag =
    | "INVALID_TITLE"
    | "INVALID_CONTENT"
    | "INVALID_FORMAT"
    | "INVALID_TAG"
    | "TAG_LIMIT"
    | "CATEGORY_NOT_FOUND"
    | "VERSION_MISMATCH"
    | "NOTE_LOCKED"
    | "NOTE_ARCHIVED";

export type NoteError = {
    readonly tag: NoteErrorTag;
    readonly message: string;
    readonly context: "note";
    readonly details?: unknown;
};
```

## イミュータブル操作

```typescript
// Creation
export type NoteCreation = {
    readonly title: string;
    readonly content: NoteContent;
    readonly tags?: ReadonlyArray<string>;
    readonly categoryId?: string;
};

// Modification
export type NoteModification = {
    readonly id: NoteId;
    readonly update: NoteUpdate;
    readonly reason?: string;
};

// Result Types
export type NoteResult<T> = Result<T, NoteError>;
export type NotePromise<T> = Promise<NoteResult<T>>;
```

## 使用例

```typescript
// Note Creation
const createNote = (
    creation: NoteCreation
): NoteResult<Note> =>
    validateTitle(creation.title)
        .chain(title =>
            validateContent(creation.content)
                .chain(content =>
                    validateTags(creation.tags ?? [])
                        .map(tags => ({
                            id: generateNoteId(),
                            title,
                            content,
                            tags,
                            metadata: {
                                created: Date.now(),
                                updated: Date.now(),
                                version: 1,
                                author: getCurrentUser()
                            }
                        }))
                )
        );

// Note Update
const updateNote = (
    note: Note,
    update: NoteUpdate
): NoteResult<Note> =>
    pipe(
        validateUpdate(update),
        chain(validUpdate => ({
            ...note,
            ...validUpdate,
            metadata: {
                ...note.metadata,
                updated: Date.now(),
                version: note.metadata.version + 1
            }
        }))
    );