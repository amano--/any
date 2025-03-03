# アクティブコンテキスト

## 現在の作業フォーカス
- ブックマークツリー機能の実装
- Chrome拡張連携の準備
- テストカバレッジの向上
- 多言語対応の実装

## 最近の変更
### 2025-03-02
1. データフェッチガイドラインの確立
   - src/appとfeaturesの責務を明確化
   - コンポーネントへのProps注入パターン定義
   - データフェッチの例外的ケースを整理
   - 実装例とベストプラクティスを文書化

2. i18n機能の強化
   - URLパスからロケール自動抽出機能の追加
   - デフォルトロケールを'ja'に設定
   - RegExp.exec()とnullish coalescingの使用
   - 型安全性の向上

2. ブックマークビューのレイアウト改善
   - 2カラムレイアウトへの変更（1:2比率）
   - 画面幅の最適化（w-full）
   - レイアウト設計ガイドラインの整備
   - コンポーネント構造の文書化強化

2. ブックマークツリーのルートフォルダ実装
   - useEffectによる遅延初期化
   - SSRとの互換性確保
   - 多言語対応（日本語・英語）
   - TreeContainerコンポーネントの拡張

2. 3パネルレイアウトの実装
   - 左パネル：一覧表示（カード/リスト）
   - 右パネル：ツリー表示
   - 下部パネル：コメント表示
   - レスポンシブ対応

3. 多言語対応の実装
   - i18nガイドラインの整備
   - 翻訳キーの構造化
   - コメント機能の多言語対応
   - next-intlの導入

4. 開発プロセスの改善
   - コミット管理ガイドラインの追加
   - AIによる実装履歴の管理方法を規定
   - コンポーネント構造の文書化ルール追加

### 2025-03-01
1. ブックマークコンポーネント実装
   - 基本的なCRUD機能
   - shadcn/uiとの統合
   - バリデーション機能

2. ツリー機能の実装
   - TreeContainerコンポーネント
   - TreeItemコンポーネント
   - ドラッグ&ドロップ機能
   - スタイル定義

3. APIルーター実装
   - tRPCエンドポイント
   - Drizzleスキーマ更新
   - データベースマイグレーション

## アクティブな決定事項
1. UIデザイン
   - 3パネルレイアウトの採用
   - shadcn/uiによるデザインシステム
   - ドラッグ&ドロップによる整理機能
   - 自動ルートフォルダ初期化

2. データ構造
   - Adjacency Listモデル
   - 階層の深さ制限（最大5階層）
   - 循環参照チェック
   - ルートフォルダを含む階層構造

3. 技術選択
   - T3 Stack採用
   - Zustandによる状態管理
   - @dnd-kit/sortableの使用
   - next-intlによる多言語対応
   - useEffectによる安全な初期化

## 現在の課題
1. 技術的課題
   - Chrome拡張との通信方式
   - ブックマークの重複チェック
   - パフォーマンス最適化
   - 翻訳キーの管理と更新

2. 開発タスク
   - テストケースの作成
   - エッジケースの検証
   - ドキュメント整備
   - 多言語対応の完全実装

## 次のステップ
1. 機能拡充
   - Chrome拡張機能連携
   - 同期機能実装
   - オフライン対応
   - 言語切り替え機能の実装

2. 品質向上
   - テストカバレッジ80%達成
   - パフォーマンス最適化
   - アクセシビリティ対応
   - 翻訳品質の確保

3. ドキュメント
   - APIドキュメント作成
   - ユースケース例追加
   - 実装ガイド整備
   - 多言語化ガイドラインの拡充
