# プロジェクト概要：ブックマーク管理アプリケーション

## 目的
- ウェブページのブックマークを効率的に管理・整理するためのアプリケーション
- Chromeブックマークとの互換性を保持
- 直感的なUIによる操作性の向上

## コア機能
1. ブックマーク管理
   - CRUD操作
   - フォルダによる階層構造
   - ドラッグ&ドロップによる整理

2. Chrome拡張連携
   - ブックマークのインポート/エクスポート
   - リアルタイム同期

3. ユーザー体験
   - 3パネルレイアウト
   - レスポンシブデザイン
   - アクセシビリティ対応

## 技術要件
- 型安全性の確保
- パフォーマンスの最適化
- テストカバレッジ80%以上

## 制約条件
- フォルダの最大深さ：5階層
- 循環参照の防止
- 同一階層での重複名チェック
