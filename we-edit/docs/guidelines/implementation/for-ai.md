# AI実装者向け統合ガイドライン

## 概要

このガイドラインは、AIが実装時に従うべき規則とパターンを定義します。各種ガイドラインを統合し、一貫性のある実装を実現することを目的とします。

## 0. 実装計画書の作成（最重要）

### 0.1. 基本ルール

- 新規実装の開始時に必ず作成
- 読み込んだファイルは重要書類として参照リンクを記録
- 保存場所: 対象ファイルと同じディレクトリの `[機能名]/logs/ai/YYYY-MM` フォルダー内
- ファイル命名規則: `YYYY-MM-DD_HH_MM-実装計画名.md`

### 0.2. 実装計画書の構成

```markdown
# 実装計画: [機能名]

作成日: YYYY-MM-DD HH:MM

## 1. 概要

- 実装する機能の簡潔な説明
- 目的と期待される効果

## 2. 技術的アプローチ

- 選択した実装方法の説明
- 使用する技術やライブラリ
- アーキテクチャ上の配置

## 3. タスク分割

- [ ] タスク1: 説明
- [ ] タスク2: 説明
  - [ ] サブタスク2.1
  - [ ] サブタスク2.2

## 4. 考慮事項

- パフォーマンス要件
- セキュリティ要件
- スケーラビリティ要件

## 5. テスト計画

- 単体テストの範囲
- 統合テストの範囲
- E2Eテストの範囲
```

### 0.3. 実装計画書の参照管理

```typescript
// コンポーネントの先頭
/*
 * [実装計画書](実装計画書への相対パス)
 */

// コンポーネントの最下部
/*
 * 実装履歴:
 * - 2025-03-02: [実装計画書](path/to/latest.md) - 3パネルレイアウトの実装
 * - 2025-03-01: [実装計画書](path/to/old.md) - カード表示の追加
 */
```

### 0.4. 実装の意思決定プロセスの記録

```typescript
/**
 * @ai_decision
 * 選択した実装アプローチ: [アプローチ名]
 * 理由:
 * 1. [理由1の説明]
 * 2. [理由2の説明]
 *
 * 検討した代替案:
 * - 案1: [説明] - 不採用理由: [理由]
 * - 案2: [説明] - 不採用理由: [理由]
 */
```

### 0.5. コンポーネント構造の記録

```typescript
/**
 * @ai_component_structure
 * レイアウト構成:
 * - [コンポーネント名]: [役割]
 *   - [子コンポーネント1]: [役割]
 *   - [子コンポーネント2]: [役割]
 *
 * 状態管理:
 * - [状態名]: [用途]
 *
 * イベントハンドラ:
 * - [イベント名]: [処理内容]
 */
```

### 0.6. 実装の説明

```typescript
/**
 * @ai_implementation
 * 機能: [機能の説明]
 * アルゴリズム: [使用しているアルゴリズムの説明]
 * パフォーマンス考慮:
 * - [パフォーマンスに関する考慮事項1]
 * - [パフォーマンスに関する考慮事項2]
 */
```

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
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
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
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
```

### 3.2. tRPCルーターの実装

```typescript
export const router = createTRPCRouter({
  getData: publicProcedure.input(schema).query(async ({ input }) => {
    // モックAPIと同じレスポンス形式を維持
    return {
      success: true,
      data: await getData(input),
    };
  }),
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
    return error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  return [{ path: "", message: "Unknown error" }];
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
