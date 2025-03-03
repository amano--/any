/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import type { GroupSettingsConfig } from './group';

// フォーム固有の型定義
export type NotificationSettings = {
  newMember: boolean;
  contentUpdate: boolean;
  memberLeave: boolean;
};

export type FormSettings = Required<GroupSettingsConfig>;

export type FormData = {
  name: string;
  description: string;
  isPublic: boolean;
  icon?: string;
  settings: FormSettings;
};

export type SettingsKey = keyof Omit<GroupSettingsConfig, 'notificationSettings'>;
export type NotificationKey = keyof NotificationSettings;

// デフォルト値
export const DEFAULT_NOTIFICATION_SETTINGS: Required<NotificationSettings> = {
  newMember: true,
  contentUpdate: true,
  memberLeave: true
} as const;

export const DEFAULT_SETTINGS: Required<GroupSettingsConfig> = {
  allowMemberInvite: true,
  requireApproval: true,
  notificationSettings: DEFAULT_NOTIFICATION_SETTINGS
} as const;

export const INITIAL_FORM_DATA: Required<Omit<FormData, 'icon'>> = {
  name: '',
  description: '',
  isPublic: false,
  settings: DEFAULT_SETTINGS
} as const;

// フォーム更新用のヘルパー関数
export const createUpdatedSettings = (
  settings: Required<GroupSettingsConfig>,
  key: SettingsKey,
  value: boolean
): Required<GroupSettingsConfig> => ({
  ...settings,
  [key]: value
});

export const createUpdatedNotifications = (
  settings: Required<GroupSettingsConfig>,
  key: NotificationKey,
  value: boolean
): Required<GroupSettingsConfig> => ({
  ...settings,
  notificationSettings: {
    ...settings.notificationSettings,
    [key]: value
  }
});

// 必須フィールドの存在チェック
export const hasRequiredFields = (data: Partial<FormData>): data is FormData => {
  return !!(
    data.name &&
    data.description &&
    typeof data.isPublic === 'boolean' &&
    data.settings &&
    typeof data.settings.allowMemberInvite === 'boolean' &&
    typeof data.settings.requireApproval === 'boolean' &&
    data.settings.notificationSettings &&
    typeof data.settings.notificationSettings.newMember === 'boolean' &&
    typeof data.settings.notificationSettings.contentUpdate === 'boolean' &&
    typeof data.settings.notificationSettings.memberLeave === 'boolean'
  );
};