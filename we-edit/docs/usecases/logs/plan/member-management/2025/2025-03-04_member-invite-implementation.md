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
- 目的: グループ管理者が新しいメンバーを招待する機能の実装
- 主要機能:
  - メンバー招待フォーム
  - メールアドレス/ID検証
  - 権限レベル設定
  - 招待状態管理
- 期待される動作:
  - 有効な会員の招待
  - 招待メール送信
  - 招待記録の保存

### 技術要件
- React + Next.js
- react-hook-form for フォーム管理
- tRPC for API通信
- Zod for バリデーション
- Radix UI for モーダル・セレクト
- TailwindCSS for スタイリング

## 実装手順

### 1. 型定義の作成
```typescript
// src/features/member-management/types/invitation.ts
export type MemberRole = 'admin' | 'editor' | 'viewer';

export interface Invitation {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeEmail: string;
  role: MemberRole;
  status: 'pending' | 'accepted' | 'rejected';
  expiresAt: Date;
}

export type CreateInvitationInput = {
  groupId: string;
  inviteeEmail: string;
  role: MemberRole;
};

export type InvitationResponse = {
  success: true;
  data: Invitation;
} | {
  success: false;
  error: string;
};
```

### 2. APIモックの実装
```typescript
// src/features/member-management/api/invitationApi.ts
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

const invitationSchema = z.object({
  groupId: z.string(),
  inviteeEmail: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer'])
});

export const invitationRouter = createTRPCRouter({
  invite: protectedProcedure
    .input(invitationSchema)
    .mutation(async ({ ctx, input }) => {
      // モック実装
      return {
        success: true,
        data: {
          id: 'mock-invitation-id',
          ...input,
          inviterId: ctx.session.user.id,
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      };
    })
});
```

### 3. コンポーネント実装

#### InviteMemberDialog
```typescript
// src/features/member-management/components/InviteMemberDialog.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type InviteMemberFormData = {
  email: string;
  role: MemberRole;
};

export const InviteMemberDialog: FC<{
  groupId: string;
  onClose: () => void;
}> = ({ groupId, onClose }) => {
  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(invitationSchema)
  });

  const mutation = api.invitation.invite.useMutation({
    onSuccess: () => {
      toast.success('招待を送信しました');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <Dialog>
      <Form {...form}>
        <EmailInput />
        <RoleSelect />
        <Button onClick={form.handleSubmit(mutation.mutate)}>
          招待を送信
        </Button>
      </Form>
    </Dialog>
  );
};
```

### 4. ページコンポーネントの更新
```typescript
// src/app/[locale]/v1/group/[id]/members/page.tsx
export default function GroupMembersPage() {
  return (
    <GroupMembersLayout>
      <MembersList />
      <InviteMemberButton />
      <InviteMemberDialog />
    </GroupMembersLayout>
  );
}
```

## 状態管理

### クライアントの状態
- フォームの状態（react-hook-form）
- ダイアログの開閉状態
- 招待処理中の状態

### サーバーの状態
- 招待リストのキャッシュ
- グループメンバーリストのキャッシュ
- 認証情報

## エラーハンドリング

### 1. フォームエラー
```typescript
const validationSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    invalid_type_error: '有効な権限を選択してください'
  })
});
```

### 2. APIエラー
```typescript
const handleInvite = async (data: InviteMemberFormData) => {
  try {
    await mutation.mutateAsync(data);
  } catch (error) {
    if (error instanceof TRPCClientError) {
      toast.error('招待の送信に失敗しました');
    }
  }
};
```

## パフォーマンス最適化

### 1. メモ化
- InviteMemberDialogコンポーネントのメモ化
- フォームのコールバック関数のメモ化
- 選択オプションの配列のメモ化

### 2. 遅延読み込み
- ダイアログコンポーネントの動的インポート
- フォームバリデーションの遅延実行

## セキュリティ対策

### 1. 入力検証
- メールアドレスのフォーマット検証
- 権限レベルの有効性確認
- XSS対策

### 2. 認証・認可
- グループ管理者のみ招待可能
- CSRFトークンの使用
- レート制限の実装

## 完了条件

1. InviteMemberDialogコンポーネントの実装完了
2. APIエンドポイントの実装完了
3. バリデーションとエラーハンドリングの実装
4. 国際化対応の完了
5. アクセシビリティ対応の完了
6. E2Eテストの準備完了

## 注意事項

1. テスト作成はスキップ（将来の実装のために考慮は行う）
2. エラーメッセージは必ず国際化する
3. アクセシビリティに配慮する
4. パフォーマンスを考慮したコンポーネント分割を行う

## 更新履歴

- 2025-03-04: 初版作成