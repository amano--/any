/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import { FC, useState, useMemo } from 'react';
import { useText } from '~/i18n/text';
import type { Group } from '../types/group';
import { GroupCard } from './GroupCard';

export type GroupFilter = 'all' | 'joined' | 'managed' | 'public';

export type GroupListProps = {
  groups: Group[];
  currentUserId: string;
  onCreateGroup?: () => void;
  onEditGroup?: (id: string) => void;
  onDeleteGroup?: (id: string) => void;
  onManageMembers?: (id: string) => void;
  className?: string;
};

/**
 * @ai_component_structure
 * レイアウト構成:
 * - Header: 検索バーとフィルター
 * - Content: グリッドレイアウトのグループカード
 * - EmptyState: データが無い場合の表示
 */
export const GroupList: FC<GroupListProps> = ({
  groups,
  currentUserId,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onManageMembers,
  className = ''
}) => {
  const { t } = useText();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<GroupFilter>('all');

  // フィルタリングとソート
  const filteredGroups = useMemo(() => {
    return groups
      .filter(group => {
        // 検索フィルター
        if (search && !group.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }

        // タイプフィルター
        switch (filter) {
          case 'joined':
            return group.members.some(m => m.userId === currentUserId);
          case 'managed':
            return group.members.some(
              m => m.userId === currentUserId && m.role === 'admin'
            );
          case 'public':
            return group.isPublic;
          default:
            return true;
        }
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [groups, search, filter, currentUserId]);

  return (
    <div className={className}>
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t.group.list.title}</h2>
          {onCreateGroup && (
            <button
              onClick={onCreateGroup}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t.group.list.create}
            </button>
          )}
        </div>

        {/* 検索とフィルター */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.group.list.search}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as GroupFilter)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t.group.list.filter.all}</option>
            <option value="joined">{t.group.list.filter.joined}</option>
            <option value="managed">{t.group.list.filter.managed}</option>
            <option value="public">{t.group.list.filter.public}</option>
          </select>
        </div>
      </div>

      {/* コンテンツ */}
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={
                group.members.some(
                  m => m.userId === currentUserId && m.role === 'admin'
                )
                  ? onEditGroup
                  : undefined
              }
              onDelete={
                group.members.some(
                  m => m.userId === currentUserId && m.role === 'admin'
                )
                  ? onDeleteGroup
                  : undefined
              }
              onMemberManage={
                group.members.some(m => m.userId === currentUserId)
                  ? onManageMembers
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        // 空の状態
        <div className="text-center py-12">
          <p className="text-gray-500">{t.group.list.empty}</p>
          {onCreateGroup && (
            <button
              onClick={onCreateGroup}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t.group.list.create}
            </button>
          )}
        </div>
      )}
    </div>
  );
};