import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `we-edit_${name}`);

export const posts = createTable(
  "post",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    createdById: text("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: int("email_verified", {
    mode: "timestamp",
  }).default(sql`(unixepoch())`),
  image: text("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const bookmarks = createTable(
  "bookmark",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    createdById: text("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    url: text("url", { length: 2048 }).notNull(),
    title: text("title", { length: 512 }).notNull(),
    description: text("description", { length: 2048 }),
    icon: text("icon", { length: 2048 }), // アイコンのURL
    tags: text("tags", { length: 2048 }), // JSON文字列として保存
    parentId: text("parent_id", { length: 255 }), // Chromeブックマークの親フォルダID
    index: int("index", { mode: "number" }), // フォルダ内での並び順
    dateAdded: int("date_added", { mode: "timestamp" }), // Chromeでの追加日時
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (bookmark) => ({
    createdByIdIdx: index("bookmark_created_by_idx").on(bookmark.createdById),
    urlIndex: index("bookmark_url_idx").on(bookmark.url),
    parentIdIdx: index("bookmark_parent_id_idx").on(bookmark.parentId),
  })
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  createdBy: one(users, { fields: [bookmarks.createdById], references: [users.id] }),
}));

/**
 * ブックマークツリー用のテーブル定義
 * 階層構造を表現するために自己参照する
 */
export const bookmarkTrees = createTable(
  "bookmark_tree",
  {
    id: text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 255 }).notNull(),
    parentId: text("parent_id", { length: 255 }),  // 参照は relations で設定
    position: int("position", { mode: "number" }).notNull(),
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    parentIdIdx: index("bookmark_tree_parent_id_idx").on(table.parentId),
    userIdIdx: index("bookmark_tree_user_id_idx").on(table.userId),
    positionIdx: index("bookmark_tree_position_idx").on(table.position),
  })
);

export const bookmarkTreesRelations = relations(bookmarkTrees, ({ one, many }) => ({
  parent: one(bookmarkTrees, {
    fields: [bookmarkTrees.parentId],
    references: [bookmarkTrees.id],
  }),
  children: many(bookmarkTrees),
  user: one(users, {
    fields: [bookmarkTrees.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
