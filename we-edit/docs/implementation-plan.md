# ブックマークツリー実装計画

## 現状の課題

現在のブックマークツリーコンポーネントには以下の課題があります：

1. 初期表示時にルートフォルダが表示されていない
2. ドラッグ可能な要素であることが視覚的に分かりにくい（すでに対応済み）

## 実装計画

### 1. ルートフォルダの初期表示

ブックマークツリーの初期表示時に、ルートとなるフォルダを自動的に表示するように改善します。これにより、ユーザーはアプリケーションを開いた直後からフォルダ構造を理解できるようになります。

#### 実装方法

1. `BookmarkTreeStore`の初期化時に、デフォルトのルートフォルダを作成する機能を追加します。
2. アプリケーション起動時に、ツリーが空の場合は自動的にルートフォルダを作成します。
3. ルートフォルダには「マイブックマーク」などのデフォルト名を設定し、展開状態にしておきます。

#### 技術的な実装詳細

1. `src/store/bookmark-tree.ts`を修正し、初期化時にデフォルトフォルダを作成するロジックを追加します。
2. `useBookmarkTreeStore`の初期状態に、空の配列ではなくデフォルトのルートフォルダを含む配列を設定します。
3. `TreeContainer`コンポーネントで、初回レンダリング時にツリーが空の場合はルートフォルダを作成するロジックを実装します。

```typescript
// 実装例
const initializeDefaultRoot = () => {
  const { items, addItem } = useBookmarkTreeStore.getState();
  
  if (items.length === 0) {
    const rootFolder: FolderTreeItem = {
      id: crypto.randomUUID(),
      type: "folder",
      name: t.bookmarks.rootFolder, // 「マイブックマーク」などの翻訳キー
      isExpanded: true,
      position: 0,
      parentId: null,
      children: [],
    };
    addItem(rootFolder);
  }
};

// useEffectでコンポーネントマウント時に実行
useEffect(() => {
  initializeDefaultRoot();
}, []);
```

### 2. 国際化対応

新しく追加するルートフォルダの名前は国際化（i18n）に対応させます。

#### 実装方法

1. 英語と日本語の翻訳ファイルに「マイブックマーク」のキーを追加します。
2. `useText`フックを使用して適切な言語のテキストを取得します。

```typescript
// src/i18n/locales/en/bookmarks.ts に追加
export const bookmarks = {
  // 既存のキー
  rootFolder: "My Bookmarks",
  // ...
};

// src/i18n/locales/ja/bookmarks.ts に追加
export const bookmarks = {
  // 既存のキー
  rootFolder: "マイブックマーク",
  // ...
};
```

## 実装の利点

1. **ユーザビリティの向上**: 初期表示時からフォルダ構造が明確になり、ユーザーは直感的にブックマークの整理を始められます。
2. **一貫性のある体験**: 他のブックマークマネージャー（Chrome、Firefoxなど）と同様の階層構造を提供することで、ユーザーは馴染みのある操作感を得られます。
3. **視覚的な明確さ**: ルートフォルダが明示的に表示されることで、階層構造が視覚的に理解しやすくなります。

## 実装手順

1. `Code`モードに切り替えて、上記の実装計画に基づいてコードを修正します。
2. 具体的には以下のファイルを修正します：
   - `src/store/bookmark-tree.ts`: 初期状態の設定
   - `src/app/_components/bookmark-tree/tree-container.tsx`: 初期化ロジックの追加
   - `src/i18n/locales/en/bookmarks.ts`と`src/i18n/locales/ja/bookmarks.ts`: 翻訳キーの追加
3. 実装後、ブラウザで動作確認を行います。

この実装により、ブックマークツリーの使いやすさが向上し、ユーザーはより直感的にブックマークを管理できるようになります。