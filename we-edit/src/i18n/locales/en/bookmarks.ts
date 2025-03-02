export const bookmarks = {
  rootFolder: "My Bookmarks",
  newFolder: "New Folder",
  newBookmark: "New Bookmark",
  deleteConfirm: "Are you sure you want to delete?",
  import: "Import",
  export: "Export",
  tags: "Tags",
  folderCreated: "Folder created successfully",
  addToFolder: "Add to this folder",
  dragDrop: {
    start: {
      bookmark: "Start dragging bookmark",
      folder: "Start dragging folder"
    },
    during: {
      overFolder: "Drop to move into folder",
    },
    aria: {
      draggable: "Dragging item"
    },
    dragHint: "Drag and drop to reorder"
  },
  bookmarkEditPage: {
    title: "Edit Bookmarks",
    listTitle: "Bookmark List",
    emptyMessage: "No bookmarks found",
    dragHint: "Drag and drop to reorder items"
  },
  status: {
    loading: "Loading...",
    empty: "No results",
    error: "An error occurred"
  },
  viewMode: {
    card: "Card View",
    list: "List View"
  },
  comments: {
    comingSoon: "Comments feature coming soon"
  }
} as const;