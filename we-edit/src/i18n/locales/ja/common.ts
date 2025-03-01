export const common ={
  "navigation": {
    "home": "ホーム",
    "bookmarks": "ブックマーク",
    "settings": "設定"
  },
  "actions": {
    "add": "追加",
    "edit": "編集",
    "delete": "削除",
    "save": "保存",
    "cancel": "キャンセル",
    "drag": "ドラッグして移動",
    "expand": "展開",
    "collapse": "折りたたむ",
    "doubleClickToEdit": "ダブルクリックして編集"
  },
  "bookmarks": {
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
  },
  "errors": {
    "general": "エラーが発生しました",
    "notFound": "ページが見つかりません",
    "network": "ネットワークエラーが発生しました",
    "validation": "入力内容に誤りがあります"
  }
} as const
