/**
 * @fileoverview Roleモデルのテスト
 */

import { describe, test, expect } from 'vitest';
import {
  createRole,
  addPermission,
  removePermission,
  hasPermission,
  canManage,
  equals
} from './role';
import {
  ROLE_TYPES,
  HIERARCHY_LEVELS,
  PERMISSION_SCOPES,
  ACTION_TYPES,
  CONTEXT_TYPES
} from '../types/constants';
import type { Permission, Role } from '../types/types';

describe('Role Model', () => {
  // テスト用のデータ
  const testPermission: Permission = {
    id: 'test_permission',
    context: CONTEXT_TYPES.BOOKMARK,
    action: ACTION_TYPES.VIEW,
    scope: PERMISSION_SCOPES.PERSONAL
  };

  const baseRoleParams = {
    id: 'test_role',
    type: ROLE_TYPES.MEMBER,
    level: HIERARCHY_LEVELS.BASIC,
    permissions: new Set([testPermission]),
    metadata: {
      version: 1,
      isActive: true,
      lastModifiedBy: 'test_user',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  describe('createRole', () => {
    test('有効なパラメータで正常にロールを作成できる', () => {
      const result = createRole(baseRoleParams);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const role = result.value;
        expect(role.id).toBe(baseRoleParams.id);
        expect(role.type).toBe(baseRoleParams.type);
        expect(role.level).toBe(baseRoleParams.level);
        expect(role.permissions.size).toBe(1);
      }
    });

    test('権限数の制限を超えた場合エラーを返す', () => {
      const manyPermissions = new Set(
        Array(101).fill(0).map((_, i) => ({
          ...testPermission,
          id: `permission_${i}`
        }))
      );
      const result = createRole({
        ...baseRoleParams,
        permissions: manyPermissions
      });
      expect(result.isErr()).toBe(true);
    });
  });

  describe('addPermission', () => {
    test('新しい権限を追加できる', async () => {
      const roleResult = createRole(baseRoleParams);
      expect(roleResult.isOk()).toBe(true);
      if (roleResult.isOk()) {
        const role = roleResult.value;
        const newPermission: Permission = {
          id: 'new_permission',
          context: CONTEXT_TYPES.ARTICLE,
          action: ACTION_TYPES.CREATE,
          scope: PERMISSION_SCOPES.GROUP
        };

        const result = addPermission(role, newPermission);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.permissions.size).toBe(2);
          expect(result.value.metadata.updatedAt > role.metadata.updatedAt).toBe(true);
        }
      }
    });
  });

  describe('removePermission', () => {
    test('既存の権限を削除できる', async () => {
      const roleResult = createRole(baseRoleParams);
      expect(roleResult.isOk()).toBe(true);
      if (roleResult.isOk()) {
        const role = roleResult.value;
        const result = removePermission(role, testPermission.id);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.permissions.size).toBe(0);
          expect(result.value.metadata.updatedAt > role.metadata.updatedAt).toBe(true);
        }
      }
    });
  });

  describe('hasPermission', () => {
    test('持っている権限に対してtrueを返す', async () => {
      const roleResult = createRole(baseRoleParams);
      expect(roleResult.isOk()).toBe(true);
      if (roleResult.isOk()) {
        const role = roleResult.value;
        expect(role.hasPermission(testPermission)).toBe(true);
      }
    });

    test('持っていない権限に対してfalseを返す', async () => {
      const roleResult = createRole(baseRoleParams);
      expect(roleResult.isOk()).toBe(true);
      if (roleResult.isOk()) {
        const role = roleResult.value;
        const otherPermission: Permission = {
          id: 'other_permission',
          context: CONTEXT_TYPES.ARTICLE,
          action: ACTION_TYPES.DELETE,
          scope: PERMISSION_SCOPES.GROUP
        };
        expect(role.hasPermission(otherPermission)).toBe(false);
      }
    });
  });

  describe('canManage', () => {
    test('より低いレベルのロールを管理できる', async () => {
      const adminRoleResult = createRole({
        ...baseRoleParams,
        type: ROLE_TYPES.SYSTEM_ADMIN,
        level: HIERARCHY_LEVELS.SYSTEM
      });

      const memberRoleResult = createRole(baseRoleParams);

      expect(adminRoleResult.isOk() && memberRoleResult.isOk()).toBe(true);
      if (adminRoleResult.isOk() && memberRoleResult.isOk()) {
        expect(adminRoleResult.value.canManage(memberRoleResult.value)).toBe(true);
      }
    });

    test('同じまたは高いレベルのロールは管理できない', async () => {
      const role1Result = createRole(baseRoleParams);
      const role2Result = createRole(baseRoleParams);

      expect(role1Result.isOk() && role2Result.isOk()).toBe(true);
      if (role1Result.isOk() && role2Result.isOk()) {
        expect(role1Result.value.canManage(role2Result.value)).toBe(false);
      }
    });
  });

  describe('equals', () => {
    test('同じIDのロールは等しい', async () => {
      const role1Result = createRole(baseRoleParams);
      const role2Result = createRole(baseRoleParams);

      expect(role1Result.isOk() && role2Result.isOk()).toBe(true);
      if (role1Result.isOk() && role2Result.isOk()) {
        expect(role1Result.value.equals(role2Result.value)).toBe(true);
      }
    });

    test('異なるIDのロールは等しくない', async () => {
      const role1Result = createRole(baseRoleParams);
      const role2Result = createRole({
        ...baseRoleParams,
        id: 'different_id'
      });

      expect(role1Result.isOk() && role2Result.isOk()).toBe(true);
      if (role1Result.isOk() && role2Result.isOk()) {
        expect(role1Result.value.equals(role2Result.value)).toBe(false);
      }
    });
  });
});