# イベントソーシング実装ガイドライン

## 概要

イベントソーシングは、アプリケーションの状態変更をイベントとして記録し、これらのイベントを再生することで現在の状態を再構築できるパターンです。このガイドラインでは、本プロジェクトでのイベントソーシングの実装方法について説明します。

## ディレクトリ構造

```
src/
├── core/
│   └── es/
│       ├── event.ts     # 基底イベント型の定義
│       ├── store.ts     # イベントストアの実装
│       └── index.ts     # public API
└── features/
    └── group/
        └── types/
            └── events.ts # 機能固有のイベント型定義
```

## イベントの型定義

### 機能固有のイベント定義

各機能のイベントは、その機能のディレクトリ内で定義します。これにより：
- 機能ごとの関心の分離
- イベント定義の集約
- コードの保守性向上

```typescript
// src/features/group/types/events.ts
export type GroupAddEvent = {
  b: "m";      // bounded context
  g: "g";      // group
  f: "g";      // feature
  a: "add";    // action
  ei: ULID;    // event identifier
  data: {
    groupId: string;
    name: string;
  }
};

export type GroupEvent = GroupAddEvent;
export type GroupReadEvent = GroupListEvent;
```

### 基底イベント型の定義

コアのイベントモジュールでは、各機能のイベント型を集約して基底となるイベント型を定義します：

```typescript
// 各機能でイベント型を定義
// e.g., src/features/group/types/events.ts
export type GroupAddEvent = { b: "m"; g: "g"; f: "g"; a: "addGroup"; ei: ULID };
export type GroupEvent = GroupAddEvent;

// src/core/es/event.ts
import { type GroupEvent, type GroupReadEvent } from "~/features/group";

// Write Event（状態変更イベント）
export type Event = MemberEvent | GroupEvent;

// Read Event（状態参照イベント）
export type ReadEvent = MemberListEvent | GroupReadEvent;
```

### イベント属性の構造

各イベントは以下の属性を持ちます：

```typescript
type BaseEvent = {
  // 境界付けられたコンテキスト(bounded context)の頭文字
  b: "m" | "g" | "b"; // member, group, bookmark など
  
  // 機能グループ(group)の頭文字
  g: "m" | "g" | "b"; // management, general, basic など
  
  // 機能(feature)の頭文字
  f: "m" | "g" | "b"; // member, group, bookmark など
  
  // アクション(action)の識別子
  a: "add" | "update" | "remove" | "list";
  
  // イベント識別子（ULID）
  ei: ULID;
};
```

### ULID型の重要性

`ei`（Event Identifier）属性は、必ずULID型である必要があります：

```typescript
// 重要: この型のstringは、必ずULID（Universally Unique Lexicographically Sortable Identifier）でなければならない
export type ULID = string;
```

ULIDを使用する理由：
1. 時系列順序付け - ULIDは生成時刻に基づいて自動的にソート可能
2. ユニーク性保証 - 競合の可能性が極めて低い
3. データベースのインデックスに最適 - 時系列順でインデックスが構築される
4. 可読性 - Base32でエンコードされ、人間が読める形式

## イベントの保存パターン

### Write Events（状態変更）

データベースの状態を変更する操作を行う場合は、`save`メソッドを使用します：

```typescript
// 例：メンバーの追加
const addMember = async (memberId: string, groupId: string) => {
  const event: MemberAddEvent = {
    b: "m", // member context
    g: "m", // management group
    f: "m", // member feature
    a: "add",
    ei: ulid(), // 新しいULIDを生成
    data: { memberId, groupId }
  };
  
  return useEventStore().save([event]);
};
```

### Read Events（状態参照）

データベースから情報を取得する操作を行う場合は、`saveReadEvent`メソッドを使用します：

```typescript
// 例：メンバーリストの取得
const listMembers = async (groupId: string) => {
  const event: MemberListEvent = {
    b: "m", // member context
    g: "m", // management group
    f: "m", // member feature
    a: "list",
    ei: ulid(), // 新しいULIDを生成
    data: { groupId }
  };
  
  return useEventStore().saveReadEvent([event]);
};
```

## 実装のベストプラクティス

1. イベントの不変性
   - イベントは一度保存されたら変更してはいけない
   - 必要な情報はすべてイベント生成時に含める

2. イベントの粒度
   - 1つの論理的な操作に対して1つのイベント
   - 複数の変更が必要な場合は、複数のイベントをアトミックに保存

3. イベントの順序性
   - ULIDにより自然な時系列順序が保証される
   - イベントの再生順序に依存する実装は避ける

4. エラー処理
   - neverthrowのResult型を使用してエラーを表現
   - 楽観的ロックによる競合検出

```typescript
import { Result, ok, err } from "neverthrow";

// エラー処理の例
const handleEvent = (event: Event): Result<void, EventStoreError> => {
  try {
    // イベントの処理
    return ok(undefined);
  } catch (error) {
    return err(new EventStoreError("イベント処理に失敗しました"));
  }
};
```

5. スナップショット
   - 定期的にイベントの状態をスナップショットとして保存
   - パフォーマンス最適化のために使用

## テスト戦略

1. イベントの生成テスト
   - 正しい属性が設定されているか
   - ULIDが適切に生成されているか

2. イベントの処理テスト
   - 状態が正しく更新されるか
   - エラーが適切に処理されるか

3. イベントの再生テスト
   - 同じイベント列から同じ状態が再構築できるか

```typescript
describe('EventSourcing', () => {
  it('should correctly handle member add event', () => {
    const event: MemberAddEvent = {
      b: "m",
      g: "m",
      f: "m",
      a: "add",
      ei: ulid(),
      data: { memberId: "1", groupId: "1" }
    };
    
    const result = useEventStore().save([event]);
    expect(result.isOk()).toBe(true);
  });
});
```

## パフォーマンスの考慮事項

1. イベントの最適化
   - 必要な情報のみを含める
   - 大きなデータはリファレンスとして保存

2. クエリの最適化
   - ReadEventを効率的に使用
   - 必要な場合はイベントのインデックスを作成