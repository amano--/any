export const bookmarks = {
  "newFolder": "New Folder",
  "newBookmark": "New Bookmark",
  "deleteConfirm": "Are you sure you want to delete?",
  "import": "Import",
  "export": "Export",
  "importSuccess": "Import successful",
  "exportSuccess": "Export successful",
  
  "validation": {
    "maxDepth": (depth:number) =>
    `Folder depth cannot exceed ${depth} levels`,
    "circularRef": "Circular reference is not allowed",
    "duplicateName": "An item with this name already exists"
  },

  "dragDrop": {
    "start": {
      "bookmark": "Start dragging bookmark",
      "folder": "Start dragging folder"
    },
    "during": {
      "overFolder": "Drop to add inside folder",
      "betweenItems": "Drop between items",
      "invalidTarget": "Cannot drop here"
    },
    "end": {
      "success": "Item moved successfully",
      "cancelled": "Move cancelled",
      "failed": "Failed to move item"
    },
    "errors": {
      "maxDepth": (depth: number) => `Cannot move: would exceed maximum depth of ${depth} levels`,
      "circularRef": "Cannot move a folder into itself",
      "invalidTarget": "Cannot move into this item",
      "systemError": "A system error occurred"
    },
    "aria": {
      "grabHandle": "Drag handle",
      "draggable": "Draggable",
      "dropTarget": "Drop target",
      "dragInProgress": "Moving",
      "dropIndicator": "Drop position"
    }
  },

  "bookmarkEditPage": {
    "title": "Edit Bookmarks",
    "listTitle": "Bookmark List",
    "treeTitle": "Bookmark Tree",
    "commentTitle": "Comments",
    "commentPlaceholder": "Comment editing (coming soon)",
    "registering": "Registering...",
    "registerSample": "Register Sample Data",
    "dragHint": "Drag items from the list to add them to the tree"
  },

  "status": {
    "moving": "Moving...",
    "saving": "Saving...",
    "saved": "Saved",
    "error": "An error occurred"
  }
} as const