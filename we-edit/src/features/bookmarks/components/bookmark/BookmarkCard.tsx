import { type FC, memo } from "react";
import { Link, GripVertical } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/shadcn/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import type { BookmarkTreeItem } from "../../types/tree";
import type { BookmarkCardProps } from "./types";

const BookmarkCard: FC<BookmarkCardProps> = ({ bookmark, className }) => {
  const { t } = useText();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: bookmark.id,
    data: {
      type: "bookmark",
      item: bookmark
    }
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 50 : undefined,
  } : undefined;

  const renderFallbackIcon = (parent: HTMLElement) => {
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
              alt={`${bookmark.name} favicon`}
              className="w-16 h-16 object-contain"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  renderFallbackIcon(parent);
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
              {bookmark.name}
            </a>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {bookmark.description ?? bookmark.url}
          </CardDescription>
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bookmark.tags.map((tag: string) => (
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
      </Card>
    </div>
  );
};

BookmarkCard.displayName = "BookmarkCard";

export default memo(BookmarkCard);