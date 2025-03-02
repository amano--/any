import { useCallback, useState } from "react";
import type { DragStartEvent, DragEndEvent, Active } from "@dnd-kit/core";

interface DragData {
  type: "tree" | "bookmark";
  item?: TreeItem;
}
import { useBookmarkTree } from "./useBookmarkTree";
import { isFolder } from "../types/tree";
import type { TreeItem } from "../types/tree";

export type DragState = {
  sourceId: string | null;
  targetId: string | null;
  type: "tree" | "bookmark";
};

/**
 * ツリーのドラッグ&ドロップを管理するフック
 */
export const useTreeDragDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    sourceId: null,
    targetId: null,
    type: "tree"
  });

  const { items, updateItem } = useBookmarkTree();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setDragState(prev => ({
      ...prev,
      sourceId: active.id as string,
      type: (active.data.current?.type as "tree" | "bookmark") ?? "tree"
    }));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const overId = over.id.toString().replace("droppable-", "");
      const targetItem = items.find(item => item.id === overId);
      
      if (targetItem && isFolder(targetItem)) {
        // ドラッグ元の情報を取得
        const data = active.data.current as DragData;
        if (data?.type === "bookmark") {
          const sourceId = active.id as string;
          // 移動するアイテムの親フォルダを更新
          updateItem(sourceId, {
            type: "bookmark",
            parentId: targetItem.id
          });
        }
      }
    }

    setDragState({
      sourceId: null,
      targetId: null,
      type: "tree"
    });
  }, [items, updateItem]);

  const handleDragOver = useCallback((event: DragEndEvent) => {
    const { over } = event;
    setDragState(prev => ({
      ...prev,
      targetId: over?.id as string | null
    }));
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  };
};