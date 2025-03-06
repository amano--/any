/**
 * @fileoverview ロールファクトリの実装
 *
 * @ai_implementation
 * 機能: ロールインスタンスの生成を担当
 * 特徴: 不変性と型安全性を確保
 */

import { Result, ok, err } from 'neverthrow';
import {
  Role,
  RoleMetadata,
  Permission,
  RoleId,
  UserId
} from '../types/types';
import { RoleType, HierarchyLevel } from '../types/constants';
import {
  createValidationError,
  RoleError,
  ROLE_ERROR_CODES
} from '../types/errors';

/**
 * ロール生成に必要なパラメータ
 */
export type RoleParams = {
  readonly type: RoleType;
  readonly level: HierarchyLevel;
  readonly permissions: ReadonlyArray<Permission>;
  readonly createdBy: UserId;
}

/**
 * ロール生成のためのファクトリ関数
 */
export const createRole = (params: RoleParams): Result<Role, RoleError> => {
  // 1. バリデーション
  const validationErrors = validateRoleParams(params);
  if (validationErrors.length > 0) {
    return err(createValidationError(
      ROLE_ERROR_CODES.INVALID_ROLE_TYPE,
      'Invalid role parameters',
      validationErrors
    ));
  }

  // 2. メタデータの生成
  const metadata: RoleMetadata = {
    version: 1,
    isActive: true,
    lastModifiedBy: params.createdBy,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // 3. ロールの生成
  const role: Role = {
    id: generateRoleId(),
    type: params.type,
    level: params.level,
    permissions: new Set(params.permissions),
    metadata,

    // メソッド実装
    hasPermission: (permission: Permission): boolean => {
      return hasPermissionImpl(role.permissions, permission);
    },

    canManage: (other: Role): boolean => {
      return canManageImpl(role, other);
    },

    equals: (other: Role): boolean => {
      return equalsImpl(role, other);
    }
  };

  return ok(role);
};

/**
 * 実装詳細
 */

// バリデーション
const validateRoleParams = (params: RoleParams): ReadonlyArray<{ field: string; message: string }> => {
  const errors: Array<{ field: string; message: string }> = [];

  // 必須チェック
  if (!params.type) {
    errors.push({ field: 'type', message: 'Role type is required' });
  }
  if (typeof params.level !== 'number') {
    errors.push({ field: 'level', message: 'Role level must be a number' });
  }
  if (!Array.isArray(params.permissions)) {
    errors.push({ field: 'permissions', message: 'Permissions must be an array' });
  }
  if (!params.createdBy) {
    errors.push({ field: 'createdBy', message: 'Creator ID is required' });
  }

  // 権限の重複チェック
  const permissionIds = new Set<string>();
  params.permissions.forEach(permission => {
    if (permissionIds.has(permission.id)) {
      errors.push({ field: 'permissions', message: `Duplicate permission ID: ${permission.id}` });
    }
    permissionIds.add(permission.id);
  });

  return errors;
};

// ID生成
const generateRoleId = (): RoleId => {
  return `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 権限チェック
const hasPermissionImpl = (
  permissions: Set<Permission>,
  permission: Permission
): boolean => {
  return Array.from(permissions).some(p => 
    p.context === permission.context &&
    p.action === permission.action &&
    p.scope === permission.scope
  );
};

// 管理権限チェック
const canManageImpl = (role: Role, other: Role): boolean => {
  // 1. レベルチェック
  if (role.level >= other.level) {
    return false;
  }

  // 2. スコープチェック
  const hasManagePermission = Array.from(role.permissions).some(p =>
    p.action === 'manage' && p.scope === 'global'
  );

  return hasManagePermission;
};

// 同値性チェック
const equalsImpl = (role: Role, other: Role): boolean => {
  return role.id === other.id;
};

/**
 * @ai_decision
 * 実装の特徴:
 * 1. 不変性の確保
 *    - readonlyの活用
 *    - Set型による重複防止
 *    - メソッドの実装を内部関数として分離
 *
 * 2. 型安全性
 *    - Result型によるエラーハンドリング
 *    - 厳密なバリデーション
 *    - 明示的な型定義
 *
 * 3. カプセル化
 *    - 内部実装の隠蔽
 *    - ファクトリパターンの採用
 */