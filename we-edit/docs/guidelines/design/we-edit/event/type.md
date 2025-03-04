# イベントシステム型定義

## 基本型定義

```typescript
// Event Identifier
export type ULID = string & { readonly __brand: unique symbol };

// Bounded Context Identifiers
export type BoundedContextId = 
    | "b"  // bookmark
    | "n"  // note
    | "nt" // notification
    | "p"  // payment
    | "t"  // tag
    | "c"  // category
    | "r"  // relation
    | "s"  // system
    | "e"; // event

// Group Context
export type GroupContextId =
    | "m"  // management
    | "c"  // content
    | "s"; // system

// Feature Context
export type FeatureContextId =
    | "c"  // create
    | "u"  // update
    | "d"  // delete
    | "r"; // read

// Action Types
export type ActionType =
    | "create"
    | "update"
    | "delete"
    | "read"
    | "archive"
    | "restore";

// Base Event Structure
export type EventBase = {
    readonly ei: ULID;
    readonly b: BoundedContextId;
    readonly g: GroupContextId;
    readonly f: FeatureContextId;
    readonly a: ActionType;
    readonly timestamp: number;
    readonly version: number;
};
```

## イベントペイロード

```typescript
// Create Event Payload
export type CreatePayload<T> = {
    readonly data: T;
};

// Update Event Payload
export type UpdatePayload<T> = {
    readonly before: T;
    readonly after: T;
    readonly changes: ReadonlyArray<{
        readonly path: ReadonlyArray<string>;
        readonly value: unknown;
    }>;
};

// Delete Event Payload
export type DeletePayload = {
    readonly reason?: string;
};
```

## 具体的なイベント型

```typescript
// Event Type Union
export type Event<T> =
    | CreateEvent<T>
    | UpdateEvent<T>
    | DeleteEvent
    | ReadEvent<T>;

// Specific Event Types
export type CreateEvent<T> = EventBase & {
    readonly type: "CREATE";
    readonly payload: CreatePayload<T>;
};

export type UpdateEvent<T> = EventBase & {
    readonly type: "UPDATE";
    readonly payload: UpdatePayload<T>;
};

export type DeleteEvent = EventBase & {
    readonly type: "DELETE";
    readonly payload: DeletePayload;
};

export type ReadEvent<T> = EventBase & {
    readonly type: "READ";
    readonly payload: {
        readonly query: unknown;
        readonly result: T;
    };
};
```

## バリデーション型

```typescript
// Validation Results
export type ValidationResult<T> = Result<T, DomainError>;

// Validator Functions
export type EventValidator<T> = (
    event: Event<T>
) => ValidationResult<Event<T>>;

export type PayloadValidator<T> = (
    payload: T
) => ValidationResult<T>;
```

## エラー型

```typescript
// Error Tags
export type EventErrorTag =
    | "INVALID_STRUCTURE"
    | "INVALID_PAYLOAD"
    | "INVALID_VERSION"
    | "CONCURRENCY"
    | "SYSTEM";

// Domain Error
export type EventError = {
    readonly tag: EventErrorTag;
    readonly message: string;
    readonly context: "event";
    readonly timestamp: number;
    readonly details?: unknown;
};
```

## 型ガード関数

```typescript
// Type Guards
export const isCreateEvent = <T>(
    event: Event<T>
): event is CreateEvent<T> =>
    event.type === "CREATE";

export const isUpdateEvent = <T>(
    event: Event<T>
): event is UpdateEvent<T> =>
    event.type === "UPDATE";

export const isDeleteEvent = <T>(
    event: Event<T>
): event is DeleteEvent =>
    event.type === "DELETE";

export const isReadEvent = <T>(
    event: Event<T>
): event is ReadEvent<T> =>
    event.type === "READ";
```

## イベントファクトリ型

```typescript
// Event Factory Types
export type EventFactory<T> = {
    readonly create: (
        data: T
    ) => ValidationResult<CreateEvent<T>>;
    
    readonly update: (
        before: T,
        after: T
    ) => ValidationResult<UpdateEvent<T>>;
    
    readonly delete: (
        reason?: string
    ) => ValidationResult<DeleteEvent>;
    
    readonly read: (
        query: unknown,
        result: T
    ) => ValidationResult<ReadEvent<T>>;
};

// Event Store Operations
export type EventStoreOps<T> = {
    readonly save: (
        events: ReadonlyArray<Event<T>>
    ) => ValidationResult<void>;
    
    readonly get: (
        filter: EventFilter
    ) => ValidationResult<ReadonlyArray<Event<T>>>;
    
    readonly getLatest: (
        aggregateId: string
    ) => ValidationResult<Event<T>>;
};

// Event Filter
export type EventFilter = {
    readonly aggregateId?: string;
    readonly fromVersion?: number;
    readonly toVersion?: number;
    readonly fromTimestamp?: number;
    readonly toTimestamp?: number;
    readonly eventTypes?: ReadonlyArray<string>;
};
```

## 使用例

```typescript
// Example: Note Event
type NoteData = {
    readonly title: string;
    readonly content: string;
};

// Create Note Event
const createNoteEvent: CreateEvent<NoteData> = {
    ei: generateULID(),
    b: "n",
    g: "c",
    f: "c",
    a: "create",
    type: "CREATE",
    timestamp: Date.now(),
    version: 1,
    payload: {
        data: {
            title: "New Note",
            content: "Note content"
        }
    }
};

// Update Note Event
const updateNoteEvent: UpdateEvent<NoteData> = {
    ei: generateULID(),
    b: "n",
    g: "c",
    f: "u",
    a: "update",
    type: "UPDATE",
    timestamp: Date.now(),
    version: 2,
    payload: {
        before: {
            title: "New Note",
            content: "Note content"
        },
        after: {
            title: "Updated Note",
            content: "Updated content"
        },
        changes: [
            {
                path: ["title"],
                value: "Updated Note"
            },
            {
                path: ["content"],
                value: "Updated content"
            }
        ]
    }
};