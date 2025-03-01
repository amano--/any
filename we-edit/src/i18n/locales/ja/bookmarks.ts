export const bookmarks = {
  "rootFolder": "マイブックマーク",
  "newFolder": "新しいフォルダ",
  "newBookmark": "新しいブックマーク",
  "deleteConfirm": "本当に削除しますか？",
  "import": "インポート",
  "export": "エクスポート",
  "importSuccess": "インポートに成功しました",
  "exportSuccess": "エクスポートに成功しました",
  "folderCreated": "フォルダを作成しました",
  "addToFolder": "フォルダに追加",
  
  "validation": {
    "maxDepth": (depth:number) =>
    `フォルダの深さは最大${depth}階層までです`,
    "circularRef": "循環参照は許可されていません",
    "duplicateName": "同じ名前のアイテムが既に存在します"
  },

  "dragDrop": {
    "start": {
      "bookmark": "ブックマークのドラッグを開始",
      "folder": "フォルダのドラッグを開始"
    },
    "during": {
      "overFolder": "フォルダにドロップして中に追加",
      "betweenItems": "アイテム間にドロップ",
      "invalidTarget": "ここにはドロップできません"
    },
    "end": {
      "success": "移動しました",
      "cancelled": "移動をキャンセルしました",
      "failed": "移動に失敗しました"
    },
    "errors": {
      "maxDepth": (depth: number) => `フォルダの深さが最大${depth}階層を超えるため移動できません`,
      "circularRef": "フォルダを自身の中に移動することはできません",
      "invalidTarget": "このアイテムの中には移動できません",
      "systemError": "システムエラーが発生しました"
    },
    "aria": {
      "grabHandle": "ドラッグハンドル",
      "draggable": "ドラッグ可能",
      "dropTarget": "ドロップ可能な場所",
      "dragInProgress": "移動中",
      "dropIndicator": "ドロップ位置"
    }
  },

  "bookmarkEditPage": {
    "title": "ブックマーク編集ページ",
    "listTitle": "ブックマーク一覧",
    "treeTitle": "ブックマークツリー",
    "commentTitle": "コメント",
    "commentPlaceholder": "コメント編集機能（準備中）",
    "registering": "登録中...",
    "registerSample": "サンプルデータを登録",
    "dragHint": "リストのアイテムをドラッグしてツリーに追加できます"
  },

  "status": {
    "moving": "移動中...",
    "saving": "保存中...",
    "saved": "保存完了",
    "error": "エラーが発生しました"
  }
} as const