docs/usecases/overview.md、を読んでクラス図を完成させてください。　
# ロールベースシステム実装計画

## 概要

Userクラスを継承ベースの設計からロールベースの設計に移行するための実装計画です。この変更により、より柔軟な権限管理と役割の割り当てが可能になります。

## マイグレーション戦略

### フェーズ1：新しいテーブルの作成
```sql
-- roles テーブル
CREATE TABLE roles (
    id VARCHAR PRIMARY KEY,
    type VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- permissions テーブル
CREATE TABLE permissions (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- role_permissions テーブル
CREATE TABLE role_permissions (
    role_id VARCHAR NOT NULL,
    permission_id VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- user_roles テーブル
CREATE TABLE user_roles (
    user_id VARCHAR NOT NULL,
    role_id VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

### フェーズ2：データ移行
1. 既存のユーザーの役割を新しいテーブルに移行
2. 権限データの初期化
3. ロールと権限の関連付け

### フェーズ3：コード更新
1. ドメインモデルの更新
2. 認証・認可システムの更新
3. APIエンドポイントの更新
4. テストの更新

## 実装の優先順位

1. 基盤となるクラスとインターフェース
   - Role インターフェース
   - Permission クラス
   - 具体的な Role 実装クラス

2. データベース関連
   - マイグレーションスクリプト
   - データアクセスレイヤー
   - リポジトリの実装

3. ビジネスロジック
   - 認証・認可サービス
   - ユーザーサービス
   - ロール管理サービス

4. API層
   - エンドポイントの更新
   - DTOの更新
   - バリデーションの更新

## テスト戦略

### 1. ユニットテスト
- Role インターフェースの実装テスト
- Permission クラスのテスト
- ユーザーとロールの関連テスト

### 2. インテグレーションテスト
- データベースマイグレーションテスト
- ロールベースの認可テスト
- APIエンドポイントテスト

### 3. システムテスト
- エンドツーエンドのユーザーフローテスト
- パフォーマンステスト
- セキュリティテスト

## リスク管理

### 1. 技術的リスク
- データ移行中のデータ損失
  - 対策：バックアップの作成
  - 対策：段階的な移行プロセス
  - 対策：ロールバックプランの準備

- パフォーマンスの低下
  - 対策：キャッシュ戦略の実装
  - 対策：インデックスの最適化
  - 対策：クエリの最適化

### 2. ビジネスリスク
- サービス中断
  - 対策：メンテナンス時間の最小化
  - 対策：段階的なデプロイ
  - 対策：自動ロールバック機能

- ユーザー混乱
  - 対策：明確なドキュメント作成
  - 対策：ヘルプデスクの準備
  - 対策：段階的な機能リリース

## タイムライン

1. 準備フェーズ（1週間）
   - 詳細設計の完了
   - 開発環境の整備
   - テスト計画の作成

2. 開発フェーズ（2週間）
   - 基盤実装
   - データベース更新
   - ビジネスロジック実装
   - API更新

3. テストフェーズ（1週間）
   - ユニットテスト
   - インテグレーションテスト
   - システムテスト

4. デプロイフェーズ（1週間）
   - データ移行
   - 本番環境への展開
   - モニタリング

## 次のステップ

1. 詳細設計ドキュメントの作成
2. 開発チームとのレビュー
3. テスト計画の詳細化
4. 開発環境のセットアップ

## 成功基準

1. すべてのユーザーの役割が正しく移行されている
2. 権限チェックが正しく機能している
3. パフォーマンスが許容範囲内である
4. セキュリティ要件を満たしている

## モニタリング計画

1. パフォーマンスメトリクス
   - 権限チェックの応答時間
   - データベースクエリの実行時間
   - APIエンドポイントの応答時間

2. エラーメトリクス
   - 権限エラーの発生率
   - データ整合性エラーの発生率
   - API エラーの発生率

3. ビジネスメトリクス
   - ユーザーセッション数
   - 機能使用率
   - エラー報告数