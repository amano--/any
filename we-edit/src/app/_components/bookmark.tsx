import { type FC } from "react";
import { Link } from "lucide-react";
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
    <Card className="w-full flex">
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
  );
};

export const BookmarkList: FC = () => {
  const { data: bookmarks, isLoading } = api.bookmark.getAll.useQuery();

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
        <p className="text-muted-foreground">ブックマークがありません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-16">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
};
