import { type FC } from "react";
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

type RouterOutput = inferRouterOutputs<AppRouter>;
type Bookmark = RouterOutput["bookmark"]["getAll"][number];

interface BookmarkCardProps {
  bookmark: Bookmark;
}

const BookmarkCard: FC<BookmarkCardProps> = ({ bookmark }) => {
  // タグを配列に変換
  const tags = bookmark.tags ? JSON.parse(bookmark.tags) as string[] : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 hover:underline"
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
      <CardFooter className="text-sm text-muted-foreground">
        {new Date(bookmark.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export const BookmarkList: FC = () => {
  const { data: bookmarks, isLoading } = api.bookmark.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 px-4 py-16 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="w-full animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded mt-2" />
            </CardHeader>
            <CardFooter>
              <div className="h-4 w-24 bg-muted rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!bookmarks?.length) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-muted-foreground">ブックマークがありません</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 px-4 py-16 sm:grid-cols-2 md:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
};
