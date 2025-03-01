import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { bookmarks } from "~/server/db/schema";

export const sampleBookmarks = [
  {
    url: "https://github.com",
    title: "GitHub: Where the world builds software",
    description:
      "GitHubは世界最大のソフトウェア開発プラットフォームです。オープンソースプロジェクトのホスティングとコラボレーションの中心地です。",
    tags: JSON.stringify(["開発", "バージョン管理", "Git"]),
    icon: "https://github.com/favicon.ico",
  },
  {
    url: "https://nextjs.org",
    title: "Next.js by Vercel - The React Framework",
    description:
      "Next.jsは、最新のフルスタックWebアプリケーションを構築するためのReactフレームワークです。サーバーサイドレンダリング、静的サイト生成、APIルートなどを提供します。",
    tags: JSON.stringify(["React", "フレームワーク", "SSR"]),
    icon: "https://nextjs.org/favicon.ico",
  },
  {
    url: "https://www.typescriptlang.org",
    title: "TypeScript: JavaScript with syntax for types",
    description:
      "TypeScriptは、JavaScriptに静的型付けを追加した言語です。大規模なアプリケーション開発において、コードの品質と保守性を向上させます。",
    tags: JSON.stringify(["TypeScript", "JavaScript", "型システム"]),
    icon: "https://www.typescriptlang.org/favicon-32x32.png",
  },
  {
    url: "https://trpc.io",
    title: "tRPC - Move Fast and Break Nothing",
    description:
      "tRPCは、TypeScriptを使用してエンドツーエンドのタイプセーフなAPIを構築するためのライブラリです。フロントエンドとバックエンド間の型安全性を保証します。",
    tags: JSON.stringify(["API", "TypeScript", "フルスタック"]),
    icon: "https://trpc.io/favicon.ico",
  },
  {
    url: "https://tailwindcss.com",
    title: "Tailwind CSS - Rapidly build modern websites",
    description:
      "Tailwind CSSは、ユーティリティファーストのCSSフレームワークです。カスタマイズ可能なデザインシステムを構築するための柔軟なツールを提供します。",
    tags: JSON.stringify(["CSS", "フロントエンド", "デザイン"]),
    icon: "data:image/x-icon;base64,AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04Afi9OAP4vTgE+L04BPi9OAT4vTgE+L04A/i9OAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04Afi9OAT4vTgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vTgC+L04BPi9OAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAMAAAAA9744Cfi9OGD4vTi9+L048vi9OP/4vTj/+L04//i9OP/4vTj/+L04//i9OPL4vTi++L04Y/i9OAwAAAAA+L04A/i9OAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vTgD+Lw4AQAAAAAAAAAA+L04Fvi9ODz4vThX+L04Zfi9OGX4vThX+L04O/i9OBYAAAAAAAAAAPm9OAH4vTgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L44Afi9OAT4vTgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vTgC+L04BPi9OAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04Afi9OAP4vTgE+L04BPi9OAT4vTgE+L04A/i9OAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA///gB///AAD//4AB//8AAP/+AAD//wAA//wAAH//AAD/+AAAP/8AAH/wAA4f/wAAv+AAP5//AACfwAD/z/8AAMAAAf///wAAwAAD////AADgAAf///8AAPAAD////wAA/AAf////AAD/AP////8AAP////8A/wAA////+AA/AAD////wAA8AAP///+AABwAA////wAADAAD///+AAAMAAP/z/wAD+QAA//n8AAf9AAD/+HAAD/4AAP/8AAAf/wAA//4AAD//AAD//wAAf/8AAP//gAH//wAA///gB///AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAH4vTgD+L04BPi9OAT4vTgE+L04BPi9OAP4vTgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAH4vTgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vTgD+L04AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vTgC+L04AgAAAAD4vTgR+L04Ufi9OID4vTiX+L04l/i9OIH4vThQ+L04EQAAAAD4vTgD+L04AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04AwAAAAD4vTgJ+L04gvi9OO74vTj/+L04/vi9OP/4vTj/+L04/vi9OP/4vTjt+L04efi8OAP4vjgB+L04AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04Avi9OAEAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAMAAAAA+L04Hvi9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OP/4vTj/+L04//i9OPz4vTj++L04//i9OP/4vTj++L04+vi9OP/4vTjg+L04JQAAAAD4vTgF+L04AQAAAAD4vTgB+L04BAAAAAD4vTgOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAEAAAAA9743BPi9OKz4vTj/+L04/fi9OPj4vTj4+L04+/i9OPv4vTj7+L04/Pi9OP34vTj/+L04zvi9OB4AAAAA+L04AwAAAAAAAAAAAAAAAAAAAAAAAAAA+L04Afi9OAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAH3vDgB+L44A/i9OHn4vTjt+L04//i9OP74vTj/+L04//i9OP74vTj/+L047vi9OIL4vjgJAAAAAPi9OAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAH4vTgDAAAAAPi9OBH4vThQ+L04gfi9OJf4vTiX+L04gPi9OFH4vTgRAAAAAPi9OAL4vTgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAH4vTgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vTgD+L04AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vTgB+L04A/i9OAT4vTgE+L04BPi9OAT4vTgD+L04AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////w////gD///wAP//4AB/38AOf++AP7/gAH//8AD///gB///+B//////+B///+AH///AA///gAH/fwB9/5wA/v+AAf//wAP///AH///8P/////////////////////////////////8oAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04Avi9OAT4vTgC+L04Avi9OAT4vTgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+L04Avi9OAEAAAAAAAAAAAAAAAAAAAAA+L04Afi9OAIAAAAAAAAAAAAAAAAAAAAA+L04Avi9OAL4vTgB+L04BAAAAAD4vTgm+L04lfi9OMT4vTjB+L04lPi9OCIAAAAA+L04AgAAAAAAAAAAAAAAAPi9OAcAAAAA+L04AgAAAAD4vThM+L049fi9OP/4vTj++L04/vi9OP/4vTj0+L04MgAAAAD4vTgCAAAAAAAAAAD4vTh1+L04IQAAAAD4vThf+L04+fi9OP34vTj4+L04//i9OI34vTgd+L04Ufi9OIEAAAAA+L04AQAAAAAAAAAA+L04Vfi9OPn4vTj0+L04//i9OP/4vTj++L04//i9OHYAAAAA+L04AgAAAAD4vTgN+L04Bfi9OAH4vTgDAAAAAAAAAAD4vThI+L04zvi9OOj4vTjq+L04x/i9OEwAAAAA+L04BgAAAAD4vTgC+L04DPi9OAwAAAAAAAAAAPi9OAL4vTgCAAAAAAAAAAD4vTgM+L04DPi9OAIAAAAA+L04BgAAAAD4vThM+L04x/i9OOr4vTjo+L04zvi9OEgAAAAAAAAAAPi9OAP4vTgB+L04Bfi9OA0AAAAA+L04AgAAAAD4vTh2+L04//i9OP74vTj/+L04//i9OPT4vTj5+L04VQAAAAAAAAAA+L04AQAAAAD4vTiB+L04Ufi9OB34vTiN+L04//i9OPj4vTj9+L04+fi9OF8AAAAA+L04Ifi9OHUAAAAAAAAAAPi9OAIAAAAA+L04Mvi9OPT4vTj/+L04/vi9OP74vTj/+L049fi9OEwAAAAA+L04AgAAAAD4vTgHAAAAAAAAAAAAAAAA+L04AgAAAAD4vTgi+L04lPi9OMH4vTjE+L04lfi9OCYAAAAA+L04BPi9OAH4vTgC+L04AgAAAAAAAAAAAAAAAAAAAAD4vTgC+L04AQAAAAAAAAAAAAAAAAAAAAD4vTgB+L04AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi9OAL4vTgE+L04Avi9OAL4vTgE+L04AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAD//wAA//8AAPw/AAD4HwAA8G8AAIH/AADD/wAA/8MAAP+BAAD2DwAA+B8AAPw/AAD//wAA//8AAP//AAA=",
  },
  {
    url: "https://ui.shadcn.com",
    title:
      "shadcn/ui - Re-usable components built using Radix UI and Tailwind CSS",
    description:
      "shadcn/uiは、Radix UIとTailwind CSSを使用して構築された再利用可能なコンポーネントのコレクションです。美しくアクセシブルなUIを簡単に作成できます。",
    tags: JSON.stringify(["UI", "コンポーネント", "アクセシビリティ"]),
    icon: "https://ui.shadcn.com/favicon.ico",
  },
  {
    url: "https://www.prisma.io",
    title: "Prisma - Next-generation Node.js and TypeScript ORM",
    description:
      "PrismaはNode.jsとTypeScriptのための次世代ORMです。型安全なデータベースアクセスとスキーマ管理を提供します。",
    tags: JSON.stringify(["データベース", "ORM", "TypeScript"]),
    icon: "https://www.prisma.io/favicon-32x32.png",
  },
  {
    url: "https://drizzle.team",
    title: "Drizzle ORM - TypeScript ORM that's fun to use",
    description:
      "Drizzle ORMは、TypeScript用の軽量で高性能なORMです。型安全性とパフォーマンスに重点を置いています。",
    tags: JSON.stringify(["データベース", "ORM", "TypeScript"]),
    icon: "https://drizzle.team/favicon-32x32.png",
  },
  {
    url: "https://react.dev",
    title: "React: The library for web and native user interfaces",
    description:
      "Reactは、WebとネイティブUIを構築するためのJavaScriptライブラリです。宣言的なUIと再利用可能なコンポーネントの作成を可能にします。",
    tags: JSON.stringify(["React", "フロントエンド", "UI"]),
    icon: "https://react.dev/favicon-32x32.png",
  },
  {
    url: "https://zod.dev",
    title: "Zod - TypeScript-first schema validation",
    description:
      "Zodは、TypeScriptファーストのスキーマ宣言と検証ライブラリです。型安全性とランタイムバリデーションを組み合わせます。",
    tags: JSON.stringify(["TypeScript", "バリデーション", "スキーマ"]),
    icon: "https://zod.dev/favicon-32x32.png",
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
      })),
    );

    return { message: "Sample bookmarks created successfully" };
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const allBookmarks = await ctx.db.query.bookmarks.findMany({
      where: (bookmarks, { eq }) =>
        eq(bookmarks.createdById, ctx.session.user.id),
      orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)],
    });

    return allBookmarks;
  }),
});
