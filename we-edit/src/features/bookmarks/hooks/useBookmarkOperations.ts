import { useCallback } from 'react';
import { useBookmarkTree } from './useBookmarkTree';
import type { 
  BookmarkTreeItem, 
  FolderTreeItem, 
  TreeItem,
  BaseBookmarkData
} from '../types';
import { ROOT_FOLDER_ID } from '../types';

/**
 * @ai_implementation
 * ブックマーク操作のための高レベルAPIを提供するカスタムフック
 */
export function useBookmarkOperations() {
  const { addItem, updateItem, removeItem, items } = useBookmarkTree();

  /**
   * 新しいブックマークを作成
   */
  const createBookmark = useCallback((
    data: BaseBookmarkData & { parentId?: string | null }
  ) => {
    const bookmark: BookmarkTreeItem = {
      id: crypto.randomUUID(),
      type: "bookmark",
      position: items.length,
      parentId: data.parentId ?? null,
      ...data
    };
    addItem(bookmark);
    return bookmark;
  }, [addItem, items.length]);

  /**
   * 新しいフォルダを作成
   */
  const createFolder = useCallback((
    name: string,
    parentId: string | null = null
  ) => {
    const folder: FolderTreeItem = {
      id: crypto.randomUUID(),
      type: "folder",
      name,
      position: items.length,
      parentId,
      isExpanded: true,
      children: []
    };
    addItem(folder);
    return folder;
  }, [addItem, items.length]);

  /**
   * アイテムを更新
   */
  const updateBookmark = useCallback((
    id: string,
    data: Partial<BaseBookmarkData>
  ) => {
    updateItem(id, {
      type: "bookmark",
      ...data
    });
  }, [updateItem]);

  /**
   * フォルダを更新
   */
  const updateFolder = useCallback((
    id: string,
    data: { name?: string; isExpanded?: boolean }
  ) => {
    updateItem(id, {
      type: "folder",
      ...data
    });
  }, [updateItem]);

  /**
   * アイテムを削除（再帰的に削除）
   */
  const deleteItem = useCallback((id: string) => {
    removeItem(id);
  }, [removeItem]);

  /**
   * フォルダ内のアイテムを取得
   */
  const getFolderContents = useCallback((folderId: string | null = null): TreeItem[] => {
    if (folderId === null) {
      return items.filter(item => item.parentId === null);
    }
    const folder = items.find(item => item.id === folderId);
    return folder && folder.type === "folder" ? folder.children : [];
  }, [items]);

  /**
   * ルートフォルダが存在しない場合、作成
   */
  const ensureRootFolder = useCallback((name: string = "マイブックマーク") => {
    const hasRoot = items.some(item => 
      item.type === "folder" && item.parentId === null
    );

    if (!hasRoot) {
      createFolder(name, null);
    }
  }, [items, createFolder]);

  return {
    createBookmark,
    createFolder,
    updateBookmark,
    updateFolder,
    deleteItem,
    getFolderContents,
    ensureRootFolder
  };
}