# イベントシステム設計

## 概要

イベントソーシングに基づく状態管理システムの設計仕様です。

## 目次

- [型定義](./type.md) - イベントの型システム設計
- [データベーススキーマ](./schema.md) - 永続化層の設計

## 設計目標

1. イミュータブルなイベントストア
2. 型安全なイベント処理
3. 効率的なイベントの永続化と再生
4. スケーラブルなアーキテクチャ

## 主要コンポーネント

### イベントストア

```typescript
type EventStore = {
    readonly save: (events: ReadonlyArray<Event>) => Result<void, DomainError>;
    readonly getEvents: (aggregateId: string) => Result<ReadonlyArray<Event>, DomainError>;
    readonly getSnapshot: <T>(aggregateId: string) => Result<T | null, DomainError>;
    readonly saveSnapshot: <T>(aggregateId: string, snapshot: T) => Result<void, DomainError>;
};
```

### イベント処理

```typescript
type EventHandler<T> = (state: T, event: Event) => Result<T, DomainError>;
type EventProcessor = <T>(events: ReadonlyArray<Event>, handler: EventHandler<T>) => Result<T, DomainError>;
```

## 実装パターン

### イベントの保存

```typescript
const saveEvent = (event: Event): Result<void, DomainError> =>
    validateEvent(event)
        .chain(generateEventId)
        .chain(persistEvent);

// Example usage
const result = pipe(
    createEvent("NOTE_CREATE", { title: "New Note" }),
    chain(saveEvent)
);
```

### 状態の再構築

```typescript
const rebuildState = <T>(
    aggregateId: string,
    initialState: T
): Result<T, DomainError> =>
    pipe(
        getEvents(aggregateId),
        chain(events => reduceEvents(events, initialState))
    );

// Example usage
type NoteState = {
    readonly title: string;
    readonly content: string;
};

const noteState = rebuildState<NoteState>(
    "note-123",
    { title: "", content: "" }
);
```

## エラー処理

1. バリデーションエラー
   ```typescript
   const validateEvent = (event: Event): Result<Event, DomainError> =>
       validateEventStructure(event)
           .chain(validateEventData)
           .chain(validateEventContext);
   ```

2. 永続化エラー
   ```typescript
   const handlePersistenceError = (
       error: unknown
   ): DomainError => ({
       tag: "PERSISTENCE",
       message: "Failed to persist event",
       context: "event-store",
       cause: error
   });
   ```

## パフォーマンス最適化

1. スナップショット戦略
   ```typescript
   const shouldTakeSnapshot = (
       events: ReadonlyArray<Event>
   ): boolean =>
       events.length >= 100;
   ```

2. バッチ処理
   ```typescript
   const processBatch = (
       events: ReadonlyArray<Event>
   ): Result<void, DomainError> =>
       pipe(
           validateBatch(events),
           chain(persistBatch)
       );
   ```

## スケーラビリティ

1. イベントの分割
   ```typescript
   const partitionEvents = (
       events: ReadonlyArray<Event>
   ): Map<string, ReadonlyArray<Event>> =>
       events.reduce(
           (acc, event) => groupByAggregate(acc, event),
           new Map()
       );
   ```

2. 並行処理
   ```typescript
   const processParallel = async (
       events: ReadonlyArray<Event>
   ): Promise<Result<void, DomainError>> =>
       Promise.all(
           partitionEvents(events)
               .map(processPartition)
       ).then(combineResults);
   ```

## テスト戦略

1. イベント生成のテスト
   ```typescript
   test("creates valid event", () => {
       const result = createEvent("NOTE_CREATE", { title: "Test" });
       expect(result.isOk()).toBe(true);
       expect(result.unwrap().type).toBe("NOTE_CREATE");
   });
   ```

2. 状態再構築のテスト
   ```typescript
   test("rebuilds state from events", () => {
       const events = [
           createNoteEvent("create"),
           createNoteEvent("update")
       ];
       const result = rebuildState(events, initialState);
       expect(result.isOk()).toBe(true);
   });
   ```

## 監視とロギング

1. イベントログ
   ```typescript
   const logEvent = (
       event: Event
   ): void => {
       logger.info({
           type: event.type,
           aggregate: event.aggregateId,
           timestamp: event.timestamp
       });
   };
   ```

2. メトリクス
   ```typescript
   const recordMetrics = (
       event: Event
   ): void => {
       metrics.increment(`event.${event.type}`);
       metrics.histogram("event.processing_time", event.processingTime);
   };