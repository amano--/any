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
type MemberAddEvent = { b: "m"; g: "m"; f: "m"; a: "addMember" };
type MemberEvent = MemberAddEvent;

/**
 * Event の種類を判別可能なUnion型にするために使用する属性
 * @param b 境界付けられたコンテキスト(bounded context) の頭文字
 * @param g 機能グループ(group) の頭文字
 * @param f 機能(feature) の頭文字
 * @param a アクション(action) の頭文字
 */
type GroupAddEvent = { b: "m"; g: "g"; f: "g"; a: "addGroup" };
// 機能グループの基底イベント
export type GroupEvent = GroupAddEvent;

// 基底となるミュータブルイベント　Write Event
export type Event = MemberEvent | GroupEvent;

// 基底となるイミュータブルイベント Read Event
export type ReadEvent = keyof typeof readEvents;
