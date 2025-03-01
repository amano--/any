# ブックマーク機能のモジュール再構築計画

## 現状の構造

```
src/
  ├── app/_components/bookmark-tree/
  │   ├── tree-container.tsx
  │   ├── tree-item.tsx
  │   ├── styles.ts
  │   └── utils.ts
  ├── store/
  │   └── bookmark-tree.ts
  └── types/
      ├── bookmark-tree.ts
      └── drag-events.ts
```

## 新構造への移行計画

```
src/features/bookmarks/
  ├── components/
  │   ├── tree/
  │   │   ├── TreeContainer.tsx
  │   │   ├── TreeItem.tsx
  │   │   └── TreeNode.tsx
  │   └── list/
  │       └── BookmarkList.tsx
  ├── hooks/
  │   ├── useBookmarkTree.ts        # Zustandストアのラッパーフック
  │   ├── useTreeDragDrop.ts        # ドラッグ&ドロップロジック
  │   └── useBookmarkOperations.ts  # ブックマーク操作
  ├── api/
  │   ├── bookmarkApi.ts            # APIクライアント
  │   └── types.ts                  # APIレスポンス型
  ├── utils/
  │   ├── treeUtils.ts              # ツリー操作ヘルパー
  │   └── validation.ts             # バリデーションロジック
  ├── types/
  │   ├── bookmark.ts               # ドメインモデル
  │   ├── tree.ts                   # ツリー構造型
  │   └── events.ts                 # イベント型
  ├── constants/
  │   └── index.ts                  # 定数定義
  └── index.ts                      # 公開API

server/features/bookmarks/
  ├── routes/
  │   └── bookmarkRoutes.ts         # tRPCルーター
  ├── services/
  │   └── bookmarkService.ts        # ビジネスロジック
  ├── models/
  │   └── bookmarkModel.ts          # Drizzleスキーマ
  └── types/
      └── index.ts                  # 共有型
```

## 移行手順

1. ディレクトリ構造の作成
   - 新しいディレクトリ階層を作成
   - 既存ファイルの移動準備

2. コンポーネントの移行
   - tree-container.tsx → TreeContainer.tsx
   - tree-item.tsx → TreeItem.tsx
   - コンポーネントロジックの分離

3. Hooks層の実装
   - Zustandストアをカスタムフックに移行
   - ドラッグ&ドロップロジックの分離
   - 操作ロジックの抽象化

4. 型定義の整理
   - ドメインモデルの定義
   - API型の分離
   - イベント型の整理

5. APIレイヤーの構築
   - tRPCクライアントの実装
   - エラーハンドリングの統一
   - 型安全な通信

## 品質管理

1. テスト戦略
   - コンポーネントの単体テスト
   - カスタムフックのテスト
   - 統合テスト

2. ドキュメント
   - 機能APIドキュメント
   - データモデル説明
   - 使用例

3. パフォーマンス
   - メモ化戦略
   - 遅延ロード
   - 状態管理の最適化

## 期待される効果

1. **保守性の向上**
   - 関心の分離
   - モジュール境界の明確化
   - テスト容易性の向上

2. **再利用性の向上**
   - 独立したコンポーネント
   - 汎用的なフック
   - 型の共有

3. **拡張性の向上**
   - 機能の追加が容易
   - インターフェースの明確化
   - 依存関係の制御

## 技術的考慮事項

1. **後方互換性**
   - 既存のインポートパスの維持
   - 段階的な移行
   - 破壊的変更の最小化

2. **パフォーマンス**
   - バンドルサイズへの影響
   - 初期ロード時間
   - メモリ使用量

3. **セキュリティ**
   - 型安全性の確保
   - 入力バリデーション
   - エラーハンドリング