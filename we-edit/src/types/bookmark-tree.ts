import type { DraggableItemData, PanelType } from "./drag-events";

/**
 * Chromeブックマークのインポート/エクスポート用の型定義
 */
export interface ChromeBookmark {
  id: string;
  parentId?: string;
  index?: number;
  title: string;
  dateAdded?: number;
  children?: ChromeBookmark[];
}

/**
 * 共通のツリーアイテムプロパティ（type以外）
 */
interface BaseTreeItemProps {
  id: string;
  name: string;
  position: number;
  parentId: string | null;
}

/**
 * フォルダ専用のプロパティ
 */
interface FolderProperties {
  isExpanded: boolean;
  children: TreeItem[];
}

/**
 * ブックマーク専用のプロパティ
 */
interface BookmarkProperties {
  url: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

/**
 * フォルダアイテムの型定義
 */
export interface FolderTreeItem extends BaseTreeItemProps {
  type: "folder";
  isExpanded: boolean;
  children: TreeItem[];
}

/**
 * ブックマークアイテムの型定義
 */
export interface BookmarkTreeItem extends BaseTreeItemProps {
  type: "bookmark";
  url: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

/**
 * ツリーアイテムの共用型
 */
export type TreeItem = FolderTreeItem | BookmarkTreeItem;

/**
 * ドロップ位置の種類
 */
export type DropPosition = "before" | "after" | "inside" | null;

/**
 * ドラッグ状態を表す型
 */
export interface DragState {
  isDragging: boolean;
  sourceId: string | null;
  targetId: string | null;
  position: DropPosition;
  sourceType: "bookmark" | "folder" | null;
  parentId: string | null;
}

/**
 * 共通の更新用プロパティ
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
 * ツリーアイテムのコンポーネントプロパティ
 */
export interface TreeComponentProps extends BaseTreeItemProps {
  type: "folder" | "bookmark";
  isExpanded?: boolean;
  depth: 0 | 1 | 2 | 3 | 4 | 5;
  onToggle?: () => void;
  onNameChange: (name: string) => void;
  children?: React.ReactNode;
  url?: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

/**
 * ドラッグ中のアイテムの状態
 */
export interface DraggingState {
  item: TreeItem;
  sourcePanel: PanelType;
  originalParent: string | null;
  originalIndex: number;
}

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
 * ドロップ位置の情報
 */
export interface DropLocation {
  parentId: string | null;
  index: number;
  type: "inside" | "before" | "after";
}

/**
 * ドラッグ可能なアイテムのデータ
 */
export interface DraggableTreeData extends DraggableItemData {
  isExpanded?: boolean;
  children?: TreeItem[];
}

/**
 * ツリーの状態管理用インターフェース
 */
export interface TreeState {
  items: TreeItem[];
  draggingItem: DraggingState | null;
  selectedId: string | null;
  dragState: DragState;
}

/**
 * ドロップ位置の計算パラメータ
 */
export interface DropPositionParams {
  targetRect: DOMRect;
  mouseY: number;
  isFolder: boolean;
  threshold?: number;
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
 * ドロップ位置を計算するユーティリティ関数
 */
export const calculateDropPosition = ({
  targetRect,
  mouseY,
  isFolder,
  threshold = 0.25
}: DropPositionParams): DropPosition => {
  const { top, height } = targetRect;
  const relativeY = mouseY - top;
  const percentage = relativeY / height;

  if (percentage < threshold) {
    return "before";
  } else if (percentage > 1 - threshold) {
    return "after";
  } else if (isFolder) {
    return "inside";
  }
  
  return "after";
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
