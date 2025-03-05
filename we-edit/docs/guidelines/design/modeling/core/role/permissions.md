# 権限システムの設計ガイドライン

## 概要

本ドキュメントでは、システム全体の権限管理の設計原則と実装方針について詳細に説明します。

## 権限の階層構造

### 1. システム権限（System Permissions）

```typescript
const SYSTEM_PERMISSIONS = {
  MANAGE_SYSTEM: 'system:manage',
  MANAGE_SECURITY: 'system:security',
  MANAGE_BACKUP: 'system:backup',
  AUDIT_SYSTEM: 'system:audit'
} as const;

type SystemPermission = typeof SYSTEM_PERMISSIONS[keyof typeof SYSTEM_PERMISSIONS];
```

### 2. 管理権限（Management Permissions）

```typescript
const MANAGEMENT_PERMISSIONS = {
  MANAGE_STAFF: 'management:staff',
  MANAGE_GROUPS: 'management:groups',
  MANAGE_POLICIES: 'management:policies',
  MANAGE_CONTENT: 'management:content'
} as const;

type ManagementPermission = typeof MANAGEMENT_PERMISSIONS[keyof typeof MANAGEMENT_PERMISSIONS];
```

### 3. 運用権限（Operational Permissions）

```typescript
const OPERATIONAL_PERMISSIONS = {
  MANAGE_TAGS: 'operational:tags',
  MANAGE_CATEGORIES: 'operational:categories',
  MODERATE_CONTENT: 'operational:moderate',
  SUPPORT_USERS: 'operational:support'
} as const;

type OperationalPermission = typeof OPERATIONAL_PERMISSIONS[keyof typeof OPERATIONAL_PERMISSIONS];
```

## 権限の粒度

### 1. コンテキスト別権限

```typescript
const CONTEXTS = {
  BOOKMARK: 'bookmark',
  ARTICLE: 'article',
  NEWSPAPER: 'newspaper',
  SYSTEM: 'system'
} as const;

type Context = typeof CONTEXTS[keyof typeof CONTEXTS];

const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  MANAGE: 'manage'
} as const;

type Action = typeof ACTIONS[keyof typeof ACTIONS];

type ContextPermission = {
  context: Context;
  actions: Action[];
  scope: 'all' | 'group' | 'own';
}
```

### 2. リソースレベル権限

```typescript
type ResourcePermission = {
  resource: string;
  actions: Action[];
  conditions?: {
    ownership?: boolean;
    groupMembership?: boolean;
    maxItems?: number;
  };
}
```

## 権限チェックの実装

### 1. 権限チェック関数

```typescript
interface PermissionChecker {
  hasPermission(
    user: User,
    permission: Permission,
    resource?: any
  ): Promise<boolean>;

  getAllowedActions(
    user: User,
    context: Context,
    resource?: any
  ): Promise<Action[]>;
}
```

### 2. デコレータの活用

```typescript
type PermissionRequirement = {
  context: Context;
  action: Action;
  scope: 'all' | 'group' | 'own';
}

const RequirePermission = (requirement: PermissionRequirement) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 実装
  };
}
```

## 権限のキャッシュと最適化

### 1. キャッシュ戦略

```typescript
type PermissionCache = {
  key: string;        // "userId:context:action"
  value: boolean;     // 権限の有無
  expires: number;    // キャッシュの有効期限
}
```

### 2. バッチ処理

```typescript
type BatchPermissionCheck = {
  permissions: Permission[];
  resources?: any[];
  results: boolean[];
}
```

## セキュリティ考慮事項

### 1. 監査ログ

```typescript
type PermissionAuditLog = {
  timestamp: Date;
  user: User;
  action: Action;
  resource: string;
  result: boolean;
  reason?: string;
}
```

### 2. 異常検知

```typescript
const ANOMALY_TYPES = {
  UNAUTHORIZED_ATTEMPT: 'unauthorized_attempt',
  EXCESSIVE_REQUESTS: 'excessive_requests',
  PATTERN_CHANGE: 'pattern_change'
} as const;

type AnomalyType = typeof ANOMALY_TYPES[keyof typeof ANOMALY_TYPES];

const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

type SeverityLevel = typeof SEVERITY_LEVELS[keyof typeof SEVERITY_LEVELS];

type PermissionAnomaly = {
  type: AnomalyType;
  severity: SeverityLevel;
  details: any;
}
```

## 実装例

### 1. 基本的な権限チェック

```typescript
class PermissionService implements PermissionChecker {
  async hasPermission(
    user: User,
    permission: Permission,
    resource?: any
  ): Promise<boolean> {
    // 1. ロールベースのチェック
    const hasRole = await this.checkRole(user, permission);
    if (!hasRole) return false;

    // 2. コンテキストベースのチェック
    const hasContext = await this.checkContext(user, permission, resource);
    if (!hasContext) return false;

    // 3. 条件付きチェック
    return this.checkConditions(user, permission, resource);
  }
}
```

### 2. 権限の集約

```typescript
class PermissionAggregator {
  async aggregatePermissions(user: User): Promise<Permission[]> {
    const roles = await this.getRoles(user);
    const permissions = new Set<Permission>();

    for (const role of roles) {
      const rolePermissions = await this.getRolePermissions(role);
      rolePermissions.forEach(p => permissions.add(p));
    }

    return Array.from(permissions);
  }
}
```

## ベストプラクティス

1. 権限の粒度
   - 必要以上に細かく分割しない
   - 関連する権限をグループ化
   - 一貫性のある命名規則

2. パフォーマンス
   - 効果的なキャッシュ戦略
   - バッチ処理の活用
   - 非同期処理の適切な使用

3. セキュリティ
   - 定期的な権限の見直し
   - 監査ログの保持
   - 異常検知の実装

## 更新履歴

- 2025-03-06: 初版作成
  - 権限システムの基本構造の定義
  - 実装例とベストプラクティスの追加
  - セキュリティ考慮事項の詳細化
- 2025-03-06: enumをtype constに変更
  - より型安全な実装に修正
  - const assertionの活用