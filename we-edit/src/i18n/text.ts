/**
 * [実装計画書](../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

// 各言語の翻訳ファイルをインポート
import { bookmarks as bookmarks_ja } from "./locales/ja/bookmarks";
import { bookmarks as bookmarks_en } from "./locales/en/bookmarks";
import { group as group_ja } from "./locales/ja/group";
import { group as group_en } from "./locales/en/group";

// 言語リソースの定義
const locales = {
  ja: {
    bookmarks: bookmarks_ja,
    group: group_ja
  },
  en: {
    bookmarks: bookmarks_en,
    group: group_en
  }
} as const;

// 型の定義
export type LocaleKey = keyof typeof locales;
export type Messages = typeof locales.ja;

// 翻訳テキストを取得する関数
export const text = (locale: LocaleKey = "ja") => locales[locale];

// React Hooks用のユーティリティ
export const useText = () => ({ t: text("ja") });
