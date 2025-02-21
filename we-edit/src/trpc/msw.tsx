/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// ~/trpc/msw.tsx
"use client";

import { useState } from "react";
import { createTRPCMsw } from "msw-trpc";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getUrl, transformer } from "./shared";
import type { AppRouter } from "~/server/api/root";
import { getBaseUrl } from "./react";
import SuperJSON from "superjson";

// export const trpcMsw = createTRPCMsw<AppRouter>();

export const trpcMsw = createTRPCMsw<AppRouter>({ 
  baseUrl: getBaseUrl(),
  transformer: { input: SuperJSON, output: SuperJSON },
});

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