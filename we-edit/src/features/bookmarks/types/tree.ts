import type { BaseBookmarkData } from "./bookmark";
import type { ReactNode } from "react";

/**
 * 共通のツリーアイテムプロパティ
 */
interface BaseTreeItem {
  id: string;
  name: string;
  position: number;
  parentId: string | null;
}

/**
 * フォルダアイテムの型定義
 */
export interface FolderTreeItem extends BaseTreeItem {
  type: "folder";
  isExpanded: boolean;
  children: TreeItem[];
}

/**
 * ブックマークアイテムの型定義
 */
export interface BookmarkTreeItem extends BaseTreeItem, BaseBookmarkData {
  type: "bookmark";
}

/**
 * ツリーアイテムの共用型
 */
export type TreeItem = FolderTreeItem | BookmarkTreeItem;

/**
 * ツリー構造の状態
 */
export interface TreeState {
  items: TreeItem[];
  selectedId: string | null;
  expandedIds: Set<string>;
}

/**
 * 基本的な更新用プロパティ
 */
export interface BaseTreeItemUpdates {
  name?: string;
  position?: number;
  parentId?: string | null;
}

/**
 * フォルダの更新用プロパティ
 */
export interface FolderTreeItemUpdates extends BaseTreeItemUpdates {
  type: "folder";
  isExpanded?: boolean;
}

/**
 * ブックマークの更新用プロパティ
 */
export interface BookmarkTreeItemUpdates extends BaseTreeItemUpdates {
  type: "bookmark";
  url?: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

/**
 * ツリーアイテムの更新用プロパティ
 */
export type TreeItemUpdates = FolderTreeItemUpdates | BookmarkTreeItemUpdates | BaseTreeItemUpdates;

/**
 * ツリー操作の結果型
 */
export interface TreeOperationResult {
  success: boolean;
  error?: string;
  items?: TreeItem[];
}

/**
 * ツリー項目の検証結果
 */
export interface TreeValidationResult {
  isValid: boolean;
  error?: string;
  maxDepth?: number;
  currentDepth?: number;
}

/**
 * ツリーコンポーネントのプロパティ
 */
export interface TreeComponentProps {
  id: string;
  name: string;
  type: "folder" | "bookmark";
  depth: 0 | 1 | 2 | 3 | 4 | 5;
  isExpanded?: boolean;
  onToggle?: () => void;
  onNameChange: (name: string) => void;
  children?: ReactNode;
  url?: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

/**
 * 型ガード関数
 */
export const isFolder = (item: TreeItem): item is FolderTreeItem => {
  return item.type === "folder";
};

export const isBookmark = (item: TreeItem): item is BookmarkTreeItem => {
  return item.type === "bookmark";
};

/**
 * ツリーの深さを計算するユーティリティ関数
 */
export const calculateTreeDepth = (item: TreeItem, items: TreeItem[]): number => {
  let depth = 0;
  let currentItem = item;

  while (currentItem.parentId) {
    depth++;
    const parent = items.find(i => i.id === currentItem.parentId);
    if (!parent) break;
    currentItem = parent;
  }

  return depth;
};