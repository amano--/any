import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { bookmarks } from "~/server/db/schema";

export const sampleBookmarks = [
  {
    url: "https://github.com",
    title: "GitHub: Where the world builds software",
    description: "GitHubは世界最大のソフトウェア開発プラットフォームです。オープンソースプロジェクトのホスティングとコラボレーションの中心地です。",
    tags: JSON.stringify(["開発", "バージョン管理", "Git"]),
  },
  {
    url: "https://nextjs.org",
    title: "Next.js by Vercel - The React Framework",
    description: "Next.jsは、最新のフルスタックWebアプリケーションを構築するためのReactフレームワークです。サーバーサイドレンダリング、静的サイト生成、APIルートなどを提供します。",
    tags: JSON.stringify(["React", "フレームワーク", "SSR"]),
  },
  {
    url: "https://www.typescriptlang.org",
    title: "TypeScript: JavaScript with syntax for types",
    description: "TypeScriptは、JavaScriptに静的型付けを追加した言語です。大規模なアプリケーション開発において、コードの品質と保守性を向上させます。",
    tags: JSON.stringify(["TypeScript", "JavaScript", "型システム"]),
  },
  {
    url: "https://trpc.io",
    title: "tRPC - Move Fast and Break Nothing",
    description: "tRPCは、TypeScriptを使用してエンドツーエンドのタイプセーフなAPIを構築するためのライブラリです。フロントエンドとバックエンド間の型安全性を保証します。",
    tags: JSON.stringify(["API", "TypeScript", "フルスタック"]),
  },
  {
    url: "https://tailwindcss.com",
    title: "Tailwind CSS - Rapidly build modern websites",
    description: "Tailwind CSSは、ユーティリティファーストのCSSフレームワークです。カスタマイズ可能なデザインシステムを構築するための柔軟なツールを提供します。",
    tags: JSON.stringify(["CSS", "フロントエンド", "デザイン"]),
  },
  {
    url: "https://ui.shadcn.com",
    title: "shadcn/ui - Re-usable components built using Radix UI and Tailwind CSS",
    description: "shadcn/uiは、Radix UIとTailwind CSSを使用して構築された再利用可能なコンポーネントのコレクションです。美しくアクセシブルなUIを簡単に作成できます。",
    tags: JSON.stringify(["UI", "コンポーネント", "アクセシビリティ"]),
  },
  {
    url: "https://www.prisma.io",
    title: "Prisma - Next-generation Node.js and TypeScript ORM",
    description: "PrismaはNode.jsとTypeScriptのための次世代ORMです。型安全なデータベースアクセスとスキーマ管理を提供します。",
    tags: JSON.stringify(["データベース", "ORM", "TypeScript"]),
  },
  {
    url: "https://drizzle.team",
    title: "Drizzle ORM - TypeScript ORM that's fun to use",
    description: "Drizzle ORMは、TypeScript用の軽量で高性能なORMです。型安全性とパフォーマンスに重点を置いています。",
    tags: JSON.stringify(["データベース", "ORM", "TypeScript"]),
  },
  {
    url: "https://react.dev",
    title: "React: The library for web and native user interfaces",
    description: "Reactは、WebとネイティブUIを構築するためのJavaScriptライブラリです。宣言的なUIと再利用可能なコンポーネントの作成を可能にします。",
    tags: JSON.stringify(["React", "フロントエンド", "UI"]),
  },
  {
    url: "https://zod.dev",
    title: "Zod - TypeScript-first schema validation",
    description: "Zodは、TypeScriptファーストのスキーマ宣言と検証ライブラリです。型安全性とランタイムバリデーションを組み合わせます。",
    tags: JSON.stringify(["TypeScript", "バリデーション", "スキーマ"]),
  },
];

export const bookmarkRouter = createTRPCRouter({
  createSampleData: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // サンプルデータを挿入
    await ctx.db.insert(bookmarks).values(
      sampleBookmarks.map((bookmark) => ({
        ...bookmark,
        createdById: userId,
      }))
    );

    return { message: "Sample bookmarks created successfully" };
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const allBookmarks = await ctx.db.query.bookmarks.findMany({
      where: (bookmarks, { eq }) => eq(bookmarks.createdById, ctx.session.user.id),
      orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)],
    });

    return allBookmarks;
  }),
});
