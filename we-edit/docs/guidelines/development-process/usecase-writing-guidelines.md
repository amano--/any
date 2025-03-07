# ユースケース記述ガイドライン

## 概要

ユースケースを効果的に記述するためのガイドラインです。
実際のプロジェクトでの経験から得られた知見をもとに、ベストプラクティスをまとめています。

## 基本原則

1. 明確性

   - 一つのユースケースは一つの目的に集中
   - シンプルで理解しやすい記述
   - 具体的な例示

2. 一貫性

   - 統一された用語の使用
   - 標準的な構造の維持
   - 命名規則の遵守

3. 追跡可能性
   - 要件との紐付け
   - 関連ユースケースの参照
   - 変更履歴の管理

## ユースケースID

### 命名規則

`[短縮Id]-[機能分類]-[連番]`

例：

- b-c-001: ブックマーク作成
- np-c-001: 新聞作成
- a-c-001: 記事作成

### 短縮Idについて

[overview.md](./overview.md)の境界付けられたコンテキスト一覧を参照

### 機能分類

| 分類 | 説明         |
| ---- | ------------ |
| c    | 作成         |
| r    | 参照         |
| u    | 更新         |
| d    | 削除         |
| i    | インポート   |
| e    | エクスポート |
| s    | 検索         |
| l    | 一覧         |

## ファイル構成

```
docs/usecases/
├── README.md           # 全体のユースケース図
├── [BC名]/            # 境界付けられたコンテキストごとのディレクトリ
│   ├── README.md      # コンテキスト固有の説明
│   └── [機能名].md    # 個別ユースケース
```

## 記述スタイル

### 1. 文書構造

```markdown
# ユースケース名

## ユースケース概要

目的と概要を簡潔に説明

## アクター

関係者を列挙

## 事前条件

必要な前提条件

## 想定シナリオ

[タイトル]
ペルソナを用いた物語形式の記述（500字程度）

## 基本フロー

具体的なステップ

## 代替フロー

別パターンの流れ

## 例外フロー

エラー時の処理

## 事後条件

完了時の状態

## 関連オブジェクト

使用するオブジェクト

## 補足情報

図表や追加情報
```

### 2. 表記ルール

1. アクターの表記

   ```markdown
   - [会員] - システムのユーザー
   - [システム] - システム自体
   - [外部システム] - 連携システム
   ```

2. シナリオの書き方

   ```markdown
   [ペルソナ名]（[年齢]歳、[役割]）は、[目的や動機]を抱えていました。

   [現状の課題や問題点]を感じていた[ペルソナ名]は、[解決策]を思いつきました。

   [具体的な行動と実装]を行い、[システムの利用方法]を決めました。

   後日、[結果や効果]となり、[最終的な価値]が得られました。
   ```

3. フローの記述
   ```markdown
   1. [アクター]は[具体的な操作]を実行
   2. [システム]は[具体的な処理]を実行
   3. [アクター]は[具体的な確認]を実行
   ```

## ユースケース図の描き方

### 1. 基本構造

```mermaid
graph TB
    subgraph システム名
        UC1["具体的な機能名"]
        UC2["具体的な機能名"]
    end

    Actor1["[アクター1]"]
    Actor2["[アクター2]"]
    System["[システム]"]

    Actor1 -->|実行| UC1
    Actor2 -->|管理| UC2
    UC1 -->|検証| System
    UC2 -->|検証| System
```

### 2. 実装状況の表示

README.mdには以下を含める：

```markdown
### 実装済みユースケース

- [機能名](ファイルパス) - 簡単な説明

### 未実装ユースケース

- 機能名 - 簡単な説明
```

## シナリオ作成のポイント

1. ペルソナ設定

   - 名前、年齢、役割は必須
   - 現実的な課題や動機
   - 具体的な目的

2. 物語構造（起承転結）

   - 起：現状の課題
   - 承：解決策の発見
   - 転：システムの利用
   - 結：得られた価値

3. 実用的な詳細
   - 具体的な数値
   - 実際の使用例
   - 測定可能な効果

## レビューポイント

1. 完全性

   - 500字程度のシナリオ
   - 必要な情報の網羅
   - 具体的な例示

2. 正確性

   - 業務要件との整合
   - 技術的な実現性
   - 制約条件の考慮

3. 一貫性
   - 用語の統一
   - 表記ルールの遵守
   - 他ユースケースとの整合

## よくある問題と対策

1. 抽象的なシナリオ

   ```markdown
   ❌ 社員が新聞を作る
   ⭕ 中堅IT企業のエンジニア（28歳）が、チームの技術情報共有のために...
   ```

2. 不明確な価値

   ```markdown
   ❌ 便利になった
   ⭕ 情報共有の時間が1日30分削減され、過去の記事も60秒以内に見つけられるように...
   ```

3. 具体性の不足
   ```markdown
   ❌ データを入力する
   ⭕ 「TechTrends Daily」という名前で、Technology カテゴリを選択し...
   ```

## 共通機能パターン

### 1. 基本的なCRUD操作

全てのコンテキストで考慮すべき操作：

- 作成（Create）
- 参照（Read）
- 更新（Update）
- 削除（Delete）

### 2. 標準的な補助機能

多くのユースケースで必要となる機能：

- 下書き保存
- テンプレート使用
- インポート/エクスポート
- バージョン管理

### 3. 分類・整理機能

一般的な分類手法：

- カテゴリ（単一選択）
- タグ（複数選択）
- フォルダ（階層構造）

## バリデーションルールの標準化

### 1. テキスト入力

| 項目     | 制限                 | 理由                         |
| -------- | -------------------- | ---------------------------- |
| タイトル | 1-200文字            | 検索性と表示性のバランス     |
| 説明文   | 最大500文字          | 詳細情報の十分な記述を許容   |
| タグ     | 30文字まで、最大10個 | UI表示の制約と管理のしやすさ |

### 2. 選択入力

| 項目     | 制限          | 理由                     |
| -------- | ------------- | ------------------------ |
| カテゴリ | 単一選択必須  | 主要な分類の明確化       |
| フォルダ | 最大階層深度5 | 管理性と検索性のバランス |

### 3. URL検証

- 形式：RFC準拠のURL形式
- 重複：警告表示（上書きオプション）
- アクセス：可能な場合は存在確認

## レビューチェックリスト

1. シナリオの品質

   - [ ] 具体的なペルソナ設定
   - [ ] 4段階のストーリー展開
   - [ ] 数値による効果の明示

2. 機能の網羅性

   - [ ] 基本的なCRUD操作
   - [ ] 必要な補助機能
   - [ ] 適切な分類手法

3. 検証ルール
   - [ ] 標準的な制限値の適用
   - [ ] エラーケースの網羅
   - [ ] ユーザー体験への配慮

## ベストプラクティス

1. シナリオ作成

   - ユーザーの課題から始める
   - 具体的な数値を含める
   - 価値を明確に示す

2. 機能設計

   - 共通パターンを活用
   - 必要最小限の機能から始める
   - 拡張性を考慮する

3. バリデーション
   - 標準ルールを基本とする
   - UXを考慮した制限設定
   - 明確なエラーメッセージ

## 複数コンテキストの連携

### 1. 依存関係の記述

```markdown
## 関連コンテキスト

- [コンテキスト名]
  - 依存の種類: [データ参照/イベント購読/APIコール]
  - 関連ユースケース: [ユースケースID]
  - 整合性要件: [データの一貫性/順序性/など]
```

### 2. 並行実装時の注意点

- 共通データモデルの定義を先行させる
- インターフェース契約を明確にする
- イベントスキーマを事前に合意する

### 3. 非機能要件の共有

| 要件カテゴリ | 記述項目 | 例 |
| ------------ | -------- | -- |
| パフォーマンス | レスポンス時間 | 検索結果は1秒以内 |
| セキュリティ | アクセス制御 | 組織内のみ閲覧可能 |
| 可用性 | 同時アクセス | 100ユーザーまで |

## 改訂履歴

- 2025-03-06: 改訂
  - 複数コンテキスト間の連携に関する記述を追加
  - 非機能要件の共有方法を標準化
  - 並行実装時の注意点を追加

- 2025-03-05: 改訂
  - 想定シナリオの書き方を具体化
  - ユースケース図の構造を標準化
  - ファイル構成を明確化
  - シナリオの物語構造を追加
