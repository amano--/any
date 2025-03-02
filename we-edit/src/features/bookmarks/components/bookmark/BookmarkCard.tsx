/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_15_07-bookmark-card-variants.md
 * 
 * @ai_implementation
 * 詳細表示用のブックマークカードコンポーネント
 * - Cardコンポーネントを使用
 * - ドラッグ＆ドロップ対応
 * - アクセシビリティ対応
 * - メモ化による最適化
 */

import { type FC, memo } from "react";
import { Link, GripVertical } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/shadcn/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import type { DraggableItemData } from "~/types/drag-events";
import type { BookmarkCardProps } from "./types";

const BookmarkCard: FC<BookmarkCardProps> = ({ bookmark, className }) => {
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

  return (
    <div className="flex items-center">
      <Card 
        ref={setNodeRef}
        style={style}
        className={cn(
          "w-full flex cursor-move",
          isDragging && "opacity-50 border-dashed scale-105",
          className
        )}
        {...attributes}
        {...listeners}
        aria-label={t.bookmarks.dragDrop.start.bookmark}
        data-draggable="true"
      >
        <div className="p-6">
        <GripVertical className="mr-2 cursor-move" />
        {bookmark.icon ? (
            <img
              src={bookmark.icon}
              alt={`${bookmark.title} favicon`}
              className="w-16 h-16 object-contain"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-16 h-16 flex items-center justify-center';
                  const icon = document.createElement('div');
                  icon.className = 'text-muted-foreground';
                  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                  svg.setAttribute('width', '24');
                  svg.setAttribute('height', '24');
                  svg.setAttribute('viewBox', '0 0 24 24');
                  svg.setAttribute('fill', 'none');
                  svg.setAttribute('stroke', 'currentColor');
                  svg.setAttribute('stroke-width', '2');
                  svg.setAttribute('stroke-linecap', 'round');
                  svg.setAttribute('stroke-linejoin', 'round');
                  svg.innerHTML = '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>';
                  icon.appendChild(svg);
                  fallback.appendChild(icon);
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <Link className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
        <CardHeader className="flex-1">
          <CardTitle className="text-xl">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline"
              onClick={(e) => isDragging && e.preventDefault()}
              aria-label={isDragging ? t.bookmarks.dragDrop.aria.draggable : undefined}
            >
              {bookmark.title}
            </a>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {bookmark.description ?? bookmark.url}
          </CardDescription>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground self-center ml-auto pr-6">
          {new Date(bookmark.createdAt).toLocaleDateString()}
        </CardFooter>
      </Card>
    </div>
  );
};

BookmarkCard.displayName = "BookmarkCard";

export default memo(BookmarkCard);