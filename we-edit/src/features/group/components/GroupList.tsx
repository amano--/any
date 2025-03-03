/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import { FC } from 'react';
import { useText } from '~/i18n/text';
import { Group } from '../types/group';
import { GroupCard } from './GroupCard';

export type GroupListProps = {
  groups: Group[];
  currentUserId: string;
  onViewGroup?: (id: string) => void;
  onEditGroup?: (id: string) => void;
  onDeleteGroup?: (id: string) => void;
  className?: string;
};

export const GroupList: FC<GroupListProps> = ({
  groups,
  currentUserId,
  onViewGroup,
  onEditGroup,
  onDeleteGroup,
  className = ''
}) => {
  const { t } = useText();

  if (groups.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t.group.list.empty}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {groups.map(group => (
        <GroupCard
          key={group.id}
          group={group}
          onView={onViewGroup}
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
        />
      ))}
    </div>
  );
};