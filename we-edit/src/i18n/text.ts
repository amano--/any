import { common as common_en } from "./locales/en/common";
import { bookmarks as bookmarks_en } from "./locales/en/bookmarks";
import { errors as errors_en } from "./locales/en/errors";

import { common as common_ja } from "./locales/ja/common";
import { bookmarks as bookmarks_ja } from "./locales/ja/bookmarks";
import { errors as errors_ja } from "./locales/ja/errors";

// 各言語のメッセージを定義
const locales = {
  en: {
    common: common_en,
    bookmarks: bookmarks_en,
    errors: errors_en
  },
  ja: {
    common: common_ja,
    bookmarks: bookmarks_ja,
    errors: errors_ja
  }
};

export const text = (locale: keyof typeof locales = "ja") => locales[locale];

export const useText = () => ({ t: text("ja") });
