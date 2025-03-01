import type { ChromeBookmark, TreeItem } from "~/types/bookmark-tree";

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

    if (item.children && item.children.length > 0) {
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
    return {
      id: item.id,
      name: item.title,
      isExpanded: true,
      position: item.index ?? 0,
      parentId: item.parentId ?? null,
      children: item.children ? item.children.map(convert) : [],
    };
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