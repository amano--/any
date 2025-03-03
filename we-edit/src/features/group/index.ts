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
  UpdateGroupInput
} from './types/group';

export type {
  NotificationSettings,
  FormSettings,
  FormData,
  SettingsKey,
  NotificationKey
} from './types/form';

// APIのエクスポート
export { mockGroupApi as groupApi } from './api/mockApi';

// コンポーネントのエクスポート
export { CreateGroup } from './components/CreateGroup';
export { GroupList } from './components/GroupList';
export { GroupCard } from './components/GroupCard';
export { GroupSettings } from './components/GroupSettings';

// ヘルパー関数のエクスポート
export {
  createUpdatedSettings,
  createUpdatedNotifications,
  hasRequiredFields,
  DEFAULT_SETTINGS,
  INITIAL_FORM_DATA
} from './types/form';

// 定数のエクスポート
export const GROUP_ROLES = ['admin', 'editor', 'viewer'] as const;
export const MEMBER_STATUS = ['active', 'invited', 'pending'] as const;