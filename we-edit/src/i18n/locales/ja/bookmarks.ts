export const bookmarks = {
  rootFolder: "マイブックマーク",
  newFolder: "新しいフォルダ",
  newBookmark: "新しいブックマーク",
  deleteConfirm: "本当に削除しますか？",
  import: "インポート",
  export: "エクスポート",
  tags: "タグ",
  folderCreated: "フォルダを作成しました",
  addToFolder: "このフォルダに追加",
  dragDrop: {
    start: {
      bookmark: "ブックマークのドラッグを開始",
      folder: "フォルダのドラッグを開始"
    },
    during: {
      overFolder: "フォルダにドロップで移動",
    },
    aria: {
      draggable: "ドラッグ中のアイテム"
    },
    dragHint: "ドラッグ＆ドロップで並び替え可能"
  },
  bookmarkEditPage: {
    title: "ブックマーク編集",
    listTitle: "ブックマーク一覧",
    emptyMessage: "ブックマークがありません",
    dragHint: "ドラッグ＆ドロップで並び替えできます"
  },
  status: {
    loading: "読み込み中...",
    empty: "結果がありません",
    error: "エラーが発生しました"
  },
  viewMode: {
    card: "カード表示",
    list: "リスト表示"
  },
  comments: {
    comingSoon: "コメント機能は近日公開予定です"
  }
} as const;