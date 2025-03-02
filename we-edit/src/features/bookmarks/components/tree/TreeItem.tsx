/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_47-bookmarks-refactoring.md
 * 
 * @ai_implementation
 * ツリーアイテムコンポーネント
 * - フォルダとブックマークの表示
 * - ドラッグ＆ドロップ対応
 * - アクセシビリティ対応
 */

import { memo } from "react";
import { Folder, FolderOpen, ChevronRight, ChevronDown, Link } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "~/shadcn/components/ui/button";
import { cn } from "~/shadcn/lib/utils";
import { useText } from "~/i18n/text";
import type { TreeItem as TreeItemType } from "../../types/tree";
import type { DraggableItemData } from "~/types/drag-events";

export type TreeItemProps = {
  item: TreeItemType;
  isSelected?: boolean;
  isExpanded?: boolean;
  onSelect?: (id: string) => void;
  onExpand?: (id: string) => void;
  onCollapse?: (id: string) => void;
};

const TreeItem = memo<TreeItemProps>(({
  item,
  isSelected,
  isExpanded,
  onSelect,
  onExpand,
  onCollapse,
}) => {
  const { t } = useText();

  // DnDの設定
  const dragData: DraggableItemData = {
    type: item.type,
    sourcePanel: "tree",
    bookmarkData: item.type === "bookmark" ? {
      title: item.name,
      url: item.url,
      icon: item.icon,
      description: item.description,
      tags: item.tags,
    } : undefined,
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: dragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // イベントハンドラ
  const handleSelect = () => {
    onSelect?.(item.id);
  };

  const handleToggle = () => {
    if (isExpanded) {
      onCollapse?.(item.id);
    } else {
      onExpand?.(item.id);
    }
  };

  // アイコンの決定
  const Icon = item.type === "folder"
    ? (isExpanded ? FolderOpen : Folder)
    : Link;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-1 py-1 pl-2 pr-4 rounded-md",
        isSelected && "bg-accent",
        isDragging && "opacity-50"
      )}
      {...attributes}
      {...listeners}
      role={item.type === "folder" ? "treeitem" : "none"}
      aria-expanded={item.type === "folder" ? isExpanded : undefined}
    >
      {item.type === "folder" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4"
          onClick={handleToggle}
          aria-label={isExpanded ? t.bookmarks.dragDrop.start.folder : undefined}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      )}
      <Icon className="h-4 w-4 text-muted-foreground" />
      <button
        className={cn(
          "flex-1 text-left text-sm px-2 py-1 rounded-sm",
          "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring"
        )}
        onClick={handleSelect}
      >
        {item.name}
      </button>
    </div>
  );
});

TreeItem.displayName = "TreeItem";

export default TreeItem;