# ブックマークカードのドラッグ＆ドロップ実装計画（改訂版）

## 課題
1. ツリー構造の更新が正しく行われない
2. ドロップ後のUI状態が更新されない
3. 親子関係の再構築が必要

## 技術的アプローチの改善

### 1. ドロップ位置の検出
- DndKit の `rectIntersection` または `closestCorners` アルゴリズムの使用
- ドロップ領域の明確な視覚的フィードバック
- 親要素と子要素の区別を考慮したドロップ位置の計算

### 2. ツリー構造の更新
```typescript
interface TreeUpdateParams {
  sourceId: string;
  targetId: string;
  position: 'before' | 'after' | 'inside';
}

function updateTreeStructure({sourceId, targetId, position}: TreeUpdateParams) {
  // 1. 現在のツリー構造を取得
  // 2. ソースアイテムを元の位置から削除
  // 3. 新しい位置にソースアイテムを挿入
  // 4. 親子関係を更新
  // 5. インデックスを再計算
  // 6. 更新されたツリーで状態を更新
}
```

### 3. UIの状態管理改善
- Zustandストアの拡張
  - ドラッグ中の状態管理
  - ドロップ位置の一時保存
  - ツリー構造の変更履歴

## 実装ステップ

### 1. 状態管理の改善
```typescript
interface DragState {
  isDragging: boolean;
  sourceId: string | null;
  targetId: string | null;
  position: 'before' | 'after' | 'inside' | null;
}

interface BookmarkTreeState {
  // 既存の状態
  dragState: DragState;
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
}
```

### 2. ドロップ検出の改善
```typescript
const handleDragOver = (event: DragOverEvent) => {
  const { active, over } = event;
  
  if (!over) return;

  // マウス位置に基づいてドロップ位置を計算
  const position = calculateDropPosition(event);
  
  // 状態を更新
  setDragState({
    sourceId: active.id as string,
    targetId: over.id as string,
    position
  });
};
```

### 3. ツリー更新処理の実装
```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { dragState } = useBookmarkTreeStore.getState();
  
  if (!dragState.sourceId || !dragState.targetId || !dragState.position) {
    return;
  }

  try {
    // ツリー構造を更新
    await updateTreeStructure({
      sourceId: dragState.sourceId,
      targetId: dragState.targetId,
      position: dragState.position
    });

    // UIを更新
    refreshTreeView();
  } finally {
    // ドラッグ状態をリセット
    resetDragState();
  }
};
```

## 検証項目

### 機能テスト
- [ ] 同一階層内での並び替え
- [ ] 異なる階層への移動
- [ ] フォルダ内へのドロップ
- [ ] ドラッグ中の視覚的フィードバック
- [ ] ドロップ後のツリー構造の整合性

### パフォーマンステスト
- [ ] 大量のアイテムがある場合の動作確認
- [ ] ドラッグ中のアニメーションの滑らかさ
- [ ] ツリー更新時の再描画パフォーマンス

### エラーハンドリング
- [ ] 無効なドロップ位置の検出
- [ ] 循環参照の防止
- [ ] 更新失敗時のロールバック

## 期待される結果
1. スムーズなドラッグ＆ドロップ操作
2. 正確なツリー構造の更新
3. 即時のUI反映
4. エラーのない状態管理

## 技術的負債の管理
- パフォーマンス最適化の必要性の監視
- 状態管理の複雑さの評価
- リファクタリングポイントの特定