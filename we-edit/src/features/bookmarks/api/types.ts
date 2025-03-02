/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_47-bookmarks-refactoring.md
 * 
 * @ai_implementation
 * APIレスポンスの型定義
 * - APIレスポンスの型安全性を確保
 * - クライアントとサーバー間の型の一貫性を維持
 */

import type { TreeItem, FolderTreeItem, BookmarkTreeItem } from '../types';

/**
 * APIレスポンスの基本型
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

/**
 * ブックマーク操作のレスポンス型
 */
export type BookmarkResponse = ApiResponse<{
  item: TreeItem;
}>;

/**
 * フォルダ操作のレスポンス型
 */
export type FolderResponse = ApiResponse<{
  item: FolderTreeItem;
}>;

/**
 * ツリー取得のレスポンス型
 */
export type TreeResponse = ApiResponse<{
  items: TreeItem[];
}>;

/**
 * 移動操作のレスポンス型
 */
export type MoveResponse = ApiResponse<{
  source: TreeItem;
  target: TreeItem;
  position: 'before' | 'after' | 'inside';
}>;

/**
 * バリデーションエラーの型
 */
export type ValidationError = {
  field: string;
  message: string;
};

/**
 * バリデーションエラーのレスポンス型
 */
export type ValidationErrorResponse = ApiResponse<{
  errors: ValidationError[];
}>;