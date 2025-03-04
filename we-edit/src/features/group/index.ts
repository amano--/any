/**
 * [実装計画書](../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

// 型定義のエクスポート
export type {
  Group,
  GroupMember,
  GroupRole,
  GroupSettingsConfig,
  MemberStatus,
  CreateGroupInput,
  UpdateGroupInput,
} from "./types/group";

export type {
  NotificationSettings,
  FormSettings,
  FormData,
  SettingsKey,
  NotificationKey,
} from "./types/form";

// APIのエクスポート
export { mockGroupApi as groupApi } from "./api/mockApi";

// コンポーネントのエクスポート
export { CreateGroup } from "./components/CreateGroup";
export { GroupList } from "./components/GroupList";
export { GroupCard } from "./components/GroupCard";
export { GroupSettings } from "./components/GroupSettings";

// ヘルパー関数のエクスポート
export {
  createUpdatedSettings,
  createUpdatedNotifications,
  hasRequiredFields,
  DEFAULT_SETTINGS,
  INITIAL_FORM_DATA,
} from "./types/form";

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

// 機能グループの基底イベント
export type GroupEvent = GroupAddEvent;
export type GroupReadEvent = GroupListEvent;

// 定数のエクスポート
export const GROUP_ROLES = ["admin", "editor", "viewer"] as const;
export const MEMBER_STATUS = ["active", "invited", "pending"] as const;
