/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import { FC } from 'react';
import { useText } from '~/i18n/text';
import type { Group } from '../types/group';

export type GroupCardProps = {
  group: Group;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
};

/**
 * @ai_component_structure
 * レイアウト構成:
 * - GroupCard: カード型のグループ表示
 *   - ヘッダー: アイコンとグループ名
 *   - コンテンツ: 説明文とメンバー数
 *   - フッター: アクションボタン群
 */
export const GroupCard: FC<GroupCardProps> = ({
  group,
  onView,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { t } = useText();

  return (
    <div className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-3">
        {group.icon && (
          <img
            src={group.icon}
            alt={group.name}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            <button 
              onClick={() => onView?.(group.id)}
              className="hover:text-blue-600 hover:underline"
            >
              {group.name}
            </button>
          </h3>
          <p className="text-sm text-gray-500">
            {group.isPublic ? 
              t.group.list.filter.public : 
              t.group.list.filter.private
            }
          </p>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {group.description}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {t.group.members.count(group.members.length)}
        </p>
      </div>

      {/* フッター */}
      <div className="flex justify-end gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(group.id)}
            className="text-sm px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            {t.group.form.edit.title}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(group.id)}
            className="text-sm px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
          >
            {t.group.form.edit.delete}
          </button>
        )}
      </div>
    </div>
  );
};