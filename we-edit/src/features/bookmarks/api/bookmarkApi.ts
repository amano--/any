/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_47-bookmarks-refactoring.md
 * 
 * @ai_implementation
 * ブックマークAPIクライアントの実装
 * - tRPCを使用した型安全なAPI通信
 * - エラーハンドリングの統一
 * - キャッシュ戦略の実装
 */

import { useCallback } from 'react';
import { api } from '~/trpc/react';
import type {
  BookmarkResponse,
  FolderResponse,
  TreeResponse,
  MoveResponse,
  ValidationErrorResponse,
} from './types';
import type { TreeItem, FolderTreeItem } from '../types';
import { transformDbDataToTreeItems } from '../utils/transform';

/**
 * ブックマークAPIクライアントフック
 * エラーハンドリングとキャッシュ管理を含む
 */
export const useBookmarkApi = () => {
  const utils = api.useUtils();
  const bookmarkApi = api.bookmark;

  /**
   * ツリーの取得
   */
  const getTree = useCallback(async (): Promise<TreeResponse> => {
    try {
      // データの取得と型変換
      const result = await bookmarkApi.getAll.useQuery().data;
      if (!result) {
        throw new Error('Failed to fetch bookmarks');
      }
      const treeItems = transformDbDataToTreeItems(result);
      return {
        success: true,
        data: { items: treeItems },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }, [bookmarkApi]);

  /**
   * サンプルデータの作成
   */
  const createSampleData = useCallback(async (): Promise<BookmarkResponse> => {
    try {
      const mutation = bookmarkApi.createSampleData.useMutation();
      const result = await mutation.mutateAsync();
      if (!result) {
        throw new Error('Failed to create sample data');
      }
      return {
        success: true,
        data: { item: result as TreeItem },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }, [bookmarkApi]);

  // TODO: 以下のメソッドは、対応するtRPCルーターの実装後に有効化します

  /**
   * ブックマークの作成
   */
  const createBookmark = useCallback(async (data: {
    name: string;
    url: string;
    parentId?: string;
  }): Promise<BookmarkResponse> => {
    // TODO: tRPCルーター実装後に有効化
    throw new Error('Not implemented');
  }, []);

  /**
   * フォルダの作成
   */
  const createFolder = useCallback(async (data: {
    name: string;
    parentId?: string;
  }): Promise<FolderResponse> => {
    // TODO: tRPCルーター実装後に有効化
    throw new Error('Not implemented');
  }, []);

  /**
   * アイテムの更新
   */
  const updateItem = useCallback(async (id: string, data: Partial<TreeItem>): Promise<BookmarkResponse> => {
    // TODO: tRPCルーター実装後に有効化
    throw new Error('Not implemented');
  }, []);

  /**
   * アイテムの削除
   */
  const deleteItem = useCallback(async (id: string): Promise<BookmarkResponse> => {
    // TODO: tRPCルーター実装後に有効化
    throw new Error('Not implemented');
  }, []);

  /**
   * アイテムの移動
   */
  const moveItem = useCallback(async (data: {
    sourceId: string;
    targetId: string;
    position: 'before' | 'after' | 'inside';
  }): Promise<MoveResponse> => {
    // TODO: tRPCルーター実装後に有効化
    throw new Error('Not implemented');
  }, []);

  /**
   * キャッシュの無効化
   */
  const invalidateCache = useCallback(() => {
    void utils.bookmark.getAll.invalidate();
  }, [utils]);

  return {
    getTree,
    createSampleData,
    createBookmark,
    createFolder,
    updateItem,
    deleteItem,
    moveItem,
    invalidateCache,
  };
};