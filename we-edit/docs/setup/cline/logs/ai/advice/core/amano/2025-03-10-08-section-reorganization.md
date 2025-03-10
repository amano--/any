# セクション番号の整理案

## 1. 最初の部分の構造修正

```diff
# Clineルール更新手順（AI用）

## 0. 重要な前提
[内容は維持]

- ## 1. 前提確認
+ ## 1. 作業フロー概要

+ ```mermaid
+ graph TD
+     A[計画書作成] -->|承認必要| B(ユーザー承認)
+     B -->|承認後のみ| C[プレビュー作成]
+     C -->|承認必要| D(ユーザー承認)
+     D -->|承認後のみ| E[.clinerules.ja作成]
+     E -->|承認必要| F(ユーザー承認)
+     F -->|承認後のみ| G[.clinerules作成]
+     G -->|承認必要| H(最終承認)
+ ```

+ ## 2. 作業準備

- ### 1.1 ファイル構造の確認
+ ### 2.1 ファイル構造の確認
[内容は維持]

- ### 1.0.2 構造変更の確認
+ ### 2.2 構造変更の確認
[内容は維持]

- ## 1. ルール改善のトリガー
+ ## 3. ルール改善のトリガー

- ### 1.1 自動検知
+ ### 3.1 自動検知
[内容は維持]

- ### 1.2 手動トリガー
+ ### 3.2 手動トリガー
[内容は維持]

[Section 1.5の内容は削除 - すでにフローチャートとして反映済み]
```

## 2. 変更のポイント

1. Section 1を「作業フロー概要」として統一
2. 以降のセクションを順番に振り直し
3. 重複していた内容を整理

## 3. 期待される効果

1. 構造の明確化
   - 論理的な流れの改善
   - 重複の解消
   - 参照の簡略化

2. 保持される要素
   - 各セクションの内容
   - フローチャートの情報
   - 作業手順の詳細

この最初の部分の修正でよろしければ、次のセクションの修正に進みます。