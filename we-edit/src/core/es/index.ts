// エラー型のエクスポート
export {
  EventStoreError,
  ConcurrencyError,
  EventNotFoundError,
  InvalidEventError,
} from "./store";

// イベントストアのエクスポート
export { useEventStore } from "./store";

// 型定義のエクスポート
export type { ErrorTag } from "./store";
export type { Event, ReadEvent, ULID } from "./event";
