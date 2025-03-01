import { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "~/shadcn/components/ui/button";
import { TreeItem } from "./tree-item";
import { useBookmarkTreeStore } from "~/store/bookmark-tree";
import type {
  TreeItem as TreeItemType,
  FolderTreeItem,
  BookmarkTreeItem,
  TreeItemUpdates,
} from "~/types/bookmark-tree";
import type {
  DragStartEvent,
  DragEndEvent,
  DraggableItemData,
  DropTargetData,
} from "~/types/drag-events";
import { exportToJson, importFromJson, convertFromChrome } from "./utils";
import { useText } from "~/i18n/text";
import { cn } from "~/shadcn/lib/utils";

const MAX_DEPTH = 5;

const isFolderItem = (item: TreeItemType): item is FolderTreeItem => {
  return item.type === "folder";
};

const clampDepth = (depth: number): 0 | 1 | 2 | 3 | 4 | 5 => {
  return Math.max(0, Math.min(5, depth)) as 0 | 1 | 2 | 3 | 4 | 5;
};

const findItemById = (
  items: TreeItemType[],
  id: UniqueIdentifier,
): TreeItemType | null => {
  for (const item of items) {
    if (item.id === String(id)) return item;
    if (isFolderItem(item) && item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

interface TreeNodeProps {
  item: TreeItemType;
  depth: 0 | 1 | 2 | 3 | 4 | 5;
}

const TreeNode = ({ item, depth }: TreeNodeProps) => {
  const { updateItem } = useBookmarkTreeStore();
  const { t } = useText();

  if (isFolderItem(item)) {
    return (
      <TreeItem
        id={item.id}
        name={item.name}
        type="folder"
        depth={depth}
        isExpanded={item.isExpanded}
        onToggle={() => {
          const updates: TreeItemUpdates = {
            type: "folder",
            isExpanded: !item.isExpanded,
          };
          updateItem(item.id, updates);
        }}
        onNameChange={(newName) => {
          const updates: TreeItemUpdates = {
            type: "folder",
            name: newName,
          };
          updateItem(item.id, updates);
        }}
        aria-label={t.bookmarks.dragDrop.aria.dropTarget}
      >
        {item.isExpanded && item.children && item.children.length > 0 && (
          <div className="pl-6">
            {item.children.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                depth={clampDepth(depth + 1)}
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
        const updates: TreeItemUpdates = {
          type: "bookmark",
          name: newName,
        };
        updateItem(item.id, updates);
      }}
      aria-label={t.bookmarks.dragDrop.aria.dropTarget}
    />
  );
};

export function TreeContainer() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDraggingFromList, setIsDraggingFromList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tree, moveItem, addItem, setTree } = useBookmarkTreeStore();
  const { t } = useText();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const bookmarks = await importFromJson(file);
      const treeItems = convertFromChrome(bookmarks);
      setTree(treeItems);
      toast.success(t.bookmarks.importSuccess);
    } catch (error) {
      toast.error(t.bookmarks.dragDrop.errors.systemError);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    try {
      exportToJson(tree);
      toast.success(t.bookmarks.exportSuccess);
    } catch (error) {
      toast.error(t.bookmarks.dragDrop.errors.systemError);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const validateMove = (
    sourceId: UniqueIdentifier,
    destinationId: UniqueIdentifier | null,
    sourcePanel: "list" | "tree",
  ): boolean => {
    if (!destinationId) return true;

    const targetItem = findItemById(tree, destinationId);
    
    if (sourcePanel === "list" && (!targetItem || !isFolderItem(targetItem))) {
      toast.error(t.bookmarks.dragDrop.errors.invalidTarget);
      return false;
    }

    const isCircular = (
      itemId: UniqueIdentifier,
      targetId: UniqueIdentifier,
    ): boolean => {
      const item = findItemById(tree, targetId);
      if (!item) return false;
      if (item.id === String(itemId)) return true;
      return item.parentId ? isCircular(itemId, item.parentId) : false;
    };

    if (isCircular(sourceId, destinationId)) {
      toast.error(t.bookmarks.dragDrop.errors.circularRef);
      return false;
    }

    const getDepth = (itemId: UniqueIdentifier | null): number => {
      if (!itemId) return 0;
      const item = findItemById(tree, itemId);
      return item ? getDepth(item.parentId) + 1 : 0;
    };

    const newDepth = getDepth(destinationId) + 1;
    if (newDepth > MAX_DEPTH) {
      toast.error(t.bookmarks.dragDrop.errors.maxDepth(MAX_DEPTH));
      return false;
    }

    return true;
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!event.active.data.current) return;
    
    const dragData = event.active.data.current;
    setIsDraggingFromList(dragData.sourcePanel === "list");
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const dragData = event.active.data.current;
    const dropData = event.over?.data.current;

    if (!dragData || !event.over) {
      setActiveId(null);
      setIsDraggingFromList(false);
      return;
    }

    const isValid = validateMove(
      event.active.id,
      event.over.id,
      dragData.sourcePanel
    );
    
    if (!isValid) {
      setActiveId(null);
      setIsDraggingFromList(false);
      return;
    }

    const index = dropData?.sortable?.index ?? 0;
    
    if (dragData.sourcePanel === "list" && dragData.bookmarkData) {
      const newBookmark: BookmarkTreeItem = {
        id: String(event.active.id),
        type: "bookmark",
        name: dragData.bookmarkData.title,
        position: index,
        parentId: String(event.over.id),
        url: dragData.bookmarkData.url,
        icon: dragData.bookmarkData.icon,
        description: dragData.bookmarkData.description,
        tags: dragData.bookmarkData.tags,
      };
      addItem(newBookmark);
      toast.success(t.bookmarks.dragDrop.end.success);
    } else {
      moveItem(String(event.active.id), String(event.over.id), index);
    }

    setActiveId(null);
    setIsDraggingFromList(false);
  };

  const handleCreateFolder = () => {
    const newFolder: FolderTreeItem = {
      id: crypto.randomUUID(),
      type: "folder",
      name: t.bookmarks.newFolder,
      isExpanded: true,
      position: tree.length,
      parentId: null,
      children: [],
    };
    addItem(newFolder);
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
            items={tree.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {tree.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <TreeNode item={item} depth={0} />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>

          <DragOverlay>
            {activeId && (
              <div 
                className={cn(
                  "opacity-50",
                  isDraggingFromList && "bg-background shadow-lg"
                )}
              >
                {(() => {
                  const item = findItemById(tree, activeId);
                  if (!item) return null;
                  return <TreeNode item={item} depth={0} />;
                })()}
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {tree.length === 0 && (
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
