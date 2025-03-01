export const bookmarks = {
  "newFolder": "新しいフォルダ",
  "newBookmark": "新しいブックマーク",
  "deleteConfirm": "本当に削除しますか？",
  "import": "インポート",
  "export": "エクスポート",
  "importSuccess": "インポートに成功しました",
  "exportSuccess": "エクスポートに成功しました",
  
  "validation": {
    "maxDepth": (depth:number)=>
    `フォルダの深さは最大${depth}階層までです`,
    "circularRef": "循環参照は許可されていません",
    "duplicateName": "同じ名前のアイテムが既に存在します"
  },
  "bookmarkEditPage": {
    "title": "ブックマーク編集ページ",
    "listTitle": "ブックマーク一覧",
    "treeTitle": "ブックマークツリー",
    "commentTitle": "コメント",
    "commentPlaceholder": "コメント編集機能（準備中）",
    "registering": "登録中...",
    "registerSample": "サンプルデータを登録"
  }
} as const