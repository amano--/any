/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_15_07-bookmark-card-variants.md
 * 
 * @ai_implementation
 * コンパクトな一覧表示用のブックマークコンポーネント
 * - 高さ2remのコンパクトなデザイン
 * - 必要最小限の情報表示
 * - ドラッグ＆ドロップ対応
 * - アクセシビリティ対応
 * - ホバー時の詳細情報表示
 */

import { type FC, memo } from "react";
import { Link, GripVertical } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shadcn/components/ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import type { DraggableItemData } from "~/types/drag-events";
import type { BookmarkListItemProps } from "./types";

const BookmarkListItem: FC<BookmarkListItemProps> = ({ bookmark, className }) => {
  const { t } = useText();
  const tags = bookmark.tags ? JSON.parse(bookmark.tags) as string[] : [];

  const dragData: DraggableItemData = {
    type: "bookmark",
    sourcePanel: "list",
    bookmarkData: {
      title: bookmark.title,
      url: bookmark.url,
      icon: bookmark.icon ?? undefined,
      description: bookmark.description ?? undefined,
      tags: tags,
    },
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: bookmark.id,
    data: dragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  // ホバー時に表示する詳細情報
  const tooltipContent = (
    <div className="max-w-md">
      <h3 className="font-medium">{bookmark.title}</h3>
      {bookmark.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {bookmark.description}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-2">
        {new Date(bookmark.createdAt).toLocaleDateString()}
      </div>
    </div>
  );

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              ref={setNodeRef}
              style={style}
              className={cn(
                "flex h-8 w-full cursor-move items-center gap-2 rounded-md border bg-card px-2 hover:bg-accent",
                isDragging && "opacity-50 border-dashed",
                className
              )}
              {...attributes}
              {...listeners}
              aria-label={t.bookmarks.dragDrop.start.bookmark}
              data-draggable="true"
            >
              <GripVertical className="mr-2 h-4 w-4 cursor-move text-muted-foreground/50" />
      
              {bookmark.icon ? (
                <img
                  src={bookmark.icon}
                  alt=""
                  className="h-4 w-4 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Link className="h-4 w-4 text-muted-foreground/50" />
              )}
              <div className="flex-1 truncate">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-blue-600 hover:underline"
                  onClick={(e) => isDragging && e.preventDefault()}
                  aria-label={isDragging ? t.bookmarks.dragDrop.aria.draggable : undefined}
                >
                  {bookmark.title}
                </a>
              </div>
              {tags.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {tags.length} {t.bookmarks.tags}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={5}>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

BookmarkListItem.displayName = "BookmarkListItem";

export default memo(BookmarkListItem);