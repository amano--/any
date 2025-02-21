import { test, expect } from "vitest";
import { AppRouter, appRouter, createCaller } from "../root";
import { inferProcedureInput } from "@trpc/server";
import { headers } from "next/headers";
import { db } from "~/server/db";

test("create and getAll todos", async () => {
  const ctx = {
    session: {
      user: {
        id: "id12345",
        name: "testUser",
        email: "test@test.com",
      },
      expires: "1234567",
    },
    headers:new Headers(),
    db
  };
  
  const caller = createCaller(ctx);

  const input: inferProcedureInput<AppRouter["post"]["hello"]> = {
    text:"Add Unit test",
  };

  const post = await caller.post.hello(input);
  expect(post.greeting).toBe("0");
});
