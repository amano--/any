# Cline Rules 設定ガイド

このディレクトリには、.clinerules に記載すべきルールが各カテゴリごとに整理されています。

## 📚 ルールファイル一覧

以下、重要度順にルールファイルを記載します：

### 1. [personal.md](./personal.md)
個人設定に関するルール。ユーザー名やチーム名、個人の作業スタイルなど、最も基本的な設定を定義します。

### 2. [project.md](./project.md)
プロジェクト全体に関わるルール。週報の更新タイミングや作業終了時の手順など、プロジェクト運営の基本ルールを定義します。

### 3. [coding-standards.md](./coding-standards.md)
コーディング規約の基本ルール。TypeScriptとReactの実装規約、型安全性、テスト方針などを定義します。

### 4. [coding-for-project.md](./coding-for-project.md)
プロジェクト固有のコーディングルール。プロジェクト特有の実装パターンや命名規則を定義します。

### 5. [coding-by-ai.md](./coding-by-ai.md)
AI実装者向けのコーディングルール。実装計画書の作成、ドキュメント管理、コメント記述などのガイドラインを提供します。

### 6. [git-workflow.md](./git-workflow.md)
Gitの運用ルール。コミットメッセージの形式、ブランチ戦略、プルリクエストの作成手順を定義します。

### 7. [package-structure.md](./package-structure.md)
パッケージ構造に関するルール。ディレクトリ構成、モジュール分割、依存関係の管理方針を定義します。

### 8. [tech-stack.md](./tech-stack.md)
技術スタックに関するルール。使用するライブラリやツール、バージョン管理の方針を定義します。

### 9. [cline-best-practices.md](./cline-best-practices.md)
Clineの推奨するベストプラクティス。メモリバンクの活用方法やプロンプトの作成方針を提供します。

## 🔄 更新プロセス

1. ルールの追加・変更時
   - 対応するカテゴリのファイルを更新
   - README.md の説明を必要に応じて更新
   - mk-clinerules.sh を実行して .clinerules を生成

2. レビュー時の確認事項
   - ルールの一貫性
   - 既存ルールとの整合性
   - 実装への影響範囲

## 🔍 使用方法

1. 新規ルールの追加
   ```bash
   # 1. 適切なカテゴリファイルを選択
   # 2. ルールを追加
   # 3. .clinerules を生成
   ./mk-clinerules.sh
   ```

2. ルールの検索
   - カテゴリごとに整理されたファイルから該当する規約を参照
   - 生成された .clinerules で最新のルールを確認

## 📋 メンテナンス

- 定期的なルールのレビューと更新
- 不要になったルールの削除
- ルール間の依存関係の管理
- ドキュメントの最新性維持

## 🔗 関連リンク

- [プロジェクトガイドライン](../../guidelines/README.md)
- [開発プロセス](../../guidelines/development-process/README.md)
- [AIガイドライン](../../ai/guidelines/README.md)