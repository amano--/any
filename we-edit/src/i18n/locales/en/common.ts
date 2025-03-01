export const common ={
  "navigation": {
    "home": "Home",
    "bookmarks": "Bookmarks",
    "settings": "Settings"
  },
  "actions": {
    "add": "Add",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "drag": "Drag to move",
    "expand": "Expand",
    "collapse": "Collapse",
    "doubleClickToEdit": "Double click to edit"
  },
  "bookmarks": {
    "newFolder": "New Folder",
    "newBookmark": "New Bookmark",
    "deleteConfirm": "Are you sure you want to delete?",
    "import": "Import",
    "export": "Export",
    "importSuccess": "Import Success",
    "exportSuccess": "Export Success",
    "validation": {
      "maxDepth": (depth:number)=>
      `Folder depth cannot exceed ${depth}levels`,
      "circularRef": "Circular reference is not allowed",
      "duplicateName": "An item with the same name already exists"
    }
  },
  "errors": {
    "general": "An error occurred",
    "notFound": "Page not found",
    "network": "Network error occurred",
    "validation": "Invalid input"
  }
} as const