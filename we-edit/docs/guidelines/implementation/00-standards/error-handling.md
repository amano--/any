# エラー処理ガイドライン

## 概要

本プロジェクトでは、エラー処理に`neverthrow`パッケージのResult型を使用します。これにより、型安全で予測可能なエラー処理を実現します。

## Result型の基本

### 定義と使用方法

```typescript
import { Result, ok, err } from "neverthrow";

// 成功時の値の型とエラー型を定義
type SuccessValue = { data: string };
type ErrorValue = { message: string };

// Result型を返す関数の例
function processData(input: string): Result<SuccessValue, ErrorValue> {
  try {
    // 処理が成功した場合
    return ok({ data: input });
  } catch (error) {
    // エラーが発生した場合
    return err({ message: "処理に失敗しました" });
  }
}
```

### エラー型の定義

エラー型は具体的で理解しやすい形で定義します：

```typescript
// タグ付きUnion型でエラーを表現
type ApiError =
  | { type: "network"; message: string }
  | { type: "validation"; fields: string[] }
  | { type: "unauthorized"; message: string };

function fetchData(): Result<Data, ApiError> {
  if (!isAuthenticated) {
    return err({ type: "unauthorized", message: "認証が必要です" });
  }
  // ...
}
```

## Result型の操作

### map / mapErr

値やエラーを変換する場合：

```typescript
const result = processData("input")
  .map(value => ({
    ...value,
    timestamp: new Date()
  }))
  .mapErr(error => ({
    type: "processed",
    originalError: error
  }));
```

### chain（flatMap）

Result型を返す関数を連鎖させる場合：

```typescript
const result = processData("input")
  .chain(value => validateData(value))
  .chain(value => saveData(value));
```

### match

結果に応じて処理を分岐する場合：

```typescript
const message = result.match(
  (value) => `成功: ${value.data}`,
  (error) => `エラー: ${error.message}`
);
```

## ベストプラクティス

1. 早期リターンの活用

```typescript
function processUser(input: unknown): Result<User, ValidationError> {
  // 型チェック
  if (!isValidInput(input)) {
    return err({ type: "validation", message: "Invalid input" });
  }

  // 業務ロジックチェック
  if (!meetsBusinessRules(input)) {
    return err({ type: "business", message: "Business rules not met" });
  }

  // 処理の実行
  return ok(createUser(input));
}
```

2. エラー型の具体化

```typescript
// ❌ 避けるべき例
type GenericError = {
  message: string;
};

// ✅ 推奨される例
type ValidationError = {
  type: "validation";
  field: string;
  message: string;
  constraints: Record<string, string>;
};
```

3. Result型の合成

```typescript
function validateAndSave(data: unknown): Result<User, ApiError> {
  return validateUser(data)          // Result<ValidatedData, ValidationError>
    .mapErr(toApiError)             // エラー型の変換
    .chain(saveToDatabase)          // Result<User, DatabaseError>
    .mapErr(toApiError);           // エラー型の統一
}
```

## エラー処理パターン

1. 集約エラー

複数のエラーを収集する場合：

```typescript
import { ResultAsync } from "neverthrow";

type ValidationErrors = string[];

function validateAll(data: unknown): Result<void, ValidationErrors> {
  const errors: string[] = [];
  
  if (!validateField1(data)) errors.push("Field1 is invalid");
  if (!validateField2(data)) errors.push("Field2 is invalid");
  
  return errors.length > 0 ? err(errors) : ok(undefined);
}
```

2. 非同期エラー処理

```typescript
type AsyncResult<T> = ResultAsync<T, ApiError>;

async function fetchWithRetry(url: string): AsyncResult<Data> {
  return ResultAsync.fromPromise(
    fetch(url).then(r => r.json()),
    (error: unknown) => ({
      type: "network",
      message: error instanceof Error ? error.message : "Network error"
    })
  );
}
```

3. エラー変換

```typescript
// エラー型の変換関数
function toApiError(error: unknown): ApiError {
  if (error instanceof DatabaseError) {
    return {
      type: "database",
      message: error.message,
      code: error.code
    };
  }
  return {
    type: "unknown",
    message: "An unexpected error occurred"
  };
}
```

## テスト戦略

Result型を使用したコードのテスト例：

```typescript
describe("Error handling", () => {
  it("should handle successful case", () => {
    const result = processData("valid input");
    expect(result.isOk()).toBe(true);
    result.match(
      value => expect(value.data).toBe("valid input"),
      error => fail("Should not reach error case")
    );
  });

  it("should handle error case", () => {
    const result = processData("");
    expect(result.isErr()).toBe(true);
    result.match(
      value => fail("Should not reach success case"),
      error => expect(error.type).toBe("validation")
    );
  });
});
```

## 移行ガイド

既存のtry-catchベースのコードからResult型への移行：

1. エラー型の定義
2. Result型を返す関数の作成
3. エラーハンドリングの修正
4. テストの更新

```typescript
// Before
function oldProcess(input: string): string {
  try {
    // 処理
    return "success";
  } catch (error) {
    throw new Error("Failed");
  }
}

// After
function newProcess(input: string): Result<string, ProcessError> {
  try {
    // 処理
    return ok("success");
  } catch (error) {
    return err({ type: "process", message: "Failed" });
  }
}