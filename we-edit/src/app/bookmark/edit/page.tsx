"use client";

import { toast } from "sonner";
import { BookmarkList } from "~/app/_components/bookmark";
import { Button } from "~/shadcn/components/ui/button";
import { api } from "~/trpc/react";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const showSuccess = () => {
  toast.success("サンプルデータを登録しました", {
    description: "技術系ブックマーク10件を追加しました",
    duration: 3000,
  });
};

const showError = () => {
  toast.error("エラーが発生しました", {
    description: "サンプルデータの登録に失敗しました。もう一度お試しください。",
    duration: 5000,
  });
};
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
/* eslint-enable @typescript-eslint/no-unsafe-call */

export default function BookmarkEditPage() {
  const utils = api.useContext();
  const { mutate: createSample, isPending } = api.bookmark.createSampleData.useMutation({
    onSuccess: () => {
      void utils.bookmark.getAll.invalidate();
      showSuccess();
    },
    onError: () => {
      showError();
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
      {/* 左側: ブックマーク一覧 */}
      <div className="border-r">
        <div className="sticky top-0 bg-background p-4 border-b space-y-4">
          <h1 className="text-2xl font-bold">ブックマーク</h1>
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

      {/* 中央: 詳細表示（今後実装） */}
      <div className="border-r">
        <div className="p-4">
          <p className="text-muted-foreground">詳細表示（準備中）</p>
        </div>
      </div>

      {/* 右側: 編集フォーム（今後実装） */}
      <div>
        <div className="p-4">
          <p className="text-muted-foreground">編集フォーム（準備中）</p>
        </div>
      </div>
    </div>
  );
}
