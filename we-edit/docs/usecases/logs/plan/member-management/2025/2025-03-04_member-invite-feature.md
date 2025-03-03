[前半部分は同じなので省略...]

### 2. APIモックの実装

#### 2.1 モックデータストアの作成
```typescript
// src/features/member-management/api/mockData.ts

// モックデータの型定義
export interface MockDataStore {
  invitations: Invitation[];
  users: Map<string, { id: string; name: string }>;
}

// 初期モックデータの定義
export const createInitialMockData = (): MockDataStore => ({
  invitations: [
    {
      id: 'mock-inv-1',
      groupId: 'group-1',
      inviterId: 'user-1',
      inviteeEmail: 'test1@example.com',
      role: 'editor',
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date('2025-03-01')
    },
    // 他の初期データ
  ],
  users: new Map([
    ['test1@example.com', { id: 'user-2', name: 'Test User 1' }],
    ['test2@example.com', { id: 'user-3', name: 'Test User 2' }]
  ])
});

// モックデータストアのインスタンス
export const mockDataStore = createInitialMockData();
```

#### 2.2 モックAPI操作の実装
```typescript
// src/features/member-management/api/mockOperations.ts

export const mockOperations = {
  // 招待の作成
  async createInvitation(input: CreateInvitationInput): Promise<InvitationResponse> {
    // 遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 500));

    // 重複チェック
    const duplicate = mockDataStore.invitations.find(
      inv => inv.inviteeEmail === input.email && inv.status === 'pending'
    );
    if (duplicate) {
      throw new Error('既に招待が存在します');
    }

    // 新規招待の作成
    const newInvitation: Invitation = {
      id: `mock-inv-${Date.now()}`,
      ...input,
      status: 'pending',
      createdAt: new Date()
    };

    // データストアに追加
    mockDataStore.invitations.push(newInvitation);

    return {
      success: true,
      data: newInvitation
    };
  },

  // 他の操作メソッド
};
```

#### 2.3 tRPCルーターの実装
```typescript
// src/features/member-management/api/router.ts

export const memberManagementRouter = createTRPCRouter({
  inviteMember: protectedProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ input }) => {
      return mockOperations.createInvitation(input);
    }),

  listInvitations: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input }) => {
      return mockOperations.listInvitations(input.groupId);
    })
});
```

#### 2.4 エラーケースのシミュレーション
```typescript
// src/features/member-management/api/mockErrors.ts

export const simulateError = (type: 'network' | 'validation' | 'server') => {
  switch (type) {
    case 'network':
      throw new Error('ネットワークエラー');
    case 'validation':
      throw new Error('入力が無効です');
    case 'server':
      throw new Error('サーバーエラー');
  }
};
```

[以降の部分は同じなので省略...]