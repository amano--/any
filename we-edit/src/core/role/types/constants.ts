/**
 * @fileoverview Role システムの定数定義
 *
 * @ai_implementation
 * 機能: システム全体で使用する役割と権限に関する定数を定義
 * 設計: type constを使用して型安全性を確保
 */

/**
 * 役割タイプの定義
 */
export const ROLE_TYPES = {
  SYSTEM_ADMIN: 'system_admin',
  DEVELOPMENT_STAFF: 'development_staff',
  STAFF_MANAGER: 'staff_manager',
  STAFF: 'staff',
  GROUP_ADMIN: 'group_admin',
  GROUP_OPERATOR: 'group_operator',
  MEMBER: 'member'
} as const;

export type RoleType = typeof ROLE_TYPES[keyof typeof ROLE_TYPES];

/**
 * 権限スコープの定義
 */
export const PERMISSION_SCOPES = {
  GLOBAL: 'global',
  GROUP: 'group',
  PERSONAL: 'personal'
} as const;

export type PermissionScope = typeof PERMISSION_SCOPES[keyof typeof PERMISSION_SCOPES];

/**
 * 階層レベルの定義
 */
export const HIERARCHY_LEVELS = {
  SYSTEM: 0,
  MANAGEMENT: 1,
  OPERATION: 2,
  BASIC: 3
} as const;

export type HierarchyLevel = typeof HIERARCHY_LEVELS[keyof typeof HIERARCHY_LEVELS];

/**
 * アクション種別の定義
 */
export const ACTION_TYPES = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  APPROVE: 'approve'
} as const;

export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

/**
 * コンテキスト種別の定義
 */
export const CONTEXT_TYPES = {
  BOOKMARK: 'bookmark',
  ARTICLE: 'article',
  NEWSPAPER: 'newspaper',
  GROUP: 'group',
  SYSTEM: 'system'
} as const;

export type ContextType = typeof CONTEXT_TYPES[keyof typeof CONTEXT_TYPES];

/**
 * @ai_decision
 * type constの使用理由:
 * 1. Union型の自動生成
 * 2. IDE補完のサポート
 * 3. 型安全性の確保
 * 4. ランタイムでの定数値の利用
 */