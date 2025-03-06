/**
 * @fileoverview Role システムのパブリックAPI
 * 
 * @ai_implementation
 * 機能: 外部に公開するAPIの定義
 */

// Types
export type {
  Role,
  RoleId,
  Permission,
  PermissionSet,
  RoleMetadata,
} from './types/types';

export {
  ROLE_ERROR_CODES,
  type RoleError,
  type ValidationError,
  type HierarchyError,
  type PermissionError,
  type NotFoundError,
  isValidationError,
  isHierarchyError,
  isPermissionError,
  isNotFoundError,
} from './types/errors';

export {
  ROLE_TYPES,
  type RoleType,
  PERMISSION_SCOPES,
  type PermissionScope,
  HIERARCHY_LEVELS,
  type HierarchyLevel,
  ACTION_TYPES,
  type ActionType,
  CONTEXT_TYPES,
  type ContextType,
} from './types/constants';

// Core functionality
export {
  createRole,
  addPermission,
  removePermission,
  hasPermission,
  canManage,
  equals,
} from './models/role';

// Repository
export { RoleRepository } from './repositories/role';

/**
 * @ai_decision
 * 公開API設計の特徴:
 * 1. 必要最小限の公開
 *    - 内部実装の隠蔽
 *    - 型定義の公開
 *    - 主要機能の公開
 *
 * 2. 型安全性の確保
 *    - 明示的な型のエクスポート
 *    - 型ガード関数の提供
 *
 * 3. モジュール構造の明確化
 *    - 論理的なグループ分け
 *    - 関連する型・関数のまとめ
 */