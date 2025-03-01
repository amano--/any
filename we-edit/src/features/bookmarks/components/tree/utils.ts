import type { ChromeBookmark } from "../../types/bookmark";
import type { TreeItem, FolderTreeItem, BookmarkTreeItem } from "../../types/tree";
import { isFolder } from "../../types/tree";

/**
 * TreeItem配列をChromeブックマーク形式に変換する
 */
export const convertToChrome = (items: TreeItem[]): ChromeBookmark[] => {
  const convert = (item: TreeItem): ChromeBookmark => {
    const result: ChromeBookmark = {
      id: item.id,
      title: item.name,
      index: item.position,
    };

    if (item.parentId) {
      result.parentId = item.parentId;
    }

    if (isFolder(item) && item.children.length > 0) {
      result.children = item.children.map(convert);
    }

    return result;
  };

  return items.map(convert);
};

/**
 * Chromeブックマーク形式をTreeItem配列に変換する
 */
export const convertFromChrome = (items: ChromeBookmark[]): TreeItem[] => {
  const convert = (item: ChromeBookmark): TreeItem => {
    if (item.children) {
      // フォルダとして扱う
      const folder: FolderTreeItem = {
        id: item.id,
        type: "folder",
        name: item.title,
        isExpanded: true,
        position: item.index ?? 0,
        parentId: item.parentId ?? null,
        children: item.children.map(convert),
      };
      return folder;
    } else {
      // ブックマークとして扱う
      const bookmark: BookmarkTreeItem = {
        id: item.id,
        type: "bookmark",
        name: item.title,
        position: item.index ?? 0,
        parentId: item.parentId ?? null,
        url: "", // 必須フィールドだが、Chromeブックマークには対応するフィールドがないため空文字を設定
      };
      return bookmark;
    }
  };

  return items.map(convert);
};

/**
 * JSONファイルからChromeブックマークをインポートする
 */
export const importFromJson = async (file: File): Promise<ChromeBookmark[]> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as ChromeBookmark[];
    return data;
  } catch (error) {
    throw new Error("Invalid bookmark file format");
  }
};

/**
 * TreeItemをJSONファイルとしてエクスポートする
 */
export const exportToJson = (items: TreeItem[]) => {
  const chromeFormat = convertToChrome(items);
  const json = JSON.stringify(chromeFormat, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bookmarks.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};