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
 * ブックマークの基本プロパティ
 */
export interface BaseBookmarkData {
  name: string;
  url: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

/**
 * ブックマークの操作結果
 */
export interface BookmarkOperationResult {
  success: boolean;
  error?: string;
}

/**
 * ブックマークの検証結果
 */
export interface BookmarkValidationResult {
  isValid: boolean;
  error?: string;
  errorType?: "DUPLICATE" | "INVALID_URL" | "MISSING_REQUIRED";
}

/**
 * ブックマークのフィルタリングオプション
 */
export interface BookmarkFilterOptions {
  tags?: string[];
  searchText?: string;
  startDate?: Date;
  endDate?: Date;
}