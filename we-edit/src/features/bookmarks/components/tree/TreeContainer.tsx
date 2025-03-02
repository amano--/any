import { useEffect, useState } from "react";
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
import  {TreeItem}  from "./TreeItem";
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
  const items = useBookmarkTree(selectItems);
  const { dragState, handleDragStart, handleDragEnd, handleDragOver } = useTreeDragDrop();
  const { createFolder, ensureRootFolder } = useBookmarkOperations();
  const { t } = useText();

  // ルートフォルダの初期化
  useEffect(() => {
    ensureRootFolder(t.bookmarks.rootFolder);
  }, [ensureRootFolder, t.bookmarks.rootFolder]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCreateFolder = () => {
    createFolder(t.bookmarks.newFolder);
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