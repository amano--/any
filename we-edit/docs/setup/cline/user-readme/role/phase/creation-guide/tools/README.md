# 文書作成支援ツール集

## 概要
このディレクトリには、効率的な文書作成と品質管理を支援するツール群が含まれています。自動化ツール、スクリプト、ワークフローを活用することで、一貫性のある高品質な文書を効率的に作成・管理できます。

## ツール構成

### 1. 自動化ツール
[automation-tools.md](./automation-tools.md)
- テンプレート生成
- 品質チェック
- バージョン管理
- レビュー管理
- メトリクス収集

主な用途：
- 文書の自動生成
- 品質の自動チェック
- バージョン管理の自動化
- レビュープロセスの効率化

### 2. スクリプト・ワークフロー
[scripts-workflows.md](./scripts-workflows.md)
- CI/CDワークフロー
- 検証スクリプト
- 自動化スクリプト
- レポート生成

主な用途：
- 継続的な品質確保
- 自動チェックの実施
- インデックスの生成
- レポートの作成

## セットアップ方法

### 1. 環境準備
```bash
# 必要なツールのインストール
npm install -g doc-tools

# 設定ファイルの配置
cp config/doc-tools.yaml .doc-tools.yaml

# 環境変数の設定
export DOC_TOOLS_HOME=/path/to/tools
export DOC_TEMPLATE_PATH=/path/to/templates
```

### 2. CI/CD設定
```yaml
# GitHub Actionsの設定例
setup:
  - npm install
  - npm run setup:tools
  - npm run setup:workflows

validate:
  - npm run validate:docs
  - npm run generate:report
```

## 使用方法

### 1. 自動化ツール
```bash
# テンプレート生成
doc-tools generate template --type technical

# 品質チェック
doc-tools check quality --path docs/

# バージョン更新
doc-tools version bump --type minor
```

### 2. スクリプト実行
```bash
# 構造検証
npm run validate:structure

# 品質チェック
npm run check:quality

# レポート生成
npm run generate:report
```

## カスタマイズ

### 1. ツールのカスタマイズ
- 設定ファイルの調整
- プラグインの追加
- ルールの設定
- テンプレートの修正

### 2. ワークフローのカスタマイズ
- チェック項目の追加
- 通知設定の変更
- 承認フローの調整
- レポート形式の変更

## メンテナンス

### 1. 定期メンテナンス
- ツールの更新
- 設定の見直し
- ログの確認
- パフォーマンス確認

### 2. トラブルシューティング
- エラーログの確認
- 設定の検証
- 依存関係の確認
- バックアップの実施

## 拡張方法

### 1. プラグイン開発
```typescript
// プラグインの例
class CustomValidator implements Validator {
  validate(doc: Document): ValidationResult {
    // カスタム検証ロジック
    return {
      valid: true,
      messages: []
    };
  }
}
```

### 2. ワークフロー追加
```yaml
# カスタムワークフローの例
custom-workflow:
  steps:
    - validate
    - transform
    - publish
  triggers:
    - on-push
    - on-schedule
```

## サポート

### 1. ヘルプリソース
- ドキュメント
- FAQページ
- サンプルコード
- チュートリアル

### 2. トラブルシューティング
- 一般的な問題
- 解決方法
- 回避策
- サポート窓口

## よくある質問

### 1. セットアップ
Q: インストールに失敗する場合は？
A: 依存関係とNodeバージョンを確認してください。

Q: 設定ファイルの場所は？
A: プロジェクトルートの.doc-tools.yamlを確認してください。

### 2. 運用
Q: 自動チェックをスキップするには？
A: コミットメッセージに[skip-doc-check]を含めてください。

Q: カスタムルールを追加するには？
A: rules/ディレクトリにルールファイルを追加してください。