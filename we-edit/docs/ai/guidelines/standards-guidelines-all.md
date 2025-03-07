# AI Implementation Standards Guidelines (AI読み込み専用)

⚠️ **注意: このファイルはAI実装用の統合ガイドラインです** ⚠️

このドキュメントは自動生成された実装標準ガイドラインの統合ファイルです。
人間による直接参照は意図されていません。代わりに個別のガイドラインを参照してください。

## ソースファイル一覧

- [mock-api-with-trpc.md](../../guidelines/implementation/standards/mock-api-with-trpc.md)
- [event-sourcing.md](../../guidelines/implementation/standards/event-sourcing.md)
- [ai-implementation.md](../../guidelines/implementation/standards/ai-implementation.md)
- [data-fetching.md](../../guidelines/implementation/standards/data-fetching.md)
- [i18n-guidelines.md](../../guidelines/implementation/standards/i18n-guidelines.md)
- [error-handling.md](../../guidelines/implementation/standards/error-handling.md)
- [react-components.md](../../guidelines/implementation/standards/react-components.md)
- [domain-model-implementation.md](../../guidelines/implementation/standards/domain-model-implementation.md)

---


# ai-implementation

# AI開発支援者のためのプロジェクトガイドライン

## 概要

このガイドラインは、AIを活用したソフトウェア開発プロセスを標準化し、プロジェクトの品質と一貫性を確保することを目的としています。

## 1. 実装計画書の作成と管理

### 基本ルール

- 新規実装の開始時に実装計画書を必ず作成すること
- 実装に際し、読み込んだファイルや読み込みを指示されたファイルは重要書類として参照リンクをマークダウン形式で記録する。
- 保存場所: 対象ファイルと同じディレクトリの `[機能名]/logs/ai/YYYY-MM` フォルダー内
- ファイル命名規則: `YYYY-MM-DD_HH_MM-実装計画名.md`
- ソースコード末尾に実装計画書へのリンクをマークダウン形式で必ずコメントとして記載

### 実装計画書の構成

```markdown
# 実装計画: [機能名]

作成日: YYYY-MM-DD HH:MM

## 1. 概要

- 実装する機能の簡潔な説明
- 目的と期待される効果

## 2. 技術的アプローチ

- 選択した実装方法の説明
- 使用する技術やライブラリ
- アーキテクチャ上の配置

## 3. タスク分割

- [ ] タスク1: 説明
- [ ] タスク2: 説明
  - [ ] サブタスク2.1
  - [ ] サブタスク2.2

## 4. 考慮事項

- パフォーマンス要件
- セキュリティ要件
- スケーラビリティ要件

## 5. テスト計画

- 単体テストの範囲
- 統合テストの範囲
- E2Eテストの範囲
```

## 2. ドキュメント管理

### 文書の種類と配置

- 関連ドキュメントも `[機能名]/logs/ai/YYYY-MM` フォルダーに保存
- 同一の命名規則を適用: `YYYY-MM-DD_HH_MM-ドキュメント名.md`
- ドキュメント間の関連性を明確に記載

### ドキュメント構造

- 目的と範囲の明確な記述
- 技術的な詳細と根拠の説明
- 関連する実装計画書や他のドキュメントへの参照
- 更新履歴の管理

## 3. コメント記述ガイドライン

### 実装計画書リンクの管理

コンポーネントの先頭には現在の実装計画書のリンクのみを記載し、実装履歴は最下部に記載します：

先頭：

```typescript
/*
 * [実装計画書](実装計画書への相対パス)
 */
```

最下部：

```typescript
/*
 * 実装履歴:
 * - 2025-03-02: [実装計画書](path/to/latest.md) - 3パネルレイアウトの実装
 * - 2025-03-01: [実装計画書](path/to/old.md) - カード表示の追加
 */
```

- マークダウンリンク形式で記述
- 履歴は新しい順に記載
- 日付と変更概要を含める

### コンポーネント構成の記録

```typescript
/**
 * @ai_component_structure
 * レイアウト構成:
 * - [コンポーネント名]: [役割]
 *   - [子コンポーネント1]: [役割]
 *   - [子コンポーネント2]: [役割]
 *
 * 状態管理:
 * - [状態名]: [用途]
 *
 * イベントハンドラ:
 * - [イベント名]: [処理内容]
 */
```

### AIの意思決定プロセスの記録

```typescript
/**
 * @ai_decision
 * 選択した実装アプローチ: [アプローチ名]
 * 理由:
 * 1. [理由1の説明]
 * 2. [理由2の説明]
 *
 * 検討した代替案:
 * - 案1: [説明] - 不採用理由: [理由]
 * - 案2: [説明] - 不採用理由: [理由]
 */
```

### 実装の説明

```typescript
/**
 * @ai_implementation
 * 機能: [機能の説明]
 * アルゴリズム: [使用しているアルゴリズムの説明]
 * パフォーマンス考慮:
 * - [パフォーマンスに関する考慮事項1]
 * - [パフォーマンスに関する考慮事項2]
 */
```

## 4. コード実装時の注意事項

### 機能ブロックの文書化

- 各機能の目的と役割を明確に説明
- 入力と出力の仕様を記載
- 依存関係の明示
- エラーハンドリングの方針

### パフォーマンス最適化

- クリティカルパスの特定と文書化
- パフォーマンスメトリクスの設定
- 最適化の根拠と効果の記録

### テスト戦略

- テストケースの選定理由
- エッジケースの考慮
- 自動化テストの範囲と手動テストの範囲

## 5. プロジェクト品質維持のためのベストプラクティス

### コードレビューチェックリスト

- [ ] 実装計画書との整合性
- [ ] AIの意思決定プロセスの明確な記録
- [ ] パフォーマンス要件の充足
- [ ] セキュリティ考慮事項の実装
- [ ] テストの網羅性
- [ ] ドキュメントの更新

### 技術的負債の管理

- 技術的負債の特定と記録
- 優先順位付けと対応計画
- 定期的なレビューと更新

## 6. コミット管理

### コミットメッセージの形式

```bash
# プレフィックス規則
# feat: 新機能
# fix: バグ修正
# refactor: リファクタリング
# docs: ドキュメント
# test: テスト関連
# chore: その他の変更

feat: 機能名や変更内容の要約

- 詳細な変更点1
- 詳細な変更点2
- 詳細な変更点3

改善点：
- 技術的な改善点
- パフォーマンスの改善
- ドキュメントの更新

🤖 ${K4}で生成
Co-Authored-By: Claude <noreply@anthropic.com>
```

### コミットの粒度

- 作業終了時に1つのコミット
- 関連する変更はまとめて1つのコミットに
- テストとドキュメントは実装と同じコミットに含める

### コミットの確認項目

- [ ] 適切なプレフィックスを使用している
- [ ] 変更内容が明確に説明されている
- [ ] 改善点が明記されている
- [ ] 関連するテストとドキュメントが含まれている
- [ ] AIによる生成であることが明記されている

## 7. 継続的改善

### 振り返りと教訓

- 実装完了後のレビュー実施
- 成功点と課題点の記録
- 改善提案の収集

### パフォーマンス測定

- 定量的指標の設定と測定
- ベンチマーク結果の記録
- 改善の効果検証

### ナレッジベース

- 共通の課題と解決策の蓄積
- ベストプラクティスの更新
- チーム間での知見共有

## AI実装ガイドラインの場所

AI用の詳細な実装ガイドラインは　docs/ai/guidelines/　以下の場所にあります：

## ガイドライン作成・更新の手順

AI実装ガイドラインを作成・更新する場合は、以下のドキュメントを参照してください：

- docs/ai/docs/ai-guidelines-creation.md

## メモリバンクとの連携

AIの実装は常にメモリバンク（.cline/memory/）と連携して動作します。
新しいガイドラインを追加した場合は、以下の更新が必要です：

1. systemPatterns.mdにガイドラインの存在を記録
2. activeContext.mdに変更内容を反映
3. progress.mdに進捗を記録

## 関連ファイル

- .clinerules: プロジェクト固有のルール
- docs/guidelines/\*.md: 人間向けガイドライン

## 更新履歴

- 2025-03-03: AI実装ガイドラインを docs/ai/guidelines/ に移動・構造化
- 2025-03-03: 実行プロトコル、検証ルール、エラー処理を分離

---


# data-fetching

# データフェッチとコンポーネント設計のガイドライン

## 基本方針

データフェッチの責務は以下のように分離します：

- src/app: データフェッチを行う場所
- src/features: Propsでデータを受け取る純粋なコンポーネント

### 推奨パターン

```typescript
// ✅ 推奨: ページコンポーネントでデータをフェッチ
// src/app/[locale]/bookmarks/page.tsx
export default async function BookmarksPage() {
  const bookmarks = await fetchBookmarks();
  return <BookmarkList items={bookmarks} />;
}

// ✅ 推奨: featuresのコンポーネントはデータをPropsで受け取る
// src/features/bookmarks/components/BookmarkList.tsx
interface BookmarkListProps {
  items: Bookmark[];
}

export function BookmarkList({ items }: BookmarkListProps) {
  return <div>{/* レンダリングロジック */}</div>;
}
```

### アンチパターン

```typescript
// ❌ 避ける: featuresのコンポーネントでデータフェッチ
// src/features/bookmarks/components/BookmarkList.tsx
export function BookmarkList() {
  const { data } = useFetchBookmarks(); // コンポーネント内でのデータフェッチは避ける
  return <div>{/* レンダリングロジック */}</div>;
}
```

## 責務の分離

### src/app (ページ)の責務

1. **データフェッチ**
   - APIコールの実行
   - データ取得のエラーハンドリング
   - ローディング状態の管理

2. **状態管理の初期化**
   - グローバル状態の初期値設定
   - コンテキストプロバイダーの配置

3. **ルーティング関連**
   - URLパラメータの処理
   - リダイレクト制御
   - 認証状態の確認

### src/features (コンポーネント)の責務

1. **UI表示**
   - 受け取ったデータのレンダリング
   - ユーザーインタラクションの処理
   - スタイリング

2. **ローカル状態管理**
   - フォームの状態
   - UI状態（開閉状態など）
   - アニメーション状態

3. **イベントハンドリング**
   - クリックイベント
   - フォーム送信
   - ドラッグ＆ドロップ

## 実装例

### ページコンポーネント

```typescript
// src/app/[locale]/bookmarks/page.tsx
import { Suspense } from "react";
import { BookmarkView } from "~/features/bookmarks/components/bookmark/BookmarkView";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export default async function BookmarksPage() {
  // データフェッチ
  const bookmarks = await fetchBookmarks();
  const folders = await fetchFolders();

  // エラーバウンダリとサスペンスでラップ
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <BookmarkView 
          items={bookmarks}
          folders={folders}
          onSave={saveBookmark}
          onDelete={deleteBookmark}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 機能コンポーネント

```typescript
// src/features/bookmarks/components/bookmark/BookmarkView.tsx
interface BookmarkViewProps {
  items: Bookmark[];
  folders: Folder[];
  onSave: (bookmark: Bookmark) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function BookmarkView({
  items,
  folders,
  onSave,
  onDelete
}: BookmarkViewProps) {
  // ローカル状態の管理
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // イベントハンドラ
  const handleSelect = (id: string) => {
    setSelectedItem(id);
  };

  return (
    <div>{/* UIレンダリング */}</div>
  );
}
```

## メリット

1. **関心の分離**
   - ページ: データ取得とルーティング
   - コンポーネント: UI表示とインタラクション

2. **テスタビリティの向上**
   - Propsで依存を注入できるため、単体テストが容易
   - モックデータでの表示確認が簡単

3. **再利用性の向上**
   - コンポーネントがデータフェッチに依存しないため、異なるコンテキストで再利用可能
   - 表示ロジックとデータ取得ロジックの分離により、保守性が向上

4. **パフォーマンスの最適化**
   - ページレベルでのデータプリフェッチが可能
   - コンポーネントの不要な再レンダリングを防止

## 例外的なケース

以下のようなケースでは、コンポーネント内でのデータフェッチを許容する場合があります：

1. **無限スクロール**
   - ユーザーインタラクションに基づく追加データの取得
   - ページネーションの実装

2. **リアルタイム更新**
   - WebSocketを使用したライブデータの取得
   - ポーリングが必要なケース

3. **検索機能**
   - ユーザー入力に基づく動的な検索結果の取得
   - オートコンプリート機能

これらの例外的なケースでも、可能な限りページコンポーネントにデータフェッチロジックを移動することを検討してください。
---


# domain-model-implementation

# ドメインモデル実装ガイドライン

## 概要

このガイドラインでは、AIによるドメインモデルの実装方法と、コアチームおよび機能開発チームの役割分担について説明します。

## プロジェクト構造

### コアチーム担当範囲

コアチームは以下のディレクトリを担当し、システム全体で重要な概念のドメインモデルを管理します：

```
docs/guidelines/design/modeling/core/[機能名]/
└── domain-design-[モデル名].md  # コアドメインモデルの設計文書

src/core/[機能名]/
├── domain/          # 外部依存のないドメインモデル実装
├── types/           # 型定義
└── tests/           # テストコード

src/common/          # システム全体で使用する共通機能
```

### 機能開発チーム担当範囲

機能開発チームは以下のディレクトリを担当し、各機能固有のドメインモデルを管理します：

```
docs/guidelines/design/modeling/features/[機能名]/
└── domain-design-[モデル名].md  # 機能固有のドメインモデル設計文書

src/features/[機能名]/
├── domain/          # 機能固有のドメインモデル実装
├── types/           # 型定義
└── tests/           # テストコード
```

## 実装プロセス

### 1. 設計ドキュメントの作成

#### コアドメインモデル
```markdown
# domain-design-[モデル名].md

## モデルの責務
- 主要な概念の定義
- ビジネスルール
- 不変条件

## 実装の注意点
- 外部依存を持たない
- テスト容易性の確保
- 型安全性の確保
```

#### 機能固有のドメインモデル
```markdown
# domain-design-[モデル名].md

## モデルの責務
- 機能固有の概念定義
- 機能要件への対応
- コアドメインとの関係

## 実装の注意点
- コアドメインモデルとの整合性
- 機能要件の充足
- テストの網羅性
```

### 2. AIへの実装指示

#### コアドメインモデル
```markdown
# 実装指示

## 参照ドキュメント
1. docs/guidelines/design/modeling/core/[機能名]/domain-design-[モデル名].md
2. docs/[機能名]/logs/ai/plans/impl-plan-[モデル名].md

## 実装要件
1. src/core/[機能名]/domain/ 以下に実装
2. 外部依存を持たないこと
3. Result型でのエラーハンドリング
4. 100%のテストカバレッジ
```

#### 機能ドメインモデル
```markdown
# 実装指示

## 参照ドキュメント
1. docs/guidelines/design/modeling/features/[機能名]/domain-design-[モデル名].md
2. docs/[機能名]/logs/ai/plans/impl-plan-[モデル名].md

## 実装要件
1. src/features/[機能名]/domain/ 以下に実装
2. コアドメインモデルとの整合性確保
3. 機能要件の充足
4. テストの網羅性
```

## 品質基準

### コアドメインモデル
- 外部依存がないこと
- テストの容易性
- 型安全性の確保
- パフォーマンスの最適化
- コードの再利用性

### 機能ドメインモデル
- コアドメインとの整合性
- 機能要件の充足
- テストの網羅性
- エラー処理の一貫性
- メンテナンス性

## チーム間の連携

### コアチームの責務
1. コアドメインモデルの設計と実装
2. 共通機能の提供
3. 機能チームへの技術支援
4. 設計レビューの実施

### 機能チームの責務
1. 機能要件の分析
2. 機能固有のモデル設計
3. コアドメインとの整合性確保
4. 実装とテスト

## 更新履歴

- 2025-03-07: 初版作成
  - プロジェクト構造の定義
  - 実装プロセスの詳細化
  - チーム間の役割分担の明確化
---


# error-handling

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
---


# event-sourcing

# イベントソーシング実装ガイドライン

## 概要

イベントソーシングは、アプリケーションの状態変更をイベントとして記録し、これらのイベントを再生することで現在の状態を再構築できるパターンです。このガイドラインでは、本プロジェクトでのイベントソーシングの実装方法について説明します。

## ディレクトリ構造

```
src/
├── core/
│   └── es/
│       ├── event.ts     # 基底イベント型の定義
│       ├── store.ts     # イベントストアの実装
│       └── index.ts     # public API
└── features/
    └── group/
        └── types/
            └── events.ts # 機能固有のイベント型定義
```

## イベントの型定義

### 判別可能なUnion型

イベントは必ず判別可能なUnion型として定義する必要があります。これにより、型安全な方法でイベントの種類を区別し、適切な処理を行うことができます。

### 機能固有のイベント定義

各機能のイベントは、その機能のディレクトリ内で定義します。これにより：

- 機能ごとの関心の分離
- イベント定義の集約
- コードの保守性向上

```typescript
// src/features/group/types/events.ts
export type GroupAddEvent = {
  b: "m"; // bounded context
  g: "g"; // group
  f: "g"; // feature
  a: "add"; // action
  ei: ULID; // event identifier
  data: {
    groupId: string;
    name: string;
  };
};

export type GroupEvent = GroupAddEvent;
export type GroupReadEvent = GroupListEvent;
```

### 基底イベント型の定義

コアのイベントモジュールでは、各機能のイベント型を集約して基底となるイベント型を定義します：

```typescript
// 各機能でイベント型を定義
// e.g., src/features/group/types/events.ts
export type GroupAddEvent = { b: "m"; g: "g"; f: "g"; a: "addGroup"; ei: ULID };
export type GroupEvent = GroupAddEvent;

// src/core/es/event.ts
import { type GroupEvent, type GroupReadEvent } from "~/features/group";

// Write Event（状態変更イベント）
export type Event = MemberEvent | GroupEvent;

// Read Event（状態参照イベント）
export type ReadEvent = MemberListEvent | GroupReadEvent;
```

### イベント属性の構造

各イベントは以下の属性を持ちます：

```typescript
type BaseEvent = {
  // 境界付けられたコンテキスト(bounded context)の頭文字
  b: "m" | "g" | "b"; // member, group, bookmark など

  // 機能グループ(group)の頭文字
  g: "m" | "g" | "b"; // management, general, basic など

  // 機能(feature)の頭文字
  f: "m" | "g" | "b"; // member, group, bookmark など

  // アクション(action)の識別子
  a: "add" | "update" | "remove" | "list";

  // イベント識別子（ULID）
  ei: ULID;
};
```

### ULID型の重要性

`ei`（Event Identifier）属性は、必ずULID型である必要があります：

```typescript
// 重要: この型のstringは、必ずULID（Universally Unique Lexicographically Sortable Identifier）でなければならない
export type ULID = string;
```

ULIDを使用する理由：

1. 時系列順序付け - ULIDは生成時刻に基づいて自動的にソート可能
2. ユニーク性保証 - 競合の可能性が極めて低い
3. データベースのインデックスに最適 - 時系列順でインデックスが構築される
4. 可読性 - Base32でエンコードされ、人間が読める形式

## イベントの保存パターン

### Write Events（状態変更）

データベースの状態を変更する操作を行う場合は、`save`メソッドを使用します：

```typescript
const { save } = useEventStore();
// 例：メンバーの追加
const addMember = async (memberId: string, groupId: string) => {
  const event: MemberAddEvent = {
    b: "m", // member context
    g: "m", // management group
    f: "m", // member feature
    a: "add",
    ei: ulid(), // 新しいULIDを生成
    data: { memberId, groupId },
  };

  return save([event]);
};
```

### Read Events（状態参照）

データベースから情報を取得する操作を行う場合は、`saveReadEvent`メソッドを使用します：

```typescript
const { saveReadEvent } = useEventStore();
// 例：メンバーリストの取得
const listMembers = async (groupId: string) => {
  const event: MemberListEvent = {
    b: "m", // member context
    g: "m", // management group
    f: "m", // member feature
    a: "list",
    ei: ulid(), // 新しいULIDを生成
    data: { groupId },
  };

  return saveReadEvent([event]);
};
```

## 実装のベストプラクティス

1. イベントの不変性

   - イベントは一度保存されたら変更してはいけない
   - 必要な情報はすべてイベント生成時に含める

2. イベントの粒度

   - 1つの論理的な操作に対して1つのイベント
   - 複数の変更が必要な場合は、複数のイベントをアトミックに保存

3. イベントの順序性

   - ULIDにより自然な時系列順序が保証される
   - イベントの再生順序に依存する実装は避ける

4. エラー処理
   - neverthrowのResult型を使用してエラーを表現
   - 楽観的ロックによる競合検出

```typescript
import { Result, ok, err } from "neverthrow";

// エラー処理の例
const handleEvent = (event: Event): Result<void, EventStoreError> => {
  try {
    // イベントの処理
    return ok(undefined);
  } catch (error) {
    return err(new EventStoreError("イベント処理に失敗しました"));
  }
};
```

5. スナップショット
   - 定期的にイベントの状態をスナップショットとして保存
   - パフォーマンス最適化のために使用

## テスト戦略

1. イベントの生成テスト

   - 正しい属性が設定されているか
   - ULIDが適切に生成されているか

2. イベントの処理テスト

   - 状態が正しく更新されるか
   - エラーが適切に処理されるか

3. イベントの再生テスト
   - 同じイベント列から同じ状態が再構築できるか

```typescript
describe("EventSourcing", () => {
  it("should correctly handle member add event", () => {
    const event: MemberAddEvent = {
      b: "m",
      g: "m",
      f: "m",
      a: "add",
      ei: ulid(),
      data: { memberId: "1", groupId: "1" },
    };

    const result = useEventStore().save([event]);
    expect(result.isOk()).toBe(true);
  });
});
```

## パフォーマンスの考慮事項

1. イベントの最適化

   - 必要な情報のみを含める
   - 大きなデータはリファレンスとして保存

2. クエリの最適化
   - ReadEventを効率的に使用
   - 必要な場合はイベントのインデックスを作成

---


# i18n-guidelines

# i18n 実装ガイドライン

## 1. 基本実装方針

私たちのi18n実装は、シンプルさと型安全性を重視しています。実装の中核は `src/i18n/text.ts` にあり、以下の特徴があります：

- TypeScriptの型システムを活用し、翻訳キーの補完と型チェックを実現
- 言語ファイルの分割管理による保守性の向上
- シンプルなAPI設計による学習コストの低減

## 1. 多言語対応

多言語対応のためスキーマになりうる型にはかならずlang属性を追加する。

## 2. コンポーネントでの使用方法

tree-container.tsxの実装を参考に、以下のようにコンポーネントで使用します：

```typescript
// フックのインポート
import { useText } from "~/i18n/text";

export function YourComponent() {
  // t オブジェクトの取得
  const { t } = useText();

  return (
    <div>
      {/* ネストされたキーへのアクセス */}
      <h1>{t.common.navigation.home}</h1>

      {/* 動的な翻訳の使用 */}
      <p>{t.common.bookmarks.validation.maxDepth(5)}</p>

      {/* エラーメッセージなどの共通テキスト */}
      <div>{t.common.errors.general}</div>
    </div>
  );
}
```

### ベストプラクティス

- useTextフックは、翻訳が必要なコンポーネントのトップレベルで呼び出す
- 頻繁に使用する翻訳キーは、分割代入で取り出して使用する
- パフォーマンスのため、メモ化が必要な場合はuseMemoと組み合わせる

## 3. メモリ効率を考慮した翻訳データの管理

### 構造化されたデータ管理

```typescript
export const common = {
  navigation: {
    home: "ホーム",
    bookmarks: "ブックマーク",
  },
  actions: {
    add: "追加",
    edit: "編集",
  },
} as const;
```

### 効率化のポイント

1. **階層構造の活用**

   - 関連する翻訳をカテゴリごとにグループ化
   - 深すぎない階層（最大3階層程度）を維持

2. **型の最適化**

   - `as const`アサーションによる厳密な型定義
   - 共通の型定義による一貫性の確保

3. **動的な翻訳の効率化**
   - パラメータ化された翻訳は関数として実装
   - 必要な場合のみ動的な値を生成

## 4. 新しい言語やテキストの追加

### ファイル構成

```
src/i18n/
├── locales/
│   ├── en/
│   │   ├── common.ts      # 共通の翻訳
│   │   ├── bookmarks.ts   # ブックマーク機能の翻訳
│   │   ├── settings.ts    # 設定画面の翻訳
│   │   └── errors.ts      # エラーメッセージの翻訳
│   └── ja/
│       ├── common.ts
│       ├── bookmarks.ts
│       ├── settings.ts
│       └── errors.ts
└── resources.ts # 各機能のリソースをインポート
│
└── text.ts
```

### 新しい言語の追加手順

1. `src/i18n/locales/[言語コード]/`ディレクトリを作成
2. 機能ごとに以下の翻訳ファイルを作成：
   - `common.ts`: 共通のUIテキスト
   - 機能固有のファイル（例：`bookmarks.ts`）
   - `errors.ts`: エラーメッセージ
3. 各ファイルは既存の言語ファイルの構造を踏襲
4. `resources.ts`にインポートと型定義を追加

### ファイル分割のメリット

- 機能ごとの責任の明確化
- チーム開発での作業の並列化が容易
- 必要な翻訳のみを読み込むことによるパフォーマンス最適化
- メンテナンス性の向上

### 新しいテキストの追加手順

1. 適切な機能のファイルを選択（または新規作成）
2. まず日本語（ja）のファイルに新しいキーと翻訳を追加
3. 適切なカテゴリの下に配置（必要に応じて新しいカテゴリを作成）
4. 他の言語の同じファイルに同じキーを追加
5. TypeScriptの型チェックを使用して、全言語で必要なキーが実装されていることを確認

### 命名規則

- キー: キャメルケース（例：`newFolder`, `importSuccess`）
- カテゴリ: 名詞の単数形（例：`navigation`, `action`）
- 動的パラメータ: 明確な型定義（例：`maxDepth: (depth: number) => string`）
- ファイル名: 機能名を小文字で（例：`bookmarks.ts`, `settings.ts`）

## 5. 新機能実装時の多言語対応プロセス

新しい機能やコンポーネントを追加する際は、以下のプロセスを必ず実施してください：

### 実装前の準備

1. 本ガイドラインを参照し、i18n実装の基本方針を理解する
2. 新機能で必要となる翻訳キーを洗い出し、適切な階層構造を設計する
3. 必要に応じて新しい翻訳ファイルの作成を検討する

### 実装時のチェックリスト

- [ ] i18n用の翻訳キーを適切な階層構造で追加
- [ ] 日本語（ja）の翻訳データを登録
- [ ] 英語（en）の翻訳データを登録
- [ ] コンポーネント内で文字列をハードコーディングしていないことを確認
- [ ] 各言語で翻訳キーが正しく表示されることを確認
- [ ] 動的な翻訳（パラメータを含む翻訳）のテスト
- [ ] エラーメッセージやバリデーションメッセージの確認

### 実装後の確認事項

1. 全ての文字列が翻訳キーを通して表示されていることを確認
2. 各言語でUIレイアウトが崩れていないことを確認
3. 新規追加した翻訳キーをドキュメントに反映
4. 翻訳データの型チェックエラーがないことを確認

## 実装時の注意点

1. **型安全性の維持**

   - 全ての言語ファイルで同じ構造を保持
   - 未定義のキーへのアクセスは型エラーとして検出

2. **パフォーマンスの考慮**

   - 大きな翻訳ファイルは機能ごとに分割
   - 動的な翻訳生成は最小限に抑える
   - 必要な翻訳のみを読み込む（遅延ロード検討）

3. **保守性の向上**

   - 意味のある命名でキーを作成
   - コメントで特殊なケースを説明
   - 非推奨になったキーは段階的に削除
   - 機能の追加・削除に応じて翻訳ファイルも整理

4. **既存コードとの整合性**
   - コンポーネント内で一貫した翻訳キーの使用
   - UI/UXの一貫性を保つための共通テキストの活用
   - 機能固有の翻訳は対応するファイルに配置

## 今後の展開

1. **自動検証の導入**

   - 未使用の翻訳キーの検出
   - 欠落している翻訳の自動チェック
   - 翻訳の一貫性チェック
   - 機能ごとの翻訳カバレッジ確認

2. **開発者エクスペリエンスの向上**
   - VSCode拡張機能による翻訳補完
   - 翻訳管理ツールの導入検討
   - 自動翻訳APIの活用検討
   - 翻訳ファイルの自動生成スクリプト

---


# mock-api-with-trpc

# tRPCを意識したモックAPIの実装手順

## 概要

フロントエンド開発初期にモックAPIを作成する際、後にtRPCで実装することを想定した設計・実装方法をまとめます。
この手順に従うことで、本実装への移行をスムーズに行うことができます。

## 1. 型定義の作成

### 1.1. 基本データ型の定義

tRPCのルーターで使用する型と同じ構造を持つ型を定義します。

```typescript
// types/group.ts
export type Group = {
  id: string;
  name: string;
  // ...その他のフィールド
};

// 入力型の定義
export type CreateGroupInput = Omit<Group, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGroupInput = Partial<CreateGroupInput> & { id: string };
```

### 1.2. レスポンス型の定義

tRPCの戻り値の型と一致するように定義します。

```typescript
export type GroupResponse = {
  success: true;
  data: Group;
} | {
  success: false;
  error: string;
};

export type GroupListResponse = {
  success: true;
  data: Group[];
} | {
  success: false;
  error: string;
};
```

## 2. バリデーションスキーマの作成

tRPCのinputバリデーションと同じスキーマを使用します。

```typescript
import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(1).max(500),
  // ...
});

// 型の抽出（tRPCのinput型と一致）
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
```

## 3. APIインターフェースの設計

tRPCルーターのメソッドと1:1で対応するようにインターフェースを設計します。

```typescript
type GroupApi {
  getGroups(): Promise<GroupListResponse>;
  getGroup(id: string): Promise<GroupResponse>;
  createGroup(input: CreateGroupInput): Promise<GroupResponse>;
  updateGroup(input: UpdateGroupInput): Promise<GroupResponse>;
  deleteGroup(id: string): Promise<GroupResponse>;
}
```

## 4. モックAPIの実装

### 4.1. データストアの作成

```typescript
let mockGroups: Group[] = [/* 初期データ */];
```

### 4.2. APIメソッドの実装

```typescript
export const mockGroupApi: GroupApi = {
  // tRPCのquery/mutationと同じシグネチャ
  async getGroups() {
    await simulateLatency();
    return {
      success: true,
      data: mockGroups
    };
  },

  async createGroup(input) {
    await simulateLatency();
    try {
      // バリデーション（tRPCと同じスキーマを使用）
      const validated = createGroupSchema.parse(input);
      
      const newGroup: Group = {
        id: generateId(),
        ...validated,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockGroups = [...mockGroups, newGroup];
      
      return {
        success: true,
        data: newGroup
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  },
  // ...他のメソッド
};
```

## 5. エラーハンドリング

tRPCのエラーハンドリングと同じパターンを採用します。

```typescript
// エラー型の定義
export type ApiError = {
  code: 'NOT_FOUND' | 'VALIDATION_ERROR' | 'UNAUTHORIZED';
  message: string;
};

// エラーレスポンスの生成
const createErrorResponse = (error: ApiError): GroupResponse => ({
  success: false,
  error: error.message
});
```

## 6. tRPCへの移行手順

### 6.1. ルーターの作成

モックAPIと同じインターフェースでルーターを実装します。

```typescript
export const groupRouter = router({
  getGroups: publicProcedure
    .query(async () => {
      // モックAPIと同じレスポンス形式
      const groups = await prisma.group.findMany();
      return {
        success: true,
        data: groups
      };
    }),

  createGroup: publicProcedure
    .input(createGroupSchema)  // モックAPIと同じバリデーションスキーマ
    .mutation(async ({ input }) => {
      const group = await prisma.group.create({
        data: input
      });
      return {
        success: true,
        data: group
      };
    })
});
```

### 6.2. クライアントコードの変更

```typescript
// 変更前（モックAPI）
const response = await mockGroupApi.createGroup(input);

// 変更後（tRPC）
const response = await trpc.group.createGroup.mutate(input);
```

## 重要な注意点

1. **型の一貫性**: tRPCのinput/output型とモックAPIの型を完全に一致させる
2. **バリデーションの共有**: zodスキーマを共有してバリデーションロジックを統一
3. **エラー処理**: tRPCのエラーハンドリングパターンを模倣
4. **レスポンス形式**: success/errorの形式を統一
5. **非同期処理**: すべてのAPIメソッドをPromiseベースで実装

## ベストプラクティス

1. モックAPIとtRPCルーターで同じ型定義ファイルを参照する
2. バリデーションスキーマを共通のファイルで管理
3. エラーケースを含めた完全なモックを実装
4. 適切なレイテンシーシミュレーションを追加
5. ユニットテストでモックAPIとtRPCの互換性を確認

## メリット

1. 型安全性の確保
2. スムーズな本実装への移行
3. フロントエンドの早期開発開始
4. テストの容易さ
5. 一貫したAPIインターフェース

以上の手順に従うことで、開発初期のモックAPIから本実装のtRPCへの移行をスムーズに行うことができます。
---


# react-components

# Reactコンポーネント実装ガイドライン

## 目次

- [使用技術スタック](#使用技術スタック)
- [基本実装パターン](#基本実装パターン)
- [型定義](#型定義)
- [型安全性](#型安全性)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [コンポーネント分割](#コンポーネント分割)
- [テスタビリティ](#テスタビリティ)
- [再利用性](#再利用性)
- [コア設計原則](#コア設計原則)

## 使用技術スタック

| 技術                | 説明                                                                          |
| ------------------- | ----------------------------------------------------------------------------- |
| **Next.js**         | サーバーサイドレンダリングと静的サイト生成をサポートするReactフレームワーク。 |
| **React**           | ユーザーインターフェースを構築するためのJavaScriptライブラリ。                |
| **TypeScript**      | JavaScriptの型付きスーパーセット。                                            |
| **Tailwind CSS**    | ユーティリティファーストのCSSフレームワーク。                                 |
| **tRPC**            | 型安全なAPIを構築するためのフレームワーク。                                   |
| **react-hook-form** | Form管理ライブラリ。                                                          |
| **Zod**             | TypeScript向けのスキーマ宣言とバリデーションライブラリ。                      |
| **Drizzle ORM**     | TypeScriptとJavaScript向けのORM。                                             |
| **Radix UI**        | アクセシブルでスタイルのないUIコンポーネントセット。                          |
| **Storybook**       | UIコンポーネントを個別に開発するためのツール。                                |
| **Vitest**          | Viteネイティブのユニットテストフレームワーク。                                |

## コア設計原則

### 推奨される記法

```typescript
// ✅ 推奨: type + アロー関数コンポーネント
type TreeItemProps = {
  label: string
  expanded?: boolean
}

const TreeItem = ({label, expanded = false}: TreeItemProps) => {
  return <div>{label}</div>
}

// ✅ 推奨: カスタムフックもアロー関数で
const useTreeState = (initialState: boolean) => {
  const [isExpanded, setExpanded] = useState(initialState)
  return { isExpanded, setExpanded }
}

// ✅ 推奨: バリデーションスキーマ
import { z } from 'zod' // or yup

const treeItemSchema = z.object({
  label: z.string(),
  expanded: z.boolean().optional()
})
```

### 避けるべき記法

```typescript
// ❌ 避ける: export defaultの使用
// 理由: 名前付きエクスポートを使用することで、インポート時の名前の一貫性と自動補完が向上します。

// ❌ 避ける: interfaceの使用
interface TreeItemProps {
  label: string
}

// ❌ 避ける: クラスコンポーネント
class TreeItem extends React.Component<TreeItemProps> {
  render() {
    return <div>{this.props.label}</div>
  }
}

// ❌ 避ける: enumの使用
enum TreeItemType {
  Folder,
  File
}

// ❌ 避ける: 通常の関数宣言
function TreeItem(props: TreeItemProps) {
  return <div>{props.label}</div>
}
```

### 理由

1. **シンプルさと一貫性**

   - `type`と`const`の組み合わせで十分な表現力
   - コードベース全体で一貫したパターン
   - 理解しやすく保守しやすい

2. **型の柔軟性**

   - `type`は交差型(`&`)や共用型(`|`)との親和性が高い
   - 型の合成や分解が容易

3. **バンドルサイズの最適化**
   - クラスコンポーネントよりも関数コンポーネントの方が小さい
   - Tree Shakingの効率が向上

## 基本実装パターン

### 推奨パターン

```typescript
import { type FC } from 'react'

type ComponentProps = {
  // 必須のprops
  required: string
  // オプショナルのprops
  optional?: number
  // 子要素
  children?: React.ReactNode
  // イベントハンドラ
  onAction?: (value: string) => void
}

export const Component: FC<ComponentProps> = ({
  required,
  optional = 0, // デフォルト値の設定
  children,
  onAction
}) => {
  // 内部の状態管理
  const [state, setState] = useState<string>('')

  // メモ化されたコールバック
  const handleAction = useCallback(() => {
    onAction?.(state)
  }, [onAction, state])

  return (
    <div>
      {/* JSXの実装 */}
    </div>
  )
}

// コンポーネントの表示名を設定（デバッグ用）
Component.displayName = 'Component'
```

### アンチパターン

```typescript
// ❌ any型の使用
const Component: FC<any> = (props) => {};

// ❌ 不明確な型名
type ComponentStuff = {};
```

## 型定義

### Props型の命名規則

```typescript
// ✅ 推奨: ComponentName + Props
type TreeItemProps = {
  label: string
  depth: number
}

// ✅ 推奨: 共有Props型の場合
type SharedTreeProps = {
  onSelect: (id: string) => void
}

// コンポーネントでの使用
export const TreeItem: FC<TreeItemProps & SharedTreeProps> = ({...})
```

### 型の集中管理

```typescript
// src/types/components.ts
type TreeNodeData = {
  id: string;
  label: string;
  children?: TreeNodeData[];
};

type TreeProps = {
  data: TreeNodeData;
  // 他の共通props
};

// 使用側
import type { TreeProps } from "@/types/components";
```

### Props型の宣言場所

- **推奨**: Propsの型宣言は、関連するFunctional Component (FC)と同じファイルに宣言してください。これにより、コンポーネントとその型定義が一箇所にまとまり、可読性と保守性が向上します。

## 型安全性

### 厳格な型チェック

```typescript
// tsconfig.jsonの推奨設定
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ジェネリック型の活用

```typescript
type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

export const List = <T extends {id: string}>({
  items,
  renderItem
}: ListProps<T>) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

## 機能別(src/features)の実装パターン

### クライアントサイドの構造

```
src/features/
  └── bookmarks/
      ├── index.ts         # 公開APIの定義
      ├── README.md        # 機能の説明とAPIドキュメント
      ├── api/            # API関連の実装
      ├── components/     # UIコンポーネント
      │   ├── tree/      # ツリービュー関連
      │   │   ├── index.ts
      │   │   ├── TreeContainer.tsx
      │   │   └── TreeItem.tsx
      │   └── list/      # リスト表示関連
      ├── constants/     # 定数定義
      ├── hooks/         # カスタムフック
      │   ├── index.ts
      │   ├── useBookmarkOperations.ts
      │   ├── useBookmarkTree.ts
      │   └── useTreeDragDrop.ts
      ├── logs/          # 開発ログ
      │   ├── ai/        # AI開発ログ
      │   └── prompt/    # プロンプト履歴
      ├── store/         # 状態管理
      ├── types/         # 型定義
      │   ├── index.ts
      │   ├── bookmark.ts
      │   ├── events.ts
      │   └── tree.ts
      └── utils/         # ユーティリティ関数
```

### サーバーサイドの構造

```
src/server/features/
  └── bookmarks/
      ├── router.ts      # tRPCルーター定義
      ├── schemas/       # バリデーションスキーマ
      ├── services/      # ビジネスロジック
      ├── repositories/  # データアクセス層
      └── types/         # 型定義

// router.tsの実装例
export const bookmarksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBookmarkSchema)
    .mutation(async ({ ctx, input }) => {
      // リポジトリを使用したデータ操作
      return ctx.db.bookmark.create(...)
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      // ユーザーのブックマーク一覧を取得
      return ctx.db.bookmark.findMany(...)
    })
})
```

## パフォーマンス最適化

### メモ化の適切な使用

```typescript
// ✅ 推奨: 重い計算の結果をメモ化
const memoizedValue = useMemo(() => {
  return expensiveComputation(prop)
}, [prop])

// ✅ 推奨: コールバックのメモ化
const handleClick = useCallback((id: string) => {
  onSelect?.(id)
}, [onSelect])

// ✅ 推奨: 子コンポーネントのメモ化
const ChildComponent = memo(({data}: ChildProps) => {
  return <div>{/* 複雑なレンダリング */}</div>
})
```

### レンダリング最適化

```typescript
// ✅ 推奨: 条件付きレンダリング
const TreeItem: FC<TreeItemProps> = ({expanded}) => {
  // 条件に応じて早期リターン
  if (!expanded) return null

  return (
    <div>
      {/* 複雑なツリー構造 */}
    </div>
  )
}

// ✅ 推奨: 仮想化リストの使用
import { VirtualizedList } from 'react-virtualized'

const LargeList: FC<LargeListProps> = ({items}) => {
  return (
    <VirtualizedList
      rowCount={items.length}
      rowRenderer={({index}) => <Item data={items[index]} />}
    />
  )
}
```

## コンポーネント分割

### 分割の基準

1. **単一責任の原則**

   ```typescript
   // ✅ 推奨: 機能ごとに分割
   const BookmarkTree = () => {
     return (
       <div>
         <TreeSearch /> {/* 検索機能 */}
         <TreeView />   {/* ツリー表示 */}
         <TreeActions /> {/* アクション群 */}
       </div>
     )
   }
   ```

2. **再利用性**

   ```typescript
   // ✅ 推奨: 汎用コンポーネント
   const Button = ({
     variant,
     size,
     children,
     ...props
   }: ButtonProps) => {
     return (
       <button className={`btn-${variant} btn-${size}`} {...props}>
         {children}
       </button>
     )
   }
   ```

3. **複雑さの管理**

   ```typescript
   // ✅ 推奨: ロジックの分離
   const useTreeLogic = (initialData: TreeData) => {
     // 複雑なロジックをカスタムフックに分離
     return {
       // ツリー操作のメソッド群
     };
   };

   const TreeView = ({ data }: TreeViewProps) => {
     const treeLogic = useTreeLogic(data);
     // UIの実装
   };
   ```

## テスタビリティ

### テスト容易な設計

```typescript
// ✅ 推奨: テスト可能な実装
const TreeItem = ({
  label,
  onSelect,
  testId = 'tree-item' // テスト用ID
}: TreeItemProps) => {
  return (
    <div
      data-testid={testId}
      onClick={() => onSelect?.()}
      role="treeitem"
    >
      {label}
    </div>
  )
}

// テストコード
describe('TreeItem', () => {
  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn()
    render(<TreeItem label="Test" onSelect={onSelect} />)

    userEvent.click(screen.getByTestId('tree-item'))
    expect(onSelect).toHaveBeenCalled()
  })
})
```

## 再利用性

### コンポーネント設計の原則

1. **Compound Componentsパターン**

   ```typescript
   const Tree = {
     Root: ({children}: {children: React.ReactNode}) => {...},
     Branch: ({children}: {children: React.ReactNode}) => {...},
     Leaf: ({label}: {label: string}) => {...}
   }

   // 使用例
   <Tree.Root>
     <Tree.Branch>
       <Tree.Leaf label="Item 1" />
     </Tree.Branch>
   </Tree.Root>
   ```

2. **カスタマイズ可能なスタイリング**

   ```typescript
   type StyleProps = {
     className?: string
     style?: React.CSSProperties
   }

   const TreeItem = ({
     className,
     style,
     ...props
   }: TreeItemProps & StyleProps) => {
     return (
       <div
         className={cn('tree-item', className)}
         style={style}
         {...props}
       />
     )
   }
   ```

3. **スキーマバリデーションの活用**

   ```typescript
   import { z } from 'zod'

   // ✅ 推奨: バリデーションスキーマの定義
   const treeItemSchema = z.object({
     label: z.string().min(1),
     expanded: z.boolean().optional(),
     children: z.array(z.lazy(() => treeItemSchema)).optional()
   })

   type TreeItemData = z.infer<typeof treeItemSchema>

   const TreeItem = ({data}: {data: TreeItemData}) => {
     // スキーマによって型安全性が保証される
     return <div>{data.label}</div>
   }
   ```

## レイアウト設計

### レイアウトコンポーネントの構造化

```typescript
/**
 * @ai_component_structure
 * レイアウト構成:
 * - MainView: ページのメインコンテナ（w-full）
 *   - 左パネル (1): プライマリコンテンツ
 *   - 右パネル (2): セカンダリコンテンツ
 */
const MainView = () => {
  return (
    <div className="w-full grid grid-cols-[1fr_2fr] grid-rows-[1fr] gap-4 h-full">
      <div className="col-span-1 overflow-auto">
        {/* 左パネル */}
      </div>
      <div className="col-span-1 overflow-auto">
        {/* 右パネル */}
      </div>
    </div>
  )
}
```

### グリッドレイアウトのベストプラクティス

1. **比率の明示**

   - 固定幅より比率を優先（`grid-cols-[1fr_2fr]`）
   - レスポンシブ性の確保
   - 保守性の向上

2. **構造のドキュメント化**

   - コンポーネント構造をコメントで明示
   - パネルの役割と比率を記録
   - 変更履歴の管理

3. **オーバーフローの制御**
   - 各パネルに`overflow-auto`を設定
   - スクロール可能な領域の明確化
   - コンテンツの適切な表示

### レイアウト変更時の注意点

1. **ドキュメントの更新**

   - コンポーネント構造のコメントを更新
   - 変更理由と影響範囲を記録
   - 設計意図の明確化

2. **段階的な変更**

   - レイアウト構造の変更を最初に実施
   - スタイリングの調整は後で実施
   - 変更の影響を確認しながら進める

3. **整合性の確保**
   - グリッドシステムの一貫した使用
   - 命名規則の統一
   - アクセシビリティの維持

## ベストプラクティスのまとめ

1. **シンプルな型システム**

   - `type`と`const`を優先使用
   - `interface`、`class`、`enum`、`function`は避ける
   - スキーマバリデーションの活用

2. **パフォーマンス**

   - 適切なメモ化の使用
   - 条件付きレンダリング
   - 仮想化の活用

3. **メンテナンス性**

   - 単一責任の原則に従う
   - テスト可能な設計
   - 明確な命名規則

4. **再利用性**
   - 柔軟なカスタマイズ
   - 拡張可能な設計
   - 共通パターンの抽出

### パフォーマンス最適化

```typescript
// メモ化による再レンダリングの防止
const TranslatedLabel = memo(({ messageKey }: { messageKey: string }) => {
  const { t } = useText();
  return <span>{t.bookmarks.tree[messageKey]}</span>;
});

// 翻訳データを含むコンポーネントの分離
const LocalizedActions = () => {
  const { t } = useText();
  return (
    <div>
      <button>{t.bookmarks.tree.addFolder}</button>
      <button>{t.bookmarks.tree.deleteConfirm}</button>
    </div>
  );
};
```

### 型安全性の確保

```typescript
// src/i18n/types.ts
import type { bookmarks as en_bookmarks } from "./locales/en/bookmarks";

// 翻訳キーの型を定義
export type Bookmarks = typeof en_bookmarks;

// 翻訳の整合性を型で保証
const assertBookmarks = (messages: Bookmarks) => messages;
assertBookmarks(ja_bookmarks); // コンパイルエラーで不整合を検出
```

---

