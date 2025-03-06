# ADR: Roleパッケージのリファクタリング - Package by Featureパターンへの移行

## ステータス
提案済み

## 作成日
2025-03-07

## コンテキスト
現在のRoleシステムはPackage by Layerパターンで実装されており、以下のような構造になっています：

```
src/core/role/
├── models/
│   ├── role.ts
│   └── role.test.ts
├── factories/
│   └── role.ts
└── repositories/
    ├── role.ts
    └── role.test.ts
```

この構造には以下の課題があります：

1. 関連する機能が分散している
2. ファイル間の依存関係が複雑
3. 機能の把握が困難

## 決定事項

Package by Featureパターンを採用し、以下の構造に移行します：

```
src/core/role/
├── types/          # 型定義は共通で使用されるため維持
│   ├── constants.ts
│   ├── types.ts
│   └── errors.ts
├── features/       # 機能ごとのディレクトリ
│   ├── management/ # ロール管理機能
│   │   ├── model.ts
│   │   ├── model.test.ts
│   │   ├── factory.ts
│   │   └── repository.ts
│   └── permission/ # 権限管理機能
│       ├── model.ts
│       ├── model.test.ts
│       └── validator.ts
└── index.ts       # 公開API
```

## 移行手順

1. 機能の分類
   - ロール管理機能のグループ化
   - 権限管理機能のグループ化
   - 共通機能の特定

2. ディレクトリ構造の変更
   ```bash
   mkdir -p src/core/role/features/{management,permission}
   ```

3. ファイルの移動
   ```bash
   # ロール管理機能
   mv src/core/role/models/role.ts src/core/role/features/management/model.ts
   mv src/core/role/factories/role.ts src/core/role/features/management/factory.ts
   mv src/core/role/repositories/role.ts src/core/role/features/management/repository.ts
   
   # テストファイルの移動
   mv src/core/role/models/role.test.ts src/core/role/features/management/model.test.ts
   mv src/core/role/repositories/role.test.ts src/core/role/features/management/repository.test.ts
   ```

4. インポートパスの更新
   - すべてのファイルで相対パスを修正
   - index.tsの更新

## 影響範囲

### 1. コードの変更点
- インポートパスの修正
- テストファイルの参照先変更
- ドキュメントのパス参照の更新

### 2. ビルド設定
- tsconfig.pathsの更新
- vitestの設定更新

### 3. ガイドラインの変更点
- ディレクトリ構造の説明更新
- ファイル配置ルールの更新
- 命名規則の更新

## メリット

1. 機能の凝集度向上
   - 関連するコードが近接
   - 依存関係の明確化
   - コードの理解が容易

2. メンテナンス性向上
   - 変更の影響範囲が明確
   - テストの関連性が明確
   - 機能追加が容易

3. 拡張性の向上
   - 新機能の追加が容易
   - 機能単位でのテスト
   - 責務の分離が明確

## デメリット

1. 移行コスト
   - コードの移動
   - テストの修正
   - ドキュメントの更新

2. 学習コスト
   - 新しい構造の理解
   - 既存の慣習との違い
   - チーム間の合意形成

## 実装の注意点

1. 段階的な移行
   - 機能ごとに順次移行
   - テストの維持
   - 既存機能の動作保証

2. ドキュメントの更新
   - ADRの作成（本文書）
   - ガイドラインの更新
   - コメントの更新

3. レビュー方針
   - 機能単位でのレビュー
   - 依存関係の確認
   - テストカバレッジの確認

## 更新履歴

- 2025-03-07: 初版作成
  - Package by Featureパターンへの移行提案
  - 具体的な移行手順の定義
  - 影響範囲の分析