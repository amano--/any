# 技術コンテキスト

## 使用されている技術

### コア技術

1. **[T3 Stack](https://create.t3.gg/)**

   - バージョン: 最新安定版
   - TypeScript のネイティブサポート
   - Next.js 14 (App Router)
   - 認証システムに NextAuth(Auth.js) を採用
   - DBアクセスに drizzle を採用
   - tRPC tanstack-query を採用

2. **TypeScript**

   - 静的型付け
   - 型推論と型チェック
   - インターフェースと型定義
   - ジェネリクスの活用

3. **[shadcn/ui](https://ui.shadcn.com/)**

   - tailwindcss
   - コンポーネントライブラリ
   - カスタマイズ可能なデザインシステム

4. **Storybook**

   - コンポーネントカタログに使用する
   - UIコンポーネントの開発とテスト

5. **Zod**

   - スキーマ検証
   - ランタイム型チェック
   - 型推論との連携

6. **Chrome拡張機能**
   - Manifest V3
   - バックグラウンドサービスワーカー
   - コンテンツスクリプト

### テスト技術

1. **vitest**
   - `@std/expect`: アサーションライブラリ
   - `@std/testing/bdd`: BDD スタイルのテスト
   - テストカバレッジ計測
   - モックとスパイ機能

2. **MSW (Mock Service Worker)**
   - APIモック
   - テスト環境での HTTP リクエストの制御

### ビルドとツール

1. **GitHub Actions**
   - CI/CD パイプライン
   - 自動テストと検証
   - コード品質チェック
   - Chrome拡張機能のビルド

## 開発環境のセットアップ

### 必要なツール

1. **Node.js と npm**
   - Node.js v18.0.0 以上
   - npm v9.0.0 以上

2. **データベース**
   - PostgreSQL 15以上
   - データベース名: `we-edit`

3. **Chrome拡張機能開発**
   - Chrome ブラウザ
   - 開発者モード有効化

### 開発ワークフロー

1. **環境構築**
```bash
# リポジトリのクローン
git clone [repository-url]
cd we-edit

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な値を設定

# データベースのマイグレーション
npm run db:push
```

2. **開発サーバーの起動**
```bash
# Next.jsの開発サーバー起動
npm run dev

# Storybookの起動
npm run storybook
```

3. **Chrome拡張機能の開発**
```bash
# 拡張機能のビルド
npm run build:extension

# Chrome拡張機能の読み込み
# 1. chrome://extensionsを開く
# 2. 開発者モードを有効化
# 3. "パッケージ化されていない拡張機能を読み込む"
# 4. build/chrome-extディレクトリを選択
```

## 技術的制約

1. **ブラウザ互換性**
   - Chrome最新版をサポート
   - その他のブラウザは段階的にサポート

2. **パフォーマンス**
   - 初期ロード時間: 3秒以内
   - ブックマーク操作のレスポンス: 500ms以内

3. **セキュリティ**
   - HTTPS通信の強制
   - Chrome拡張機能とのセキュアな通信
   - CSP (Content Security Policy) の適用

## 依存関係

### 主要な依存関係

```json
{
  "dependencies": {
    "@t3-oss/env-nextjs": "^0.7.1",
    "@tanstack/react-query": "^5.0.0",
    "@trpc/client": "^10.43.6",
    "@trpc/next": "^10.43.6",
    "@trpc/react-query": "^10.43.6",
    "@trpc/server": "^10.43.6",
    "drizzle-orm": "^0.28.5",
    "next": "^14.0.3",
    "next-auth": "^4.24.5",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/chrome": "^0.0.254",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.39",
    "@types/react-dom": "^18.2.17",
    "autoprefixer": "^10.4.16",
    "msw": "^2.0.9",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.3.2",
    "vitest": "^0.34.6"
  }
}
```

### 依存関係管理

- npmを使用したパッケージ管理
- package-lock.jsonによるバージョン固定
- 定期的な依存関係の更新とセキュリティチェック

## 技術的な意思決定

1. **T3 Stackの採用理由**
   - 型安全性の確保
   - フルスタック開発の効率化
   - コミュニティサポート

2. **Drizzle ORMの選択**
   - TypeScriptとの親和性
   - マイグレーション管理の容易さ
   - パフォーマンス

3. **Chrome拡張機能の実装方針**
   - Manifest V3の採用
   - モジュラー設計
   - TypeScriptによる型安全性の確保
