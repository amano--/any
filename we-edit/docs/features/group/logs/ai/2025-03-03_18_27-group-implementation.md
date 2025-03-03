# 実装計画: グループ機能

作成日: 2025-03-03 18:27

## 参照ドキュメント
- [会員管理ユースケース](../../../../usecases/member-management.md)
- [Reactコンポーネントガイドライン](../../../../guidelines/react-components.md)
- [i18nガイドライン](../../../../guidelines/i18n-guidelines.md)
- [データフェッチガイドライン](../../../../guidelines/data-fetching.md)
- [AI開発ガイドライン](../../../../guidelines/ai-development.md)

## 1. 概要

グループ作成・管理機能を実装します。初期段階ではクライアントサイドのモックデータを使用し、後にバックエンド実装と統合する予定です。

## 2. 技術的アプローチ

### 2.1 フォルダ構造
```
src/features/group/
├── api/
│   ├── mockApi.ts         # モックデータとAPI
│   └── types.ts          # API型定義
├── components/
│   ├── GroupList.tsx     # グループ一覧
│   ├── GroupCard.tsx     # グループカード
│   ├── CreateGroup.tsx   # グループ作成フォーム
│   ├── GroupSettings.tsx # グループ設定
│   ├── MemberList.tsx    # メンバー一覧
│   └── MemberItem.tsx    # メンバー情報
├── hooks/
│   ├── useGroup.ts       # グループ操作フック
│   └── useGroupMembers.ts # メンバー管理フック
├── store/
│   └── groupStore.ts     # 状態管理
└── types/
    └── group.ts          # 型定義
```

### 2.2 データ構造
```typescript
type Group = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
  settings: GroupSettings;
};

type GroupMember = {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
  status: 'active' | 'invited' | 'pending';
};

type GroupSettings = {
  allowMemberInvite: boolean;
  requireApproval: boolean;
  notificationSettings: {
    newMember: boolean;
    contentUpdate: boolean;
    memberLeave: boolean;
  };
};
```

### 2.3 モックデータ（10件）
```typescript
const mockGroups: Group[] = [
  {
    id: "g1",
    name: "開発チーム",
    description: "プロジェクトの開発メンバー",
    isPublic: false,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-03-01"),
    members: [
      {
        id: "m1",
        userId: "u1",
        groupId: "g1",
        role: "admin",
        joinedAt: new Date("2025-01-01"),
        status: "active"
      }
    ],
    settings: {
      allowMemberInvite: true,
      requireApproval: true,
      notificationSettings: {
        newMember: true,
        contentUpdate: true,
        memberLeave: true
      }
    }
  },
  {
    id: "g2",
    name: "デザインチーム",
    description: "UIデザインチーム",
    isPublic: false,
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-03-01"),
    members: [/* メンバーデータ */],
    settings: {/* 設定データ */}
  },
  // ... 他8件のグループデータ
];

// 完全なモックデータは mockApi.ts に実装
```

### 2.4 コンポーネント仕様

#### GroupList
```typescript
type GroupListProps = {
  groups: Group[];
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
};
```

#### GroupCard
```typescript
type GroupCardProps = {
  group: Group;
  onEdit: (groupId: string) => void;
  onDelete: (groupId: string) => void;
  onMemberManage: (groupId: string) => void;
};
```

#### CreateGroup
```typescript
type CreateGroupProps = {
  onSubmit: (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
};
```

### 2.5 i18n構造
```typescript
// src/i18n/locales/ja/group.ts
export const group = {
  list: {
    title: "グループ一覧",
    empty: "グループがありません",
    create: "新規グループ作成"
  },
  form: {
    name: "グループ名",
    description: "説明",
    isPublic: "公開設定",
    submit: "作成",
    cancel: "キャンセル"
  },
  members: {
    invite: "メンバー招待",
    remove: "削除",
    changeRole: "権限変更"
  },
  errors: {
    nameRequired: "グループ名は必須です",
    createFailed: "グループの作成に失敗しました",
    updateFailed: "グループの更新に失敗しました",
    deleteFailed: "グループの削除に失敗しました"
  }
} as const;
```

## 3. タスク分割と優先順位

### Phase 1: 基盤実装
1. [ ] 型定義（group.ts）
2. [ ] モックデータ（mockApi.ts）
3. [ ] グループ操作フック（useGroup.ts）
4. [ ] 状態管理（groupStore.ts）
5. [ ] i18n実装

### Phase 2: UI実装
1. [ ] GroupList
2. [ ] GroupCard
3. [ ] CreateGroup
4. [ ] GroupSettings

### Phase 3: 機能実装
1. [ ] グループCRUD操作
2. [ ] メンバー管理
3. [ ] 権限管理
4. [ ] 通知設定

## 4. エラーハンドリング

### 4.1 想定エラーケース
1. グループ作成・編集時
   - 必須項目の欠如
   - 重複名の検出
   - 権限不足

2. メンバー管理時
   - 存在しないユーザー
   - 権限の衝突
   - 招待の重複

### 4.2 エラー表示
```typescript
type ErrorDisplay = {
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: {
    label: string;
    handler: () => void;
  };
};
```

## 5. テスト計画（詳細）

### 5.1 単体テスト
```typescript
describe('GroupCard', () => {
  it('displays group information correctly');
  it('handles edit action');
  it('handles delete action');
  it('shows member count');
});

describe('useGroup', () => {
  it('creates group successfully');
  it('handles creation error');
  it('updates group data');
  it('manages member list');
});
```

### 5.2 統合テスト
- グループ作成から編集までのフロー
- メンバー招待から承認までのフロー
- 権限変更と機能制限の検証

### 5.3 E2Eテスト
- ユーザー権限ごとの機能アクセス検証
- エラー時のリカバリーフロー
- 並行操作時の整合性

## 6. パフォーマンス最適化

### 6.1 実装方針
1. メンバーリストの仮想化
2. グループデータのキャッシュ
3. 更新の最適化（部分更新）

### 6.2 監視メトリクス
1. レンダリング時間
2. メモリ使用量
3. ネットワークリクエスト数

Version: 0.2.0 (Draft)
Last Updated: 2025-03-03 18:27 JST