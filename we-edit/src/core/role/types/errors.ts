/**
 * @fileoverview Role システムのエラー型定義
 *
 * @ai_implementation
 * 機能: システムのエラー型と関連する定数を定義
 * 設計: 型安全なエラーハンドリングの実現
 */

/**
 * エラーコード定義
 */
export const ROLE_ERROR_CODES = {
  INVALID_ROLE_TYPE: 'ROLE.INVALID_TYPE',
  INVALID_PERMISSION: 'ROLE.INVALID_PERMISSION',
  HIERARCHY_VIOLATION: 'ROLE.HIERARCHY_VIOLATION',
  CIRCULAR_REFERENCE: 'ROLE.CIRCULAR_REFERENCE',
  PERMISSION_DENIED: 'ROLE.PERMISSION_DENIED',
  ROLE_NOT_FOUND: 'ROLE.NOT_FOUND',
  DUPLICATE_ROLE: 'ROLE.DUPLICATE',
  INVALID_OPERATION: 'ROLE.INVALID_OPERATION',
  MAX_DEPTH_EXCEEDED: 'ROLE.MAX_DEPTH_EXCEEDED',
  MAX_CHILDREN_EXCEEDED: 'ROLE.MAX_CHILDREN_EXCEEDED'
} as const;

export type RoleErrorCode = typeof ROLE_ERROR_CODES[keyof typeof ROLE_ERROR_CODES];

/**
 * 基本エラー型
 */
export type BaseError = {
  readonly message: string;
  readonly timestamp: Date;
  readonly details?: unknown;
  readonly stack?: string;
}

/**
 * エラー種別ごとの追加情報
 */
export type ValidationError = BaseError & {
  readonly code: typeof ROLE_ERROR_CODES.INVALID_ROLE_TYPE | typeof ROLE_ERROR_CODES.INVALID_PERMISSION;
  readonly validationErrors: ReadonlyArray<{
    readonly field: string;
    readonly message: string;
  }>;
}

export type HierarchyError = BaseError & {
  readonly code: typeof ROLE_ERROR_CODES.HIERARCHY_VIOLATION | typeof ROLE_ERROR_CODES.CIRCULAR_REFERENCE;
  readonly path: ReadonlyArray<string>;
}

export type PermissionError = BaseError & {
  readonly code: typeof ROLE_ERROR_CODES.PERMISSION_DENIED;
  readonly requiredPermission: string;
  readonly actualPermissions: ReadonlyArray<string>;
}

export type NotFoundError = BaseError & {
  readonly code: typeof ROLE_ERROR_CODES.ROLE_NOT_FOUND;
  readonly searchCriteria: Record<string, unknown>;
}

export type RoleError = ValidationError | HierarchyError | PermissionError | NotFoundError;

/**
 * エラーファクトリ関数
 */
const createBaseError = (message: string, details?: unknown): BaseError => ({
  message,
  timestamp: new Date(),
  details,
  stack: new Error().stack
});

export const createValidationError = (
  code: typeof ROLE_ERROR_CODES.INVALID_ROLE_TYPE | typeof ROLE_ERROR_CODES.INVALID_PERMISSION,
  message: string,
  validationErrors: ReadonlyArray<{ field: string; message: string }>
): ValidationError => ({
  ...createBaseError(message),
  code,
  validationErrors
});

export const createHierarchyError = (
  code: typeof ROLE_ERROR_CODES.HIERARCHY_VIOLATION | typeof ROLE_ERROR_CODES.CIRCULAR_REFERENCE,
  message: string,
  path: ReadonlyArray<string>
): HierarchyError => ({
  ...createBaseError(message),
  code,
  path
});

export const createPermissionError = (
  message: string,
  requiredPermission: string,
  actualPermissions: ReadonlyArray<string>
): PermissionError => ({
  ...createBaseError(message),
  code: ROLE_ERROR_CODES.PERMISSION_DENIED,
  requiredPermission,
  actualPermissions
});

export const createNotFoundError = (
  message: string,
  searchCriteria: Record<string, unknown>
): NotFoundError => ({
  ...createBaseError(message),
  code: ROLE_ERROR_CODES.ROLE_NOT_FOUND,
  searchCriteria
});

/**
 * 型ガード関数
 */
export const isValidationError = (error: RoleError): error is ValidationError => {
  return error.code === ROLE_ERROR_CODES.INVALID_ROLE_TYPE || 
         error.code === ROLE_ERROR_CODES.INVALID_PERMISSION;
};

export const isHierarchyError = (error: RoleError): error is HierarchyError => {
  return error.code === ROLE_ERROR_CODES.HIERARCHY_VIOLATION || 
         error.code === ROLE_ERROR_CODES.CIRCULAR_REFERENCE;
};

export const isPermissionError = (error: RoleError): error is PermissionError => {
  return error.code === ROLE_ERROR_CODES.PERMISSION_DENIED;
};

export const isNotFoundError = (error: RoleError): error is NotFoundError => {
  return error.code === ROLE_ERROR_CODES.ROLE_NOT_FOUND;
};

/**
 * @ai_decision
 * エラー型設計の改善:
 * 1. 共通のベース型を導入
 *    - BaseErrorを基底型として使用
 *    - 共通プロパティの重複を排除
 *
 * 2. Union型によるエラー表現
 *    - RoleErrorとして統合
 *    - 型安全な判別を実現
 *
 * 3. 型ガード関数の提供
 *    - エラー種別の安全な判別
 *    - コンパイル時の型チェック
 */