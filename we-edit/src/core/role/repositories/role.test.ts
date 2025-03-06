/**
 * @fileoverview ロールリポジトリのテスト
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { RoleRepository } from './role';
import {
  ROLE_TYPES,
  HIERARCHY_LEVELS,
  PERMISSION_SCOPES,
  ACTION_TYPES,
  CONTEXT_TYPES
} from '../types/constants';
import type { Permission, Role } from '../types/types';
import { createRole } from '../models/role';

describe('Role Repository', () => {
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

  beforeEach(async () => {
    // 既存のデータをクリア
    const roles = await RoleRepository.findAll();
    if (!roles.isOk()) return;
    
    await Promise.all(roles.value.map(role => {
      return RoleRepository.delete(role.id).then(result => {
        if (!result.isOk()) {
          throw new Error(`Failed to delete role: ${role.id}`);
        }
      });
    }));
  });

  describe('save and find', () => {
    test('ロールの保存と取得が正常に動作する', async () => {
      // 1. ロールの作成
      const roleResult = createRole(baseRoleParams);
      if (!roleResult.isOk()) {
        throw new Error('Failed to create role');
      }
      const role = roleResult.value;

      // 2. ロールの保存
      const saveResult = await RoleRepository.save(role);
      if (!saveResult.isOk()) {
        throw new Error('Failed to save role');
      }

      // 3. IDによる取得
      const findByIdResult = await RoleRepository.findById(role.id);
      if (!findByIdResult.isOk()) {
        throw new Error('Failed to find role by ID');
      }
      const foundById = findByIdResult.value;
      expect(foundById.id).toBe(role.id);
      expect(foundById.type).toBe(role.type);

      // 4. タイプによる取得
      const findByTypeResult = await RoleRepository.findByType(ROLE_TYPES.MEMBER);
      if (!findByTypeResult.isOk()) {
        throw new Error('Failed to find role by type');
      }
      const foundByType = findByTypeResult.value;
      expect(foundByType.length).toBeGreaterThan(0);
      expect(foundByType[0]?.type).toBe(ROLE_TYPES.MEMBER);

      // 5. レベルによる取得
      const findByLevelResult = await RoleRepository.findByLevel(HIERARCHY_LEVELS.BASIC);
      if (!findByLevelResult.isOk()) {
        throw new Error('Failed to find role by level');
      }
      const foundByLevel = findByLevelResult.value;
      expect(foundByLevel.length).toBeGreaterThan(0);
      expect(foundByLevel[0]?.level).toBe(HIERARCHY_LEVELS.BASIC);
    });

    test('存在しないIDの検索はエラーを返す', async () => {
      const findResult = await RoleRepository.findById('non_existent_id');
      expect(findResult.isErr()).toBe(true);
    });
  });

  describe('delete', () => {
    test('ロールの削除が正常に動作する', async () => {
      // 1. ロールの作成と保存
      const roleResult = createRole(baseRoleParams);
      if (!roleResult.isOk()) {
        throw new Error('Failed to create role');
      }
      const role = roleResult.value;

      const saveResult = await RoleRepository.save(role);
      if (!saveResult.isOk()) {
        throw new Error('Failed to save role');
      }

      // 2. ロールの削除
      const deleteResult = await RoleRepository.delete(role.id);
      expect(deleteResult.isOk()).toBe(true);

      // 3. 削除後の検証
      const findResult = await RoleRepository.findById(role.id);
      expect(findResult.isErr()).toBe(true);
    });
  });

  describe('findBy', () => {
    test('複数条件での検索が正常に動作する', async () => {
      // 1. ロールの作成と保存
      const roleResult = createRole(baseRoleParams);
      if (!roleResult.isOk()) {
        throw new Error('Failed to create role');
      }
      const role = roleResult.value;

      const saveResult = await RoleRepository.save(role);
      if (!saveResult.isOk()) {
        throw new Error('Failed to save role');
      }

      // 2. 複数条件での検索
      const findResult = await RoleRepository.findBy({
        types: [ROLE_TYPES.MEMBER],
        levels: [HIERARCHY_LEVELS.BASIC],
        isActive: true
      });
      if (!findResult.isOk()) {
        throw new Error('Failed to find role by criteria');
      }

      const foundRoles = findResult.value;
      expect(foundRoles.length).toBeGreaterThan(0);

      const foundRole = foundRoles[0];
      if (!foundRole) {
        throw new Error('No role found');
      }

      expect(foundRole.type).toBe(ROLE_TYPES.MEMBER);
      expect(foundRole.level).toBe(HIERARCHY_LEVELS.BASIC);
      expect(foundRole.metadata.isActive).toBe(true);
    });
  });
});