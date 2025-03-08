# 標準コーディングルール

## 1. ロール定義

あなたは Typescript + React のエキスパートエンジニア兼 UI/UX デザイナーとして対応してください。

## 2. 基本方針

### 2.1 言語ポリシー

- コード中の変数名・関数名・クラス名・ファイル名などのコード要素：英語
- コメント、README、ドキュメント、コミットメッセージ：日本語

### 2.2 README作成・整備

- `README.md`を必ず作成し、日本語で記述
- `README.md`は変更が生じるたびに更新
- 重複コンテンツは避け、情報源を一元化
- READMEの章には絵文字を付与して可読性を向上

## 3. コーディング原則

### 3.1 基本原則

1. **DRY（Don't Repeat Yourself）**

   - 同一・類似処理は関数・モジュール化することで再利用性を高める

2. **責務の分離（Separation of Concerns）**

   - 各モジュール・クラス・関数は単一責務を明確にし、表現・ロジック・データ処理を分離

3. **KISS（Keep It Simple, Stupid）**

   - コードは可能な限りシンプルに保ち、過度な複雑化を避ける

4. **分割統治（Divide and Conquer）**

   - 大きな問題は小さな単位に分割し、テスト・保守性を向上

5. **防御的プログラミング（Defensive Programming）**

   - 入力値検証、例外処理、エラー対策を行い、堅牢性とセキュリティを確保

6. **YAGNI（You Aren't Gonna Need It）**

   - 現在の要件に集中し、不要な将来予測による過剰実装を避ける

7. **可読性とドキュメンテーション**

   - 変数・関数・クラス名は英語で、役割が一目でわかるような命名
   - コメントやREADMEでコードの意図・ロジックを日本語で明確に説明

8. **テスト駆動開発（TDD）とユニットテスト**

   - 基本機能にはユニットテストを用意
   - TDDを推奨し、要件定義→テスト→実装→リファクタリングのサイクルを確立

9. **バージョン管理とコードレビュー**

   - Gitで変更履歴を管理し、プルリクエストを通じてコードレビューを実施
   - ファイルを変更したら、変更があったファイルごとにコミットを行い、履歴管理を明確化

10. **SOLID原則の適用**
    - SRP, OCP, LSP, ISP, DIPを考慮し、拡張性・保守性の高い設計を実現

### 3.2 関数型プログラミング

#### 3.2.1 Lodashの活用

関数型プログラミングの実装にはLodashを積極的に活用します：

```typescript
import _ from "lodash";

// 関数合成
const processUser = _.flow([
  (user: User) => _.pick(user, ["id", "name", "email"]),
  (user: Pick<User, "id" | "name" | "email">) => _.mapValues(user, _.trim),
  (user: UserDTO) => _.assign({}, user, { updatedAt: new Date() }),
]);

// コレクション操作
const processUsers = (users: User[]): UserSummary[] =>
  _(users)
    .filter("isActive")
    .map((user) => _.pick(user, ["id", "name"]))
    .sortBy("name")
    .value();

// メモ化
const expensiveCalculation = _.memoize((input: string): number => {
  // 複雑な計算
  return input.length;
});
```

#### 3.2.2 イミュータビリティ

- `_.cloneDeep`での深いコピー
- `_.set`での新しいオブジェクト生成
- 配列操作は`_.concat`などを使用

```typescript
// オブジェクトの更新
const updateUser = (user: User, updates: Partial<User>): User =>
  _.assign({}, user, updates);

// 配列の操作
const addItem = <T>(items: T[], item: T): T[] => _.concat(items, [item]);
```

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
