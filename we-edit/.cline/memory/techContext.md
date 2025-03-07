# 技術コンテキスト

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- shadcn/ui (UIコンポーネント)
- @dnd-kit/sortable (ドラッグ&ドロップ)
- Zustand (状態管理)
- next-intl (多言語対応)

### バックエンド
- tRPC (APIレイヤー)
- Drizzle ORM (データベース)
- NextAuth (認証)
- neverthrow (エラー処理)
- ulid (イベントID生成)

### イベントソーシング
- Zustandベースのイベントストア
- Write/Read Eventsの分離
- ULIDによる時系列ソート

### 開発ツール
- Storybook (UIコンポーネント開発)
- MSW (APIモック)
- Vitest (テスティング)
- Draw.io (クラス図・設計図)
  - テキストベースのXML作成
  - .txt → .drawio変換アプローチ
  - バージョン管理対応

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
- 多言語対応の抽象化（useText hook）

### モデリング設計
- Draw.ioを使用した標準化されたクラス図作成
- 境界付けられたコンテキストの視覚化
- システム構造の文書化
- チーム間の設計共有

### 国際化（i18n）設計
- next-intlによる多言語サポート
- 構造化された翻訳キー管理
- 言語ごとの分離されたリソースファイル
- 型安全な翻訳キーアクセス

## パフォーマンス最適化
- Next.jsのビルトインキャッシュ活用
- クライアントサイドキャッシング
- 階層データの効率的な処理
- 翻訳リソースの動的ローディング

## セキュリティ対策
- NextAuthによる認証
- APIエンドポイントの保護
- 入力バリデーション
- XSS対策

## テスト戦略
- ユニットテスト (Vitest)
- インテグレーションテスト
- UIコンポーネントテスト (Storybook)
- APIモック (MSW)
- 多言語対応のテスト
