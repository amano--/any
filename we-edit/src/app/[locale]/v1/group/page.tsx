/**
 * [実装計画書](../../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  GroupList, 
  CreateGroup, 
  Group, 
  groupApi,
  CreateGroupInput
} from '~/features/group';
import { isSuccessResponse } from '~/features/group/api/types';
import { useText } from '~/i18n/text';

export default function GroupPage() {
  const { t } = useText();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // グループ一覧の取得
  const fetchGroups = async () => {
    try {
      const response = await groupApi.getGroups();
      if (isSuccessResponse(response)) {
        setGroups(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(t.group.errors.notFound);
    }
  };

  // 初回読み込み
  useEffect(() => {
    void fetchGroups();
  }, []);

  // グループの作成
  const handleCreate = async (input: CreateGroupInput) => {
    try {
      const response = await groupApi.createGroup(input);
      if (isSuccessResponse(response)) {
        setIsCreating(false);
        void fetchGroups();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(t.group.errors.create);
    }
  };

  // グループの表示
  const handleView = async (id: string) => {
    try {
      const response = await groupApi.getGroup(id);
      if (isSuccessResponse(response)) {
        setSelectedGroup(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(t.group.errors.notFound);
    }
  };

  // グループの削除
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t.group.confirmations.delete);
    if (!confirmed) return;

    try {
      const response = await groupApi.deleteGroup(id);
      if (isSuccessResponse(response)) {
        void fetchGroups();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(t.group.errors.delete);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t.group.list.title}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-sm underline"
          >
            閉じる
          </button>
        </div>
      )}

      {isCreating ? (
        <div className="mb-8">
          <CreateGroup
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t.group.list.create}
        </button>
      )}

      <GroupList
        groups={groups}
        currentUserId="test-user"
        onViewGroup={handleView}
        onDeleteGroup={handleDelete}
      />
    </div>
  );
}