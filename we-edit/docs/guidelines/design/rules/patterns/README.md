# 実装パターンガイドライン

## 基本原則

1. 関数型アプローチ
2. イミュータブルなデータ構造
3. 副作用の制御
4. 型安全性の確保

## 共通パターン

### 1. Result型によるエラー処理

```typescript
type Result<T, E> = Ok<T> | Err<E>;

// 成功ケース
const ok = <T>(value: T): Result<T, never> => ({
    type: "ok",
    value
});

// エラーケース
const err = <E>(error: E): Result<never, E> => ({
    type: "err",
    error
});

// 使用例
const divide = (a: number, b: number): Result<number, string> =>
    b === 0
        ? err("Division by zero")
        : ok(a / b);
```

### 2. バリデーションチェーン

```typescript
type Validator<T> = (value: T) => Result<T, ValidationError>;

const chain = <T>(
    validators: ReadonlyArray<Validator<T>>
): Validator<T> =>
    (value: T) =>
        validators.reduce(
            (acc, validator) => acc.chain(validator),
            ok(value)
        );

// 使用例
const validateTitle = chain([
    validateNotEmpty,
    validateLength(1, 100),
    validateFormat
]);
```

### 3. イミュータブルな更新

```typescript
const updateNote = (
    note: Note,
    update: NoteUpdate
): Result<Note, DomainError> =>
    validateUpdate(update)
        .map(validUpdate => ({
            ...note,
            ...validUpdate,
            metadata: {
                ...note.metadata,
                updated: Date.now()
            }
        }));
```

### 4. パイプライン処理

```typescript
const pipe = <T>(...fns: ReadonlyArray<(arg: T) => T>) =>
    (value: T): T =>
        fns.reduce((acc, fn) => fn(acc), value);

// 使用例
const processNote = pipe(
    validateNote,
    addMetadata,
    saveNote
);
```

### 5. 副作用の分離

```typescript
// 純粋な計算
const calculateTotal = (
    items: ReadonlyArray<Item>
): Result<number, Error> =>
    items.reduce(
        (acc, item) => acc.map(total => total + item.price),
        ok(0)
    );

// 副作用を含む処理
const saveOrder = async (
    order: Order
): Promise<Result<Order, Error>> =>
    calculateTotal(order.items)
        .chain(total =>
            persistOrder({ ...order, total })
        );
```

### 6. Factory関数

```typescript
const createNote = (
    title: string,
    content: string
): Result<Note, DomainError> =>
    validateTitle(title)
        .chain(validTitle =>
            validateContent(content)
                .map(validContent => ({
                    id: generateId(),
                    title: validTitle,
                    content: validContent,
                    metadata: createMetadata()
                }))
        );
```

### 7. 状態変更の追跡

```typescript
type StateChange<T> = {
    readonly before: T;
    readonly after: T;
    readonly timestamp: number;
    readonly reason?: string;
};

const trackChange = <T>(
    before: T,
    after: T,
    reason?: string
): StateChange<T> => ({
    before,
    after,
    timestamp: Date.now(),
    reason
});
```

### 8. メモ化

```typescript
const memoize = <T, U>(
    fn: (arg: T) => U
): (arg: T) => U => {
    const cache = new Map<T, U>();
    
    return (arg: T): U => {
        const cached = cache.get(arg);
        if (cached !== undefined) return cached;
        
        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
};
```

### 9. イベントハンドリング

```typescript
type EventHandler<T, E> = (
    event: T
) => Result<void, E>;

const createEventHandler = <T, E>(
    handlers: Map<string, EventHandler<T, E>>
) => (event: T): Result<void, E> =>
    handlers.has(event.type)
        ? handlers.get(event.type)!(event)
        : err("Unknown event type");
```

### 10. 非同期処理

```typescript
type AsyncResult<T, E> = Promise<Result<T, E>>;

const asyncPipe = <T, E>(
    ...fns: ReadonlyArray<(arg: T) => AsyncResult<T, E>>
) => async (
    initial: T
): AsyncResult<T, E> =>
    fns.reduce(
        async (acc, fn) =>
            (await acc).chain(value => fn(value)),
        Promise.resolve(ok(initial))
    );
```

## ベストプラクティス

1. 早期リターン
   ```typescript
   const processData = (data: unknown): Result<Data, Error> => {
       if (!isValid(data)) {
           return err(new ValidationError());
       }
       
       if (!hasPermission(data)) {
           return err(new PermissionError());
       }
       
       return ok(data);
   };
   ```

2. 型の絞り込み
   ```typescript
   const isCreateEvent = (
       event: Event
   ): event is CreateEvent =>
       event.type === "CREATE";
   
   const processEvent = (event: Event): Result<void, Error> =>
       isCreateEvent(event)
           ? handleCreate(event)
           : err(new UnknownEventError());
   ```

3. エラーの集約
   ```typescript
   const validateAll = <T, E>(
       results: ReadonlyArray<Result<T, E>>
   ): Result<ReadonlyArray<T>, ReadonlyArray<E>> => {
       const errors: E[] = [];
       const values: T[] = [];
       
       for (const result of results) {
           if (result.isErr()) {
               errors.push(result.error);
           } else {
               values.push(result.value);
           }
       }
       
       return errors.length > 0
           ? err(errors)
           : ok(values);
   };