# 境界付けられたコンテキスト一覧

| 境界付けられたコンテキスト名 | 英名         | 短縮Id |
| ---------------------------- | ------------ | ------ |
| 会員                         | member       | m      |
| ブックマーク                 | bookmark     | b      |
| 記事                         | article      | a      |
| 新聞                         | newspaper    | np     |
| 通知                         | notification | n      |
| ポイント                     | point        | p      |
| 決済                         | payment      | py     |
| タグ                         | tag          | t      |
| カテゴリ                     | category     | c      |
| 関係                         | relation     | r      |
| システム                     | system       | s      |
| イベント                     | event        | e      |

## 短縮Id選定の基準

1. 一意性: 他のコンテキストと重複しない
2. 簡潔性: 単一文字を優先（可能な場合）
3. 推測可能性: コンテキスト名から推測しやすい
4. 一貫性: 同じパターンで命名

## 使用例

イベントの型定義において、コンテキストを示すために使用：

```typescript
type BookmarkCreateEvent = {
  b: "b"; // bookmark context
  g: "m"; // management group
  f: "c"; // create feature
  a: "add";
  ei: ULID;
};
```

## コンテキスト間の関係

必要に応じて、コンテキスト間で以下のような関係を定義できます：

1. Bookmark-Tag関係
2. Bookmark-Category関係
3. Note-Bookmark関係
4. Notification-Event関係
   など

これらの関係は、`Relation`コンテキストで管理されます。
