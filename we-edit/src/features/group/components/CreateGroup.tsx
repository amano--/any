/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import { FC, useState } from 'react';
import { useText } from '~/i18n/text';
import { z } from 'zod';
import type { CreateGroupInput, GroupSettingsConfig } from '../types/group';
import {
  FormData,
  NotificationKey,
  SettingsKey,
  INITIAL_FORM_DATA,
  createUpdatedSettings,
  createUpdatedNotifications,
  hasRequiredFields
} from '../types/form';

export type CreateGroupProps = {
  onSubmit: (data: CreateGroupInput) => Promise<void>;
  onCancel: () => void;
  className?: string;
};

type ValidationField = 'name' | 'description';

// エラーメッセージ取得用のヘルパー
const getValidationMessage = (t: ReturnType<typeof useText>['t'], error: z.ZodError): string => {
  const firstError = error.errors[0];
  if (!firstError) {
    return t.group.errors.create;
  }

  const path = firstError.path[0] as ValidationField | undefined;
  if (!path) {
    return t.group.errors.create;
  }

  // name フィールドのバリデーション
  if (path === 'name') {
    if (firstError.message.includes('required')) {
      return t.group.validation.name.required;
    }
    if (firstError.message.includes('2')) {
      return t.group.validation.name.minLength;
    }
    if (firstError.message.includes('50')) {
      return t.group.validation.name.maxLength;
    }
  }

  // description フィールドのバリデーション
  if (path === 'description') {
    if (firstError.message.includes('required')) {
      return t.group.validation.description.required;
    }
    if (firstError.message.includes('500')) {
      return t.group.validation.description.maxLength;
    }
  }

  return t.group.errors.create;
};

// バリデーションスキーマ
const createGroupSchema = z.object({
  name: z.string()
    .min(2)
    .max(50),
  description: z.string()
    .min(1)
    .max(500),
  isPublic: z.boolean().default(false),
  icon: z.string().optional(),
  settings: z.object({
    allowMemberInvite: z.boolean(),
    requireApproval: z.boolean(),
    notificationSettings: z.object({
      newMember: z.boolean(),
      contentUpdate: z.boolean(),
      memberLeave: z.boolean()
    })
  }) satisfies z.ZodType<GroupSettingsConfig>
});

export const CreateGroup: FC<CreateGroupProps> = ({
  onSubmit,
  onCancel,
  className = ''
}) => {
  const { t } = useText();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Required<Omit<FormData, 'icon'>>>(INITIAL_FORM_DATA);

  // 基本フィールドの更新
  const updateBasicField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 設定の更新
  const updateSettings = (key: SettingsKey, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: createUpdatedSettings(prev.settings, key, value)
    }));
  };

  // 通知設定の更新
  const updateNotification = (key: NotificationKey, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: createUpdatedNotifications(prev.settings, key, value)
    }));
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasRequiredFields(formData)) {
      setError(t.group.validation.formIncomplete);
      return;
    }
    
    try {
      setIsSubmitting(true);
      const validatedData = createGroupSchema.parse(formData);
      await onSubmit(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(getValidationMessage(t, err));
      } else {
        setError(t.group.errors.create);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* 基本情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t.group.form.create.title}</h3>
        
        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {t.group.form.fields.name}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => updateBasicField('name', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t.group.form.fields.description}
          </label>
          <textarea
            value={formData.description}
            onChange={e => updateBasicField('description', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={e => updateBasicField('isPublic', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{t.group.form.fields.isPublic}</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {t.group.form.fields.isPublicHint}
          </p>
        </div>
      </div>

      {/* 詳細設定 */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">{t.group.form.fields.settings}</h4>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.settings.allowMemberInvite}
              onChange={e => updateSettings('allowMemberInvite', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{t.group.form.settings.allowMemberInvite}</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.settings.requireApproval}
              onChange={e => updateSettings('requireApproval', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{t.group.form.settings.requireApproval}</span>
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t.group.form.settings.notifications.title}
          </p>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.settings.notificationSettings.newMember}
              onChange={e => updateNotification('newMember', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              {t.group.form.settings.notifications.newMember}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.settings.notificationSettings.contentUpdate}
              onChange={e => updateNotification('contentUpdate', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              {t.group.form.settings.notifications.contentUpdate}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.settings.notificationSettings.memberLeave}
              onChange={e => updateNotification('memberLeave', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              {t.group.form.settings.notifications.memberLeave}
            </span>
          </label>
        </div>
      </div>

      {/* アクション */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          {t.group.form.create.cancel}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {t.group.form.create.submit}
        </button>
      </div>
    </form>
  );
};