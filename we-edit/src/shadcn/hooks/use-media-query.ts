/**
 * メディアクエリの状態を監視するカスタムフック
 * @link https://ui.shadcn.com/docs/hooks/use-media-query
 */

import { useEffect, useState } from "react";

/**
 * メディアクエリマッチングフック
 * @param query メディアクエリ文字列
 * @returns マッチ状態
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);
    } else {
      // @deprecated: Safari用の後方互換性対応
      mediaQuery.addListener(handler);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handler);
      } else {
        // @deprecated: Safari用の後方互換性対応
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  // SSRとhydration対策
  if (!mounted) {
    return false;
  }

  return matches;
};