import { useEffect, useState, memo } from "react";
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
import { AnimatePresence } from "framer-motion";
import { Button } from "~/shadcn/components/ui/button";
import { TreeItem } from "./TreeItem";
import { useBookmarkOperations, useTreeDragDrop } from "../../hooks";
import { useBookmarkTree, selectItems } from "../../hooks";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";
import type { TreeItem as TreeItemType } from "../../types";

type TreeContainerProps = {
  className?: string;
};

interface TreeNodeProps {
  item: TreeItemType;
  depth: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * @ai_implementation
 * ブックマークツリーのコンテナコンポーネント
 * - ドラッグ&ドロップの管理
 * - ツリー構造の表示
 * - 自動ルートフォルダ初期化
 */
const TreeContainerBase = ({ className }: TreeContainerProps) => {
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
      <TreeNode
        key={item.id}
        item={item}
        depth={depth}
      />
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
          isDraggingFromList && "bg-muted/50 border-2 border-dashed border-primary/50",
          className
        )}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {items.map((item) => renderTreeNode(item, 0))}
            </AnimatePresence>
          </SortableContext>

          <DragOverlay dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {dragState.sourceId && (() => {
              const item = items.find(i => i.id === dragState.sourceId);
              if (!item) return null;
              return (
                <div
                  className={cn(
                    "opacity-75",
                    dragState.type === "bookmark" && "bg-background shadow-lg rounded-lg p-2",
                    "transform-gpu scale-95",
                    "transition-transform duration-200"
                  )}
                >
                  {renderTreeNode(item, 0)}
                </div>
              );
            })()}
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
};

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

TreeContainerBase.displayName = "TreeContainer";
TreeNode.displayName = "TreeNode";

export const TreeContainer = memo(TreeContainerBase);