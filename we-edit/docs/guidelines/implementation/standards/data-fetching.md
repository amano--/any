# データフェッチとコンポーネント設計のガイドライン

## 基本方針

データフェッチの責務は以下のように分離します：

- src/app: データフェッチを行う場所
- src/features: Propsでデータを受け取る純粋なコンポーネント

### 推奨パターン

```typescript
// ✅ 推奨: ページコンポーネントでデータをフェッチ
// src/app/[locale]/bookmarks/page.tsx
export default async function BookmarksPage() {
  const bookmarks = await fetchBookmarks();
  return <BookmarkList items={bookmarks} />;
}

// ✅ 推奨: featuresのコンポーネントはデータをPropsで受け取る
// src/features/bookmarks/components/BookmarkList.tsx
interface BookmarkListProps {
  items: Bookmark[];
}

export function BookmarkList({ items }: BookmarkListProps) {
  return <div>{/* レンダリングロジック */}</div>;
}
```

### アンチパターン

```typescript
// ❌ 避ける: featuresのコンポーネントでデータフェッチ
// src/features/bookmarks/components/BookmarkList.tsx
export function BookmarkList() {
  const { data } = useFetchBookmarks(); // コンポーネント内でのデータフェッチは避ける
  return <div>{/* レンダリングロジック */}</div>;
}
```

## 責務の分離

### src/app (ページ)の責務

1. **データフェッチ**
   - APIコールの実行
   - データ取得のエラーハンドリング
   - ローディング状態の管理

2. **状態管理の初期化**
   - グローバル状態の初期値設定
   - コンテキストプロバイダーの配置

3. **ルーティング関連**
   - URLパラメータの処理
   - リダイレクト制御
   - 認証状態の確認

### src/features (コンポーネント)の責務

1. **UI表示**
   - 受け取ったデータのレンダリング
   - ユーザーインタラクションの処理
   - スタイリング

2. **ローカル状態管理**
   - フォームの状態
   - UI状態（開閉状態など）
   - アニメーション状態

3. **イベントハンドリング**
   - クリックイベント
   - フォーム送信
   - ドラッグ＆ドロップ

## 実装例

### ページコンポーネント

```typescript
// src/app/[locale]/bookmarks/page.tsx
import { Suspense } from "react";
import { BookmarkView } from "~/features/bookmarks/components/bookmark/BookmarkView";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export default async function BookmarksPage() {
  // データフェッチ
  const bookmarks = await fetchBookmarks();
  const folders = await fetchFolders();

  // エラーバウンダリとサスペンスでラップ
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <BookmarkView 
          items={bookmarks}
          folders={folders}
          onSave={saveBookmark}
          onDelete={deleteBookmark}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 機能コンポーネント

```typescript
// src/features/bookmarks/components/bookmark/BookmarkView.tsx
interface BookmarkViewProps {
  items: Bookmark[];
  folders: Folder[];
  onSave: (bookmark: Bookmark) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function BookmarkView({
  items,
  folders,
  onSave,
  onDelete
}: BookmarkViewProps) {
  // ローカル状態の管理
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // イベントハンドラ
  const handleSelect = (id: string) => {
    setSelectedItem(id);
  };

  return (
    <div>{/* UIレンダリング */}</div>
  );
}
```

## メリット

1. **関心の分離**
   - ページ: データ取得とルーティング
   - コンポーネント: UI表示とインタラクション

2. **テスタビリティの向上**
   - Propsで依存を注入できるため、単体テストが容易
   - モックデータでの表示確認が簡単

3. **再利用性の向上**
   - コンポーネントがデータフェッチに依存しないため、異なるコンテキストで再利用可能
   - 表示ロジックとデータ取得ロジックの分離により、保守性が向上

4. **パフォーマンスの最適化**
   - ページレベルでのデータプリフェッチが可能
   - コンポーネントの不要な再レンダリングを防止

## 例外的なケース

以下のようなケースでは、コンポーネント内でのデータフェッチを許容する場合があります：

1. **無限スクロール**
   - ユーザーインタラクションに基づく追加データの取得
   - ページネーションの実装

2. **リアルタイム更新**
   - WebSocketを使用したライブデータの取得
   - ポーリングが必要なケース

3. **検索機能**
   - ユーザー入力に基づく動的な検索結果の取得
   - オートコンプリート機能

これらの例外的なケースでも、可能な限りページコンポーネントにデータフェッチロジックを移動することを検討してください。