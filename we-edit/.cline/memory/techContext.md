# 技術コンテキスト

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- shadcn/ui (UIコンポーネント)
- @dnd-kit/sortable (ドラッグ&ドロップ)
- Zustand (状態管理)

### バックエンド
- tRPC (APIレイヤー)
- Drizzle ORM (データベース)
- NextAuth (認証)

### 開発ツール
- Storybook (UIコンポーネント開発)
- MSW (APIモック)
- Vitest (テスティング)

## 開発環境
- Visual Studio Code
- Node.js
- npm

## アーキテクチャ設計

### データベース設計
- Adjacency Listモデルによる階層構造
- 以下のフィールドを含む：
  - position (並び順)
  - parent_id (親子関係)
  - is_expanded (フォルダ状態)

### APIレイヤー
- tRPCによるエンドツーエンドの型安全性
- Repositoryパターンによるデータアクセス抽象化

### コンポーネント設計
- Atomic Designアプローチ
- 再利用可能なUIコンポーネント
- Storybookによるコンポーネントカタログ化

## パフォーマンス最適化
- Next.jsのビルトインキャッシュ活用
- クライアントサイドキャッシング
- 階層データの効率的な処理

## セキュリティ対策
- NextAuthによる認証
- APIエンドポイントの保護
- 入力バリデーション

## テスト戦略
- ユニットテスト (Vitest)
- インテグレーションテスト
- UIコンポーネントテスト (Storybook)
- APIモック (MSW)
