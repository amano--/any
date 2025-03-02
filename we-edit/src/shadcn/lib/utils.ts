import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwindクラス名を結合するユーティリティ
 * clsxでクラス名を結合し、tailwind-mergeで競合を解決
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * コンポーネントの名前を生成するユーティリティ
 */
export function composeComponentName(baseComponent: string, subComponent: string) {
  return `${baseComponent}.${subComponent}`
}

/**
 * ブレークポイントに応じた値を返すユーティリティ
 */
export type Breakpoint = "mobile" | "tablet" | "desktop"

export type ResponsiveValue<T> = {
  mobile?: T
  tablet?: T
  desktop?: T
  default: T
}

/**
 * ブレークポイントに応じた値を返す
 * - 指定されたブレークポイントの値がない場合はデフォルト値を返す
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: Breakpoint
): T {
  return value[breakpoint] ?? value.default
}

/**
 * サイズ値のユーティリティ型
 */
export type SizeValue = "sm" | "md" | "lg" | "xl"

/**
 * コンポーネントの共通Props型
 */
export type BaseProps = {
  className?: string
  children?: React.ReactNode
}

/**
 * アクセシビリティProps型
 */
export type AriaProps = {
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-controls"?: string
  role?: string
}

/**
 * ReactNodeのnullチェック
 */
export function isNonNullable<T>(value: T | null | undefined): value is T {
  return value != null
}
