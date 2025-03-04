# エラー処理パターン

## 基本原則

1. Result型による明示的なエラー処理
2. 網羅的な型チェック
3. 合成可能なバリデーション
4. エラーの文脈保持

## Result型の活用

### 基本パターン

```typescript
import { Result, ok, err } from "neverthrow";

// エラータグの定義
export type ErrorTag =
    | "VALIDATION"
    | "NOT_FOUND"
    | "CONCURRENCY"
    | "SYSTEM";

// ドメインエラーの型定義
export type DomainError = {
    readonly tag: ErrorTag;
    readonly message: string;
    readonly context: string;
    readonly timestamp: number;
};

// エラー生成関数
export const createError = (
    tag: ErrorTag,
    message: string,
    context: string
): DomainError => ({
    tag,
    message,
    context,
    timestamp: Date.now()
});
```

### エラーチェーン

```typescript
export type ValidationResult<T> = Result<T, DomainError>;

// バリデーション関数の型
export type Validator<T> = (value: T) => ValidationResult<T>;

// バリデーションチェーンの作成
export const chain = <T>(
    validators: ReadonlyArray<Validator<T>>
): Validator<T> =>
    (value: T) =>
        validators.reduce(
            (acc, validator) => acc.chain(validator),
            ok(value)
        );

// 使用例
const validateTitle: Validator<string> = (title) =>
    title.length > 0
        ? ok(title)
        : err(createError(
            "VALIDATION",
            "Title cannot be empty",
            "note"
          ));

const validateLength: Validator<string> = (title) =>
    title.length <= 100
        ? ok(title)
        : err(createError(
            "VALIDATION",
            "Title too long",
            "note"
          ));

const titleValidator = chain([
    validateTitle,
    validateLength
]);
```

## バリデーションパターン

### 型による制約

```typescript
// 有効な値のみを受け入れる新しい型
export type NonEmptyString = string & { readonly __tag: unique symbol };

export const createNonEmptyString = (
    value: string
): ValidationResult<NonEmptyString> =>
    value.length > 0
        ? ok(value as NonEmptyString)
        : err(createError(
            "VALIDATION",
            "String cannot be empty",
            "validation"
          ));

// 正の数値のみを受け入れる型
export type PositiveNumber = number & { readonly __tag: unique symbol };

export const createPositiveNumber = (
    value: number
): ValidationResult<PositiveNumber> =>
    value > 0
        ? ok(value as PositiveNumber)
        : err(createError(
            "VALIDATION",
            "Number must be positive",
            "validation"
          ));
```

### 複合バリデーション

```typescript
export type Note = {
    readonly title: NonEmptyString;
    readonly content: NonEmptyString;
    readonly tags: ReadonlyArray<NonEmptyString>;
};

export const validateNote = (
    rawNote: {
        title: string;
        content: string;
        tags: ReadonlyArray<string>;
    }
): ValidationResult<Note> =>
    createNonEmptyString(rawNote.title)
        .chain(title =>
            createNonEmptyString(rawNote.content)
                .chain(content =>
                    validateTags(rawNote.tags)
                        .map(tags => ({
                            title,
                            content,
                            tags
                        }))
                )
        );

const validateTags = (
    tags: ReadonlyArray<string>
): ValidationResult<ReadonlyArray<NonEmptyString>> =>
    tags.reduce(
        (acc, tag) =>
            acc.chain(validTags =>
                createNonEmptyString(tag)
                    .map(validTag => [...validTags, validTag])
            ),
        ok([] as ReadonlyArray<NonEmptyString>)
    );
```

## エラー処理パターン

### 条件付き実行

```typescript
export const whenValid = <T, U>(
    value: ValidationResult<T>,
    fn: (value: T) => U
): Result<U, DomainError> =>
    value.map(fn);

// 使用例
const result = validateNote(rawNote)
    .chain(note =>
        whenValid(
            validatePermissions(userId, note),
            () => saveNote(note)
        )
    );
```

### エラー変換

```typescript
export const mapError = <T>(
    result: ValidationResult<T>,
    context: string
): ValidationResult<T> =>
    result.mapErr(error => ({
        ...error,
        context
    }));

// 使用例
const saveWithContext = <T>(
    result: ValidationResult<T>
): ValidationResult<T> =>
    mapError(result, "database");
```

## 非同期エラー処理

```typescript
import { ResultAsync } from "neverthrow";

export type AsyncValidationResult<T> = ResultAsync<T, DomainError>;

export const validateAsync = <T>(
    value: T,
    validator: (value: T) => Promise<boolean>
): AsyncValidationResult<T> =>
    ResultAsync.fromPromise(
        validator(value).then(valid =>
            valid ? value : Promise.reject()
        ),
        () => createError(
            "VALIDATION",
            "Async validation failed",
            "validation"
        )
    );

// 使用例
const validateUniqueName = (
    name: string
): AsyncValidationResult<string> =>
    validateAsync(
        name,
        async (value) => {
            const existing = await findByName(value);
            return existing === null;
        }
    );
```

## テストパターン

### バリデーションのテスト

```typescript
describe("Note Validation", () => {
    test("validates non-empty title", () => {
        const result = validateNote({
            title: "",
            content: "content",
            tags: []
        });

        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().tag).toBe("VALIDATION");
    });

    test("validates all tags", () => {
        const result = validateNote({
            title: "title",
            content: "content",
            tags: ["valid", ""]
        });

        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().message)
            .toContain("String cannot be empty");
    });
});
```

## エラーログ戦略

```typescript
export type ErrorLog = {
    readonly error: DomainError;
    readonly stackTrace?: string;
    readonly timestamp: number;
    readonly severity: "INFO" | "WARN" | "ERROR";
};

export const logError = (
    error: DomainError,
    severity: ErrorLog["severity"] = "ERROR"
): void => {
    const log: ErrorLog = {
        error,
        stackTrace: new Error().stack,
        timestamp: Date.now(),
        severity
    };
    
    // ログ出力処理（実装は環境に依存）
    console.error(JSON.stringify(log, null, 2));
};