# グループ管理システムのユースケース実装例

## 概要

複数のグループを持つ組織での権限管理システムの実装例を示します。

## 実装例

```typescript
// グループコンテキストの定義
type GroupContext = {
  id: string;
  name: string;
  parentId?: string;
  maxMembers: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// グループメンバーシップの定義
type GroupMembership = {
  groupId: string;
  userId: string;
  roleType: RoleType;
  joinedAt: Date;
}

// グループ管理システム
class GroupManagementSystem {
  private groups = new Map<string, GroupContext>();
  private memberships = new Map<string, GroupMembership[]>();

  // グループの作成
  async createGroup(
    name: string,
    creator: { id: string; role: RoleType },
    parentId?: string
  ): Promise<Result<GroupContext, Error>> {
    // 1. 権限チェック
    if (!this.canCreateGroup(creator.role)) {
      return err(new Error('権限がありません'));
    }

    // 2. 親グループの検証
    if (parentId && !this.isValidParent(parentId)) {
      return err(new Error('無効な親グループです'));
    }

    // 3. グループの作成
    const group: GroupContext = {
      id: generateId(),
      name,
      parentId,
      maxMembers: 100,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    this.groups.set(group.id, group);
    return ok(group);
  }

  // メンバーの追加
  async addMember(
    groupId: string,
    userId: string,
    roleType: RoleType,
    adder: { id: string; role: RoleType }
  ): Promise<Result<GroupMembership, Error>> {
    // 1. 権限チェック
    if (!this.canManageMembers(adder.role, groupId)) {
      return err(new Error('権限がありません'));
    }

    // 2. グループの存在確認
    const group = this.groups.get(groupId);
    if (!group) {
      return err(new Error('グループが見つかりません'));
    }

    // 3. メンバー数の確認
    const currentMembers = this.memberships.get(groupId) || [];
    if (currentMembers.length >= group.maxMembers) {
      return err(new Error('メンバー数の上限に達しています'));
    }

    // 4. メンバーシップの作成
    const membership: GroupMembership = {
      groupId,
      userId,
      roleType,
      joinedAt: new Date()
    };

    if (!this.memberships.has(groupId)) {
      this.memberships.set(groupId, []);
    }
    this.memberships.get(groupId)!.push(membership);

    return ok(membership);
  }

  // グループ階層の取得
  async getGroupHierarchy(groupId: string): Promise<Result<GroupContext[], Error>> {
    const hierarchy: GroupContext[] = [];
    let currentId = groupId;

    while (currentId) {
      const group = this.groups.get(currentId);
      if (!group) {
        return err(new Error('無効なグループ階層です'));
      }

      hierarchy.unshift(group);
      if (!group.parentId) break;
      currentId = group.parentId;
    }

    return ok(hierarchy);
  }

  // 権限チェックのヘルパー関数
  private canCreateGroup(role: RoleType): boolean {
    return [
      ROLE_TYPES.SYSTEM_ADMIN,
      ROLE_TYPES.GROUP_ADMIN
    ].includes(role);
  }

  private canManageMembers(role: RoleType, groupId: string): boolean {
    return [
      ROLE_TYPES.SYSTEM_ADMIN,
      ROLE_TYPES.GROUP_ADMIN,
      ROLE_TYPES.GROUP_OPERATOR
    ].includes(role);
  }

  private isValidParent(parentId: string): boolean {
    const parent = this.groups.get(parentId);
    if (!parent) return false;

    // 循環参照のチェック
    const visited = new Set<string>();
    let current = parent;
    
    while (current.parentId) {
      if (visited.has(current.parentId)) return false;
      visited.add(current.parentId);
      current = this.groups.get(current.parentId)!;
    }

    return true;
  }
}
```

## 使用例

```typescript
const groupSystem = new GroupManagementSystem();

// システム管理者によるグループ作成
const createResult = await groupSystem.createGroup(
  '開発チーム',
  { id: 'admin1', role: ROLE_TYPES.SYSTEM_ADMIN }
);

if (createResult.isOk()) {
  const group = createResult.value;
  
  // グループ管理者の追加
  const addAdminResult = await groupSystem.addMember(
    group.id,
    'user1',
    ROLE_TYPES.GROUP_ADMIN,
    { id: 'admin1', role: ROLE_TYPES.SYSTEM_ADMIN }
  );

  if (addAdminResult.isOk()) {
    console.log('グループと管理者が正常に作成されました');
  }
}
```

## 重要なポイント

1. 階層構造の管理
   - 親子関係の妥当性検証
   - 循環参照の防止
   - 深さの制限

2. メンバーシップの管理
   - 権限に基づくアクセス制御
   - メンバー数の制限
   - 監査可能な履歴

3. エラーハンドリング
   - Result型による結果の表現
   - 明確なエラーメッセージ
   - 一貫した検証

4. パフォーマンス考慮
   - メモリ効率の良いデータ構造
   - キャッシュの活用
   - バッチ処理の可能性

## 注意点

1. スケーラビリティ
   - 大規模組織での運用
   - 分散システムでの整合性
   - キャッシュ戦略

2. セキュリティ
   - 権限の厳格な検証
   - 監査ログの保持
   - データの整合性確保

3. 運用性
   - 管理機能の提供
   - バックアップ/リストア
   - トラブルシューティング