# Package by Featureモデリングガイドライン

## 概要

Feature（機能）単位でのパッケージ構造化に関する設計原則とガイドラインを提供します。

## 基本原則

### 1. 機能の凝集度

機能は以下の基準で分割します：

- 独立して変更可能である
- 明確な責務を持つ
- 最小限の外部依存を持つ

### 2. ディレクトリ構造

```
src/
├── core/           # コアドメイン
│   └── [機能名]/
│       ├── features/
│       │   ├── management/
│       │   │   ├── model.ts
│       │   │   └── repository.ts
│       │   └── validation/
│       │       └── model.ts
│       └── types/
│           └── index.ts
│
└── features/       # アプリケーション機能
    └── [機能名]/
        ├── model/
        ├── ui/
        └── api/
```

### 3. ファイル構成

各機能ディレクトリには以下のファイルを配置：

```
[機能名]/
├── model.ts        # ドメインモデル
├── model.test.ts   # テスト
├── types.ts        # 型定義（機能固有）
├── repository.ts   # データアクセス
└── index.ts        # 公開API
```

## 設計指針

### 1. 境界の定義

```typescript
// 明確な境界を持つ型定義
type UserManagement = {
  readonly id: string;
  readonly context: 'user_management';  // 文脈の明示
  readonly operations: UserOperations;
}

// 機能固有の操作
type UserOperations = {
  create: () => Promise<Result<User, Error>>;
  update: (user: User) => Promise<Result<User, Error>>;
}
```

### 2. 依存関係の制御

```typescript
// 良い例：明示的な依存関係
import { User } from '../../types';
import { createUser } from './model';
import { UserRepository } from './repository';

// 悪い例：不要な依存関係
import { Database } from '../../../infrastructure/db';
import { Logger } from '../../../utils/logger';
```

### 3. インターフェースの設計

```typescript
// 機能単位での公開インターフェース
// index.ts
export type { User, UserRole } from './types';
export { createUser, updateUser } from './model';
export { UserRepository } from './repository';
```

## 実装パターン

### 1. モデルの実装

```typescript
// model.ts
import { Result, ok, err } from 'neverthrow';
import type { User, CreateUserParams } from './types';

export const createUser = (
  params: CreateUserParams
): Result<User, Error> => {
  // ビジネスロジックの実装
};
```

### 2. リポジトリの実装

```typescript
// repository.ts
import type { User } from './types';

export const UserRepository = {
  save: (user: User) => Promise<Result<void, Error>>,
  findById: (id: string) => Promise<Result<User, Error>>
};
```

## アンチパターン

### 1. 避けるべき実装

```typescript
// ❌ 機能間の直接依存
import { UserRepository } from '../user/repository';
import { RoleRepository } from '../role/repository';

// ✅ 依存の抽象化
import type { UserProvider } from './types';
import type { RoleProvider } from './types';
```

### 2. 注意が必要なパターン

1. 機能の肥大化
   - 単一の機能が大きくなりすぎている
   - 責務が不明確になっている
   - サブ機能への分割を検討

2. 循環参照
   - 機能間の相互参照
   - 共通コードの抽出を検討
   - インターフェースの見直し

## 移行のガイドライン

### 1. 段階的アプローチ

1. 機能の特定と分析
2. 依存関係の整理
3. 新構造への段階的移行
4. テストの維持と更新

### 2. チェックリスト

- [ ] 機能の境界が明確か
- [ ] 依存関係が最小限か
- [ ] テストが機能と共にあるか
- [ ] 公開APIが適切か

## 参考資料

- [Role Package Refactoring ADR](../../logs/ai/adr/design/2025-03/role-package-structure-refactoring.md)
- [Package Structure Guidelines](../development-process/package-structure.md)

## 更新履歴

- 2025-03-07: 初版作成
  - 基本原則の定義
  - 実装パターンの追加
  - アンチパターンの定義