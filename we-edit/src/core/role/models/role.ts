/**
 * @fileoverview ロールモデルの実装
 *
 * @ai_implementation
 * 機能: ロールのドメインロジックを関数として実装
 * 特徴: 不変性と純粋関数による実装
 */

import { Result, ok, err } from 'neverthrow';
import {
  Permission,
  PermissionSet,
  Role,
  RoleMetadata,
  RoleId,
} from '../types/types';
import { RoleType, HierarchyLevel } from '../types/constants';
import {
  RoleError,
  createValidationError,
  ROLE_ERROR_CODES
} from '../types/errors';

/**
 * 定数定義
 */
const MAX_PERMISSIONS = 100;
const MAX_DEPTH = 5;

/**
 * ロール生成
 */
export const createRole = (params: {
  id: RoleId;
  type: RoleType;
  level: HierarchyLevel;
  permissions: PermissionSet;
  metadata: RoleMetadata;
}): Result<Role, RoleError> => {
  // 1. 権限数の制限チェック
  if (params.permissions.size > MAX_PERMISSIONS) {
    return err(createValidationError(
      ROLE_ERROR_CODES.INVALID_PERMISSION,
      `Maximum number of permissions (${MAX_PERMISSIONS}) exceeded`,
      [{ field: 'permissions', message: 'Too many permissions' }]
    ));
  }

  // 2. ロールオブジェクトの生成
  const role: Role = {
    id: params.id,
    type: params.type,
    level: params.level,
    permissions: params.permissions,
    metadata: params.metadata,
    hasPermission: (permission) => hasPermission(params.permissions, permission),
    canManage: (other) => canManage(params, other),
    equals: (other) => equals(params.id, other.id)
  };

  return ok(role);
};

/**
 * 権限チェック
 */
export const hasPermission = (
  permissions: PermissionSet,
  permission: Permission
): boolean => {
  return Array.from(permissions).some(p => 
    p.context === permission.context &&
    p.action === permission.action &&
    (p.scope === permission.scope || p.scope === 'global')
  );
};

/**
 * 管理権限チェック
 */
export const canManage = (
  role: {
    level: HierarchyLevel;
    permissions: PermissionSet;
  },
  other: Role
): boolean => {
  // 1. レベルチェック
  if (role.level >= other.level) {
    return false;
  }

  // 2. グローバル権限チェック
  if (hasGlobalManagePermission(role.permissions)) {
    return true;
  }

  // 3. スコープチェック
  return hasManagePermissionForScope(role.permissions);
};

/**
 * 同値性チェック
 */
export const equals = (roleId: RoleId, otherId: RoleId): boolean => {
  return roleId === otherId;
};

/**
 * 権限の追加
 */
export const addPermission = (
  role: Role,
  permission: Permission
): Result<Role, RoleError> => {
  // 1. 制限チェック
  if (role.permissions.size >= MAX_PERMISSIONS) {
    return err(createValidationError(
      ROLE_ERROR_CODES.INVALID_PERMISSION,
      `Cannot add more permissions. Maximum (${MAX_PERMISSIONS}) reached`,
      [{ field: 'permissions', message: 'Permission limit exceeded' }]
    ));
  }

  // 2. 新しい権限セットの作成
  const newPermissions = new Set(role.permissions);
  newPermissions.add(permission);

  // 3. 新しいロールの生成
  return createRole({
    ...role,
    permissions: newPermissions,
    metadata: {
      ...role.metadata,
      updatedAt: new Date()
    }
  });
};

/**
 * 権限の削除
 */
export const removePermission = (
  role: Role,
  permissionId: string
): Result<Role, RoleError> => {
  // 1. 新しい権限セットの作成
  const newPermissions = new Set(
    Array.from(role.permissions).filter(p => p.id !== permissionId)
  );

  // 2. 新しいロールの生成
  return createRole({
    ...role,
    permissions: newPermissions,
    metadata: {
      ...role.metadata,
      updatedAt: new Date()
    }
  });
};

/**
 * ヘルパー関数
 */
const hasGlobalManagePermission = (permissions: PermissionSet): boolean => {
  return Array.from(permissions).some(p => 
    p.action === 'manage' && p.scope === 'global'
  );
};

const hasManagePermissionForScope = (permissions: PermissionSet): boolean => {
  return Array.from(permissions).some(p => 
    p.action === 'manage' && (
      p.scope === 'global' ||
      p.scope === 'group'
    )
  );
};

/**
 * @ai_decision
 * 実装の特徴:
 * 1. 型エラーの修正
 *    - 適切なエラーコードの使用
 *    - メタデータの型整合性確保
 *    - 条件チェックの単純化
 *
 * 2. 純粋関数による実装
 *    - クラスの代わりに関数を使用
 *    - 副作用のない実装
 *    - テスト容易性の向上
 *
 * 3. 型安全性
 *    - Result型によるエラーハンドリング
 *    - 厳密な型定義
 *    - readonly修飾子の活用
 */