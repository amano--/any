# 機能実装指示書作成ガイドライン

## 概要

このガイドラインは、ユースケース実装計画書から具体的な機能実装指示書を作成するための手順と規則を定義します。

## 前提条件

### 必須の読み込み文書

1. ユースケース実装計画書
2. `docs/guidelines/mock-api-with-trpc.md`
3. `docs/guidelines/react-components.md`
4. その他の技術ガイドライン

## 文書構造

### 1. メタ情報

```markdown
# [機能名]実装指示書

作成日: YYYY-MM-DD
更新日: YYYY-MM-DD

## 参照文書

- [ユースケース実装計画書](リンク)
- [mock-api-with-trpc.md](リンク)
- [react-components.md](リンク)
```

### 2. 実装概要

```markdown
## 機能概要

- 目的
- 主な機能
- 技術スタック

## 技術要件

- フレームワーク: Next.js
- 状態管理: react-hook-form
- API: tRPC
- その他の主要ライブラリ
```

### 3. 実装手順

```markdown
## 実装ステップ

### 1. 型定義

- データモデル
- API入出力
- コンポーネントProps

### 2. APIモック

### 3. コンポーネント実装

- ページコンポーネント
- 機能コンポーネント
- 共通コンポーネント

### 4. フォーム実装

- react-hook-formの設定
- バリデーション
- エラーハンドリング
```

## 必須セクション

### 1. 型定義セクション

```markdown
## 型定義

### データモデル

\```typescript
// 必要な型定義
\```

### API型

\```typescript
// 入出力の型定義
\```

### Props型

\```typescript
// コンポーネントProps
\```
```

### 2. APIセクション

```markdown
## API実装

### 2.1 モックデータストア
1. データ構造の定義
   \```typescript
   // モックデータの型とストア構造を定義
   interface MockDataStore {
     items: Item[];
     metadata: {
       lastUpdated: Date;
       version: string;
     };
   }
   
   // 初期データは必ず5件以上含める
   const createInitialData = (): MockDataStore => ({
     items: [
       {
         id: 'item-1',
         // ...具体的なデータ
       },
       // ... 他の初期データ
     ],
     metadata: {
       lastUpdated: new Date(),
       version: '1.0.0'
     }
   });
   \```

### 2.2 モックAPI操作
1. 基本的なCRUD操作
   \```typescript
   export const mockOperations = {
     // 作成操作
     async create(input: CreateInput): Promise<Response> {
       await simulateLatency();
       try {
         // バリデーション
         // データ作成
         // 結果返却
       } catch (error) {
         // エラー処理
       }
     },
     
     // 他の操作
     async update(): Promise<Response> {
       // 更新処理
     }
   };
   \```

2. ネットワーク状態の模倣
   \```typescript
   // 遅延シミュレーション（200-500ms）
   const simulateLatency = () => 
     new Promise(resolve => 
       setTimeout(resolve, 200 + Math.random() * 300)
     );
   \```
```

### 3. コンポーネントセクション

```markdown
## コンポーネント実装

### ページコンポーネント

- パス: src/app/[locale]/v1/[機能名]/page.tsx
- 責務
- 状態管理

### 機能コンポーネント

- 構造
- Props
- イベントハンドリング
```

### 4. フォームセクション

```markdown
## フォーム実装

### react-hook-form設定

\```typescript
// フォーム設定例
\```

### バリデーション

\```typescript
// バリデーションスキーマ
\```
```

## 実装時の注意点

### 1. 共通規約

- コンポーネントの分割基準
- 命名規則
- ファイル構成

### 2. パフォーマンス考慮

- メモ化の基準
- 非同期処理の扱い
- 最適化のポイント

### 3. エラーハンドリング

- ユーザーエラー
- システムエラー
- エッジケース

### 4. テスト関連

- テストはスキップすることを明記
- 将来のテスト実装の考慮点

## 必須チェック項目

### 1. 基本要件

- [ ] 型定義の完全性
- [ ] APIエンドポイントの定義
- [ ] コンポーネント構造の明確化
- [ ] フォーム実装方針の明示

### 2. 技術要件

- [ ] react-hook-formの使用計画
- [ ] モックAPIの設計
- [ ] Next.jsページの作成計画
- [ ] トップページへのリンク追加計画

### 3. 品質要件

- [ ] エラーハンドリングの方針
- [ ] パフォーマンス考慮点
- [ ] アクセシビリティ対応
- [ ] i18n対応

## 補足情報

### 1. 開発環境

- 必要な環境変数
- 開発用スクリプト
- デバッグ方法

### 2. デプロイ

- ビルド手順
- 環境差分
- 注意点

### 3. トラブルシューティング

- 既知の問題
- 対処方法
- サポートリソース

## 文書更新履歴

- 作成: YYYY-MM-DD
- 更新: YYYY-MM-DD 更新内容
