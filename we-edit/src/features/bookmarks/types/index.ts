/**
 * @fileoverview
 * ブックマーク機能の型定義をエクスポートする中央モジュール。
 * 他のモジュールはこのファイルを通じて型定義にアクセスします。
 */

export * from './bookmark';
export * from './tree';
export * from './events';

// 定数
export const MAX_TREE_DEPTH = 5;
export const ROOT_FOLDER_ID = 'root';

// 列挙型
export enum BookmarkActionTypes {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MOVE = 'MOVE',
  REORDER = 'REORDER'
}

// ドラッグ&ドロップ定数
export const DND_CONSTANTS = {
  DRAG_DELAY: 150,  // ドラッグ開始までの遅延（ms）
  HOVER_TIMEOUT: 500, // フォルダを開くまでのホバー時間（ms）
  DROP_INDICATOR_OFFSET: 2, // ドロップインジケーターのオフセット（px）
} as const;