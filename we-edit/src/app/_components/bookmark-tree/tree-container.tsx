import { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
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
import type { TreeItem as TreeItemType } from "~/types/bookmark-tree";
import type { DragStartEvent, DragEndEvent } from "~/types/drag-events";
import { exportToJson, importFromJson, convertFromChrome } from "./utils";
import { useText } from "~/i18n/text";

const MAX_DEPTH = 5;

const findItemById = (items: TreeItemType[], id: UniqueIdentifier): TreeItemType | null => {
  for (const item of items) {
    if (item.id === String(id)) return item;
    if (item.children) {
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

  return (
    <TreeItem
      {...item}
      depth={depth}
      onToggle={() => {
        updateItem(item.id, { isExpanded: !item.isExpanded });
      }}
      onNameChange={(newName) => {
        updateItem(item.id, { name: newName });
      }}
    >
      {item.isExpanded && item.children && item.children.length > 0 && (
        <div className="pl-6">
          {item.children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              depth={(depth + 1) as 0 | 1 | 2 | 3 | 4 | 5}
            />
          ))}
        </div>
      )}
    </TreeItem>
  );
};

export function TreeContainer() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tree, moveItem, addItem, setTree } = useBookmarkTreeStore();
  const {t} = useText();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const bookmarks = await importFromJson(file);
      const treeItems = convertFromChrome(bookmarks);
      setTree(treeItems);
      toast.success(t.common.bookmarks.importSuccess);
    } catch (error) {
      toast.error(t.common.bookmarks.importSuccess);
    }

    // ファイル選択をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    try {
      exportToJson(tree);
      toast.success(t.common.bookmarks.exportSuccess);
    } catch (error) {
      toast.error(t.common.bookmarks.exportSuccess);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // バリデーション関数
  const validateMove = (sourceId: UniqueIdentifier, destinationId: UniqueIdentifier | null): boolean => {
    if (!destinationId) return true;

    // 循環参照チェック
    const isCircular = (itemId: UniqueIdentifier, targetId: UniqueIdentifier): boolean => {
      const item = findItemById(tree, targetId);
      if (!item) return false;
      if (item.id === String(itemId)) return true;
      return item.parentId ? isCircular(itemId, item.parentId) : false;
    };

    // 深さチェック
    const getDepth = (itemId: UniqueIdentifier | null): number => {
      if (!itemId) return 0;
      const item = findItemById(tree, itemId);
      return item ? getDepth(item.parentId) + 1 : 0;
    };

    if (isCircular(sourceId, destinationId)) {
      toast.error(t.common.bookmarks.validation.circularRef);
      return false;
    }

    const newDepth = getDepth(destinationId) + 1;
    if (newDepth > MAX_DEPTH) {
      toast.error(t.common.bookmarks.validation.maxDepth(MAX_DEPTH));
      return false;
    }

    return true;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const isValid = validateMove(active.id, over.id);
      if (!isValid) return;

      const index = over.data?.current?.sortable?.index ?? 0;
      moveItem(String(active.id), String(over.id), index);
    }

    setActiveId(null);
  };

  const handleCreateFolder = () => {
    const newFolder: TreeItemType = {
      id: crypto.randomUUID(),
      name: t.common.bookmarks.newFolder,
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
        {t.common.bookmarks.newFolder}
      </Button>

      <div className="flex-1 overflow-auto p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tree.map(item => item.id)}
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
              <div className="opacity-50">
                {(() => {
                  const item = findItemById(tree, activeId);
                  return item ? <TreeNode item={item} depth={0} /> : null;
                })()}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
