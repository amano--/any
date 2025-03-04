# TypeScript型定義ガイドライン

## 基本原則

1. `type`と`const`のみを使用
2. イミュータブルな型定義
3. 判別可能なユニオン型
4. 厳格な型チェック

## 型定義規則

### 1. type宣言の使用

```typescript
// ✅ Good
type User = {
    readonly id: string;
    readonly name: string;
    readonly email: string;
};

// ❌ Bad - interfaceは使用しない
interface User {
    id: string;
    name: string;
    email: string;
}
```

### 2. const定数の使用

```typescript
// ✅ Good
export const ErrorTags = {
    VALIDATION: "VALIDATION",
    NOT_FOUND: "NOT_FOUND",
    SYSTEM: "SYSTEM"
} as const;

type ErrorTag = typeof ErrorTags[keyof typeof ErrorTags];

// ❌ Bad - enumは使用しない
enum ErrorTag {
    VALIDATION = "VALIDATION",
    NOT_FOUND = "NOT_FOUND",
    SYSTEM = "SYSTEM"
}
```

### 3. 判別可能なユニオン型

```typescript
// ✅ Good
type CreateEvent = {
    readonly type: "CREATE";
    readonly payload: CreatePayload;
};

type UpdateEvent = {
    readonly type: "UPDATE";
    readonly payload: UpdatePayload;
};

type Event = CreateEvent | UpdateEvent;

// イベントの処理
const handleEvent = (event: Event): Result<void, Error> => {
    switch (event.type) {
        case "CREATE":
            return handleCreate(event.payload);
        case "UPDATE":
            return handleUpdate(event.payload);
    }
};

// ❌ Bad - 判別できない型
type Event = {
    readonly payload: unknown;
    readonly timestamp: number;
};
```

### 4. イミュータブルな型定義

```typescript
// ✅ Good
type Note = {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly metadata: {
        readonly created: number;
        readonly updated: number;
    };
};

// ❌ Bad - ミュータブルな型
type Note = {
    id: string;
    title: string;
    content: string;
    metadata: {
        created: number;
        updated: number;
    };
};
```

### 5. ブランド型

```typescript
// ✅ Good
type UserId = string & { readonly __brand: unique symbol };
type Email = string & { readonly __brand: unique symbol };

// 型安全な生成関数
const createUserId = (id: string): Result<UserId, Error> =>
    validateId(id).map(id => id as UserId);

const createEmail = (email: string): Result<Email, Error> =>
    validateEmail(email).map(email => email as Email);

// ❌ Bad - 型安全性のない文字列
type UserId = string;
type Email = string;
```

### 6. 集約型の定義

```typescript
// ✅ Good
type UserState = {
    readonly data: User;
    readonly status: "active" | "inactive";
    readonly lastLogin: number;
};

type UserAction = 
    | { readonly type: "LOGIN"; readonly timestamp: number }
    | { readonly type: "LOGOUT"; readonly timestamp: number };

// ❌ Bad - 状態と操作が混在
type User = {
    data: UserData;
    status: string;
    login(): void;
    logout(): void;
};
```

### 7. 型の合成

```typescript
// ✅ Good
type WithTimestamp = {
    readonly timestamp: number;
};

type WithAuthor = {
    readonly author: string;
};

type Event = {
    readonly type: string;
    readonly payload: unknown;
} & WithTimestamp & WithAuthor;

// ❌ Bad - 重複した定義
type Event = {
    readonly type: string;
    readonly payload: unknown;
    readonly timestamp: number;
    readonly author: string;
};
```

### 8. Result型の使用

```typescript
// ✅ Good
type Result<T, E> = Ok<T> | Err<E>;

type Ok<T> = {
    readonly type: "ok";
    readonly value: T;
};

type Err<E> = {
    readonly type: "err";
    readonly error: E;
};

// 使用例
const divide = (a: number, b: number): Result<number, string> =>
    b === 0
        ? { type: "err", error: "Division by zero" }
        : { type: "ok", value: a / b };

// ❌ Bad - 例外を使用
const divide = (a: number, b: number): number => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
};
```

### 9. 型のバリデーション

```typescript
// ✅ Good
type ValidationResult<T> = Result<T, ValidationError>;

type Validator<T> = (value: T) => ValidationResult<T>;

const chain = <T>(
    validators: ReadonlyArray<Validator<T>>
): Validator<T> =>
    (value: T) =>
        validators.reduce(
            (acc, validator) => acc.chain(validator),
            ok(value)
        );

// ❌ Bad - 型安全でないバリデーション
const validate = (data: any): boolean => {
    // 型チェックなしのバリデーション
    return true;
};
```

### 10. ジェネリック型の制約

```typescript
// ✅ Good
type Entity = {
    readonly id: string;
};

type Repository<T extends Entity> = {
    readonly findById: (id: string) => Promise<Result<T, Error>>;
    readonly save: (entity: T) => Promise<Result<T, Error>>;
};

// ❌ Bad - 制約のない汎用型
type Repository<T> = {
    findById(id: any): Promise<T>;
    save(entity: T): Promise<T>;
};
```

## エラー処理パターン

### 型安全なエラー処理

```typescript
// エラータグの定義
export const ErrorTags = {
    VALIDATION: "VALIDATION",
    NOT_FOUND: "NOT_FOUND",
    SYSTEM: "SYSTEM"
} as const;

export type ErrorTag = typeof ErrorTags[keyof typeof ErrorTags];

// ドメインエラーの型
export type DomainError = {
    readonly tag: ErrorTag;
    readonly message: string;
    readonly context: string;
};

// Result型を使用したエラーハンドリング
export type ValidationResult<T> = Result<T, DomainError>;

export const validate = <T>(
    value: T,
    validator: (v: T) => boolean,
    errorMessage: string
): ValidationResult<T> =>
    validator(value)
        ? ok(value)
        : err({
            tag: ErrorTags.VALIDATION,
            message: errorMessage,
            context: "validation"
          });