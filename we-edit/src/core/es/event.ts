import { type GroupEvent, type GroupReadEvent } from "~/features/group";

// 基底となるミュータブルイベント　Write Event
export type Event =  GroupEvent;

// 基底となるイミュータブルイベント Read Event
export type ReadEvent =  GroupReadEvent;
