import { ULID } from "ulid";

/**
 * Noteの種類を判別可能なUnion型にするために使用する属性
 * @param t type の頭文字
 */
type Memo = { t: "m",ni: ULID }

type Bookmark = { t: "b", ni: ULID }

type Article = { t: "a", ni: ULID }

type Newspaper = { t: "m",  ni: ULID }

// 基底となる抽象型
export type Note = Memo | Bookmark | Article | Newspaper
