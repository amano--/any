import { create } from 'zustand';
import type { TreeItem } from '~/types/bookmark-tree';

interface BookmarkTreeState {
  tree: TreeItem[];
  moveItem: (sourceId: string, destinationId: string | null, index: number) => void;
  addItem: (item: TreeItem) => void;
  updateItem: (id: string, updates: Partial<Omit<TreeItem, 'id'>>) => void;
  removeItem: (id: string) => void;
  setTree: (items: TreeItem[]) => void;
}

export const useBookmarkTreeStore = create<BookmarkTreeState>((set) => ({
  tree: [],

  setTree: (items) => set({ tree: items }),

  moveItem: (sourceId, destinationId, index) =>
    set((state) => {
      const newTree = [...state.tree];
      const sourceItem = findItemRecursive(newTree, sourceId);
      if (!sourceItem) return state;

      removeItemFromParent(newTree, sourceId);

      if (destinationId === null) {
        // ルートレベルに移動
        newTree.splice(index, 0, sourceItem);
      } else {
        // 他のアイテムの子として移動
        const destinationItem = findItemRecursive(newTree, destinationId);
        if (!destinationItem) return state;

        if (!destinationItem.children) {
          destinationItem.children = [];
        }
        destinationItem.children.splice(index, 0, sourceItem);
      }

      sourceItem.parentId = destinationId;

      // positionの更新
      updatePositions(newTree);

      return { tree: newTree };
    }),

  addItem: (item) =>
    set((state) => ({
      tree: [...state.tree, item],
    })),

  updateItem: (id, updates) =>
    set((state) => {
      const newTree = [...state.tree];
      const item = findItemRecursive(newTree, id);
      if (!item) return state;

      Object.assign(item, updates);
      return { tree: newTree };
    }),

  removeItem: (id) =>
    set((state) => {
      const newTree = [...state.tree];
      removeItemFromParent(newTree, id);
      return { tree: newTree };
    }),
}));

// ヘルパー関数
function findItemRecursive(items: TreeItem[], id: string): TreeItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const found = findItemRecursive(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeItemFromParent(items: TreeItem[], id: string): boolean {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id === id) {
      items.splice(i, 1);
      return true;
    }
    if (item.children && item.children.length > 0) {
      if (removeItemFromParent(item.children, id)) {
        return true;
      }
    }
  }
  return false;
}

function updatePositions(items: TreeItem[], parentId: string | null = null) {
  items.forEach((item, index) => {
    item.position = index;
    item.parentId = parentId;
    if (item.children?.length) {
      updatePositions(item.children, item.id);
    }
  });
}

export const findItemById = (items: TreeItem[], id: string): TreeItem | null => {
  return findItemRecursive(items, id);
};
