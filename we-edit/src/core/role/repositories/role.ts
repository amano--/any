/**
 * @fileoverview ロールリポジトリの実装
 *
 * @ai_implementation
 * 機能: ロールの永続化と取得を担当
 * 特徴: Result型による安全な実装
 */

import { Result, ok, err } from 'neverthrow';
import { RoleType, HierarchyLevel } from '../types/constants';
import { Role, RoleId } from '../types/types';
import { createRole } from '../models/role';
import {
  RoleError,
  createNotFoundError,
  ROLE_ERROR_CODES
} from '../types/errors';

/**
 * インメモリストレージ（実際の実装では適切なストレージに置き換え）
 */
const roleStore = new Map<RoleId, Role>();

/**
 * ロールリポジトリの実装
 */
export const RoleRepository = {
  /**
   * ロールの保存
   */
  save: async (role: Role): Promise<Result<void, RoleError>> => {
    try {
      roleStore.set(role.id, role);
      return ok(undefined);
    } catch (error) {
      return err(createNotFoundError(
        'Failed to save role',
        { roleId: role.id }
      ));
    }
  },

  /**
   * IDによるロールの取得
   */
  findById: async (id: RoleId): Promise<Result<Role, RoleError>> => {
    const role = roleStore.get(id);
    if (!role) {
      return err(createNotFoundError(
        `Role not found: ${id}`,
        { roleId: id }
      ));
    }
    return ok(role);
  },

  /**
   * タイプによるロールの取得
   */
  findByType: async (type: RoleType): Promise<Result<Role[], RoleError>> => {
    const roles = Array.from(roleStore.values())
      .filter(role => role.type === type);

    return ok(roles);
  },

  /**
   * レベルによるロールの取得
   */
  findByLevel: async (level: HierarchyLevel): Promise<Result<Role[], RoleError>> => {
    const roles = Array.from(roleStore.values())
      .filter(role => role.level === level);

    return ok(roles);
  },

  /**
   * ロールの削除
   */
  delete: async (id: RoleId): Promise<Result<void, RoleError>> => {
    if (!roleStore.has(id)) {
      return err(createNotFoundError(
        `Role not found for deletion: ${id}`,
        { roleId: id }
      ));
    }

    try {
      roleStore.delete(id);
      return ok(undefined);
    } catch (error) {
      return err(createNotFoundError(
        'Failed to delete role',
        { roleId: id }
      ));
    }
  },

  /**
   * 全ロールの取得
   */
  findAll: async (): Promise<Result<Role[], RoleError>> => {
    const roles = Array.from(roleStore.values());
    return ok(roles);
  },

  /**
   * 条件による検索
   */
  findBy: async (criteria: {
    types?: RoleType[];
    levels?: HierarchyLevel[];
    isActive?: boolean;
  }): Promise<Result<Role[], RoleError>> => {
    const roles = Array.from(roleStore.values()).filter(role => {
      if (criteria.types && !criteria.types.includes(role.type)) {
        return false;
      }
      if (criteria.levels && !criteria.levels.includes(role.level)) {
        return false;
      }
      if (criteria.isActive !== undefined && role.metadata.isActive !== criteria.isActive) {
        return false;
      }
      return true;
    });

    return ok(roles);
  }
};

/**
 * @ai_decision
 * 実装の特徴:
 * 1. Result型による安全な操作
 *    - すべての操作がResult型を返す
 *    - エラーの型安全な処理
 *
 * 2. 非同期対応
 *    - すべてのメソッドがasync
 *    - 将来の永続化層の変更に対応
 *
 * 3. 柔軟な検索
 *    - 複数の検索条件をサポート
 *    - 型安全な検索条件
 */