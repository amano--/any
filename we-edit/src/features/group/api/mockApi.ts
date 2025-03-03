/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import { 
  Group, 
  GroupResponse, 
  GroupListResponse, 
  CreateGroupInput, 
  UpdateGroupInput,
  GroupMember,
  GroupRole
} from '../types/group';

// モックユーザーデータ
const mockUsers = [
  { id: "u1", name: "John Doe" },
  { id: "u2", name: "Jane Smith" },
  { id: "u3", name: "Bob Johnson" },
  { id: "u4", name: "Alice Brown" },
  { id: "u5", name: "Charlie Wilson" },
] as const;

// デフォルトの設定
const defaultGroupSettings = {
  allowMemberInvite: true,
  requireApproval: true,
  notificationSettings: {
    newMember: true,
    contentUpdate: true,
    memberLeave: true
  }
} as const;

// 初期グループデータ
const initialGroup: Group = {
  id: "g1",
  name: "開発チーム",
  description: "プロジェクトの開発メンバー",
  isPublic: false,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-03-01"),
  members: [
    {
      id: "m1",
      userId: "u1",
      groupId: "g1",
      role: "admin",
      joinedAt: new Date("2025-01-01"),
      status: "active"
    },
    {
      id: "m2",
      userId: "u2",
      groupId: "g1",
      role: "editor",
      joinedAt: new Date("2025-01-02"),
      status: "active"
    }
  ],
  settings: defaultGroupSettings
};

// モックグループデータ
let mockGroups: Group[] = [initialGroup];

// API関数
export const mockGroupApi = {
  // グループ一覧取得
  getGroups: async (): Promise<GroupListResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: mockGroups
    };
  },

  // グループ詳細取得
  getGroup: async (id: string): Promise<GroupResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const group = mockGroups.find(g => g.id === id);
    return group
      ? { success: true, data: group }
      : { success: false, error: "Group not found" };
  },

  // グループ作成
  createGroup: async (input: CreateGroupInput): Promise<GroupResponse> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newGroup: Group = {
      id: `g${mockGroups.length + 1}`,
      name: input.name,
      description: input.description,
      isPublic: input.isPublic ?? false,
      icon: input.icon,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      settings: input.settings ?? { ...defaultGroupSettings }
    };

    mockGroups = [...mockGroups, newGroup];
    
    return {
      success: true,
      data: newGroup
    };
  },

  // グループ更新
  updateGroup: async (input: UpdateGroupInput): Promise<GroupResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const currentGroup = mockGroups.find(g => g.id === input.id);
    
    if (!currentGroup) {
      return { success: false, error: "Group not found" };
    }

    const updatedGroup: Group = {
      id: currentGroup.id,
      name: input.name ?? currentGroup.name,
      description: input.description ?? currentGroup.description,
      isPublic: input.isPublic ?? currentGroup.isPublic,
      icon: input.icon ?? currentGroup.icon,
      createdAt: currentGroup.createdAt,
      updatedAt: new Date(),
      members: currentGroup.members,
      settings: input.settings 
        ? { ...currentGroup.settings, ...input.settings }
        : currentGroup.settings
    };

    mockGroups = mockGroups.map(g => 
      g.id === input.id ? updatedGroup : g
    );

    return {
      success: true,
      data: updatedGroup
    };
  },

  // グループ削除
  deleteGroup: async (id: string): Promise<GroupResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const groupExists = mockGroups.some(g => g.id === id);
    
    if (!groupExists) {
      return { success: false, error: "Group not found" };
    }

    mockGroups = mockGroups.filter(g => g.id !== id);
    return { success: true };
  },

  // メンバー追加
  addMember: async (groupId: string, userId: string, role: GroupRole): Promise<GroupResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const targetGroup = mockGroups.find(g => g.id === groupId);
    
    if (!targetGroup) {
      return { success: false, error: "Group not found" };
    }

    const newMember: GroupMember = {
      id: `m${Date.now()}`,
      userId,
      groupId,
      role,
      joinedAt: new Date(),
      status: "active"
    };

    const updatedGroup: Group = {
      ...targetGroup,
      members: [...targetGroup.members, newMember]
    };

    mockGroups = mockGroups.map(g => 
      g.id === groupId ? updatedGroup : g
    );

    return {
      success: true,
      data: updatedGroup
    };
  },

  // メンバー削除
  removeMember: async (groupId: string, userId: string): Promise<GroupResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const targetGroup = mockGroups.find(g => g.id === groupId);
    
    if (!targetGroup) {
      return { success: false, error: "Group not found" };
    }

    if (!targetGroup.members.some(m => m.userId === userId)) {
      return { success: false, error: "Member not found" };
    }

    const updatedGroup: Group = {
      ...targetGroup,
      members: targetGroup.members.filter(m => m.userId !== userId)
    };

    mockGroups = mockGroups.map(g => 
      g.id === groupId ? updatedGroup : g
    );

    return {
      success: true,
      data: updatedGroup
    };
  }
};