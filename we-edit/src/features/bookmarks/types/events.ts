import type { 
  DragStartEvent as DndDragStartEvent, 
  DragEndEvent as DndDragEndEvent, 
  Active, 
  Over,
  DataRef
} from "@dnd-kit/core";
import type { MutableRefObject } from "react";
import type { TreeItem, BookmarkTreeItem } from "./tree";
import type { BaseBookmarkData } from "./bookmark";

/**
 * ドラッグ&ドロップ関連の型定義
 */

/**
 * パネルの種類
 */
export type PanelType = "list" | "tree";

/**
 * ドロップ位置の種類
 */
export type DropPosition = "before" | "after" | "inside" | null;

/**
 * ドラッグ状態
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
 * ドラッグ可能なアイテムのデータ
 */
export interface DraggableItemData {
  type: "bookmark" | "folder";
  sourcePanel: PanelType;
  bookmarkData?: BaseBookmarkData;
  treeItem?: TreeItem;
}

/**
 * ドラッグデータの参照
 */
export type DraggableDataRef = DataRef<DraggableItemData>;

/**
 * ドロップターゲットのデータ
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
 * Active要素
 */
export interface DraggableActive extends Omit<Active, 'data'> {
  data: MutableRefObject<DraggableItemData | undefined>;
}

/**
 * Over要素
 */
export interface DraggableOver extends Omit<Over, 'data'> {
  data: MutableRefObject<DropTargetData | undefined>;
}

/**
 * ドラッグ開始イベント
 */
export interface DragStartEvent extends Omit<DndDragStartEvent, 'active'> {
  active: DraggableActive;
}

/**
 * ドラッグ終了イベント
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
 * ドロップ結果
 */
export interface DropResult {
  success: boolean;
  error?: string;
  item?: BookmarkTreeItem;
}

/**
 * ドラッグ＆ドロップの検証エラー
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