# プロンプトコーディングルール

## ロール定義

あなたは Typescript + React のエキスパートエンジニア兼 UI/UX デザイナーとして対応してください。

## 技術スタック

# TypeScript + React プロジェクトにおける重要な実装規約

## 1. 型安全性

### 1.1 変数宣言

- `type` と `const` のみを使用
- `let` と `var` の使用を禁止
- すべての変数に明示的な型アノテーションを付与

```typescript
// Good
type User = {
  id: string;
  name: string;
};

const user: User = {
  id: "1",
  name: "John",
};

// Bad
let name = "John"; // let の使用
var id = 1; // var の使用
```

### 1.2 Tagged Union

- 複数の状態を持つデータには Tagged Union を積極的に使用
- 状態の型安全性を確保
- パターンマッチングを活用

```typescript
// Good
type LoadState<T> =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; data: T }
  | { type: "error"; error: Error };

// 使用例
switch (state.type) {
  case "idle":
    return <Idle />;
  case "loading":
    return <Loading />;
  case "success":
    return <Success data={state.data} />;
  case "error":
    return <Error error={state.error} />;
  default:
    const _exhaustiveCheck: never = color
    throw new Error("unreachable:" + _exhaustiveCheck)
}
```

## 2. 国際化（i18n）

### 2.1 テキスト管理

- すべてのテキストは i18n リソースファイルで管理
- ハードコードされた文字列は禁止
- 翻訳キーは階層構造で管理

```typescript
// Good
const title = t("common.header.title");

// Bad
const title = "Welcome to our app"; // ハードコード
```

### 2.2 日付と数値

- 日付と数値はローカライズを考慮
- タイムゾーンを明示的に処理
- 数値フォーマットはロケールに応じて変更

## 3. テストとドキュメント

### 3.1 コロケーション

- テストファイルは実装ファイルと同じディレクトリに配置
- Storybookファイルも同様に配置
- 関連するファイルをグループ化

```
components/
  Button/
    Button.tsx
    Button.test.tsx
    Button.stories.tsx
    Button.module.css
```

### 3.2 テストカバレッジ

- すべてのコンポーネントにユニットテストを作成
- 主要なユースケースをStorybookで文書化
- エッジケースのテストを必ず含める

## 4. エラー処理

### 4.1 例外処理

- 型付きエラーを使用
- エラーの境界を明確に定義
- 未処理の例外を防止

```typescript
type Result<T> =
  | { type: "success"; value: T }
  | { type: "error"; error: Error };

const fetchData = async (): Promise<Result<Data>> => {
  try {
    const data = await api.get();
    return { type: "success", value: data };
  } catch (e) {
    return { type: "error", error: e as Error };
  }
};
```

## 5. コンポーネント設計

### 5.1 Props の型定義

- すべてのPropsに明示的な型定義
- 必須プロパティと任意プロパティを明確に区別
- 共通のProps型を再利用

```typescript
type ButtonProps = {
  variant: "primary" | "secondary";
  size: "small" | "medium" | "large";
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};
```

### 5.2 状態管理

- ローカル状態は`useState`のみ使用
- グローバル状態はストアで一元管理
- 非同期状態はTagged Unionで管理

## 6. パフォーマンス

### 6.1 メモ化

- 高コストな計算には`useMemo`を使用
- 再レンダリングの最適化に`memo`を使用
- 依存配列は明示的に定義

### 6.2 副作用

- 副作用は`useEffect`内でのみ実行
- クリーンアップ関数を適切に実装
- 依存配列の変更を最小限に抑える

## 7. コードスタイル

### 7.1 命名規則

- コンポーネント: PascalCase
- 関数: camelCase
- 型: PascalCase
- 定数: UPPER_SNAKE_CASE

### 7.2 ファイル構造

- 機能ごとにディレクトリを分割
- index.tsで公開APIを明示
- テストとストーリーを適切に配置
