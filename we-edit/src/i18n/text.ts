import { usePathname } from "next/navigation";
import { resources } from "./resources";

export type Locale = keyof typeof resources;

export const text = (locale: Locale) => resources[locale];

export const useText = () => {
  const pathname = usePathname();
  const localeMatch = /^\/([a-z]{2})\//.exec(pathname || "");
  const locale = (localeMatch?.[1] ?? "ja") as Locale;

  return { t: text(locale) };
};
