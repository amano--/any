/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_47-bookmarks-refactoring.md
 * 
 * @ai_implementation
 * ブックマークデータ管理フック
 * - APIクエリとミューテーションの管理
 * - データの変換
 * - エラーハンドリング
 */

import { api } from '~/trpc/react';
import type { TreeItem } from '../types';
import { transformDbDataToTreeItems } from '../utils/transform';
import { useCallback } from 'react';

export const useBookmarkData = () => {
  const utils = api.useUtils();

  // ブックマークデータの取得
  const {
    data: rawData,
    isLoading,
    error,
  } = api.bookmark.getAll.useQuery();

  // データの変換
  const items = rawData ? transformDbDataToTreeItems(rawData) : [];

  // サンプルデータの作成
  const { mutateAsync: createSampleData } = api.bookmark.createSampleData.useMutation({
    // 成功時にデータを再取得
    onSuccess: () => {
      void utils.bookmark.getAll.invalidate();
    },
  });

  // キャッシュの無効化
  const invalidateCache = useCallback(() => {
    void utils.bookmark.getAll.invalidate();
  }, [utils]);

  return {
    items,
    isLoading,
    error,
    createSampleData,
    invalidateCache,
  };
};