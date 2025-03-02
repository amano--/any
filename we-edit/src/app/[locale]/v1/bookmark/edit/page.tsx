/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_47-bookmarks-refactoring.md
 * 
 * @ai_implementation
 * ブックマーク編集ページ
 * - カード表示とリスト表示の切り替え
 * - 一覧表示とツリー表示の両方をサポート
 */

"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "~/shadcn/components/ui/tabs";
import { useText } from "~/i18n/text";
import { TreeContainer } from "~/features/bookmarks/components/tree";
import BookmarkView from "~/features/bookmarks/components/bookmark/BookmarkView";
import { useBookmarkData } from "~/features/bookmarks/hooks/useBookmarkData";

type ViewMode = "tree" | "list";

export default function BookmarkEditPage() {
  const { t } = useText();
  const { items, isLoading, error } = useBookmarkData();

  // エラー表示
  if (error) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-destructive">{t.bookmarks.status.error}</p>
      </div>
    );
  }

  // ローディング表示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-muted-foreground">{t.bookmarks.status.loading}</p>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {t.bookmarks.bookmarkEditPage.title}
        </h1>
      </div>

     
        <BookmarkView items={items}/>
    </div>
  );
}
