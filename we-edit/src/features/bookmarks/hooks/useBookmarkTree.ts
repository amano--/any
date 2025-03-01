import { create } from 'zustand';
import { 
  TreeItem, 
  TreeState, 
  DragState, 
  TreeItemUpdates,
  DropPosition,
  isFolder,
  FolderTreeItem,
  calculateTreeDepth
} from '../types';

/**
 * @ai_decision
 * 選択した実装アプローチ: カスタムフックによるストア管理
 * 理由:
 * 1. ロジックの再利用性向上
 * 2. コンポーネントとの疎結合
 * 3. テスト容易性の向上
 */

const initialDragState: DragState = {
  isDragging: false,
  sourceId: null,
  targetId: null,
  position: null,
  sourceType: null,
  parentId: null,
};

interface BookmarkTreeState {
  // 状態
  items: TreeItem[];
  selectedId: string | null;
  expandedIds: Set<string>;
  dragState: DragState;

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

/**
 * 再利用可能なブックマークツリーのカスタムフック
 */
export const useBookmarkTree = create<BookmarkTreeState>((set, get) => ({
  // 初期状態
  items: [],
  selectedId: null,
  expandedIds: new Set(),
  dragState: initialDragState,

  // ツリー操作メソッド
  setTree: (items) => set({ items }),

  moveItem: (sourceId, targetId, position) =>
    set((state) => {
      const newTree = [...state.items];
      const sourceItem = findItemRecursive(newTree, sourceId);
      if (!sourceItem) return state;

      removeItemFromParent(newTree, sourceId);

      if (!targetId) {
        // ルートレベルに移動
        const index = getInsertIndex(newTree, position, 0);
        newTree.splice(index, 0, sourceItem);
        sourceItem.parentId = null;
      } else {
        const targetItem = findItemRecursive(newTree, targetId);
        if (!targetItem) return state;

        if (position === "inside" && isFolder(targetItem)) {
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
          
          const targetIndex = siblings.findIndex(item => item?.id === targetId);
          const index = position === "before" ? targetIndex : targetIndex + 1;
          siblings.splice(index, 0, sourceItem);
          sourceItem.parentId = parentId;
        }
      }

      // positionの更新
      updatePositions(newTree);

      return { 
        ...state,
        items: newTree,
        dragState: initialDragState
      };
    }),

  addItem: (item) =>
    set((state) => {
      if (item.parentId === null) {
        return {
          ...state,
          items: [...state.items, item],
        };
      }

      const newTree = [...state.items];
      const parentItem = findItemRecursive(newTree, item.parentId);
      
      if (parentItem && isFolder(parentItem)) {
        parentItem.children = [...parentItem.children, item];
        return { ...state, items: newTree };
      }

      return state;
    }),

  updateItem: (id, updates) =>
    set((state) => {
      const newTree = [...state.items];
      const item = findItemRecursive(newTree, id);
      if (!item) return state;

      Object.assign(item, updates);
      return { ...state, items: newTree };
    }),

  removeItem: (id) =>
    set((state) => {
      const newTree = [...state.items];
      removeItemFromParent(newTree, id);
      return { ...state, items: newTree };
    }),

  // ドラッグ状態管理
  setDragState: (dragStateUpdates) =>
    set((state) => ({
      ...state,
      dragState: {
        ...state.dragState,
        ...dragStateUpdates,
      },
    })),

  resetDragState: () => set((state) => ({ ...state, dragState: initialDragState })),
}));

// ヘルパー関数
function findItemRecursive(items: TreeItem[], id: string): TreeItem | null {
  for (const item of items) {
    if (!item) continue;
    if (item.id === id) return item;
    if (isFolder(item)) {
      const found = findItemRecursive(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeItemFromParent(items: TreeItem[], id: string): boolean {
  const index = items.findIndex(item => item?.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    return true;
  }

  for (const item of items) {
    if (item && isFolder(item)) {
      if (removeItemFromParent(item.children, id)) {
        return true;
      }
    }
  }
  
  return false;
}

function updatePositions(items: TreeItem[], parentId: string | null = null) {
  items.forEach((item, index) => {
    if (!item) return;
    item.position = index;
    item.parentId = parentId;
    if (isFolder(item)) {
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

// 便利なセレクタ
export const selectDragState = (state: BookmarkTreeState) => state.dragState;
export const selectItems = (state: BookmarkTreeState) => state.items;
export const selectSelectedId = (state: BookmarkTreeState) => state.selectedId;
export const selectExpandedIds = (state: BookmarkTreeState) => state.expandedIds;