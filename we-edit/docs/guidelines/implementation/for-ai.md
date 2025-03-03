# AI実装者向け統合ガイドライン

## 概要

このガイドラインは、AIが実装時に従うべき規則とパターンを定義します。各種ガイドラインを統合し、一貫性のある実装を実現することを目的とします。

## 1. 実装の基本原則

### 1.1. ファイル構成
```typescript
src/features/[機能名]/
├── index.ts         # 公開APIの定義
├── README.md        # 機能の説明とAPIドキュメント
├── api/            # API関連の実装
├── components/     # UIコンポーネント
├── hooks/         # カスタムフック
├── types/         # 型定義
└── utils/         # ユーティリティ関数
```

### 1.2. 実装手順
1. 型定義の作成
2. APIインターフェースの設計
3. コンポーネントの実装
4. テストの作成（要求された場合）

## 2. コンポーネント実装規則

### 2.1. 基本構造
```typescript
// ✅ 推奨: type + アロー関数コンポーネント
type ComponentProps = {
  required: string;
  optional?: number;
  children?: React.ReactNode;
  onAction?: (value: string) => void;
};

export const Component: FC<ComponentProps> = ({
  required,
  optional = 0,
  children,
  onAction
}) => {
  return (
    <div>{/* JSX */}</div>
  );
};
```

### 2.2. 責務の分離

1. **ページコンポーネント（src/app/）**
   - データフェッチ
   - ルーティング
   - エラーハンドリング

2. **機能コンポーネント（src/features/）**
   - UI表示
   - ローカル状態管理
   - イベントハンドリング

## 3. データフェッチの実装

### 3.1. モックAPIの実装
```typescript
// types/api.ts
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// api/mockApi.ts
export const mockApi = {
  async getData(): Promise<ApiResponse<Data>> {
    try {
      const data = await simulateRequest();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
};
```

### 3.2. tRPCルーターの実装
```typescript
export const router = createTRPCRouter({
  getData: publicProcedure
    .input(schema)
    .query(async ({ input }) => {
      // モックAPIと同じレスポンス形式を維持
      return {
        success: true,
        data: await getData(input)
      };
    })
});
```

## 4. フォーム実装（react-hook-form）

### 4.1. 基本パターン
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

type FormData = z.infer<typeof schema>;

const Form = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* フォームフィールド */}
    </form>
  );
};
```

## 5. エラーハンドリング

### 5.1. API応答のエラー処理
```typescript
try {
  const response = await api.getData();
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
} catch (error) {
  // エラー表示
  showErrorToast(error instanceof Error ? error.message : "Unknown error");
}
```

### 5.2. バリデーションエラー
```typescript
const handleError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
  }
  return [{ path: '', message: 'Unknown error' }];
};
```

## 6. 国際化対応

### 6.1. 翻訳キーの使用
```typescript
const { t } = useText();

return (
  <div>
    <h1>{t.features.title}</h1>
    <button>{t.common.actions.submit}</button>
  </div>
);
```

## 7. パフォーマンス最適化

### 7.1. メモ化
```typescript
// 重い計算の結果をメモ化
const memoizedValue = useMemo(() => {
  return expensiveComputation(props);
}, [props]);

// コールバックのメモ化
const handleClick = useCallback(() => {
  onAction(id);
}, [id, onAction]);
```

## 8. 実装時のチェックリスト

### 8.1. コンポーネント実装
- [ ] 型定義の完全性
- [ ] Props型の明示
- [ ] メモ化の適切な使用
- [ ] エラーハンドリング
- [ ] アクセシビリティ対応

### 8.2. APIモック実装
- [ ] レスポンス型の定義
- [ ] エラーケースの網羅
- [ ] バリデーションの実装
- [ ] tRPCとの互換性確保

### 8.3. フォーム実装
- [ ] バリデーションスキーマ
- [ ] エラーメッセージの国際化
- [ ] 送信処理のエラーハンドリング

## 9. 注意事項

1. 常にTypeScriptの厳格モードで実装
2. anyの使用は禁止
3. コメントは必要最小限に
4. パフォーマンスを意識した実装
5. セキュリティを考慮したバリデーション

## 10. 実装例の参照

実装時は、以下のファイルを参考にしてください：

1. src/features/bookmarks/ - ブックマーク機能の実装例
2. src/features/group/ - グループ機能の実装例

これらは、本ガイドラインに従って実装された実例です。