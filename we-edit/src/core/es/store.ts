import { create } from "zustand";
import { type Event, type ReadEvent } from "./event";
import { type Result, ok, err } from "neverthrow";

// エラー型のタグ
const ErrorTags = {
  BASE: "EventStoreError",
  CONCURRENCY: "ConcurrencyError",
  NOT_FOUND: "EventNotFoundError",
  INVALID: "InvalidEventError",
} as const;

// エラータグの型を公開
export type ErrorTag = (typeof ErrorTags)[keyof typeof ErrorTags];

// 基本エラー型
export class EventStoreError extends Error {
  constructor(
    message: string,
    public readonly tag: ErrorTag = ErrorTags.BASE,
  ) {
    super(message);
    this.name = "EventStoreError";
  }

  static isEventStoreError(error: unknown): error is EventStoreError {
    return error instanceof EventStoreError;
  }
}

// 具体的なエラー型
export class ConcurrencyError extends EventStoreError {
  constructor() {
    super("Concurrency conflict detected", ErrorTags.CONCURRENCY);
    this.name = "ConcurrencyError";
  }
}

export class EventNotFoundError extends EventStoreError {
  constructor() {
    super("Event not found", ErrorTags.NOT_FOUND);
    this.name = "EventNotFoundError";
  }
}

export class InvalidEventError extends EventStoreError {
  constructor(message: string) {
    super(message, ErrorTags.INVALID);
    this.name = "InvalidEventError";
  }
}

// エラー処理のためのユーティリティ関数
function createStoreError(error: unknown): EventStoreError {
  if (EventStoreError.isEventStoreError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return new EventStoreError(error.message);
  }

  if (typeof error === "string") {
    return new EventStoreError(error);
  }
    
  return new EventStoreError("Unknown error occurred");
}

// Result型のヘルパー関数
function tryCatch<T>(fn: () => T): Result<T, EventStoreError> {
  try {
    const result = fn();
    return ok(result);
  } catch (e: unknown) {
    const error = createStoreError(e);
    return err(error);
  }
}

// イベントIDの生成
import { ulid } from 'ulid';

import { type ULID } from "./event";

function generateEventId(_event: Event | ReadEvent): ULID {
  return ulid();
}

// イベントストアの状態定義
interface EventStoreState {
  events: Record<string, Event[]>;
  readEvents: Record<string, ReadEvent[]>;
  snapshots: Record<string, unknown>;
  version: number;

  // メソッド
  save: (events: Event[]) => Result<void, EventStoreError>;
  saveReadEvent: (events: ReadEvent[]) => Result<void, EventStoreError>;
  getEvents: (aggregateId: string) => Result<Event[], EventStoreError>;
  getSnapshot: <T>(aggregateId: string) => Result<T | null, EventStoreError>;
  saveSnapshot: <T>(aggregateId: string, snapshot: T) => Result<void, EventStoreError>;
}

// Zustandストアの作成
export const useEventStore = create<EventStoreState>((set, get) => ({
  events: {},
  readEvents: {},
  snapshots: {},
  version: 0,

  saveReadEvent: (events: ReadEvent[]) => {
    return tryCatch(() => {
      const newReadEvents = { ...get().readEvents };
      
      for (const event of events) {
        const eventId = generateEventId(event);
        newReadEvents[eventId] = [event];
      }
      
      set((state) => ({
        ...state,
        readEvents: newReadEvents
      }));
    });
  },

  save: (events: Event[]) => {
    return tryCatch(() => {
      const newEvents = { ...get().events };

      for (const event of events) {
        const eventId = generateEventId(event);
        const currentEvents = newEvents[eventId] ?? [];
        const expectedVersion = currentEvents.length;

        if (currentEvents.length > 0 && expectedVersion !== currentEvents.length) {
          throw new ConcurrencyError();
        }

        newEvents[eventId] = [...currentEvents, event];
      }

      set((state) => ({
        ...state,
        events: newEvents,
        version: state.version + 1,
      }));
    });
  },

  getEvents: (aggregateId: string) => {
    return tryCatch(() => {
      const events = get().events[aggregateId] ?? [];
      return [...events];
    });
  },

  getSnapshot: <T>(aggregateId: string) => {
    return tryCatch(() => {
      const snapshot = get().snapshots[aggregateId] as T | undefined;
      return snapshot ?? null;
    });
  },

  saveSnapshot: <T>(aggregateId: string, snapshot: T) => {
    return tryCatch(() => {
      set((state) => ({
        ...state,
        snapshots: {
          ...state.snapshots,
          [aggregateId]: snapshot,
        },
      }));
    });
  },
}));
