import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  GripVertical,
  Link,
} from "lucide-react";
import { Button } from "~/shadcn/components/ui/button";
import { Input } from "~/shadcn/components/ui/input";
import { treeItemStyles } from "./styles";
import { useText } from "~/i18n/text";

/**
 * 共通のTreeItemプロパティ
 */
interface BaseTreeItemProps {
  id: string;
  name: string;
  depth: 0 | 1 | 2 | 3 | 4 | 5;
  onNameChange: (name: string) => void;
  children?: React.ReactNode;
  "aria-label"?: string;
}

/**
 * フォルダ用のTreeItemプロパティ
 */
interface FolderTreeItemProps extends BaseTreeItemProps {
  type: "folder";
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * ブックマーク用のTreeItemプロパティ
 */
interface BookmarkTreeItemProps extends BaseTreeItemProps {
  type: "bookmark";
  url: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

/**
 * TreeItemのプロパティ型
 */
export type TreeItemProps = FolderTreeItemProps | BookmarkTreeItemProps;

/**
 * 型ガード関数
 */
const isFolderProps = (props: TreeItemProps): props is FolderTreeItemProps => {
  return props.type === "folder";
};

export function TreeItem(props: TreeItemProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(props.name);
  const { t } = useText();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameSubmit = () => {
    setIsEditing(false);
    if (editName !== props.name) {
      props.onNameChange(editName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditName(props.name);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={treeItemStyles({
        isDragging,
        depth: props.depth,
      })}
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          {...listeners}
          title={t.common.actions.drag}
          aria-label={t.common.actions.drag}
        >
          <GripVertical className="h-4 w-4" />
        </Button>

        {isFolderProps(props) ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={props.onToggle}
            title={props.isExpanded ? t.common.actions.collapse : t.common.actions.expand}
          >
            {props.isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : null}

        {isFolderProps(props) ? (
          <Folder className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Link className="h-4 w-4 text-muted-foreground" />
        )}

        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="h-7 py-1"
            autoFocus
            aria-label={t.common.actions.edit}
            title={t.common.actions.edit}
            placeholder={t.common.actions.edit}
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className="flex-1 cursor-default"
            title={t.common.actions.doubleClickToEdit}
            aria-label={t.common.actions.doubleClickToEdit}
          >
            {props.name}
          </span>
        )}
      </div>

      {props.children}
    </div>
  );
}
