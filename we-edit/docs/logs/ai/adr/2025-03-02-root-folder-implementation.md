# ADR: ブックマークツリーのルートフォルダ実装

## ステータス

提案 (2025-03-02)

## 文脈

ブックマークツリーの初期表示時に、ルートとなるフォルダが表示されていないという課題がありました。これにより：
- ユーザーが階層構造を理解しにくい
- 他のブックマークマネージャーとの一貫性が失われている
- ブックマークの整理が直感的でない

## 決定事項

以下の実装方針を採用しました：

1. useEffectによるルートフォルダの遅延初期化
   - SSRとの互換性を確保
   - 既存のデータとの競合を防止
   - UIレンダリング後の安全な初期化

2. 多言語対応
   - 英語：「My Bookmarks」
   - 日本語：「マイブックマーク」

3. i18nシステムの活用
   - useText フックを使用
   - 翻訳キーによる管理

## 代替案の検討

1. ストア作成時の初期化
   - 利点：早期初期化
   - 欠点：SSRでの問題が発生する可能性
   - 不採用理由：SSRとの互換性の問題

2. APIからの取得時の初期化
   - 利点：バックエンドとの一貫性
   - 欠点：APIの応答を待つ必要があり、UX低下
   - 不採用理由：初期表示の遅延

## 技術的な影響

1. パフォーマンス
   - useEffectの依存配列を最適化
   - 不要な再レンダリングを防止

2. コードベース
   - BookmarkTreeStoreの拡張
   - TreeContainerコンポーネントの機能追加
   - 翻訳ファイルの更新

## 教訓

1. SSRを考慮した初期化戦略の重要性
2. 多言語対応を前提とした設計の必要性
3. ユーザー体験を重視した実装判断