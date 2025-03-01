import { common as common_en } from "./locales/en/common";
import { common as common_ja} from "./locales/ja/common";

// 各言語のメッセージを定義
const locales= {en:{common:common_en}, ja:{common:common_ja} }; 

export const text:(locale:keyof typeof locales) => typeof locales[keyof typeof locales] = (locale="ja") => locales[locale];

export const useText = () => ({t:text("ja")});
