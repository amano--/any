# 実装計画: ブックマークツリー編集機能の復元

作成日: 2025-03-02 08:22

## 1. 概要

- ブックマークツリーの名前をダブルクリックで編集できる機能の復元
- フォルダに子要素を追加できる機能の復元
- ドラッグアンドドロップでフォルダに子要素を追加する機能の改善

## 2. 技術的アプローチ

- 選択した実装方法: Reactコンポーネントの拡張と状態管理の改善
- 使用する技術やライブラリ:
  - React (フロントエンド)
  - @dnd-kit (ドラッグアンドドロップ)
  - Zustand (状態管理)
  - Framer Motion (アニメーション)
- アーキテクチャ上の配置:
  - src/features/bookmarks/components/tree/TreeItem.tsx - ツリーアイテムコンポーネント
  - src/features/bookmarks/components/tree/TreeContainer.tsx - ツリーコンテナコンポーネント
  - src/features/bookmarks/hooks/useTreeDragDrop.ts - ドラッグアンドドロップロジック
  - src/features/bookmarks/hooks/useBookmarkOperations.ts - ブックマーク操作ロジック
  - src/i18n/locales/en/bookmarks.ts - 英語の翻訳
  - src/i18n/locales/ja/bookmarks.ts - 日本語の翻訳

## 3. タスク分割

- [x] TreeItem.tsxに名前をダブルクリックで編集する機能を追加
  - [x] 編集モードの状態管理を実装
  - [x] ダブルクリックイベントハンドラを追加
  - [x] 編集モード時のInputコンポーネントを実装
  - [x] キーボードイベント（Enter, Escape）の処理を追加
  - [x] フォーカスアウト時の保存処理を実装

- [x] TreeItem.tsxにフォルダに子要素を追加するボタンを追加
  - [x] フォルダの場合のみボタンを表示
  - [x] クリックイベントハンドラを実装
  - [x] カスタムイベント'add-to-folder'の発火処理を追加

- [x] TreeContainer.tsxに'add-to-folder'イベントのリスナーを追加
  - [x] イベントリスナーの登録と解除
  - [x] 選択されたフォルダに子要素を追加する処理
  - [x] 成功時のトースト通知を実装

- [x] useTreeDragDrop.tsのhandleDragEnd関数を修正
  - [x] フォルダの場合は"inside"に設定
  - [x] ドラッグ中のフォルダを自動的に展開する処理を追加

- [x] TreeContainer.tsxにonDragOverイベントハンドラを追加
  - [x] ドラッグ中にフォルダの上にホバーした時の処理
  - [x] フォルダを自動的に展開する機能を実装

- [x] 翻訳ファイルに必要な文字列を追加
  - [x] 英語の翻訳ファイルに'folderCreated'と'addToFolder'を追加
  - [x] 日本語の翻訳ファイルに'folderCreated'と'addToFolder'を追加

## 4. 考慮事項

- パフォーマンス要件:
  - ドラッグアンドドロップ操作の応答性を確保
  - 編集モード切り替え時のスムーズな遷移

- ユーザビリティ要件:
  - 直感的な操作感を提供
  - 視覚的なフィードバックを適切に提供
  - キーボードショートカットのサポート

- 多言語対応:
  - 英語と日本語の両方をサポート
  - 翻訳キーの一貫性を確保

## 5. テスト計画

- 手動テスト:
  - ダブルクリックによる名前編集機能のテスト
  - フォルダに子要素を追加する機能のテスト
  - ドラッグアンドドロップでフォルダに子要素を追加する機能のテスト
  - 多言語表示のテスト

- 自動テスト:
  - 将来的にはJestとReact Testing Libraryを使用した単体テストの追加を検討