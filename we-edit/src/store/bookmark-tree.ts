import { create } from 'zustand';
import type {
  TreeItem,
  TreeItemUpdates,
  FolderTreeItem,
  BookmarkTreeItem,
  FolderTreeItemUpdates,
  BookmarkTreeItemUpdates,
} from '~/types/bookmark-tree';

interface BookmarkTreeState {
  tree: TreeItem[];
  moveItem: (sourceId: string, destinationId: string | null, index: number) => void;
  addItem: (item: TreeItem) => void;
  updateItem: (id: string, updates: TreeItemUpdates) => void;
  removeItem: (id: string) => void;
  setTree: (items: TreeItem[]) => void;
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

export const useBookmarkTreeStore = create<BookmarkTreeState>((set) => ({
  tree: [],

  setTree: (items) => set({ tree: items }),

  moveItem: (sourceId, destinationId, index) =>
    set((state) => {
      const newTree = [...state.tree];
      const sourceItem = findItemRecursive(newTree, sourceId);
      if (!ensureValidItem(sourceItem)) return state;

      removeItemFromParent(newTree, sourceId);

      if (destinationId === null) {
        // ルートレベルに移動
        newTree.splice(index, 0, sourceItem);
      } else {
        // 他のアイテムの子として移動
        const destinationItem = findItemRecursive(newTree, destinationId);
        if (!ensureValidItem(destinationItem) || !isFolderItem(destinationItem)) return state;

        destinationItem.children.splice(index, 0, sourceItem);
      }

      sourceItem.parentId = destinationId;

      // positionの更新
      updatePositions(newTree);

      return { tree: newTree };
    }),

  addItem: (item) =>
    set((state) => {
      if (item.parentId === null) {
        return {
          tree: [...state.tree, item],
        };
      }

      const newTree = [...state.tree];
      const parentItem = findItemRecursive(newTree, item.parentId);
      
      if (ensureValidItem(parentItem) && isFolderItem(parentItem)) {
        parentItem.children = [...parentItem.children, item];
        return { tree: newTree };
      }

      return state;
    }),

  updateItem: (id, updates) =>
    set((state) => {
      const newTree = [...state.tree];
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

export const findItemById = (items: TreeItem[], id: string): TreeItem | null => {
  return findItemRecursive(items, id);
};
