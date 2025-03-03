# tRPCを意識したモックAPIの実装手順

## 概要

フロントエンド開発初期にモックAPIを作成する際、後にtRPCで実装することを想定した設計・実装方法をまとめます。
この手順に従うことで、本実装への移行をスムーズに行うことができます。

## 1. 型定義の作成

### 1.1. 基本データ型の定義

tRPCのルーターで使用する型と同じ構造を持つ型を定義します。

```typescript
// types/group.ts
export type Group = {
  id: string;
  name: string;
  // ...その他のフィールド
};

// 入力型の定義
export type CreateGroupInput = Omit<Group, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGroupInput = Partial<CreateGroupInput> & { id: string };
```

### 1.2. レスポンス型の定義

tRPCの戻り値の型と一致するように定義します。

```typescript
export type GroupResponse = {
  success: true;
  data: Group;
} | {
  success: false;
  error: string;
};

export type GroupListResponse = {
  success: true;
  data: Group[];
} | {
  success: false;
  error: string;
};
```

## 2. バリデーションスキーマの作成

tRPCのinputバリデーションと同じスキーマを使用します。

```typescript
import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(1).max(500),
  // ...
});

// 型の抽出（tRPCのinput型と一致）
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
```

## 3. APIインターフェースの設計

tRPCルーターのメソッドと1:1で対応するようにインターフェースを設計します。

```typescript
type GroupApi {
  getGroups(): Promise<GroupListResponse>;
  getGroup(id: string): Promise<GroupResponse>;
  createGroup(input: CreateGroupInput): Promise<GroupResponse>;
  updateGroup(input: UpdateGroupInput): Promise<GroupResponse>;
  deleteGroup(id: string): Promise<GroupResponse>;
}
```

## 4. モックAPIの実装

### 4.1. データストアの作成

```typescript
let mockGroups: Group[] = [/* 初期データ */];
```

### 4.2. APIメソッドの実装

```typescript
export const mockGroupApi: GroupApi = {
  // tRPCのquery/mutationと同じシグネチャ
  async getGroups() {
    await simulateLatency();
    return {
      success: true,
      data: mockGroups
    };
  },

  async createGroup(input) {
    await simulateLatency();
    try {
      // バリデーション（tRPCと同じスキーマを使用）
      const validated = createGroupSchema.parse(input);
      
      const newGroup: Group = {
        id: generateId(),
        ...validated,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockGroups = [...mockGroups, newGroup];
      
      return {
        success: true,
        data: newGroup
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  },
  // ...他のメソッド
};
```

## 5. エラーハンドリング

tRPCのエラーハンドリングと同じパターンを採用します。

```typescript
// エラー型の定義
export type ApiError = {
  code: 'NOT_FOUND' | 'VALIDATION_ERROR' | 'UNAUTHORIZED';
  message: string;
};

// エラーレスポンスの生成
const createErrorResponse = (error: ApiError): GroupResponse => ({
  success: false,
  error: error.message
});
```

## 6. tRPCへの移行手順

### 6.1. ルーターの作成

モックAPIと同じインターフェースでルーターを実装します。

```typescript
export const groupRouter = router({
  getGroups: publicProcedure
    .query(async () => {
      // モックAPIと同じレスポンス形式
      const groups = await prisma.group.findMany();
      return {
        success: true,
        data: groups
      };
    }),

  createGroup: publicProcedure
    .input(createGroupSchema)  // モックAPIと同じバリデーションスキーマ
    .mutation(async ({ input }) => {
      const group = await prisma.group.create({
        data: input
      });
      return {
        success: true,
        data: group
      };
    })
});
```

### 6.2. クライアントコードの変更

```typescript
// 変更前（モックAPI）
const response = await mockGroupApi.createGroup(input);

// 変更後（tRPC）
const response = await trpc.group.createGroup.mutate(input);
```

## 重要な注意点

1. **型の一貫性**: tRPCのinput/output型とモックAPIの型を完全に一致させる
2. **バリデーションの共有**: zodスキーマを共有してバリデーションロジックを統一
3. **エラー処理**: tRPCのエラーハンドリングパターンを模倣
4. **レスポンス形式**: success/errorの形式を統一
5. **非同期処理**: すべてのAPIメソッドをPromiseベースで実装

## ベストプラクティス

1. モックAPIとtRPCルーターで同じ型定義ファイルを参照する
2. バリデーションスキーマを共通のファイルで管理
3. エラーケースを含めた完全なモックを実装
4. 適切なレイテンシーシミュレーションを追加
5. ユニットテストでモックAPIとtRPCの互換性を確認

## メリット

1. 型安全性の確保
2. スムーズな本実装への移行
3. フロントエンドの早期開発開始
4. テストの容易さ
5. 一貫したAPIインターフェース

以上の手順に従うことで、開発初期のモックAPIから本実装のtRPCへの移行をスムーズに行うことができます。