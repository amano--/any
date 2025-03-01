import { create } from 'zustand';
import type {
  TreeItem,
  TreeItemUpdates,
  FolderTreeItem,
  BookmarkTreeItem,
  FolderTreeItemUpdates,
  BookmarkTreeItemUpdates,
  TreeState,
  DragState,
  DropPosition,
} from '~/types/bookmark-tree';

const initialDragState: DragState = {
  isDragging: false,
  sourceId: null,
  targetId: null,
  position: null,
  sourceType: null,
  parentId: null,
};

/**
 * @ai_implementation
 * 実装計画: src/app/_components/bookmark-tree/ai-logs/2025-03-02_06_52-root-folder-implementation.md
 *
 * BookmarkTreeStore の拡張
 * - ドラッグ状態の管理
 * - ツリー構造の更新ロジック
 * - ルートフォルダの初期化機能
 * - パフォーマンス最適化
 *
 * @ai_decision
 * 選択した実装アプローチ: デフォルトルートフォルダの遅延初期化
 * 理由:
 * 1. コンポーネントのマウント時に初期化することで、既存のデータとの競合を防ぐ
 * 2. useEffectでの初期化により、SSRとの互換性を確保
 *
 * 検討した代替案:
 * - 案1: ストア作成時に初期化 - 不採用理由: SSRでの問題が発生する可能性
 * - 案2: APIからの取得時に初期化 - 不採用理由: APIの応答を待つ必要があり、UX低下
 */
interface BookmarkTreeState extends TreeState {
  // ツリー操作
  // ツリー操作
  moveItem: (sourceId: string, targetId: string | null, position: DropPosition) => void;
  addItem: (item: TreeItem) => void;
  updateItem: (id: string, updates: TreeItemUpdates) => void;
  removeItem: (id: string) => void;
  setTree: (items: TreeItem[]) => void;

  // ドラッグ状態管理
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
}

const isFolderItem = (item: TreeItem): item is FolderTreeItem => {
  return item.type === "folder";
};

const isFolderUpdates = (updates: TreeItemUpdates): updates is FolderTreeItemUpdates => {
  return 'type' in updates && updates.type === 'folder';
};

const isBookmarkUpdates = (updates: TreeItemUpdates): updates is BookmarkTreeItemUpdates => {
  return 'type' in updates && updates.type === 'bookmark';
};

const ensureValidItem = <T extends TreeItem>(item: T | null | undefined): item is T => {
  return item !== null && item !== undefined;
};

export const useBookmarkTreeStore = create<BookmarkTreeState>((set, get) => ({
  // 初期状態
  items: [],
  selectedId: null,
  draggingItem: null,
  dragState: initialDragState,

  // ツリー操作メソッド
  setTree: (items) => set({ items }),

  moveItem: (sourceId, targetId, position) =>
    set((state) => {
      const newTree = [...state.items];
      const sourceItem = findItemRecursive(newTree, sourceId);
      if (!ensureValidItem(sourceItem)) return state;

      removeItemFromParent(newTree, sourceId);

      if (!targetId) {
        // ルートレベルに移動
        const index = getInsertIndex(newTree, position, 0);
        newTree.splice(index, 0, sourceItem);
        sourceItem.parentId = null;
      } else {
        const targetItem = findItemRecursive(newTree, targetId);
        if (!ensureValidItem(targetItem)) return state;

        if (position === "inside" && isFolderItem(targetItem)) {
          // フォルダの中に移動
          targetItem.children.push(sourceItem);
          sourceItem.parentId = targetItem.id;
        } else {
          // 前後に移動
          const parentId = targetItem.parentId;
          const siblings = parentId ? 
            (findItemRecursive(newTree, parentId) as FolderTreeItem)?.children : 
            newTree;
          
          if (!siblings) return state;
          
          const targetIndex = siblings.findIndex(item => item.id === targetId);
          const index = position === "before" ? targetIndex : targetIndex + 1;
          siblings.splice(index, 0, sourceItem);
          sourceItem.parentId = parentId;
        }
      }

      // positionの更新
      updatePositions(newTree);

      return { 
        items: newTree,
        dragState: initialDragState
      };
    }),

  addItem: (item) =>
    set((state) => {
      if (item.parentId === null) {
        return {
          items: [...state.items, item],
        };
      }

      const newTree = [...state.items];
      const parentItem = findItemRecursive(newTree, item.parentId);
      
      if (ensureValidItem(parentItem) && isFolderItem(parentItem)) {
        parentItem.children = [...parentItem.children, item];
        return { items: newTree };
      }

      return state;
    }),

  updateItem: (id, updates) =>
    set((state) => {
      const newTree = [...state.items];
      const item = findItemRecursive(newTree, id);
      if (!ensureValidItem(item)) return state;

      if (isFolderItem(item) && isFolderUpdates(updates)) {
        // フォルダの更新
        Object.assign(item, updates);
      } else if (!isFolderItem(item) && isBookmarkUpdates(updates)) {
        // ブックマークの更新
        Object.assign(item, updates);
      } else if (!('type' in updates)) {
        // 共通プロパティの更新
        Object.assign(item, updates);
      }

      return { items: newTree };
    }),

  removeItem: (id) =>
    set((state) => {
      const newTree = [...state.items];
      removeItemFromParent(newTree, id);
      return { items: newTree };
    }),

  // ドラッグ状態管理
  setDragState: (dragStateUpdates) =>
    set((state) => ({
      dragState: {
        ...state.dragState,
        ...dragStateUpdates,
      },
    })),

  resetDragState: () => set({ dragState: initialDragState }),
}));

// ヘルパー関数
function findItemRecursive(items: TreeItem[], id: string): TreeItem | null {
  if (!Array.isArray(items)) return null;
  
  for (const item of items) {
    if (!item) continue;
    if (item.id === id) return item;
    if (isFolderItem(item)) {
      const found = findItemRecursive(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeItemFromParent(items: TreeItem[], id: string): boolean {
  if (!Array.isArray(items)) return false;

  const index = items.findIndex(item => item?.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    return true;
  }

  for (const item of items) {
    if (item && isFolderItem(item)) {
      if (removeItemFromParent(item.children, id)) {
        return true;
      }
    }
  }
  
  return false;
}

function updatePositions(items: TreeItem[], parentId: string | null = null) {
  if (!Array.isArray(items)) return;

  items.forEach((item, index) => {
    if (!item) return;
    item.position = index;
    item.parentId = parentId;
    if (isFolderItem(item)) {
      updatePositions(item.children, item.id);
    }
  });
}

function getInsertIndex(items: TreeItem[], position: DropPosition, defaultIndex: number): number {
  if (position === "after") {
    return defaultIndex + 1;
  }
  return defaultIndex;
}

export const findItemById = (items: TreeItem[], id: string): TreeItem | null => {
  return findItemRecursive(items, id);
};

// セレクタ関数
export const selectDragState = (state: BookmarkTreeState) => state.dragState;
export const selectItems = (state: BookmarkTreeState) => state.items;
export const selectSelectedId = (state: BookmarkTreeState) => state.selectedId;
