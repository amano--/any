# Reactコンポーネント実装ガイドライン

## 目次
- [基本実装パターン](#基本実装パターン)
- [型定義](#型定義)
- [型安全性](#型安全性)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [コンポーネント分割](#コンポーネント分割)
- [テスタビリティ](#テスタビリティ)
- [再利用性](#再利用性)

## 基本実装パターン

### 推奨パターン

```typescript
import { type FC } from 'react'

type ComponentProps = {
  // 必須のprops
  required: string
  // オプショナルのprops
  optional?: number
  // 子要素
  children?: React.ReactNode
  // イベントハンドラ
  onAction?: (value: string) => void
}

export const Component: FC<ComponentProps> = ({
  required,
  optional = 0, // デフォルト値の設定
  children,
  onAction
}) => {
  // 内部の状態管理
  const [state, setState] = useState<string>('')

  // メモ化されたコールバック
  const handleAction = useCallback(() => {
    onAction?.(state)
  }, [onAction, state])

  return (
    <div>
      {/* JSXの実装 */}
    </div>
  )
}

// コンポーネントの表示名を設定（デバッグ用）
Component.displayName = 'Component'
```

### アンチパターン

```typescript
// ❌ 避けるべきパターン
type Props = {p: string}
const Component: FC<Props> = ({p}) => {}

// ❌ any型の使用
const Component: FC<any> = (props) => {}

// ❌ 不明確な型名
type ComponentStuff = {}
```

## 型定義

### Props型の命名規則

```typescript
// ✅ 推奨: ComponentName + Props
type TreeItemProps = {
  label: string
  depth: number
}

// ✅ 推奨: 共有Props型の場合
type SharedTreeProps = {
  onSelect: (id: string) => void
}

// コンポーネントでの使用
export const TreeItem: FC<TreeItemProps & SharedTreeProps> = ({...})
```

### 型の集中管理

```typescript
// src/types/components.ts
export interface TreeNodeData {
  id: string
  label: string
  children?: TreeNodeData[]
}

export type TreeProps = {
  data: TreeNodeData
  // 他の共通props
}

// 使用側
import type { TreeProps } from '@/types/components'
```

## 型安全性

### 厳格な型チェック

```typescript
// tsconfig.jsonの推奨設定
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ジェネリック型の活用

```typescript
type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

export const List = <T extends {id: string}>({
  items,
  renderItem
}: ListProps<T>) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

## パフォーマンス最適化

### メモ化の適切な使用

```typescript
// ✅ 推奨: 重い計算の結果をメモ化
const memoizedValue = useMemo(() => {
  return expensiveComputation(prop)
}, [prop])

// ✅ 推奨: コールバックのメモ化
const handleClick = useCallback((id: string) => {
  onSelect?.(id)
}, [onSelect])

// ✅ 推奨: 子コンポーネントのメモ化
const ChildComponent = memo(({data}: ChildProps) => {
  return <div>{/* 複雑なレンダリング */}</div>
})
```

### レンダリング最適化

```typescript
// ✅ 推奨: 条件付きレンダリング
const TreeItem: FC<TreeItemProps> = ({expanded}) => {
  // 条件に応じて早期リターン
  if (!expanded) return null

  return (
    <div>
      {/* 複雑なツリー構造 */}
    </div>
  )
}

// ✅ 推奨: 仮想化リストの使用
import { VirtualizedList } from 'react-virtualized'

const LargeList: FC<LargeListProps> = ({items}) => {
  return (
    <VirtualizedList
      rowCount={items.length}
      rowRenderer={({index}) => <Item data={items[index]} />}
    />
  )
}
```

## コンポーネント分割

### 分割の基準

1. **単一責任の原則**
   ```typescript
   // ✅ 推奨: 機能ごとに分割
   const BookmarkTree = () => {
     return (
       <div>
         <TreeSearch /> {/* 検索機能 */}
         <TreeView />   {/* ツリー表示 */}
         <TreeActions /> {/* アクション群 */}
       </div>
     )
   }
   ```

2. **再利用性**
   ```typescript
   // ✅ 推奨: 汎用コンポーネント
   const Button: FC<ButtonProps> = ({
     variant,
     size,
     children,
     ...props
   }) => {
     return (
       <button className={`btn-${variant} btn-${size}`} {...props}>
         {children}
       </button>
     )
   }
   ```

3. **複雑さの管理**
   ```typescript
   // ✅ 推奨: ロジックの分離
   const useTreeLogic = (initialData: TreeData) => {
     // 複雑なロジックをカスタムフックに分離
     return {
       // ツリー操作のメソッド群
     }
   }

   const TreeView: FC<TreeViewProps> = ({data}) => {
     const treeLogic = useTreeLogic(data)
     // UIの実装
   }
   ```

## テスタビリティ

### テスト容易な設計

```typescript
// ✅ 推奨: テスト可能な実装
const TreeItem: FC<TreeItemProps> = ({
  label,
  onSelect,
  testId = 'tree-item' // テスト用ID
}) => {
  return (
    <div
      data-testid={testId}
      onClick={() => onSelect?.()}
      role="treeitem"
    >
      {label}
    </div>
  )
}

// テストコード
describe('TreeItem', () => {
  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn()
    render(<TreeItem label="Test" onSelect={onSelect} />)
    
    userEvent.click(screen.getByTestId('tree-item'))
    expect(onSelect).toHaveBeenCalled()
  })
})
```

## 再利用性

### コンポーネント設計の原則

1. **Compound Componentsパターン**
   ```typescript
   const Tree = {
     Root: ({children}: {children: React.ReactNode}) => {...},
     Branch: ({children}: {children: React.ReactNode}) => {...},
     Leaf: ({label}: {label: string}) => {...}
   }

   // 使用例
   <Tree.Root>
     <Tree.Branch>
       <Tree.Leaf label="Item 1" />
     </Tree.Branch>
   </Tree.Root>
   ```

2. **カスタマイズ可能なスタイリング**
   ```typescript
   type StyleProps = {
     className?: string
     style?: React.CSSProperties
   }

   const TreeItem: FC<TreeItemProps & StyleProps> = ({
     className,
     style,
     ...props
   }) => {
     return (
       <div
         className={cn('tree-item', className)}
         style={style}
         {...props}
       />
     )
   }
   ```

3. **拡張可能なProps**
   ```typescript
   type BaseProps = {
     // 基本的なprops
   }

   type ExtendedProps = BaseProps & {
     // 追加のprops
   }

   // 基本コンポーネント
   const BaseComponent: FC<BaseProps> = (props) => {...}

   // 拡張コンポーネント
   const ExtendedComponent: FC<ExtendedProps> = (props) => {
     return <BaseComponent {...props} />
   }
   ```

## ベストプラクティスのまとめ

1. **型安全性**
   - 厳格な型チェックを有効化
   - Props型を明確に定義
   - ジェネリック型の適切な活用

2. **パフォーマンス**
   - 適切なメモ化の使用
   - 条件付きレンダリング
   - 仮想化の活用

3. **メンテナンス性**
   - 単一責任の原則に従う
   - テスト可能な設計
   - 明確な命名規則

4. **再利用性**
   - 柔軟なカスタマイズ
   - 拡張可能な設計
   - 共通パターンの抽出