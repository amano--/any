import { usePathname } from "next/navigation";
import { Group } from "../../features/group/types/group";
import { type GroupEvent, type GroupReadEvent } from "~/features/group";

/**
 * Event の種類を判別可能なUnion型にするために使用する属性
 * @param b 境界付けられたコンテキスト(bounded context) の頭文字
 * @param g 機能グループ(group) の頭文字
 * @param f 機能(feature) の頭文字
 * @param a アクション(action) の頭文字
 */
type MemberListEvent = { b: "m"; g: "m"; f: "m"; a: "listMember"; ei: ULID };

/**
 * Event の種類を判別可能なUnion型にするために使用する属性
 * @param b 境界付けられたコンテキスト(bounded context) の頭文字
 * @param g 機能グループ(group) の頭文字
 * @param f 機能(feature) の頭文字
 * @param a アクション(action) の頭文字
 */
type MemberAddEvent = { b: "m"; g: "m"; f: "m"; a: "addMember"; ei: ULID };
type MemberEvent = MemberAddEvent;

// 重要: この型のstringは、かならずULID（Universally Unique Lexicographically Sortable Identifier）でなければならない
export type ULID = string;

// 基底となるミュータブルイベント　Write Event
export type Event = MemberEvent | GroupEvent;

// 基底となるイミュータブルイベント Read Event
export type ReadEvent = MemberListEvent | GroupReadEvent;
