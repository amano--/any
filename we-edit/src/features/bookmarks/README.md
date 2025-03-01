# Bookmarks Feature

## 概要

ブックマーク管理機能を提供するフィーチャーモジュールです。
ドラッグ＆ドロップによる整理、階層構造の管理、多言語対応などの機能を提供します。

## 主な機能

- ブックマークの階層構造管理
- ドラッグ＆ドロップによる並び替え
- フォルダの作成・編集
- 多言語対応
- Chromeブックマークの互換性

## 使用方法

### 基本的な使用方法

```tsx
import { TreeContainer, useBookmarkOperations } from '~/features/bookmarks';

function BookmarkManager() {
  const { createFolder, createBookmark } = useBookmarkOperations();

  return (
    <div>
      <TreeContainer />
      <button onClick={() => createFolder("新しいフォルダ")}>
        フォルダを作成
      </button>
    </div>
  );
}
```

### カスタムフックの使用

```tsx
import { useBookmarkTree, useTreeDragDrop } from '~/features/bookmarks';

function CustomBookmarkView() {
  const { items, addItem, removeItem } = useBookmarkTree();
  const { dragState, handleDragStart, handleDragEnd } = useTreeDragDrop();

  // カスタムビューの実装
}
```

## ディレクトリ構造

```
src/features/bookmarks/
  ├── components/         # Reactコンポーネント
  │   └── tree/          # ツリー関連のコンポーネント
  ├── hooks/             # カスタムフック
  ├── types/             # 型定義
  ├── utils/             # ユーティリティ関数
  ├── index.ts           # パブリックAPI
  └── README.md          # ドキュメント
```

## 主要なコンポーネント

### TreeContainer

ブックマークツリー全体を管理するコンテナコンポーネント。
ドラッグ＆ドロップ、ツリーの表示、操作を統合的に管理します。

```tsx
<TreeContainer />
```

### TreeItem

個別のブックマークまたはフォルダを表示するコンポーネント。
通常は直接使用せず、TreeContainerを通じて使用します。

## カスタムフック

### useBookmarkTree

ブックマークツリーの状態管理を行うフック。

```tsx
const { 
  items,          // ツリーアイテム配列
  addItem,        // アイテム追加
  removeItem,     // アイテム削除
  updateItem,     // アイテム更新
  moveItem        // アイテム移動
} = useBookmarkTree();
```

### useTreeDragDrop

ドラッグ＆ドロップ操作を管理するフック。

```tsx
const {
  dragState,        // ドラッグ状態
  handleDragStart,  // ドラッグ開始ハンドラ
  handleDragEnd,    // ドラッグ終了ハンドラ
  handleDragOver    // ドラッグオーバーハンドラ
} = useTreeDragDrop();
```

### useBookmarkOperations

高レベルなブックマーク操作を提供するフック。

```tsx
const {
  createBookmark,    // ブックマーク作成
  createFolder,      // フォルダ作成
  updateBookmark,    // ブックマーク更新
  updateFolder,      // フォルダ更新
  deleteItem,        // アイテム削除
  ensureRootFolder   // ルートフォルダの確認/作成
} = useBookmarkOperations();
```

## 設定と制約

- 最大階層深さ: 5階層
- 同一フォルダ内での重複名を許可しない
- フォルダの循環参照を防止

## 国際化対応

`useText`フックを使用して多言語対応を実現。
翻訳キーは`bookmarks`名前空間で管理されています。

```tsx
const { t } = useText();
t.bookmarks.rootFolder  // ルートフォルダ名
t.bookmarks.newFolder   // 新規フォルダ名
```

## エラーハンドリング

- 階層深さの超過
- 循環参照の検出
- ドラッグ＆ドロップの制約違反

これらのエラーは適切なエラーメッセージとともにユーザーに通知されます。

## パフォーマンス最適化

- メモ化による不要な再レンダリングの防止
- ドラッグ＆ドロップ操作の最適化
- 大規模なツリー構造のための仮想化対応

## 今後の拡張予定

- オフライン対応
- Chromeとの同期機能
- 検索機能の強化
- タグ管理システム