import { type FC, useState, type HTMLAttributes, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent
} from "@dnd-kit/core";
import { Tabs, TabsList, TabsTrigger } from "~/shadcn/components/ui/tabs";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import { useMediaQuery } from "~/shadcn/hooks/use-media-query";
import type { BookmarkViewMode, BookmarkViewProps } from "./types";
import BookmarkCard from "./BookmarkCard";
import BookmarkListItem from "./BookmarkListItem";
import { TreeContainer } from "../tree/TreeContainer";
import { useBookmarkOperations } from "../../hooks";

type StatusProps = HTMLAttributes<HTMLDivElement> & {
  "aria-live"?: "polite" | "assertive" | "off";
  "aria-busy"?: boolean;
};

type DragState = {
  type: "bookmark" | "tree";
  sourceId: string | null;
  targetId: string | null;
};

/**
 * ブックマーク表示切り替えコンポーネント
 */
const BookmarkView: FC<BookmarkViewProps> = ({ className, items: bookmarks }) => {
  const { t } = useText();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mode, setMode] = useState<BookmarkViewMode>("list");
  const [dragState, setDragState] = useState<DragState>({
    type: "bookmark",
    sourceId: null,
    targetId: null
  });

  const { addBookmarkToFolder } = useBookmarkOperations();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setDragState(prev => ({
      ...prev,
      sourceId: active.id as string,
      type: active.data.current?.type || "bookmark"
    }));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // ブックマークをフォルダに追加
      addBookmarkToFolder(active.id as string, over.id as string);
    }

    setDragState({
      type: "bookmark",
      sourceId: null,
      targetId: null
    });
  }, [addBookmarkToFolder]);
  
  // データが空の場合
  if (!bookmarks?.length) {
    const emptyProps: StatusProps = {
      role: "status",
      "aria-live": "polite",
      className: "flex items-center justify-center px-4 py-16",
    };

    return (
      <div {...emptyProps}>
        <p className="text-muted-foreground">{t.bookmarks.status.empty}</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("w-full grid grid-cols-[1fr_2fr] grid-rows-[1fr] gap-4 h-full", className)}>
        {/* 左パネル: ブックマーク一覧 */}
        <div 
          className={cn(
            "col-span-1 row-span-1 overflow-auto border rounded-lg p-4",
            dragState.sourceId && "opacity-75"
          )}
        >
          {/* 表示モード切り替えタブ */}
          <div className="mb-4 flex justify-end">
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as BookmarkViewMode)}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {t.bookmarks.viewMode.list}
                </TabsTrigger>
                <TabsTrigger
                  value="card"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  disabled={isMobile}
                >
                  {t.bookmarks.viewMode.card}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* ブックマークリスト */}
          <div
            className={cn(
              "flex flex-col",
              mode === "list" ? "gap-2" : "gap-4"
            )}
            role="list"
            aria-label={t.bookmarks.bookmarkEditPage.listTitle}
          >
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                role="listitem"
              >
                {mode === "card" ? (
                  <BookmarkCard
                    bookmark={bookmark}
                    className="transition-all duration-200 hover:scale-[1.01]"
                  />
                ) : (
                  <BookmarkListItem
                    bookmark={bookmark}
                    className="transition-all duration-200 hover:bg-accent/50"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 右パネル: ツリー表示 */}
        <div className="col-span-1 row-span-1 overflow-auto border rounded-lg p-4">
          <TreeContainer />
        </div>

        {/* ドラッグオーバーレイ */}
        <DragOverlay>
          {dragState.sourceId && bookmarks.find(b => b.id === dragState.sourceId) && (
            <div className="opacity-50">
              <BookmarkListItem
                bookmark={bookmarks.find(b => b.id === dragState.sourceId)!}
                className="bg-background shadow-lg"
              />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

BookmarkView.displayName = "BookmarkView";

export default BookmarkView;