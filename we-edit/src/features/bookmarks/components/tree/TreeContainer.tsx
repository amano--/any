/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_47-bookmarks-refactoring.md
 * 
 * @ai_implementation
 * ブックマークツリーのコンテナコンポーネント
 * - ドラッグ＆ドロップ対応
 * - アクセシビリティ対応
 * - 型安全性の確保
 */

import { memo } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "~/shadcn/components/ui/button";
import { type TreeItem } from "../../types/tree";
import { useBookmarkTreeStore } from "../../store/bookmark-tree";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import TreeItemComponent from "./TreeItem";

export type TreeProps = {
  className?: string;
  items: TreeItem[];
  selectedId?: string;
  expandedIds?: string[];
  onSelect?: (id: string) => void;
  onExpand?: (id: string) => void;
  onCollapse?: (id: string) => void;
};

/**
 * ブックマークツリーのコンテナコンポーネント
 */
const TreeContainer = memo<TreeProps>(({
  className,
  items = [], // デフォルト値を設定
  selectedId,
  expandedIds = [],
  onSelect,
  onExpand,
  onCollapse,
}) => {
  const { t } = useText();
  const moveItem = useBookmarkTreeStore((state) => state.moveItem);

  // ドラッグ＆ドロップの終了時処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const position: "before" | "after" = oldIndex < newIndex ? "after" : "before";
      
      moveItem(active.id as string, over.id as string, position);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={cn("flex flex-col gap-0.5", className)}
          role="tree"
          aria-label={t.bookmarks.bookmarkEditPage.listTitle}
        >
          {items.map((item) => (
            <TreeItemComponent
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              isExpanded={expandedIds.includes(item.id)}
              onSelect={onSelect}
              onExpand={onExpand}
              onCollapse={onCollapse}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
});

TreeContainer.displayName = "TreeContainer";

export default TreeContainer;