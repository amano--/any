/**
 * @fileoverview Role システムの型定義
 *
 * @ai_implementation
 * 機能: システムの型定義を提供
 * 設計: 不変性と型安全性を重視
 */

import { Result } from 'neverthrow';
import {
  RoleType,
  HierarchyLevel,
  PermissionScope,
  ContextType,
  ActionType
} from './constants';

/**
 * 基本的なID型
 */
export type RoleId = string;
export type UserId = string;
export type GroupId = string;

/**
 * タイムスタンプ情報
 */
export type Timestamp = {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * メタデータ
 */
export type RoleMetadata = Timestamp & {
  readonly version: number;
  readonly isActive: boolean;
  readonly lastModifiedBy: UserId;
}

/**
 * 権限の定義
 */
export type Permission = {
  readonly id: string;
  readonly context: ContextType;
  readonly action: ActionType;
  readonly scope: PermissionScope;
  readonly conditions?: {
    readonly groupId?: GroupId;
    readonly resources?: string[];
    readonly maxItems?: number;
    readonly timeLimit?: Date;
  };
}

export type PermissionSet = Set<Permission>;

/**
 * ロール定義
 */
export type Role = {
  readonly id: RoleId;
  readonly type: RoleType;
  readonly level: HierarchyLevel;
  readonly permissions: PermissionSet;
  readonly metadata: RoleMetadata;

  // メソッドは実装クラスで提供
  hasPermission: (permission: Permission) => boolean;
  canManage: (other: Role) => boolean;
  equals: (other: Role) => boolean;
}

/**
 * ロールファクトリ
 */
export type RoleFactory = {
  create: (params: {
    type: RoleType;
    level: HierarchyLevel;
    permissions: Permission[];
    createdBy: UserId;
  }) => Result<Role, Error>;

  createFromTemplate: (
    templateId: string,
    modifications?: Partial<Permission>[]
  ) => Result<Role, Error>;
}

/**
 * ロールマネージャ
 */
export type RoleManager = {
  getRole: (id: RoleId) => Promise<Result<Role, Error>>;
  getRolesByType: (type: RoleType) => Promise<Result<Role[], Error>>;
  getRolesByLevel: (level: HierarchyLevel) => Promise<Result<Role[], Error>>;
  
  assignRole: (userId: UserId, roleId: RoleId) => Promise<Result<void, Error>>;
  removeRole: (userId: UserId, roleId: RoleId) => Promise<Result<void, Error>>;
  
  hasPermission: (
    userId: UserId,
    permission: Permission
  ) => Promise<Result<boolean, Error>>;

  validateHierarchy: (roles: Role[]) => Promise<Result<boolean, Error>>;
}

/**
 * ロールリポジトリ
 */
export type RoleRepository = {
  save: (role: Role) => Promise<Result<void, Error>>;
  findById: (id: RoleId) => Promise<Result<Role, Error>>;
  findByType: (type: RoleType) => Promise<Result<Role[], Error>>;
  findByLevel: (level: HierarchyLevel) => Promise<Result<Role[], Error>>;
  delete: (id: RoleId) => Promise<Result<void, Error>>;
}

/**
 * ロール階層構造
 */
export type RoleHierarchy = {
  readonly role: Role;
  readonly children: RoleHierarchy[];
}

/**
 * ロール検証結果
 */
export type RoleValidationResult = {
  readonly isValid: boolean;
  readonly errors: ReadonlyArray<{
    readonly code: string;
    readonly message: string;
    readonly path?: string;
  }>;
}

/**
 * @ai_decision
 * 型定義の特徴:
 * 1. interfaceではなくtype使用
 * 2. readonlyによる不変性の保証
 * 3. Result型による型安全なエラーハンドリング
 * 4. メソッドは実装クラスで提供
 */