# 機能実装指示書テンプレート

## 概要

このテンプレートは、ユースケース実装計画書から具体的な実装指示書を作成するための標準形式を提供します。

## 文書構造

### 1. メタ情報
```markdown
# [機能名]実装指示書
作成日: YYYY-MM-DD
更新日: YYYY-MM-DD
関連ユースケース: [UC-XX]

## 参照文書
- [ユースケース実装計画書](./path/to/plan.md)
- [mock-api-with-trpc.md](./path/to/mock-api.md)
- [react-components.md](./path/to/components.md)
```

### 2. 実装概要
```markdown
## 実装概要

### 機能要件
- 目的
- 主要機能
- 期待される動作

### 技術要件
- React + Next.js
- react-hook-form for フォーム管理
- tRPC for API通信
- その他の依存ライブラリ
```

### 3. 実装手順

```markdown
## 実装手順

### 1. 型定義の作成
\```typescript
// 必要な型定義
interface Example {
  // ...
}
\```

### 2. APIモックの実装
- docs/guidelines/mock-api-with-trpc.md に従って実装
\```typescript
// tRPCルーター定義例
\```

### 3. コンポーネント実装
- Propsの型定義
- react-hook-formの設定
- バリデーションルール
- エラーハンドリング

### 4. ページコンポーネントの作成
- パス: src/app/[locale]/v1/[機能名]/page.tsx
- ルーティング設定
- レイアウト構成
```

### 4. コンポーネントの詳細仕様

```markdown
## コンポーネント仕様

### ページコンポーネント
\```typescript
// 基本構造
export default function FeaturePage() {
  // フック定義
  // 状態管理
  // イベントハンドラ
  
  return (
    // JSX
  );
}
\```

### フォームコンポーネント
\```typescript
// react-hook-formの使用例
const form = useForm<FormData>({
  defaultValues,
  resolver: zodResolver(schema)
});
\```

### APIクライアント
\```typescript
// tRPCの使用例
const mutation = api.feature.create.useMutation({
  onSuccess: () => {
    // ...
  }
});
\```
```

### 5. 状態管理

```markdown
## 状態管理

### クライアントの状態
- フォームの状態（react-hook-form）
- ローディング状態
- エラー状態

### サーバーの状態
- APIレスポンスのキャッシュ
- 認証状態
- セッション情報
```

## 実装のチェックポイント

### 1. 型安全性
- [ ] すべての型が明示的に定義されている
- [ ] TypeScriptの厳格モードに対応
- [ ] APIの型が定義されている

### 2. フォーム実装
- [ ] react-hook-formを使用している
- [ ] バリデーションが実装されている
- [ ] エラーメッセージが国際化されている

### 3. API実装
- [ ] docs/guidelines/mock-api-with-trpc.md に従っている
- [ ] エラーハンドリングが実装されている
- [ ] レスポンス型が定義されている

### 4. ページ実装
- [ ] 適切なパスに作成されている
- [ ] トップページにリンクが追加されている
- [ ] レイアウトが適切に構成されている

## エラーハンドリング

### 1. フォームエラー
```typescript
// バリデーションエラーの処理例
const handleError = (error: Error) => {
  if (error instanceof z.ZodError) {
    // バリデーションエラーの処理
  }
};
```

### 2. APIエラー
```typescript
// APIエラーの処理例
try {
  await mutation.mutateAsync(data);
} catch (error) {
  // エラー処理
}
```

## パフォーマンス最適化

### 1. メモ化
- コンポーネントのメモ化
- コールバックのメモ化
- 計算値のメモ化

### 2. 遅延読み込み
- 動的インポート
- コンポーネントの遅延読み込み

## セキュリティ対策

### 1. 入力検証
- フォーム入力のバリデーション
- APIリクエストの検証
- XSS対策

### 2. 認証・認可
- ルートの保護
- APIエンドポイントの保護

## 完了条件

1. すべての型が定義されている
2. フォームが正しく実装されている
3. APIが実装されている
4. ページが作成されている
5. エラーハンドリングが実装されている
6. トップページにリンクが追加されている

## 注意事項

1. テスト作成はスキップ
2. コメントは最小限に
3. 型安全性を優先
4. エラーハンドリングを忘れずに