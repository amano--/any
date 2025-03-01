import type { 
  DragStartEvent as DndDragStartEvent, 
  DragEndEvent as DndDragEndEvent, 
  Active, 
  Over,
  DataRef
} from "@dnd-kit/core";
import type { MutableRefObject } from "react";
import type { TreeItem, BookmarkTreeItem } from "./bookmark-tree";

/**
 * パネルの種類を表す型
 */
export type PanelType = "list" | "tree";

/**
 * ドロップ位置の種類を表す型
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
 * ドラッグ可能なアイテムのデータ型
 */
export interface DraggableItemData {
  type: "bookmark" | "folder";
  sourcePanel: PanelType;
  bookmarkData?: {
    title: string;
    url: string;
    icon?: string;
    description?: string;
    tags?: string[];
  };
  treeItem?: TreeItem;
}

/**
 * ドラッグデータの参照型
 */
export type DraggableDataRef = DataRef<DraggableItemData>;

/**
 * ドロップターゲットのデータ型
 */
export interface DropTargetData {
  sortable?: {
    index?: number;
  };
  type?: "bookmark" | "folder";
  panel?: PanelType;
  parentId?: string | null;
}

/**
 * Active要素の型
 */
export interface DraggableActive extends Omit<Active, 'data'> {
  data: MutableRefObject<DraggableItemData | undefined>;
}

/**
 * Over要素の型
 */
export interface DraggableOver extends Omit<Over, 'data'> {
  data: MutableRefObject<DropTargetData | undefined>;
}

/**
 * ドラッグ開始イベントの型
 */
export interface DragStartEvent extends Omit<DndDragStartEvent, 'active'> {
  active: DraggableActive;
}

/**
 * ドラッグ終了イベントの型
 */
export interface DragEndEvent extends Omit<DndDragEndEvent, 'active' | 'over'> {
  active: DraggableActive;
  over: DraggableOver | null;
}

/**
 * パネル間のドラッグ開始イベント
 */
export interface PanelDragStartEvent extends DragStartEvent {
  source: PanelType;
}

/**
 * パネル間のドラッグ終了イベント
 */
export interface PanelDragEndEvent extends DragEndEvent {
  source: PanelType;
  destination: PanelType | null;
}

/**
 * ドロップ結果の型
 */
export interface DropResult {
  success: boolean;
  error?: string;
  item?: BookmarkTreeItem;
}

/**
 * ドラッグ＆ドロップの検証エラー型
 */
export type DragValidationError =
  | "MAX_DEPTH_EXCEEDED"
  | "CIRCULAR_REFERENCE"
  | "INVALID_TARGET"
  | "INVALID_OPERATION";

/**
 * ドラッグ＆ドロップのバリデーション結果
 */
export interface DragValidationResult {
  isValid: boolean;
  error?: DragValidationError;
  errorMessage?: string;
}

/**
 * ドラッグ＆ドロップの操作結果
 */
export interface DragOperationResult {
  success: boolean;
  error?: string;
  affectedItems?: TreeItem[];
}
