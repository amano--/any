# Cline セットアップガイド

## 📋 概要

Clineは、AIアシスタントの動作を制御し、一貫性のある開発を実現するためのルールとガイドラインを提供します。

## 📁 ディレクトリ構造

```
cline/
├── rules/          # .clinerules に組み込むルール
│   ├── [personal.md](./rules/personal.md)       # 個人設定
│   ├── [project.md](./rules/project.md)       # プロジェクトルール
│   ├── [coding-standards.md](./rules/coding-standards.md)   # 標準規約
│   ├── [coding-for-project.md](./rules/coding-for-project.md) # プロジェクト固有
│   ├── [coding-by-ai.md](./rules/coding-by-ai.md)     # AI実装規約
│   ├── [git-workflow.md](./rules/git-workflow.md)     # Git運用
│   ├── [package-structure.md](./rules/package-structure.md) # パッケージ構造
│   ├── [tech-stack.md](./rules/tech-stack.md)       # 技術スタック
│   └── [README.md](./rules/README.md)        # ルール一覧
│
├── [prompt-engineering.md](./prompt-engineering.md)  # プロンプトエンジニアリング一般
├── [roo-prompt-practices.md](./roo-prompt-practices.md)  # Roo特化型プロンプト
├── [references.md](./references.md)    # 参照ドキュメント
└── [README.md](./README.md)        # 本ファイル
```

## 🔍 コンポーネント説明

### 1. ルール（rules/）

.clinerules に組み込むルールを管理します：

1. 個人設定（personal.md）

   - チーム名とユーザー名の設定
   - AIアシスタントの振る舞いの定義
   - ユーザーのプログラミングスキルレベルの認識
   - テストコード駆動の作業スタイル
   - タスク完了時の自動コミット設定

2. プロジェクトルール（project.md）

   - セキュリティガイドライン（機密ファイル、認証情報）
   - 更新トリガーの定義（週報、知見、ADR）
   - 週報の定期更新スケジュール（9:00-21:00）
   - 知見のまとめ作成プロセス
   - ADR（Architecture Decision Record）の作成基準

3. コーディング規約

   - 標準規約（coding-standards.md）

     - TypeScript + React の基本原則
     - コーディング原則（DRY, SOLID等）
     - 関数型プログラミングパターン
     - 国際化対応の方針
     - テストとドキュメントの規約

   - プロジェクト固有（coding-for-project.md）

     - プロジェクトのディレクトリ構造
     - 固有の命名規則
     - 状態管理パターン
     - エラー処理方針
     - パフォーマンス最適化戦略

   - AI実装（coding-by-ai.md）
     - 実装計画書の作成手順
     - コードコメント規則
     - AI特有の考慮事項
     - 品質管理プロセス
     - メモリ管理の最適化

4. その他のルール

   - Git運用（git-workflow.md）

     - コミットメッセージ規約
     - ブランチ戦略
     - プルリクエスト作成手順
     - レビュープロセス

   - パッケージ構造（package-structure.md）

     - Package by Feature 原則
     - コロケーションルール
     - 依存関係管理
     - バンドル最適化戦略

   - 技術スタック（tech-stack.md）
     - 言語・フレームワークのバージョン
     - ビルドツールとその設定
     - テストフレームワーク
     - UIライブラリと状態管理
     - CI/CDとモニタリング

### 2. プロンプトエンジニアリング

1. 一般的なベストプラクティス（[prompt-engineering.md](./prompt-engineering.md)）
   - 基本原則と構造化手法
   - プロンプトの最適化技術
   - テストと評価方法
   - セキュリティ考慮事項
2. Roo Code特化型ガイド（[roo-prompt-practices.md](./roo-prompt-practices.md)）
   - モード活用の最適化
   - ツール活用のベストプラクティス
   - コンテキスト管理とタスク実行
   - MCPとプロジェクト固有の考慮事項

### 3. 参照情報（references.md）

- 関連ドキュメント
- 外部リソース
- 用語集

## 🛠️ セットアップ手順

1. ルールの生成

   ```bash
   # .clinerules の生成
   ./mk-clinerules.sh
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
- 2025-03-08: ルール概要の追加
  - 各ルールファイルの詳細な説明を追加
  - コンポーネントの説明を拡充
- 2025-03-08: プロンプトエンジニアリングドキュメントの追加
  - 一般的なプロンプトエンジニアリングのベストプラクティスを追加
  - Roo特化型のプロンプト活用ガイドを追加
  - READMEのプロンプトセクションを更新
