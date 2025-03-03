/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

import type { Group, CreateGroupInput, UpdateGroupInput } from '../types/group';

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

export type GroupResponse = ApiResponse<Group>;
export type GroupListResponse = ApiResponse<Group[]>;

export interface GroupApi {
  getGroups(): Promise<GroupListResponse>;
  getGroup(id: string): Promise<GroupResponse>;
  createGroup(input: CreateGroupInput): Promise<GroupResponse>;
  updateGroup(input: UpdateGroupInput): Promise<GroupResponse>;
  deleteGroup(id: string): Promise<GroupResponse>;
}

// レスポンスの型ガード
export const isSuccessResponse = <T>(
  response: ApiResponse<T>
): response is { success: true; data: T } => {
  return response.success;
};