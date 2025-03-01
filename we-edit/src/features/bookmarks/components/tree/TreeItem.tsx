import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '~/shadcn/lib/utils';
import type { TreeComponentProps } from '../../types';
import { Card } from '~/shadcn/components/ui/card';
import { Label } from '~/shadcn/components/ui/label';

/**
 * @ai_implementation
 * ツリー項目のコンポーネント
 * - ドラッグ&ドロップ可能
 * - フォルダ/ブックマークの表示切り替え
 * - 展開/折りたたみの状態管理
 */
export const TreeItem = forwardRef<
  HTMLDivElement,
  TreeComponentProps & HTMLAttributes<HTMLDivElement>
>(({
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
    paddingLeft: `${depth * 1.5}rem`,
  };

  const isFolder = type === 'folder';
  const baseClasses = "relative mb-2 p-2";
  const stateClasses = isDragging ? "opacity-50" : "";
  const typeClasses = isFolder ? "bg-muted" : "";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        baseClasses,
        stateClasses,
        typeClasses,
        className
      )}
      {...props}
    >
      <div
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        {/* アイコン */}
        <div className="flex-shrink-0">
          {isFolder ? (
            <button
              onClick={onToggle}
              className="p-1 hover:bg-accent rounded"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "📂" : "📁"}
            </button>
          ) : (
            <span role="img" aria-label="bookmark">
              {icon ?? "🔖"}
            </span>
          )}
        </div>

        {/* 名前 */}
        <Label className="flex-grow">
          {name}
        </Label>

        {/* URLとタグ（ブックマークの場合） */}
        {!isFolder && url && (
          <div className="flex-shrink-0 text-sm text-muted-foreground">
            {url}
          </div>
        )}
      </div>

      {/* 子要素 */}
      {children}
    </Card>
  );
});

TreeItem.displayName = 'TreeItem';