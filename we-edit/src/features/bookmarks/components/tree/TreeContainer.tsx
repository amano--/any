/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_22-bookmark-tree-edit-functionality.md
 *
 * @ai_implementation
 * ブックマークツリーのコンテナコンポーネント
 * - フォルダに子要素を追加するイベントリスナーの実装
 * - ドラッグアンドドロップ時のフォルダ自動展開機能
 * - 視覚的フィードバックの改善
 */

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "~/shadcn/components/ui/button";
import { TreeItem } from "./TreeItem";
import { useBookmarkOperations, useTreeDragDrop } from "../../hooks";
import { useBookmarkTree, selectItems } from "../../hooks";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import type { TreeItem as TreeItemType } from "../../types";

/**
 * @ai_implementation
 * ブックマークツリーのコンテナコンポーネント
 * - ドラッグ&ドロップの管理
 * - ツリー構造の表示
 * - 自動ルートフォルダ初期化
 */
export function TreeContainer() {
  const [isDraggingFromList, setIsDraggingFromList] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const items = useBookmarkTree(selectItems);
  const { dragState, handleDragStart, handleDragEnd, handleDragOver } = useTreeDragDrop();
  const { createFolder, ensureRootFolder } = useBookmarkOperations();
  const { t } = useText();

  // ルートフォルダの初期化
  useEffect(() => {
    ensureRootFolder(t.bookmarks.rootFolder);
  }, [ensureRootFolder, t.bookmarks.rootFolder]);

  // フォルダに子要素を追加するイベントリスナー
  useEffect(() => {
    const handleAddToFolder = (event: Event) => {
      const customEvent = event as CustomEvent<{ folderId: string }>;
      const folderId = customEvent.detail.folderId;
      setSelectedFolderId(folderId);
      
      // フォルダに新しい子フォルダを追加
      createFolder(t.bookmarks.newFolder, folderId);
      toast.success(t.bookmarks.folderCreated);
    };

    window.addEventListener('add-to-folder', handleAddToFolder as EventListener);
    
    return () => {
      window.removeEventListener('add-to-folder', handleAddToFolder as EventListener);
    };
  }, [createFolder, t.bookmarks.newFolder, t.bookmarks.folderCreated]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // ルートレベルに新しいフォルダを作成
  const handleCreateFolder = () => {
    createFolder(t.bookmarks.newFolder);
    toast.success(t.bookmarks.folderCreated);
  };

  const renderTreeNode = (item: TreeItemType, depth: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!item) return null;
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <TreeNode item={item} depth={depth} />
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleCreateFolder} className="w-full">
        {t.bookmarks.newFolder}
      </Button>

      <div 
        className={cn(
          "flex-1 overflow-auto p-4",
          isDraggingFromList && "bg-muted/50 border-2 border-dashed border-primary/50"
        )}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={(event) => {
            const { over } = event;
            if (!over) return;
            
            const targetId = String(over.id);
            const overData = over.data.current;
            
            if (overData && overData.type) {
              handleDragOver(targetId, overData.type);
              
              // フォルダの上にドラッグした場合、自動的に展開
              if (overData.type === 'folder') {
                const targetItem = items.find(item => item.id === targetId);
                if (targetItem && targetItem.type === 'folder' && !targetItem.isExpanded) {
                  // フォルダが閉じている場合は開く
                  const { updateItem } = useBookmarkTree.getState();
                  updateItem(targetId, {
                    type: "folder",
                    isExpanded: true
                  });
                }
              }
            }
          }}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {items.map((item) => renderTreeNode(item, 0))}
            </AnimatePresence>
          </SortableContext>

          <DragOverlay>
            {dragState.sourceId && (
              <div 
                className={cn(
                  "opacity-50",
                  isDraggingFromList && "bg-background shadow-lg"
                )}
              >
                {(() => {
                  const item = items.find(i => i.id === dragState.sourceId);
                  if (!item) return null;
                  return renderTreeNode(item, 0);
                })()}
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {items.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            {isDraggingFromList 
              ? t.bookmarks.dragDrop.during.overFolder
              : t.bookmarks.bookmarkEditPage.dragHint
            }
          </div>
        )}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  item: TreeItemType;
  depth: 0 | 1 | 2 | 3 | 4 | 5;
}

const TreeNode = ({ item, depth }: TreeNodeProps) => {
  const { updateItem } = useBookmarkTree();
  const { t } = useText();

  if ('children' in item) {
    return (
      <TreeItem
        id={item.id}
        name={item.name}
        type="folder"
        depth={depth}
        isExpanded={item.isExpanded}
        onToggle={() => {
          updateItem(item.id, {
            type: "folder",
            isExpanded: !item.isExpanded,
          });
        }}
        onNameChange={(newName) => {
          updateItem(item.id, {
            type: "folder",
            name: newName,
          });
        }}
      >
        {item.isExpanded && item.children && item.children.length > 0 && (
          <div className="pl-6">
            {item.children.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                depth={depth < 5 ? (depth + 1) as 0 | 1 | 2 | 3 | 4 | 5 : 5}
              />
            ))}
          </div>
        )}
      </TreeItem>
    );
  }

  return (
    <TreeItem
      id={item.id}
      name={item.name}
      type="bookmark"
      depth={depth}
      url={item.url}
      icon={item.icon}
      description={item.description}
      tags={item.tags}
      onNameChange={(newName) => {
        updateItem(item.id, {
          type: "bookmark",
          name: newName,
        });
      }}
    />
  );
};