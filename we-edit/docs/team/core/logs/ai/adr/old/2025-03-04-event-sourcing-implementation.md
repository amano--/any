# ADR: イベントソーシング実装パターン

## ステータス

Accepted

## コンテキスト

プロジェクトでイベントソーシングを採用するにあたり、以下の課題がありました：

1. イベントの一意性と順序性の保証
2. イベントの型安全性の確保
3. 読み取り/書き込み操作の明確な区別
4. イベントの追跡可能性

## 決定事項

以下の実装パターンを採用することを決定しました：

1. イベント識別子にULIDを採用
   - 時系列でソート可能
   - 競合の可能性が極めて低い
   - データベースのインデックスに最適

2. イベント定義の構造化と分離
   - 各機能のイベントは機能ディレクトリ内で定義
   - コアモジュールで基底イベント型を集約
   ```typescript
   // src/features/group/types/events.ts
   export type GroupEvent = GroupAddEvent;
   export type GroupReadEvent = GroupListEvent;

   // src/core/es/event.ts
   import { type GroupEvent, type GroupReadEvent } from "~/features/group";
   export type Event = MemberEvent | GroupEvent;        // Write Events
   export type ReadEvent = MemberListEvent | GroupReadEvent;  // Read Events
   ```

3. イベント属性の標準化と型安全性の確保
   ```typescript
   type BaseEvent = {
     b: string; // bounded context
     g: string; // group
     f: string; // feature
     a: string; // action
     ei: ULID;  // event identifier
   };
   ```

4. 読み取り/書き込み操作の分離
   - `save`: 状態変更イベント
   - `saveReadEvent`: 状態参照イベント

## 影響

### 肯定的な影響

1. 型安全性の向上
   - コンパイル時にイベントの整合性チェック
   - IDEのサポートによる開発効率の向上

2. デバッグ容易性
   - イベントの追跡が容易
   - 問題の原因特定が迅速

3. パフォーマンス
   - ULIDによる効率的なソート
   - 読み取り/書き込みの明確な分離

### 潜在的な課題

1. 開発者の学習コスト
   - イベントソーシングパターンの理解
   - 新しい型システムへの適応

2. コードの冗長性
   - イベント定義の重複可能性
   - 型定義の管理コスト

## 代替案

1. UUIDの使用
   - 順序性が保証されない
   - データベースのインデックス効率が低い

2. 単純な型システム
   - 型安全性が低下
   - エラーの早期発見が困難

## 導入ステップ

1. 既存コードの移行
   ```mermaid
   graph TB
     A[既存コード分析] --> B[イベント型定義]
     B --> C[ULID導入]
     C --> D[save/saveReadEvent実装]
     D --> E[テスト追加]
   ```

2. 開発者教育
   - ガイドラインの整備
   - コードレビュープロセスの調整

## 関連ドキュメント

- [イベントソーシング実装ガイドライン](../../guidelines/implementation/event-sourcing.md)
- [テスト戦略ガイドライン](coming-soon.md)