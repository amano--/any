/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { toast } from "sonner";
import { BookmarkList } from "~/app/_components/bookmark";
import { TreeContainer } from "~/app/_components/bookmark-tree/tree-container";
import { Button } from "~/shadcn/components/ui/button";
import { api } from "~/trpc/react";
import { useText } from "~/i18n/text";

/**
 * ブックマーク編集ページ
 * レイアウトは以下の通り
 * 左側: 一覧パネル
 * 右側: ツリーパネル
 * 下部: コメントパネル
 */
export default function BookmarkEditPage() {
  const { t } = useText();

  const showSuccess = () => {
    toast.success("サンプルデータが登録されました");
  };

  const showError = () => {
    toast.error(t.errors.general);
  };
  const utils = api.useContext();
  const { mutate: createSample, isPending } =
    api.bookmark.createSampleData.useMutation({
      onSuccess: () => {
        void utils.bookmark.getAll.invalidate();
        showSuccess();
      },
      onError: () => {
        showError();
      },
    });

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-3">
      {/* 左パネル: ブックマーク一覧パネル */}
      <div className="border-r">
        <div className="sticky top-0 space-y-4 border-b bg-background p-4">
          <h1 className="text-2xl font-bold">ブックマーク一覧</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => createSample()}
              disabled={isPending}
            >
              {isPending ? "登録中..." : "サンプルデータを登録"}
            </Button>
          </div>
        </div>
        <BookmarkList />
      </div>

      {/* 中央パネル: ツリーパネル */}
      <div className="border-r">
        <div className="sticky top-0 border-b bg-background p-4">
          <h2 className="mb-4 text-xl font-bold">ブックマークツリー</h2>
          <TreeContainer />
        </div>
      </div>

      {/* 右パネル: コメントパネル */}
      <div>
        <div className="sticky top-0 border-b bg-background p-4">
          <h2 className="text-xl font-bold">コメント</h2>
          <p className="mt-4 text-muted-foreground">
            コメント編集機能（準備中）
          </p>
        </div>
      </div>
    </div>
  );
}
