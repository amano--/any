/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_47-bookmarks-refactoring.md
 * 
 * @ai_implementation
 * データ変換ユーティリティ
 * - DBのデータ型からドメインモデルへの変換
 * - 型安全性の確保
 */

import type { BookmarkTreeItem, FolderTreeItem, TreeItem } from '../types/tree';

/**
 * DBのブックマークデータ型
 */
type DbBookmark = {
  id: number;
  createdById: string;
  createdAt: Date;
  description: string | null;
  url: string;
  title: string;
  icon: string | null;
  tags: string | null;
  parentId: string | null;
  index: number | null;
  dateAdded: Date | null;
};

/**
 * タグの型定義
 */
type BookmarkTags = string[];

/**
 * DBのブックマークデータを階層構造のTreeItem型に変換
 */
export function transformDbDataToTreeItems(dbItems: DbBookmark[]): TreeItem[] {
  const items: TreeItem[] = [];
  const itemsMap = new Map<string, FolderTreeItem>();

  // 最初にルートフォルダとフォルダを作成
  dbItems.forEach(item => {
    if (!item.parentId) {
      const folder: FolderTreeItem = {
        id: String(item.id),
        type: 'folder',
        name: item.title,
        position: item.index ?? 0,
        parentId: null,
        isExpanded: true,
        children: [],
      };
      items.push(folder);
      itemsMap.set(String(item.id), folder);
    }
  });

  // 次にブックマークを作成して適切な場所に配置
  dbItems.forEach(item => {
    if (item.parentId) {
      const bookmark: BookmarkTreeItem = {
        id: String(item.id),
        type: 'bookmark',
        name: item.title,
        position: item.index ?? 0,
        parentId: item.parentId,
        url: item.url,
        icon: item.icon ?? undefined,
        description: item.description ?? undefined,
        tags: parseTags(item.tags),
      };

      const parentFolder = itemsMap.get(item.parentId);
      if (parentFolder) {
        parentFolder.children.push(bookmark);
      } else {
        // 親フォルダが見つからない場合はルートに追加
        items.push(bookmark);
      }
    }
  });

  return sortTreeItems(items);
}

/**
 * タグの文字列をパースして配列に変換
 */
function parseTags(tagsJson: string | null): BookmarkTags {
  if (!tagsJson) return [];
  try {
    const parsed = JSON.parse(tagsJson) as unknown;
    if (Array.isArray(parsed) && parsed.every(tag => typeof tag === 'string')) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * TreeItemの配列をposition順にソート
 */
function sortTreeItems(items: TreeItem[]): TreeItem[] {
  return items
    .sort((a, b) => a.position - b.position)
    .map(item => {
      if ('children' in item) {
        return {
          ...item,
          children: sortTreeItems(item.children),
        };
      }
      return item;
    });
}