# シンプルなRole実装例

## 基本実装

```typescript
// 役割の種類を定義
const ROLE_TYPES = {
  SYSTEM_ADMIN: 'system_admin',
  STAFF: 'staff',
  MEMBER: 'member'
} as const;

type RoleType = typeof ROLE_TYPES[keyof typeof ROLE_TYPES];

// 基本的な権限を定義
const BASIC_PERMISSIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete'
} as const;

type BasicPermission = typeof BASIC_PERMISSIONS[keyof typeof BASIC_PERMISSIONS];

// ロールの実装
type Role = {
  type: RoleType;
  permissions: BasicPermission[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

// ロールファクトリ
const createRole = (
  type: RoleType,
  permissions: BasicPermission[],
  createdBy: string
): Role => ({
  type,
  permissions,
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy
  }
});
```

## 使用例

```typescript
// システム管理者ロールの作成
const adminRole = createRole(
  ROLE_TYPES.SYSTEM_ADMIN,
  Object.values(BASIC_PERMISSIONS),
  'system'
);

// 一般会員ロールの作成
const memberRole = createRole(
  ROLE_TYPES.MEMBER,
  [BASIC_PERMISSIONS.VIEW],
  'system'
);

// 権限チェック関数
const hasPermission = (
  role: Role,
  permission: BasicPermission
): boolean => role.permissions.includes(permission);

// 使用例
console.log(hasPermission(adminRole, BASIC_PERMISSIONS.DELETE)); // true
console.log(hasPermission(memberRole, BASIC_PERMISSIONS.DELETE)); // false
```

## 重要なポイント

1. type constの使用
   - enumの代わりにconst assertionを使用
   - 型安全性の確保
   - IDE補完のサポート

2. 明確な型定義
   - RoleType型の定義
   - BasicPermission型の定義
   - Role型の構造化

3. ファクトリパターン
   - createRole関数による一貫した生成
   - メタデータの自動付与
   - 再利用性の向上

4. シンプルな権限チェック
   - 単純な配列インクルード
   - パフォーマンスを考慮
   - 拡張性を確保

## 注意点

1. このシンプルな実装は以下の場合に適しています：
   - 小規模なアプリケーション
   - 単純な権限構造
   - 高速な権限チェックが必要な場合

2. より複雑なシステムでは以下の拡張が必要：
   - 階層構造の導入
   - 詳細な権限管理
   - キャッシュ戦略