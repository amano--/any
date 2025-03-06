# Role構造のリファクタリング計画

## 概要

Package by LayerパターンからPackage by Featureパターンへの移行計画を策定しました。

## 作成したドキュメント

1. ADR
   - パッケージ構造リファクタリングの意思決定
   - 具体的な移行手順
   - 影響範囲の分析

2. ガイドライン
   - パッケージ構造の基本原則
   - 実装ガイドライン
   - 移行戦略

## 移行計画

### フェーズ1: 準備（1日）
- [ ] 新しいディレクトリ構造の作成
- [ ] 既存コードの依存関係分析
- [ ] テスト環境の準備

### フェーズ2: 実装（2-3日）
- [ ] ファイルの移動
- [ ] インポートパスの更新
- [ ] テストの修正
- [ ] ビルド設定の更新

### フェーズ3: 検証（1-2日）
- [ ] テストの実行
- [ ] パフォーマンス確認
- [ ] コードレビュー
- [ ] ドキュメントの最終更新

## 技術的な変更点

1. ディレクトリ構造
```diff
 src/core/role/
-├── models/
-│   └── role.ts
-├── factories/
-│   └── role.ts
-└── repositories/
-    └── role.ts
+├── features/
+│   ├── management/
+│   │   ├── model.ts
+│   │   ├── factory.ts
+│   │   └── repository.ts
+│   └── permission/
+│       └── model.ts
+└── types/
    ├── constants.ts
    └── types.ts
```

2. インポートパスの変更
```diff
-import { Role } from '../models/role';
+import { Role } from '../features/management/model';
```

## 懸念事項

1. 既存機能への影響
   - テストカバレッジの維持
   - パフォーマンスへの影響
   - バグの混入リスク

2. チーム対応
   - 新構造の学習コスト
   - レビュー基準の調整
   - ドキュメントの更新

## 次のステップ

1. チームでの合意形成
   - リファクタリング計画のレビュー
   - スケジュールの確認
   - リスク対策の検討

2. 具体的な作業計画
   - タスクの優先順位付け
   - 担当者のアサイン
   - マイルストーンの設定

## 参照

- [Package Structure ADR](../../../logs/ai/adr/design/2025-03/role-package-structure-refactoring.md)
- [Package Structure Guidelines](../../../guidelines/development-process/package-structure.md)

## 更新履歴

- 2025-03-07 00:31: 初版作成
  - リファクタリング計画の策定
  - ドキュメントの整備
  - 移行手順の詳細化