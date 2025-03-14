# .clinerules 作成の手順書

## 0. 前提条件

- AIは必ず全手順を順序通りに実行すること
- 各ステップで理解度を確認すること
- 不明点は即座に質問すること

## 1. 情報収集フェーズ

### 1.1 メンバールールの収集と理解

1. メンバールールの確認
   ```
   docs/team/[teamName]/member/[userName]/rules/
   ```
   - 00-basic.mdから順に読み込む
   - 個人情報を正確に把握
   - ユーザーの特性を理解

2. 理解度の確認
   - 完全理解：次のステップへ
   - 部分的理解：不足部分を再確認
   - 不十分：全体を再読了

3. 重点確認項目
   ```yaml
   個人情報:
     - チーム名
     - ユーザー名
     - 役割

   ユーザー特性:
     - 技術レベル
     - 作業スタイル
     - 得意分野
     - 注意点

   作業プロセス:
     - 自動化設定
     - 品質管理方法
     - コミュニケーション方法
   ```

### 1.2 チームルールの確認と統合

1. チームルールの読み込み
   ```
   docs/team/[teamName]/rules/
   ```
   - メンバールールとの整合性確認
   - 矛盾点の特定
   - 統合方針の決定

### 1.3 プロジェクトルールの確認

1. 基本ルールの確認
   ```
   docs/setup/cline/rules/detail/basic/
   ```
   - 必須要件の確認
   - セキュリティ要件の理解
   - 標準プラクティスの把握

## 2. プレビュー作成フェーズ

### 2.1 構造設計

1. メンバーセクション
   ```yaml
   memberRules:
     personalInfo: [個人情報]
     characteristics: [特性]
     workflowSettings: [作業設定]
   ```

2. チームセクション
   ```yaml
   teamRules:
     commonPractices: [共通規約]
     workflowRules: [作業ルール]
   ```

3. プロジェクトセクション
   ```yaml
   projectRules:
     basicSettings: [基本設定]
     securityRules: [セキュリティ]
   ```

### 2.2 プレビュー生成

1. プレビューファイルの作成
   ```
   docs/setup/cline/logs/ai/advice/[teamName]/[userName]/YYYY-MM-DD-HH-clinerules-preview.md
   ```

2. 内容の構造化
   - 個人情報と特性を最上部に
   - 重要な注意点を明確に
   - 作業プロセスを詳細に

## 3. レビューフェーズ

### 3.1 自己チェック

1. 理解度の最終確認
   - 個人特性の反映
   - ルール間の整合性
   - 優先順位の正確さ

2. エラー防止チェック
   - セキュリティ要件
   - 矛盾の有無
   - 実装可能性

### 3.2 ユーザーレビュー

1. プレビューの提示
   - 構造の説明
   - 重要ポイントの強調
   - 質問事項の明確化

2. フィードバック対応
   - 修正要求の理解
   - 変更の実施
   - 再確認

## 4. 実装フェーズ

### 4.1 .clinerules の生成

1. ファイル生成
   ```bash
   # 承認済みプレビューに基づいて生成
   ```

2. 内容の検証
   - 形式の確認
   - リンクの検証
   - 動作確認

### 4.2 最終確認

1. ユーザー承認の取得
   - 最終内容の確認
   - 動作の確認
   - 承認の記録

## 5. 記録と改善

### 5.1 作業記録

1. ログの保存
   - 作業プロセス
   - 決定事項
   - 注意点

2. 知見の蓄積
   - 効果的だった方法
   - 発生した問題
   - 改善案

### 5.2 継続的改善

1. フィードバックの反映
   - 手順の改善
   - テンプレートの更新
   - プロセスの最適化

## 6. エラー対応

### 6.1 一般的なエラー

1. 理解度不足
   - 再読了
   - 質問
   - 確認

2. 矛盾の検出
   - 即時報告
   - 解決案の提示
   - 承認の取得

### 6.2 重大なエラー

1. セキュリティ関連
   - 即時停止
   - 報告
   - 対策実施

2. データ損失リスク
   - バックアップ確認
   - 安全な方法の選択
   - 段階的な実施