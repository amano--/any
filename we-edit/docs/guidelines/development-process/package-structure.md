# パッケージ構造ガイドライン

## 概要

本ガイドラインでは、プロジェクトのパッケージ構造に関する原則と実装方針を定義します。

## 基本原則

### 1. Package by Feature優先

```
src/features/[機能名]/
└── [サブ機能]/
    ├── model.ts      # ドメインモデル
    ├── model.test.ts # モデルのテスト
    ├── factory.ts    # ファクトリ
    └── repository.ts # リポジトリ
```

#### 理由
- 関連するコードの凝集度を高める
- 機能単位での変更を容易にする
- コードの理解とナビゲーションを改善

### 2. 共通コードの配置

```
src/core/[機能名]/
├── types/           # 型定義
│   ├── constants.ts # 定数
│   ├── types.ts     # 型
│   └── errors.ts    # エラー
└── index.ts         # 公開API
```

#### 理由
- 再利用可能なコードを集約
- 型定義の一元管理
- 依存関係の明確化

## 実装ガイドライン

### 1. ファイル配置

- 機能に関連するファイルは同じディレクトリに配置
- テストファイルはテスト対象の近くに配置
- 共通の型定義は`types`ディレクトリに配置

### 2. 命名規則

```typescript
// model.ts
export const createUser = () => { ... }
export const updateUser = () => { ... }

// repository.ts
export const UserRepository = { ... }

// types.ts
export type User = { ... }
```

### 3. インポート規則

```typescript
// 同じ機能内のインポート
import { createUser } from './model';
import { UserRepository } from './repository';

// 共通型のインポート
import { User } from '../../types';
```

## リファクタリングガイド

### 1. Layer型からFeature型への移行手順

```bash
# 1. 新しいディレクトリ構造の作成
mkdir -p features/[機能名]

# 2. ファイルの移動
mv models/user.ts features/user/model.ts
mv repositories/user.ts features/user/repository.ts

# 3. インポートパスの更新
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/models/from "\.\.\/features/g' {} +
```

### 2. チェックリスト

- [ ] 機能の境界を明確に定義
- [ ] 関連するファイルをグループ化
- [ ] テストファイルの移動
- [ ] インポートパスの更新
- [ ] ビルド設定の更新

## アンチパターン

### 1. 避けるべき構造

```
❌ src/
   ├── models/      # レイヤー型の構造
   ├── controllers/
   └── repositories/
```

### 2. 推奨される構造

```
✅ src/
   ├── features/    # 機能型の構造
   │   └── user/
   │       ├── model.ts
   │       └── repository.ts
   └── core/
       └── types/
```

## 移行戦略

### 1. 段階的アプローチ

1. 新規機能はFeature型で実装
2. 既存コードは機能単位で順次移行
3. 共通コードは`core`ディレクトリに移動

### 2. 優先順位

1. 頻繁に変更される機能から着手
2. 依存関係の少ない機能を優先
3. テストカバレッジの高い機能を選択

## 例外事項

以下の場合は、状況に応じて柔軟に対応：

1. マイクロサービス境界
2. 共通ライブラリ
3. レガシーコードの統合

## 参照

- [Roleパッケージリファクタリング ADR](../logs/ai/adr/design/2025-03/role-package-structure-refactoring.md)
- [Role実装 ADR](../logs/ai/adr/implementation/2025-03/role-system-implementation.md)

## 更新履歴

- 2025-03-07: 初版作成
  - Package by Feature原則の導入
  - ディレクトリ構造ガイドライン追加
  - リファクタリングガイド追加