/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

// グループの基本的な型定義
export type GroupRole = 'admin' | 'editor' | 'viewer';
export type MemberStatus = 'active' | 'invited' | 'pending';

export type GroupMember = {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRole;
  joinedAt: Date;
  status: MemberStatus;
};

export type GroupSettingsConfig = {
  allowMemberInvite: boolean;
  requireApproval: boolean;
  notificationSettings: {
    newMember: boolean;
    contentUpdate: boolean;
    memberLeave: boolean;
  };
};

export type Group = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
  settings: GroupSettingsConfig;
};

// API操作用の入力型
export type CreateGroupInput = Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'members'>;
export type UpdateGroupInput = Partial<CreateGroupInput> & { id: string };