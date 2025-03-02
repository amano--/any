/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_15_07-bookmark-card-variants.md
 * 
 * @ai_implementation
 * ブックマークコンポーネントの型定義
 */

import type { TreeItem } from "../../types/tree";

/**
 * 表示モード
 */
export type BookmarkViewMode = "card" | "list";

/**
 * 表示切り替えコンポーネントのProps
 */
export type BookmarkViewProps = {
  className?: string;
};

/**
 * カード表示のProps
 */
export type BookmarkCardProps = {
  bookmark: TreeItem;
  className?: string;
};

/**
 * リスト表示のProps
 */
export type BookmarkListItemProps = {
  bookmark: TreeItem;
  className?: string;
};