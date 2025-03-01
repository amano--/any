/**
 * Chromeブックマークのインポート/エクスポート用の型定義
 */
export interface ChromeBookmark {
  id: string;
  parentId?: string;
  index?: number;
  title: string;
  dateAdded?: number;
  children?: ChromeBookmark[];
}

/**
 * ブックマークツリーのアイテム
 */
export interface TreeItem {
  id: string;
  name: string;
  isExpanded: boolean;
  position: number;
  parentId: string | null;
  children: TreeItem[];
}

export interface DragEndEvent {
  active: {
    id: string;
  };
  over: {
    id: string;
    data?: {
      current?: {
        sortable?: {
          index?: number;
        };
      };
    };
  } | null;
}
