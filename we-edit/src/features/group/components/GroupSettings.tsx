/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import { FC, useState } from 'react';
import { useText } from '~/i18n/text';
import type { Group, GroupRole, GroupSettingsConfig } from '../types/group';
import {
  NotificationKey,
  SettingsKey,
  createUpdatedSettings,
  createUpdatedNotifications
} from '../types/form';

export type GroupSettingsProps = {
  group: Group;
  currentUserId: string;
  onUpdate: (data: Partial<Group>) => Promise<void>;
  onDelete: () => Promise<void>;
  onMemberRemove: (userId: string) => Promise<void>;
  onRoleChange: (userId: string, role: GroupRole) => Promise<void>;
  className?: string;
};

const ROLE_OPTIONS: { value: GroupRole; labelKey: keyof typeof import('~/i18n/locales/ja/group').group.members.roles }[] = [
  { value: 'admin', labelKey: 'admin' },
  { value: 'editor', labelKey: 'editor' },
  { value: 'viewer', labelKey: 'viewer' }
];

/**
 * @ai_component_structure
 * レイアウト構成:
 * - Header: グループ名と説明
 * - BasicSettings: 基本設定
 * - Notifications: 通知設定
 * - MemberManagement: メンバー管理
 * - DangerZone: 削除など危険な操作
 */
export const GroupSettings: FC<GroupSettingsProps> = ({
  group,
  currentUserId,
  onUpdate,
  onDelete,
  onMemberRemove,
  onRoleChange,
  className = ''
}) => {
  const { t } = useText();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 現在のユーザーが管理者かどうか
  const isAdmin = group.members.some(
    m => m.userId === currentUserId && m.role === 'admin'
  );

  // 設定の更新
  const updateSettings = async (key: SettingsKey, value: boolean) => {
    try {
      setError(null);
      setIsSubmitting(true);
      const newSettings = createUpdatedSettings(group.settings, key, value);
      await onUpdate({ settings: newSettings });
    } catch (err) {
      setError(t.group.errors.update);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 通知設定の更新
  const updateNotification = async (key: NotificationKey, value: boolean) => {
    try {
      setError(null);
      setIsSubmitting(true);
      const newSettings = createUpdatedNotifications(group.settings, key, value);
      await onUpdate({ settings: newSettings });
    } catch (err) {
      setError(t.group.errors.update);
    } finally {
      setIsSubmitting(false);
    }
  };

  // メンバー権限の変更
  const handleRoleChange = async (userId: string, role: GroupRole) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onRoleChange(userId, role);
    } catch (err) {
      setError(t.group.errors.changeRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  // メンバーの削除
  const handleMemberRemove = async (userId: string) => {
    if (!window.confirm(t.group.confirmations.removeMember)) {
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await onMemberRemove(userId);
    } catch (err) {
      setError(t.group.errors.removeMember);
    } finally {
      setIsSubmitting(false);
    }
  };

  // グループの削除
  const handleDelete = async () => {
    if (!window.confirm(t.group.confirmations.delete)) {
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await onDelete();
    } catch (err) {
      setError(t.group.errors.delete);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
        {t.group.errors.notAuthorized}
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* 基本設定 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t.group.form.fields.settings}</h3>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={group.settings.allowMemberInvite}
              onChange={e => updateSettings('allowMemberInvite', e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{t.group.form.settings.allowMemberInvite}</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={group.settings.requireApproval}
              onChange={e => updateSettings('requireApproval', e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{t.group.form.settings.requireApproval}</span>
          </label>
        </div>
      </section>

      {/* 通知設定 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">
          {t.group.form.settings.notifications.title}
        </h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={group.settings.notificationSettings.newMember}
              onChange={e => updateNotification('newMember', e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              {t.group.form.settings.notifications.newMember}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={group.settings.notificationSettings.contentUpdate}
              onChange={e => updateNotification('contentUpdate', e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              {t.group.form.settings.notifications.contentUpdate}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={group.settings.notificationSettings.memberLeave}
              onChange={e => updateNotification('memberLeave', e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              {t.group.form.settings.notifications.memberLeave}
            </span>
          </label>
        </div>
      </section>

      {/* メンバー管理 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t.group.members.title}</h3>

        <div className="space-y-2">
          {group.members.length === 0 ? (
            <p className="text-gray-500">{t.group.members.empty}</p>
          ) : (
            group.members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>{member.userId}</div>
                <div className="flex items-center gap-2">
                  {member.userId !== currentUserId && (
                    <>
                      <select
                        value={member.role}
                        onChange={e => handleRoleChange(member.userId, e.target.value as GroupRole)}
                        disabled={isSubmitting}
                        className="text-sm border rounded px-2 py-1"
                      >
                        {ROLE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {t.group.members.roles[option.labelKey]}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleMemberRemove(member.userId)}
                        disabled={isSubmitting}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        {t.group.members.actions.remove}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 危険な操作 */}
      <section className="border-t pt-8">
        <div className="bg-red-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-red-800 mb-4">
            {t.group.dangerZone.title}
          </h3>
          <p className="text-sm text-red-600 mb-4">
            {t.group.dangerZone.deleteWarning}
          </p>
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {t.group.form.edit.delete}
          </button>
        </div>
      </section>
    </div>
  );
};