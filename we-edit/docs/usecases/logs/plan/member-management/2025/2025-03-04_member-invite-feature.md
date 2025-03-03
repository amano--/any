# メンバー招待機能実装指示書

作成日: 2025-03-04
更新日: 2025-03-04
関連ユースケース: UC-3

## 参照文書
- [ユースケース実装計画書](./2025-03-04_member-management-plan.md)
- [mock-api-with-trpc.md](../../../../../guidelines/implementation/mock-api-with-trpc.md)
- [react-components.md](../../../../../guidelines/implementation/react-components.md)

## 実装概要

### 機能要件
- 目的: グループ管理者がシステムを通じて新しいメンバーを招待できる
- 主要機能: 
  - メールアドレスまたはIDによる招待
  - 権限レベルの設定
  - 招待メールの送信
- 期待される動作:
  - 招待フォームの表示と入力検証
  - サーバーでの招待処理
  - 招待結果の通知

### 技術要件
- React + Next.js (App Router)
- react-hook-form for フォーム管理
- tRPC for API通信
- Zod for バリデーション
- Radix UI for モーダル
- TailwindCSS for スタイリング

## 実装手順

### 1. 型定義の作成
```typescript
// src/features/member-management/types.ts
export type MemberRole = 'admin' | 'editor' | 'viewer';

export interface Invitation {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeEmail: string;
  role: MemberRole;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const inviteMemberSchema = z.object({
  groupId: z.string(),
  inviteeEmail: z.string().email('有効なメールアドレスを入力してください'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    required_error: '権限を選択してください'
  })
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
```

### 2. APIモックの実装

#### 2.1 モックデータストア
```typescript
// src/features/member-management/api/mockData.ts
interface MockDataStore {
  invitations: Invitation[];
  users: Map<string, {
    id: string;
    name: string;
    email: string;
    groups: string[];
  }>;
}

// 初期データ（5件以上）
const createInitialData = (): MockDataStore => ({
  invitations: [
    {
      id: 'inv-1',
      groupId: 'group-1',
      inviterId: 'user-1',
      inviteeEmail: 'member1@example.com',
      role: 'editor',
      status: 'pending',
      expiresAt: new Date('2025-03-11'),
      createdAt: new Date('2025-03-04'),
      updatedAt: new Date('2025-03-04')
    },
    {
      id: 'inv-2',
      groupId: 'group-1',
      inviterId: 'user-1',
      inviteeEmail: 'member2@example.com',
      role: 'viewer',
      status: 'accepted',
      expiresAt: new Date('2025-03-11'),
      createdAt: new Date('2025-03-03'),
      updatedAt: new Date('2025-03-03')
    },
    {
      id: 'inv-3',
      groupId: 'group-1',
      inviterId: 'user-1',
      inviteeEmail: 'member3@example.com',
      role: 'admin',
      status: 'rejected',
      expiresAt: new Date('2025-03-11'),
      createdAt: new Date('2025-03-02'),
      updatedAt: new Date('2025-03-02')
    },
    {
      id: 'inv-4',
      groupId: 'group-2',
      inviterId: 'user-2',
      inviteeEmail: 'member4@example.com',
      role: 'editor',
      status: 'pending',
      expiresAt: new Date('2025-03-11'),
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01')
    },
    {
      id: 'inv-5',
      groupId: 'group-2',
      inviterId: 'user-2',
      inviteeEmail: 'member5@example.com',
      role: 'viewer',
      status: 'cancelled',
      expiresAt: new Date('2025-03-11'),
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01')
    }
  ],
  users: new Map([
    ['member1@example.com', { id: 'user-3', name: 'Member 1', email: 'member1@example.com', groups: [] }],
    ['member2@example.com', { id: 'user-4', name: 'Member 2', email: 'member2@example.com', groups: ['group-1'] }],
    ['member3@example.com', { id: 'user-5', name: 'Member 3', email: 'member3@example.com', groups: [] }],
    ['member4@example.com', { id: 'user-6', name: 'Member 4', email: 'member4@example.com', groups: [] }],
    ['member5@example.com', { id: 'user-7', name: 'Member 5', email: 'member5@example.com', groups: ['group-2'] }]
  ])
});

// モックデータストアのインスタンス
export const mockStore = createInitialData();
```

#### 2.2 モックAPI操作
```typescript
// src/features/member-management/api/mockOperations.ts
export const mockOperations = {
  // 招待の作成
  async createInvitation(input: InviteMemberInput): Promise<Invitation> {
    await simulateLatency();
    
    // 重複チェック
    const existingInvitation = mockStore.invitations.find(
      inv => inv.inviteeEmail === input.inviteeEmail &&
            inv.groupId === input.groupId &&
            inv.status === 'pending'
    );
    
    if (existingInvitation) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '既に招待が送信されています'
      });
    }

    // 新規招待の作成
    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      ...input,
      inviterId: 'user-1', // TODO: 実際のユーザーIDを使用
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockStore.invitations.push(newInvitation);
    return newInvitation;
  },

  // 招待一覧の取得
  async listInvitations(groupId: string): Promise<Invitation[]> {
    await simulateLatency();
    return mockStore.invitations.filter(inv => inv.groupId === groupId);
  },

  // 招待のキャンセル
  async cancelInvitation(id: string): Promise<Invitation> {
    await simulateLatency();
    
    const invitation = mockStore.invitations.find(inv => inv.id === id);
    if (!invitation) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: '招待が見つかりません'
      });
    }

    if (invitation.status !== 'pending') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'この招待はキャンセルできません'
      });
    }

    invitation.status = 'cancelled';
    invitation.updatedAt = new Date();
    return invitation;
  }
};

// ネットワーク遅延のシミュレーション（200-500ms）
const simulateLatency = () => 
  new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
```

#### 2.3 tRPCルーター
```typescript
// src/features/member-management/api/router.ts
export const invitationRouter = createTRPCRouter({
  invite: protectedProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const invitation = await mockOperations.createInvitation(input);
        return {
          success: true as const,
          data: invitation
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '招待の作成に失敗しました'
        });
      }
    }),

  list: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input }) => {
      const invitations = await mockOperations.listInvitations(input.groupId);
      return {
        success: true as const,
        data: invitations
      };
    }),

  cancel: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      const invitation = await mockOperations.cancelInvitation(input.invitationId);
      return {
        success: true as const,
        data: invitation
      };
    })
});
```

### 3. コンポーネント実装
```typescript
// src/features/member-management/components/InviteMemberForm.tsx
export const InviteMemberForm: FC<{
  groupId: string;
  onSuccess?: () => void;
}> = ({ groupId, onSuccess }) => {
  const form = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema)
  });

  const { t } = useTranslations();
  const mutation = api.invitation.invite.useMutation({
    onSuccess: () => {
      toast.success(t.member.invite.success);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="inviteeEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.member.invite.email}</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.member.invite.role}</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  {t.member.roles.admin}
                </SelectItem>
                <SelectItem value="editor">
                  {t.member.roles.editor}
                </SelectItem>
                <SelectItem value="viewer">
                  {t.member.roles.viewer}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="submit"
        disabled={mutation.isLoading}
        onClick={form.handleSubmit(data => 
          mutation.mutate({ ...data, groupId })
        )}
      >
        {t.member.invite.submit}
      </Button>
    </Form>
  );
};
```

### 4. ページコンポーネントの作成
```typescript
// src/app/[locale]/v1/group/[groupId]/members/invite/page.tsx
export default function InviteMemberPage({
  params: { groupId }
}: {
  params: { groupId: string }
}) {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={t.member.invite.title}
        description={t.member.invite.description}
      />
      <InviteMemberForm groupId={groupId} />
    </div>
  );
}
```

## エラーハンドリング

### 1. フォームエラー
```typescript
const validationSchema = z.object({
  inviteeEmail: z.string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    invalid_type_error: '有効な権限を選択してください'
  })
});
```

### 2. APIエラー
```typescript
export const errorMessages = {
  duplicate: '既に招待が送信されています',
  notFound: '招待が見つかりません',
  invalidStatus: 'この招待はキャンセルできません',
  system: 'システムエラーが発生しました'
} as const;
```

## セキュリティ対策

### 1. 入力検証
- メールアドレスのフォーマット検証
- 権限レベルの有効性確認
- XSS対策としてのエスケープ処理

### 2. 認証・認可
- グループ管理者権限の確認
- CSRFトークンの使用
- レート制限の実装

## パフォーマンス最適化

### 1. メモ化
- InviteMemberFormコンポーネントのメモ化
- 選択オプションのメモ化
- バリデーション関数のメモ化

### 2. 遅延読み込み
- モーダルコンポーネントの動的インポート
- フォームのバリデーション

## 完了条件

1. 型定義がすべて完了している
2. モックAPIが実装されている
3. フォームが正しく実装されている
4. エラーハンドリングが実装されている
5. 国際化対応が完了している
6. アクセシビリティ対応が完了している

## 注意事項

1. テスト作成はスキップ
2. エラーメッセージは必ず国際化する
3. アクセシビリティ対応を忘れずに
4. パフォーマンスを考慮する

## 更新履歴

- 2025-03-04: 初版作成