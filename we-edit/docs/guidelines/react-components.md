# Reactコンポーネント実装ガイドライン

## 目次

- [使用技術スタック](#使用技術スタック)
- [基本実装パターン](#基本実装パターン)
- [型定義](#型定義)
- [型安全性](#型安全性)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [コンポーネント分割](#コンポーネント分割)
- [テスタビリティ](#テスタビリティ)
- [再利用性](#再利用性)
- [コア設計原則](#コア設計原則)

## 使用技術スタック

| 技術                | 説明                                                                          |
| ------------------- | ----------------------------------------------------------------------------- |
| **Next.js**         | サーバーサイドレンダリングと静的サイト生成をサポートするReactフレームワーク。 |
| **React**           | ユーザーインターフェースを構築するためのJavaScriptライブラリ。                |
| **TypeScript**      | JavaScriptの型付きスーパーセット。                                            |
| **Tailwind CSS**    | ユーティリティファーストのCSSフレームワーク。                                 |
| **tRPC**            | 型安全なAPIを構築するためのフレームワーク。                                   |
| **react-hook-form** | Form管理ライブラリ。                                                          |
| **Zod**             | TypeScript向けのスキーマ宣言とバリデーションライブラリ。                      |
| **Drizzle ORM**     | TypeScriptとJavaScript向けのORM。                                             |
| **Radix UI**        | アクセシブルでスタイルのないUIコンポーネントセット。                          |
| **Storybook**       | UIコンポーネントを個別に開発するためのツール。                                |
| **Vitest**          | Viteネイティブのユニットテストフレームワーク。                                |

## コア設計原則

### 推奨される記法

```typescript
// ✅ 推奨: type + アロー関数コンポーネント
type TreeItemProps = {
  label: string
  expanded?: boolean
}

const TreeItem = ({label, expanded = false}: TreeItemProps) => {
  return <div>{label}</div>
}

// ✅ 推奨: カスタムフックもアロー関数で
const useTreeState = (initialState: boolean) => {
  const [isExpanded, setExpanded] = useState(initialState)
  return { isExpanded, setExpanded }
}

// ✅ 推奨: バリデーションスキーマ
import { z } from 'zod' // or yup

const treeItemSchema = z.object({
  label: z.string(),
  expanded: z.boolean().optional()
})
```

### 避けるべき記法

```typescript
// ❌ 避ける: export defaultの使用
// 理由: 名前付きエクスポートを使用することで、インポート時の名前の一貫性と自動補完が向上します。

// ❌ 避ける: interfaceの使用
interface TreeItemProps {
  label: string
}

// ❌ 避ける: クラスコンポーネント
class TreeItem extends React.Component<TreeItemProps> {
  render() {
    return <div>{this.props.label}</div>
  }
}

// ❌ 避ける: enumの使用
enum TreeItemType {
  Folder,
  File
}

// ❌ 避ける: 通常の関数宣言
function TreeItem(props: TreeItemProps) {
  return <div>{props.label}</div>
}
```

### 理由

1. **シンプルさと一貫性**

   - `type`と`const`の組み合わせで十分な表現力
   - コードベース全体で一貫したパターン
   - 理解しやすく保守しやすい

2. **型の柔軟性**

   - `type`は交差型(`&`)や共用型(`|`)との親和性が高い
   - 型の合成や分解が容易

3. **バンドルサイズの最適化**
   - クラスコンポーネントよりも関数コンポーネントの方が小さい
   - Tree Shakingの効率が向上

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
// ❌ any型の使用
const Component: FC<any> = (props) => {};

// ❌ 不明確な型名
type ComponentStuff = {};
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
type TreeNodeData = {
  id: string;
  label: string;
  children?: TreeNodeData[];
};

type TreeProps = {
  data: TreeNodeData;
  // 他の共通props
};

// 使用側
import type { TreeProps } from "@/types/components";
```

### Props型の宣言場所

- **推奨**: Propsの型宣言は、関連するFunctional Component (FC)と同じファイルに宣言してください。これにより、コンポーネントとその型定義が一箇所にまとまり、可読性と保守性が向上します。

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

## 機能別(src/features)の実装パターン

### クライアントサイドの構造

```
src/features/
  └── bookmarks/
      ├── index.ts         # 公開APIの定義
      ├── README.md        # 機能の説明とAPIドキュメント
      ├── api/            # API関連の実装
      ├── components/     # UIコンポーネント
      │   ├── tree/      # ツリービュー関連
      │   │   ├── index.ts
      │   │   ├── TreeContainer.tsx
      │   │   └── TreeItem.tsx
      │   └── list/      # リスト表示関連
      ├── constants/     # 定数定義
      ├── hooks/         # カスタムフック
      │   ├── index.ts
      │   ├── useBookmarkOperations.ts
      │   ├── useBookmarkTree.ts
      │   └── useTreeDragDrop.ts
      ├── logs/          # 開発ログ
      │   ├── ai/        # AI開発ログ
      │   └── prompt/    # プロンプト履歴
      ├── store/         # 状態管理
      ├── types/         # 型定義
      │   ├── index.ts
      │   ├── bookmark.ts
      │   ├── events.ts
      │   └── tree.ts
      └── utils/         # ユーティリティ関数
```

### サーバーサイドの構造

```
src/server/features/
  └── bookmarks/
      ├── router.ts      # tRPCルーター定義
      ├── schemas/       # バリデーションスキーマ
      ├── services/      # ビジネスロジック
      ├── repositories/  # データアクセス層
      └── types/         # 型定義

// router.tsの実装例
export const bookmarksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBookmarkSchema)
    .mutation(async ({ ctx, input }) => {
      // リポジトリを使用したデータ操作
      return ctx.db.bookmark.create(...)
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      // ユーザーのブックマーク一覧を取得
      return ctx.db.bookmark.findMany(...)
    })
})
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
   const Button = ({
     variant,
     size,
     children,
     ...props
   }: ButtonProps) => {
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
     };
   };

   const TreeView = ({ data }: TreeViewProps) => {
     const treeLogic = useTreeLogic(data);
     // UIの実装
   };
   ```

## テスタビリティ

### テスト容易な設計

```typescript
// ✅ 推奨: テスト可能な実装
const TreeItem = ({
  label,
  onSelect,
  testId = 'tree-item' // テスト用ID
}: TreeItemProps) => {
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

   const TreeItem = ({
     className,
     style,
     ...props
   }: TreeItemProps & StyleProps) => {
     return (
       <div
         className={cn('tree-item', className)}
         style={style}
         {...props}
       />
     )
   }
   ```

3. **スキーマバリデーションの活用**

   ```typescript
   import { z } from 'zod'

   // ✅ 推奨: バリデーションスキーマの定義
   const treeItemSchema = z.object({
     label: z.string().min(1),
     expanded: z.boolean().optional(),
     children: z.array(z.lazy(() => treeItemSchema)).optional()
   })

   type TreeItemData = z.infer<typeof treeItemSchema>

   const TreeItem = ({data}: {data: TreeItemData}) => {
     // スキーマによって型安全性が保証される
     return <div>{data.label}</div>
   }
   ```

## レイアウト設計

### レイアウトコンポーネントの構造化

```typescript
/**
 * @ai_component_structure
 * レイアウト構成:
 * - MainView: ページのメインコンテナ（w-full）
 *   - 左パネル (1): プライマリコンテンツ
 *   - 右パネル (2): セカンダリコンテンツ
 */
const MainView = () => {
  return (
    <div className="w-full grid grid-cols-[1fr_2fr] grid-rows-[1fr] gap-4 h-full">
      <div className="col-span-1 overflow-auto">
        {/* 左パネル */}
      </div>
      <div className="col-span-1 overflow-auto">
        {/* 右パネル */}
      </div>
    </div>
  )
}
```

### グリッドレイアウトのベストプラクティス

1. **比率の明示**

   - 固定幅より比率を優先（`grid-cols-[1fr_2fr]`）
   - レスポンシブ性の確保
   - 保守性の向上

2. **構造のドキュメント化**

   - コンポーネント構造をコメントで明示
   - パネルの役割と比率を記録
   - 変更履歴の管理

3. **オーバーフローの制御**
   - 各パネルに`overflow-auto`を設定
   - スクロール可能な領域の明確化
   - コンテンツの適切な表示

### レイアウト変更時の注意点

1. **ドキュメントの更新**

   - コンポーネント構造のコメントを更新
   - 変更理由と影響範囲を記録
   - 設計意図の明確化

2. **段階的な変更**

   - レイアウト構造の変更を最初に実施
   - スタイリングの調整は後で実施
   - 変更の影響を確認しながら進める

3. **整合性の確保**
   - グリッドシステムの一貫した使用
   - 命名規則の統一
   - アクセシビリティの維持

## ベストプラクティスのまとめ

1. **シンプルな型システム**

   - `type`と`const`を優先使用
   - `interface`、`class`、`enum`、`function`は避ける
   - スキーマバリデーションの活用

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

### パフォーマンス最適化

```typescript
// メモ化による再レンダリングの防止
const TranslatedLabel = memo(({ messageKey }: { messageKey: string }) => {
  const { t } = useText();
  return <span>{t.bookmarks.tree[messageKey]}</span>;
});

// 翻訳データを含むコンポーネントの分離
const LocalizedActions = () => {
  const { t } = useText();
  return (
    <div>
      <button>{t.bookmarks.tree.addFolder}</button>
      <button>{t.bookmarks.tree.deleteConfirm}</button>
    </div>
  );
};
```

### 型安全性の確保

```typescript
// src/i18n/types.ts
import type { bookmarks as en_bookmarks } from "./locales/en/bookmarks";

// 翻訳キーの型を定義
export type Bookmarks = typeof en_bookmarks;

// 翻訳の整合性を型で保証
const assertBookmarks = (messages: Bookmarks) => messages;
assertBookmarks(ja_bookmarks); // コンパイルエラーで不整合を検出
```
