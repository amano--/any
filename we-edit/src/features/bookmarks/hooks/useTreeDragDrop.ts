/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_22-bookmark-tree-edit-functionality.md
 *
 * @ai_implementation
 * ブックマークツリーのドラッグ＆ドロップロジックを管理するカスタムフック
 * - フォルダへのドロップ時の処理改善
 * - ドラッグ中のフォルダ自動展開機能
 *
 * @ai_decision
 * 選択した実装アプローチ: フォルダの場合は常に"inside"に設定
 * 理由:
 * 1. ユーザーの意図を明確に反映（フォルダにドロップ = 中に入れる）
 * 2. 実装がシンプルで堅牢
 * 3. ドラッグ中のフォルダを自動的に展開することでUXを向上
 */

import { useMemo } from 'react';
import type {
  DragStartEvent,
  DragEndEvent,
  DragState,
  TreeItem,
  FolderTreeItem,
  DropPosition,
} from '../types';
import { useBookmarkTree } from './useBookmarkTree';

/**
 * @ai_implementation
 * ブックマークツリーのドラッグ＆ドロップロジックを管理するカスタムフック
 */
export function useTreeDragDrop() {
  const { dragState, setDragState, moveItem, items } = useBookmarkTree();

  const handlers = useMemo(
    () => ({
      handleDragStart: (event: DragStartEvent) => {
        const { active } = event;
        const dragData = active.data.current;
        if (!dragData) return;

        setDragState({
          isDragging: true,
          sourceId: String(active.id),
          sourceType: dragData.type,
          parentId: dragData.treeItem?.parentId ?? null,
        });
      },

      handleDragEnd: (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
          setDragState({ isDragging: false });
          return;
        }

        const sourceId = String(active.id);
        const targetId = String(over.id);
        const overData = over.data.current;

        if (!overData) {
          setDragState({ isDragging: false });
          return;
        }

        // ドロップ位置の決定
        // フォルダの場合は中に追加、それ以外は後ろに追加
        let position: DropPosition = "after";
        
        if (overData.type === "folder") {
          // フォルダの場合は中に追加
          position = "inside";
          
          // ドラッグ中のフォルダを展開
          const targetItem = items.find(item => item.id === targetId);
          if (targetItem && targetItem.type === "folder" && !targetItem.isExpanded) {
            // フォルダが閉じている場合は開く
            moveItem(sourceId, targetId, position);
            // フォルダを展開
            setTimeout(() => {
              const store = useBookmarkTree.getState();
              store.updateItem(targetId, {
                type: "folder",
                isExpanded: true
              });
            }, 0);
            setDragState({ isDragging: false });
            return;
          }
        }

        moveItem(sourceId, targetId, position);
        setDragState({ isDragging: false });
      },

      handleDragOver: (overId: string | null, type: "folder" | "bookmark") => {
        setDragState({
          targetId: overId,
          position: type === "folder" ? "inside" : "after",
        });
      },

      handleDragCancel: () => {
        setDragState({ isDragging: false });
      },
    }),
    [setDragState, moveItem, items]
  );

  return {
    dragState,
    ...handlers,
  };
}