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

        let position: DropPosition = "after";
        if (overData.type === "folder") {
          position = "inside";
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