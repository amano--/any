# チームルール設定改善提案

## 1. 変更内容

```diff
  # チームルール設定

+ ## 1. チームルールの理解度確認
+ 
+ ### 1.1 確認対象のルール
+ 
+ AIは個人ルールの確認後、以下のチームルールを確認すること：
+ 
+ 1. チーム共通のルール
+    ```bash
+    docs/team/[teamName]/rules/
+    例：docs/team/core/rules/
+    ```
+ 
+ ### 1.2 理解度判定基準
+ 
+ 1. チームルールを完全に理解している場合
+    → そのままプロジェクトルールの確認に進む
+ 
+ 2. チームルールを部分的にしか理解していない場合
+    → 不足している部分を再確認してからプロジェクトルールの確認に進む
+ 
+ 3. チームルールをほとんど理解していない場合
+    → すべてのチームルールを再読了してからプロジェクトルールの確認に進む
+ 
+ ### 1.3 重点確認項目
+ 
+ 1. チーム開発プラクティス
+    - コーディング規約
+    - レビュー基準
+    - 品質基準
+ 
+ 2. チームワークフロー
+    - ブランチ戦略
+    - マージ基準
+    - デプロイフロー
+ 
+ 3. チームコミュニケーション
+    - 報告ルール
+    - 相談プロセス
+    - ドキュメント管理
+ 
+ ## 2. ルール階層での位置づけ
+ 
+ このファイルは.clinerules生成時の2番目に優先されるルールを定義します：
+ 
+ 1. 個人ルール（最優先）
+    - docs/team/[teamName]/member/[userName]/rules/ を参照
+    - 個人固有の設定を尊重
+    - チームルールと矛盾しない範囲で適用
+ 
+ 2. チームルール（このファイル）
+    - チーム共通の規約を定義
+    - チーム内での標準化を推進
+    - プロジェクトルールと整合性を確保
+ 
+ 3. プロジェクトルール（基盤）
+    - docs/setup/cline/rules/detail/ を参照
+    - プロジェクト全体の規約を遵守
+    - 基本的な開発標準として参照
+ 
+ ## 3. 理解度不足時の対応
+ 
+ ### 3.1 再確認手順
+ 
+ 1. チームルールの再読了
+    ```bash
+    docs/team/[teamName]/rules/
+    ```
+ 
+ 2. 理解度の報告
+    - 不明点の明確化
+    - 確認が必要な項目のリスト
+    - チーム固有の慣習の確認
+ 
+ 3. チームリーダーの確認
+    - 理解度の確認
+    - 必要に応じた説明
+    - 作業開始の承認
+ 
+ ### 3.2 エラー防止
+ 
+ - 個人ルールとの整合性を確認
+ - プロジェクトルールとの整合性を確認
+ - チーム固有の例外ルールを明確化
```

## 2. 変更理由

1. チームレベルの理解度確認
   - チーム固有のルールの理解促進
   - チームワークフローの確実な把握
   - コミュニケーション基準の明確化

2. 階層構造の明確化
   - 個人ルールとの関係性
   - プロジェクトルールとの整合性
   - チームの位置づけの明確化

3. エラー防止の強化
   - チーム固有の注意点
   - 階層間の整合性確認
   - 承認プロセスの明確化

## 3. 概要

### 対象ファイル
docs/setup/cline/rules/01-team.md

### 改善の動機
- チームルール理解度の確実な確認
- チーム固有のプラクティスの徹底
- エラー防止の強化

### 期待される成果
- チームルールの確実な適用
- チーム内の一貫性確保
- エラーの削減

## 4. 現状の課題

### 4.1 問題点
- チームルールの理解度確認が不足
- チーム固有の慣習の把握が不十分
- エラー防止が不十分

### 4.2 影響範囲
- チーム内の作業品質
- チーム間の連携
- プロジェクト全体の整合性

## 5. 実装計画

### 5.1 実装手順
1. team.mdの作成
2. 関連ファイルの参照確認
3. チーム内でのレビュー実施

### 5.2 検証項目
- 理解度確認の効果
- チーム内での一貫性
- エラー防止の効果

## 6. リスク評価

### 6.1 潜在的な問題
- チーム固有の例外処理
  → 明確な文書化で対応
- 個人ルールとの競合
  → 優先順位の明確化で対応

### 6.2 代替案
1. 簡略化バージョン
   - メリット：理解の容易さ
   - デメリット：詳細の欠如

2. より詳細なバージョン
   - メリット：完全な網羅性
   - デメリット：管理の複雑化