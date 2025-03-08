# Cline セットアップガイド

## 📋 概要

Clineは、AIアシスタントの動作を制御し、一貫性のある開発を実現するためのルールとガイドラインを提供します。

## 📁 ディレクトリ構造

```
cline/
├── rules/          # .clinerules に組み込むルール
│   ├── personal.md       # 個人設定
│   ├── project.md       # プロジェクトルール
│   ├── coding-*.md      # コーディング規約
│   └── README.md        # ルール一覧
│
├── prompt.md      # プロンプト設計ガイド
├── references.md  # 参照ドキュメント
└── README.md      # 本ファイル
```

## 🔍 コンポーネント説明

### 1. ルール（rules/）

.clinerules に組み込むルールを管理します：

1. 個人設定（personal.md）
   - ユーザー情報
   - 作業スタイル
   - 個人の設定

2. プロジェクトルール（project.md）
   - 週報更新
   - 作業フロー
   - プロジェクト運営

3. コーディング規約
   - 標準規約（coding-standards.md）
   - プロジェクト固有（coding-for-project.md）
   - AI実装（coding-by-ai.md）

4. その他のルール
   - Git運用（git-workflow.md）
   - パッケージ構造（package-structure.md）
   - 技術スタック（tech-stack.md）

### 2. プロンプト設計（prompt.md）

- プロンプトの作成方針
- テンプレート
- ベストプラクティス

### 3. 参照情報（references.md）

- 関連ドキュメント
- 外部リソース
- 用語集

## 🛠️ セットアップ手順

1. ルールの生成
   ```bash
   # .clinerules の生成
   ./rules/mk-clinerules.sh
   ```

2. プロンプトの設定
   - prompt.md を参照
   - 必要なテンプレートを選択
   - カスタマイズを実施

## 📚 利用方法

1. ルールの参照
   - rules/ 配下の各ファイルを確認
   - 生成された .clinerules を参照

2. プロンプトの作成
   - prompt.md のガイドラインに従う
   - テンプレートを活用

3. 更新と管理
   - 定期的なルールの見直し
   - フィードバックの反映
   - ドキュメントの更新

## 🔄 更新プロセス

1. ルールの変更
   - 該当ファイルを編集
   - mk-clinerules.sh を実行
   - 変更を確認

2. プロンプトの改善
   - フィードバックの収集
   - テンプレートの更新
   - 効果の検証

## 📖 関連ドキュメント

- [プロジェクトガイドライン](../guidelines/README.md)
- [開発プロセス](../guidelines/development-process/README.md)
- [AIガイドライン](../ai/guidelines/README.md)

## 📝 注意事項

- ルールは定期的にレビュー
- プロンプトは継続的に改善
- フィードバックを積極的に収集

## 更新履歴

- 2025-03-08: 初版作成
  - ディレクトリ構造の整理
  - 各コンポーネントの説明を追加
  - セットアップ手順を記載