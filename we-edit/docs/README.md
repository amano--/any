# We-Edit Documentation Guide

[English](#english) | [日本語](#japanese)

<a id="english"></a>
## English

### Purpose and Scope

This documentation provides comprehensive information about the We-Edit system, including:
- System architecture and design
- Development guidelines
- Implementation details
- Operation procedures
- API specifications

### Directory Structure

```
docs/
├── architecture/     # System architecture documentation
│   ├── index.md     # Architecture documentation index
│   ├── overview.md  # System overview
│   ├── components.md # Component design
│   ├── data-model.md # Data modeling
│   ├── security.md  # Security design
│   ├── scalability.md # Scalability design
│   └── tech-stack.md # Technology stack
├── guidelines/      # Development guidelines
│   ├── i18n-guidelines.md # Internationalization guide
│   └── ai-development.md  # AI development guidelines
└── logs/           # Development logs
    ├── ai/         # AI-assisted development logs
    │   ├── adr/    # Architecture Decision Records
    │   └── work-log/ # Daily work logs
    └── prompt/     # AI prompt histories
```

### How to Contribute

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/we-edit.git
   cd we-edit
   ```

2. **Create a Branch**
   ```bash
   git checkout -b docs/your-contribution
   ```

3. **Make Changes**
   - Follow the formatting guidelines
   - Use provided templates
   - Include both English and Japanese content

4. **Submit Pull Request**
   - Provide clear description
   - Reference related issues
   - Request review from documentation maintainers

### Document Formatting Guidelines

1. **Markdown Standards**
   - Use ATX-style headers (#)
   - Include table of contents for long documents
   - Proper code block formatting with language tags

2. **Diagrams**
   - Use Mermaid.js for diagrams
   - Include alt text for images
   - Follow the project's diagram style guide

3. **Bilingual Content**
   - English and Japanese sections clearly separated
   - Consistent terminology across languages
   - Maintain parallel structure in both languages

### Required Tools and Setup

1. **Documentation Tools**
   - Visual Studio Code
   - Markdown Preview Enhanced plugin
   - Mermaid.js support

2. **Local Preview**
   ```bash
   npm install
   npm run docs:serve
   ```

### Build and Deployment

1. **Build Process**
   ```bash
   npm run docs:build
   ```

2. **Validation**
   ```bash
   npm run docs:lint
   npm run docs:test
   ```

### Key Resources

- [Architecture Documentation](./architecture/index.md)
- [i18n Guidelines](./guidelines/i18n-guidelines.md)
- [AI Development Guidelines](./guidelines/ai-development.md)
- [API Documentation](../src/server/api/README.md)
- [Contributing Guide](../CONTRIBUTING.md)

---

<a id="japanese"></a>
## 日本語

### 目的と範囲

本ドキュメントは、We-Editシステムに関する以下の包括的な情報を提供します：
- システムアーキテクチャと設計
- 開発ガイドライン
- 実装の詳細
- 運用手順
- API仕様

### ディレクトリ構造

```
docs/
├── architecture/     # システムアーキテクチャドキュメント
│   ├── index.md     # アーキテクチャドキュメント目次
│   ├── overview.md  # システム概要
│   ├── components.md # コンポーネント設計
│   ├── data-model.md # データモデリング
│   ├── security.md  # セキュリティ設計
│   ├── scalability.md # スケーラビリティ設計
│   └── tech-stack.md # 技術スタック
├── guidelines/      # 開発ガイドライン
│   ├── i18n-guidelines.md # 国際化ガイド
│   └── ai-development.md  # AI開発ガイドライン
└── logs/           # 開発ログ
    ├── ai/         # AI支援開発ログ
    │   ├── adr/    # アーキテクチャ決定記録
    │   └── work-log/ # 日次作業ログ
    └── prompt/     # AIプロンプト履歴
```

### 貢献方法

1. **フォークとクローン**
   ```bash
   git clone https://github.com/your-username/we-edit.git
   cd we-edit
   ```

2. **ブランチの作成**
   ```bash
   git checkout -b docs/your-contribution
   ```

3. **変更の作成**
   - フォーマットガイドラインに従う
   - 提供されたテンプレートを使用
   - 英語と日本語の両方のコンテンツを含める

4. **プルリクエストの提出**
   - 明確な説明を提供
   - 関連する課題を参照
   - ドキュメント管理者にレビューを依頼

### ドキュメントフォーマットガイドライン

1. **Markdown規約**
   - ATXスタイルのヘッダー（#）を使用
   - 長文書には目次を含める
   - 言語タグ付きの適切なコードブロックフォーマット

2. **図表**
   - 図表にはMermaid.jsを使用
   - 画像には代替テキストを含める
   - プロジェクトの図表スタイルガイドに従う

3. **バイリンガルコンテンツ**
   - 英語と日本語のセクションを明確に区別
   - 言語間で一貫した用語を使用
   - 両言語で並列構造を維持

### 必要なツールとセットアップ

1. **ドキュメントツール**
   - Visual Studio Code
   - Markdown Preview Enhanced プラグイン
   - Mermaid.js サポート

2. **ローカルプレビュー**
   ```bash
   npm install
   npm run docs:serve
   ```

### ビルドとデプロイメント

1. **ビルドプロセス**
   ```bash
   npm run docs:build
   ```

2. **検証**
   ```bash
   npm run docs:lint
   npm run docs:test
   ```

### 主要リソース

- [アーキテクチャドキュメント](./architecture/index.md)
- [i18nガイドライン](./guidelines/i18n-guidelines.md)
- [AI開発ガイドライン](./guidelines/ai-development.md)
- [APIドキュメント](../src/server/api/README.md)
- [コントリビューションガイド](../CONTRIBUTING.md)