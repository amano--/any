# AIルール更新手順改善提案

## 1. 変更内容

```diff
  # Clineルール更新手順（AI用）

  ## 0. 重要な前提
  
  - ルールのメンテナンスはユーザーの責任です
  - AIは分析と改善案作成と更新作業を担当します
  - ルールの更新は必ずユーザーの承認が必要です

+ ## 1. ルールの階層構造理解
+ 
+ ### 1.1 階層構造の概要
+ 
+ AIは以下の3つの階層のルールを理解し、それぞれの役割を認識すること：
+ 
+ 1. メンバールール（個人固有の設定）
+    ```bash
+    docs/team/[teamName]/member/[userName]/rules/
+    例：docs/team/core/member/amano/rules/
+    ```
+ 
+ 2. チームルール（チームメンバーとして共通の設定）
+    ```bash
+    docs/team/[teamName]/rules/
+    例：docs/team/core/rules/
+    ```
+ 
+ 3. プロジェクトルール（プロジェクトメンバーとして共通の設定）
+    ```bash
+    docs/setup/cline/rules/detail/
+    ```
+ 
+ ### 1.2 .clinerules生成の優先順位
+ 
+ AIは必ず以下の順序でルールを読み込み、.clinerules を生成すること：
+ 
+ 1. メンバールール（最優先）
+    - 個人の開発環境に特化した設定
+    - 個人のワークフロー最適化設定
+ 
+ 2. チームルール（次優先）
+    - チーム共通の開発プラクティス
+    - チーム固有のワークフロー
+ 
+ 3. プロジェクトルール（基盤）
+    - プロジェクト全体の基本ルール
+    - 共通の開発標準
+ 
+ ### 1.3 読み込み時の注意点
+ 
+ - 後から読み込むルールは先に読み込んだルールを上書きしない
+ - 各階層のルールの独立性を保つ
+ - 矛盾が発見された場合は即座に報告する

- ## 1. ルール改善のトリガー
+ ## 2. ルール改善のトリガー

[rest of the file content remains unchanged, just updating section numbers]
```

## 2. 変更理由

1. ルール階層構造の明確化
   - 3階層のルール構造を明示
   - 読み込み順序の重要性を強調
   - AIの理解ポイントを具体化

2. .clinerules生成プロセスの改善
   - 優先順位の明確化
   - 上書き禁止ルールの明示
   - 矛盾検出の重要性

3. AIの作業効率向上
   - 明確な作業順序の提示
   - 具体的な例示の追加
   - エラー防止の強化

## 3. 概要

### 対象ファイル
docs/setup/cline/update-guide/for-ai-update-clinerules.md

### 改善の動機
- ルールの階層構造をAIが確実に理解する必要性
- .clinerules生成プロセスの最適化
- エラー防止の強化

### 期待される成果
- AIによる正確なルール理解
- 効率的な.clinerules生成
- エラーの削減

## 4. 現状の課題

### 4.1 問題点
- ルールの階層構造が不明確
- 読み込み順序が明示されていない
- エラー防止メカニズムが不十分

### 4.2 影響範囲
- .clinerules生成プロセス全体
- AIのルール理解プロセス
- エラー検出と報告

## 5. 実装計画

### 5.1 実装手順
1. for-ai-update-clinerules.mdの更新
2. 既存のセクション番号の調整
3. 新しい階層構造セクションの追加

### 5.2 検証項目
- AIがルール階層を正しく理解できるか
- .clinerules生成が正しい順序で行われるか
- エラー検出が適切に機能するか

## 6. リスク評価

### 6.1 潜在的な問題
- 既存の処理との互換性
  → 段階的な移行で対応
- 理解の複雑化
  → 具体例の提示で対応

### 6.2 代替案
1. 階層構造を簡略化
   - メリット：理解が容易
   - デメリット：柔軟性の低下

2. 自動検出機能の追加
   - メリット：エラー防止の強化
   - デメリット：実装の複雑化