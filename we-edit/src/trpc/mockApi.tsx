/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// ~/trpc/msw.tsx
"use client";

import { useState } from "react";
import { createTRPCMsw } from "msw-trpc";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import {
  QueryClient,
  QueryClientProvider,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { AppRouter } from "~/server/api/root";
import { getBaseUrl } from "./react";
import SuperJSON from "superjson";
import { protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { posts } from "~/server/db/schema";
import { QueryProcedure } from "@trpc/server/unstable-core-do-not-import";
import { DecoratedQueryMethods } from "node_modules/@trpc/react-query/dist/createTRPCReact";

// export const trpcMsw = createTRPCMsw<AppRouter>();

const getLatest =
  // : DecoratedQueryMethods<{
  //   input: void;
  //   output: {
  //       id: number;
  //       name: string | null;
  //       createdById: string;
  //       createdAt: Date;
  //       updatedAt: Date | null;
  //   } | null;
  //   transformer:boolean;
  //   errorShape:unknown
  // }>
  {
    // useQuery(input?:void, opts:unknown) {
    //   return {
    //     data: {
    //       id: 1,
    //       name: "hoge",
    //       createdById: "me",
    //       createdAt: new Date(2000, 1, 1),
    //       updatedAt: new Date(2000, 1, 1),
    //     },
    //   };
    // },
    useSuspenseQuery: (input?: void, opts?: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return [
        {
          id: 1,
          name: "hoge",
          createdById: "me",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
        },
        {} as UseSuspenseQueryResult,
      ];
    },
  };
//async () =>({id:1,name:"hoge",createdById:"me",createdAt:new Date(2000,1,1),updatedAt:new Date(2000,1,1) });

const post = {
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),
  getLatest,
};

const routers = { post };
export const mockApi = { ...routers };

// export const api = createTRPCReact<AppRouter>();

// export const TRPCReactProvider = (props: { children: React.ReactNode }) => {
//   const [queryClient] = useState(() => new QueryClient());
//   const [trpcClient] = useState(() =>
//     api.createClient({
//       transformer,
//       links: [
//         httpLink({
//           url: getUrl(),
//           headers() {
//             return {
//               "content-type": "application/json",
//             };
//           },
//         }),
//       ],
//     }),
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       <api.Provider client={trpcClient} queryClient={queryClient}>
//         {props.children}
//       </api.Provider>
//     </QueryClientProvider>
//   );
// };
