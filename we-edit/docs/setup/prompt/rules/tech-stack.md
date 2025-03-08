# 技術スタック

## 1. コア技術

### 1.1 言語

- TypeScript 5.x
  - strict モード必須
  - ESLint + Prettier でコード品質管理
  - tsconfig.json で厳格な型チェック設定

### 1.2 フレームワーク

- React 18.x
  - 関数コンポーネントのみ使用
  - Hooks パターンを標準採用
  - Suspense と Error Boundary の積極活用

## 2. ビルドツール

### 2.1 開発環境

- Next.js 14.x
  - App Router 採用
  - Server Components 活用
  - 適切なキャッシュ戦略の実装

### 2.2 ビルド設定

- Webpack 5.x (Next.js に組み込み)
  - 最適化設定の調整
  - モジュールフェデレーション対応
  - Dynamic Imports の活用

### 2.3 パッケージ管理

- pnpm
  - 厳格なバージョン管理
  - モノレポ対応
  - workspace 機能の活用

## 3. テストフレームワーク

### 3.1 ユニットテスト

- Vitest
  - React Testing Library との統合
  - 高速な実行と Watch モード
  - カバレッジレポート生成

### 3.2 E2Eテスト

- Playwright
  - クロスブラウザテスト
  - Visual Regression Testing
  - CI/CD パイプライン統合

### 3.3 コンポーネントテスト

- Storybook 7.x
  - インタラクションテスト
  - ビジュアルテスト
  - ドキュメンテーション

## 4. UIライブラリ

### 4.1 コンポーネント

- shadcn/ui
  - カスタマイズ可能なコンポーネント
  - アクセシビリティ対応
  - ダークモード対応

### 4.2 スタイリング

- Tailwind CSS
  - 型安全な設定
  - カスタムユーティリティの作成
  - デザインシステムとの統合

### 4.3 アイコン

- Lucide Icons
  - TypeScript サポート
  - SVG 最適化
  - Tree-shaking 対応

## 5. 状態管理

### 5.1 クライアントステート

- Zustand
  - 型安全な状態管理
  - DevTools 対応
  - ミドルウェアサポート

### 5.2 サーバーステート

- TanStack Query v5
  - キャッシュ管理
  - 楽観的更新
  - 無限スクロール対応

### 5.3 フォーム

- React Hook Form
  - 型安全なフォーム管理
  - Zod によるバリデーション
  - パフォーマンス最適化

## 6. 開発ツール

### 6.1 コード品質

- ESLint
  - TypeScript ESLint
  - React Hooks ESLint
  - Import 順序の強制

### 6.2 フォーマット

- Prettier
  - 一貫したコードスタイル
  - エディタ統合
  - Git フック連携

### 6.3 Git フック

- Husky
  - コミット前の型チェック
  - テスト自動実行
  - リントチェック

## 7. CI/CD

### 7.1 継続的インテグレーション

- GitHub Actions
  - 自動テスト実行
  - 型チェック
  - コードリントと品質チェック

### 7.2 デプロイメント

- Vercel
  - プレビューデプロイメント
  - エッジ関数
  - Analytics 統合

## 8. モニタリング

### 8.1 エラートラッキング

- Sentry
  - エラー収集と分析
  - パフォーマンスモニタリング
  - リリーストラッキング

### 8.2 パフォーマンス

- Web Vitals
  - コアWeb Vitals の監視
  - ユーザー体験の測定
  - パフォーマンス最適化

### 8.3 アナリティクス

- Vercel Analytics
  - リアルタイムモニタリング
  - ユーザー行動分析
  - パフォーマンスメトリクス
