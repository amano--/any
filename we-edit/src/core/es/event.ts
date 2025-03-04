import { usePathname } from "next/navigation";
import { resources } from "./resources";
import { Group } from "../../features/group/types/group";

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

/**
 * Event の種類を判別可能なUnion型にするために使用する属性
 * @param b 境界付けられたコンテキスト(bounded context) の頭文字
 * @param g 機能グループ(group) の頭文字
 * @param f 機能(feature) の頭文字
 * @param a アクション(action) の頭文字
 */
type GroupListEvent = { b: "m"; g: "g"; f: "g"; a: "listGroup"; ei: ULID };

/**
 * Event の種類を判別可能なUnion型にするために使用する属性
 * @param b 境界付けられたコンテキスト(bounded context) の頭文字
 * @param g 機能グループ(group) の頭文字
 * @param f 機能(feature) の頭文字
 * @param a アクション(action) の頭文字
 */
type GroupAddEvent = { b: "m"; g: "g"; f: "g"; a: "addGroup"; ei: ULID };

// 重要: この型のstringは、かならずULID（Universally Unique Lexicographically Sortable Identifier）でなければならない
export type ULID = string;

// 機能グループの基底イベント
export type GroupEvent = GroupAddEvent;

// 基底となるミュータブルイベント　Write Event
export type Event = MemberEvent | GroupEvent;

// 基底となるイミュータブルイベント Read Event
export type ReadEvent = MemberListEvent | GroupListEvent;
