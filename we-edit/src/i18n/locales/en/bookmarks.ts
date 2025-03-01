export const bookmarks = {
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
} as const