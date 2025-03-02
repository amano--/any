/**
 * [実装計画書](../logs/ai/2025-03-02_16_04-bookmark-3panel-layout.md)
 *
 * @ai_component_structure
 * レイアウト構成:
 * - BookmarkView: ブックマーク編集ページのメインコンテナ（w-full）
 *   - 左パネル (1): ブックマーク一覧表示
 *     - TabsList: カード/リスト表示切り替え
 *     - BookmarkCard/BookmarkListItem: ブックマーク表示
 *   - 右パネル (2): ツリー表示
 *     - TreeContainer: ブックマークツリー
 *
 * 状態管理:
 * - mode: 表示モード（card/list）
 * - items: ブックマークデータ
 * - isLoading: データ読み込み状態
 * - error: エラー状態
 *
 * @ai_implementation
 * ブックマーク表示切り替えコンポーネント
 * - カード表示とリスト表示の切り替え
 * - レスポンシブ対応
 * - アクセシビリティ対応
 */

import { type FC, useState, type HTMLAttributes } from "react";
import { Tabs, TabsList, TabsTrigger } from "~/shadcn/components/ui/tabs";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import { useMediaQuery } from "~/shadcn/hooks/use-media-query";
import type { BookmarkViewMode, BookmarkViewProps } from "./types";
import BookmarkCard from "./BookmarkCard";
import BookmarkListItem from "./BookmarkListItem";
import {TreeContainer} from "../tree/TreeContainer";

type StatusProps = HTMLAttributes<HTMLDivElement> & {
  "aria-live"?: "polite" | "assertive" | "off";
  "aria-busy"?: boolean;
};

/**
 * ブックマーク表示切り替えコンポーネント
 */
const BookmarkView: FC<BookmarkViewProps> = ({ className,items:bookmarks }) => {
  const { t } = useText();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mode, setMode] = useState<BookmarkViewMode>("list");
  
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
    <div className={cn("w-full grid grid-cols-[1fr_2fr] grid-rows-[1fr] gap-4 h-full", className)}>
      {/* 左パネル: ブックマーク一覧 */}
      <div className="col-span-1 row-span-1 overflow-auto border rounded-lg p-4">
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

    </div>
  );
};

BookmarkView.displayName = "BookmarkView";

export default BookmarkView;

/**
 * 実装履歴:
 * - 2025-03-02: [実装計画書](../logs/ai/2025-03-02_16_04-bookmark-3panel-layout.md) - 3パネルレイアウトの実装
 * - 2025-03-02: [実装計画書](../logs/ai/2025-03-02_15_07-bookmark-card-variants.md) - カード表示とリスト表示の実装
 */