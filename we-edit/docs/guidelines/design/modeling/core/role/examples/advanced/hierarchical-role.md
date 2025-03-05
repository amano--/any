# 階層的なRole実装例

## 高度な実装

```typescript
// 階層レベルの定義
const HIERARCHY_LEVELS = {
  SYSTEM: 0,
  MANAGEMENT: 1,
  OPERATION: 2,
  BASIC: 3
} as const;

type HierarchyLevel = typeof HIERARCHY_LEVELS[keyof typeof HIERARCHY_LEVELS];

// 権限スコープの定義
const PERMISSION_SCOPES = {
  GLOBAL: 'global',
  GROUP: 'group',
  PERSONAL: 'personal'
} as const;

type PermissionScope = typeof PERMISSION_SCOPES[keyof typeof PERMISSION_SCOPES];

// 高度なロール定義
type HierarchicalRole = {
  id: string;
  name: string;
  level: HierarchyLevel;
  scope: PermissionScope;
  permissions: Set<string>;
  children: Set<string>;  // 子ロールのID
  metadata: {
    maxSubordinates: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

// ロール管理クラス
class RoleHierarchyManager {
  private roles: Map<string, HierarchicalRole> = new Map();

  // ロールの追加
  addRole(role: HierarchicalRole): void {
    if (this.validateRole(role)) {
      this.roles.set(role.id, role);
    }
  }

  // 権限の継承確認
  private inheritPermissions(roleId: string): Set<string> {
    const role = this.roles.get(roleId);
    if (!role) return new Set();

    const allPermissions = new Set(role.permissions);
    role.children.forEach(childId => {
      const childPermissions = this.inheritPermissions(childId);
      childPermissions.forEach(p => allPermissions.add(p));
    });

    return allPermissions;
  }

  // ロールの検証
  private validateRole(role: HierarchicalRole): boolean {
    // 1. レベルチェック
    if (role.level < 0 || role.level > 3) return false;

    // 2. 循環参照チェック
    if (this.hasCircularReference(role.id, role.children)) return false;

    // 3. スコープの整合性チェック
    if (!this.validateScope(role)) return false;

    return true;
  }

  // 循環参照のチェック
  private hasCircularReference(
    roleId: string,
    children: Set<string>,
    visited = new Set<string>()
  ): boolean {
    if (visited.has(roleId)) return true;
    visited.add(roleId);

    for (const childId of children) {
      const child = this.roles.get(childId);
      if (!child) continue;
      if (this.hasCircularReference(childId, child.children, visited)) {
        return true;
      }
    }

    return false;
  }

  // スコープの検証
  private validateScope(role: HierarchicalRole): boolean {
    switch (role.scope) {
      case PERMISSION_SCOPES.GLOBAL:
        return role.level === HIERARCHY_LEVELS.SYSTEM;
      case PERMISSION_SCOPES.GROUP:
        return role.level <= HIERARCHY_LEVELS.OPERATION;
      case PERMISSION_SCOPES.PERSONAL:
        return true;
      default:
        return false;
    }
  }
}
```

## 使用例

```typescript
// システム管理者ロールの作成
const adminRole: HierarchicalRole = {
  id: 'system_admin',
  name: 'System Administrator',
  level: HIERARCHY_LEVELS.SYSTEM,
  scope: PERMISSION_SCOPES.GLOBAL,
  permissions: new Set(['*']),  // 全権限
  children: new Set(),
  metadata: {
    maxSubordinates: Infinity,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

// グループ管理者ロールの作成
const groupAdminRole: HierarchicalRole = {
  id: 'group_admin',
  name: 'Group Administrator',
  level: HIERARCHY_LEVELS.MANAGEMENT,
  scope: PERMISSION_SCOPES.GROUP,
  permissions: new Set(['group:*']),
  children: new Set(['group_member']),
  metadata: {
    maxSubordinates: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

const manager = new RoleHierarchyManager();
manager.addRole(adminRole);
manager.addRole(groupAdminRole);
```

## 重要なポイント

1. 階層構造の実装
   - レベルによる明確な区分け
   - 権限の継承メカニズム
   - 循環参照の防止

2. スコープの管理
   - グローバル/グループ/個人の区分
   - レベルに応じた制限
   - 整合性の確保

3. 検証メカニズム
   - ロールの妥当性チェック
   - 階層関係の検証
   - スコープの整合性確認

4. 拡張性
   - 新しいレベルの追加が容易
   - カスタム権限の追加が可能
   - メタデータの柔軟な拡張

## 注意点

1. パフォーマンスへの考慮
   - 権限継承の計算コスト
   - キャッシュの必要性
   - 階層の深さ制限

2. セキュリティ
   - 権限の適切な制限
   - スコープの厳格な管理
   - 検証の確実な実施

3. 運用面
   - ロールの管理コスト
   - メンテナンスの容易さ
   - 監査の必要性