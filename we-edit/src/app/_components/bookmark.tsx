/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @ai_implementation
 * 実装計画: src/app/_components/bookmark-tree/ai-logs/2025-03-02_04_18-bookmark-drag-and-drop-revision.md
 * 
 * 機能: ブックマークカードのドラッグ＆ドロップ並び替え
 * アプローチ: @dnd-kit/sortableを使用した実装
 * パフォーマンス考慮: 
 * - transform.scaleによるスムーズなアニメーション
 * - メモ化によるre-render最適化
 */

import { type FC, useCallback } from "react";
import { Link, GripVertical } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/shadcn/components/ui/card";
import { api } from "~/trpc/react";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import type { DraggableItemData } from "~/types/drag-events";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useBookmarkTreeStore } from "~/store/bookmark-tree";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Bookmark = RouterOutput["bookmark"]["getAll"][number];

interface BookmarkCardProps {
  bookmark: Bookmark;
  className?: string;
}

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
      <GripVertical className="mr-2 cursor-move" />
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

export const BookmarkList: FC = () => {
  const { t } = useText();
  const { data: bookmarks, isLoading } = api.bookmark.getAll.useQuery();
  const moveItem = useBookmarkTreeStore((state) => state.moveItem);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && bookmarks) {
      const oldIndex = bookmarks.findIndex(item => item.id === active.id);
      const newIndex = bookmarks.findIndex(item => item.id === over.id);
      const position: "before" | "after" = oldIndex < newIndex ? "after" : "before";
      
      // Zustand storeの更新
      moveItem(active.id as string, over.id as string, position);
    }
  }, [bookmarks, moveItem]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="w-full flex animate-pulse">
            <div className="p-6">
              <div className="h-16 w-16 bg-muted rounded" />
            </div>
            <CardHeader className="flex-1">
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded mt-2" />
              <div className="h-4 w-24 bg-muted rounded mt-4" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!bookmarks?.length) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-muted-foreground">{t.bookmarks.bookmarkEditPage?.listTitle}</p>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={bookmarks.map(b => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div 
          className="flex flex-col gap-4 px-4 py-16"
          role="list"
          aria-label={t.bookmarks.bookmarkEditPage.listTitle}
        >
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} role="listitem">
              <BookmarkCard bookmark={bookmark} />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
