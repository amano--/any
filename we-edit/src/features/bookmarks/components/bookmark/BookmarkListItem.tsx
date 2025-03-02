import { type FC, memo } from "react";
import { Link, GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import type { BookmarkListItemProps } from "./types";

const BookmarkListItem: FC<BookmarkListItemProps> = ({ bookmark, className }) => {
  const { t } = useText();
  const tags = bookmark.tags ?? [];

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

  return (
    <div className="flex items-center">
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
            {bookmark.name}
          </a>
        </div>
        {tags.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {tags.length} {t.bookmarks.tags}
          </span>
        )}
      </div>
    </div>
  );
};

BookmarkListItem.displayName = "BookmarkListItem";

export default memo(BookmarkListItem);