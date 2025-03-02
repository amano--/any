import { forwardRef, memo } from "react";
import type { HTMLAttributes } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "~/shadcn/lib/utils";
import type { TreeComponentProps } from "../../types";
import { ChevronRight, ChevronDown, GripVertical } from "lucide-react";

/**
 * インデントガイド（垂直線）コンポーネントの型定義
 */
type IndentGuideProps = {
  depth: number;
};

/**
 * インデントガイド（垂直線）コンポーネント
 */
const IndentGuide = ({ depth }: IndentGuideProps) => {
  if (depth === 0) return null;
  
  return Array.from({ length: depth }).map((_, index) => (
    <div
      key={index}
      className="absolute w-px h-full bg-border"
      style={{
        left: `${(index + 1) * 1.5}rem`,
      }}
    />
  ));
};

IndentGuide.displayName = "IndentGuide";

/**
 * ツリー項目コンポーネントの型定義
 */
type TreeItemComponentProps = TreeComponentProps & HTMLAttributes<HTMLDivElement>;

/**
 * @ai_implementation
 * ツリー項目のコンポーネント
 * - ドラッグ&ドロップ可能
 * - フォルダ/ブックマークの表示切り替え
 * - 展開/折りたたみの状態管理
 * - アクセシビリティ対応
 * - キーボード操作
 */
const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps>(({
  id,
  name,
  type,
  depth,
  isExpanded,
  children,
  onToggle,
  onNameChange,
  url,
  icon,
  description,
  tags,
  className,
  ...props
}, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isFolder = type === "folder";
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative mb-2 transition-all",
        isDragging ? "opacity-50 z-50" : "",
        className
      )}
      role="treeitem"
      aria-expanded={isFolder ? isExpanded : undefined}
      {...props}
    >
      {/* インデントガイド */}
      <IndentGuide depth={depth} />

      {/* コンテンツ */}
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg",
          "hover:bg-accent/50",
          "relative ml-[1.5rem]",
          `pl-[${(depth * 1.5)}rem]`
        )}
        {...attributes}
        {...listeners}
      >
        {/* ドラッグハンドル */}
        <div className="flex-shrink-0">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* フォルダ/ブックマークアイコン */}
        <div className="flex-shrink-0">
          {isFolder ? (
            <button
              onClick={onToggle}
              className={cn(
                "p-1 rounded-sm transition-colors",
                "hover:bg-accent focus:bg-accent focus:outline-none"
              )}
              aria-label={`${isExpanded ? "折りたたむ" : "展開する"}: ${name}`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span 
              role="img" 
              aria-label="ブックマーク"
              className="w-4 h-4"
            >
              {icon ?? "🔖"}
            </span>
          )}
        </div>

        {/* 名前 */}
        <div className="flex-grow truncate font-medium">
          {name}
        </div>

        {/* URLとタグ（ブックマークの場合） */}
        {!isFolder && url && (
          <div className="flex-shrink-0 text-sm text-muted-foreground truncate max-w-[200px]">
            {url}
          </div>
        )}
      </div>

      {/* 子要素 */}
      {children && isExpanded && (
        <div className="overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
});

TreeItemComponent.displayName = "TreeItemComponent";

/**
 * メモ化されたTreeItemコンポーネント
 */
export const TreeItem = memo(TreeItemComponent, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.name === next.name &&
    prev.isExpanded === next.isExpanded &&
    prev.depth === next.depth
  );
});

TreeItem.displayName = "TreeItem";