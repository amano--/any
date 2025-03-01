/**
 * @link 実装計画書 src/features/bookmarks/logs/ai/2025-03-02_08_22-bookmark-tree-edit-functionality.md
 *
 * @ai_implementation
 * ブックマークツリーの名前をダブルクリックで編集できる機能と
 * フォルダに子要素を追加できる機能の実装
 * - ダブルクリックで編集モードに切り替え
 * - 編集モード中はInputコンポーネントを表示
 * - フォルダの場合は子要素追加ボタンを表示
 */

import { forwardRef, useState, useRef, useEffect } from 'react';
import type { HTMLAttributes, KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '~/shadcn/lib/utils';
import type { TreeComponentProps } from '../../types';
import { Card } from '~/shadcn/components/ui/card';
import { Label } from '~/shadcn/components/ui/label';
import { Input } from '~/shadcn/components/ui/input';
import { Button } from '~/shadcn/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useText } from '~/i18n/text';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useText();

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

  // 編集モードを開始
  const handleDoubleClick = () => {
    if (!isDragging) {
      setIsEditing(true);
    }
  };

  // 編集を保存
  const saveEdit = () => {
    if (editValue.trim() !== '' && editValue !== name) {
      onNameChange?.(editValue.trim());
    }
    setIsEditing(false);
  };

  // キーボードイベント処理
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditValue(name);
      setIsEditing(false);
    }
  };

  // 編集モードになったらフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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

        {/* 名前（編集モード/表示モード） */}
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="flex-grow h-8 py-1"
            autoFocus
          />
        ) : (
          <Label
            className="flex-grow cursor-text"
            onDoubleClick={handleDoubleClick}
          >
            {name}
          </Label>
        )}

        {/* URLとタグ（ブックマークの場合） */}
        {!isFolder && url && !isEditing && (
          <div className="flex-shrink-0 text-sm text-muted-foreground">
            {url}
          </div>
        )}

        {/* フォルダの場合、子要素追加ボタン */}
        {isFolder && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={t.bookmarks.addToFolder}
            onClick={(e) => {
              e.stopPropagation();
              // フォルダに子要素を追加するためのコンテキストメニューを表示
              // または直接子フォルダを追加
              if (onToggle) {
                // まずフォルダを展開
                if (!isExpanded) {
                  onToggle();
                }
                // 子フォルダ追加イベントを発火
                const event = new CustomEvent('add-to-folder', {
                  detail: { folderId: id }
                });
                window.dispatchEvent(event);
              }
            }}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 子要素 */}
      {children}
    </Card>
  );
});

TreeItem.displayName = 'TreeItem';