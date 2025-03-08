# English Rule Translation Process

Created: 2025-03-08 19:28

## Overview

英訳ルールの更新プロセスとmk-clinerules.shの運用方法について整理しました。

## Key Findings

### 1. mk-clinerules.sh の運用方法

- 入力: docs/setup/cline/rules/en/ 配下の英訳ファイル
- 出力: プロジェクトルート直下の .clinerules
- 英訳ファイルの自動結合により、一貫性のある英語ルールセットを生成

### 2. 英訳版ルール更新プロセス

1. 原則
   - 日本語版のルール更新時に必ず英訳版も更新
   - 既存の内容は変更せず、追記形式で更新
   - 翻訳の一貫性を維持

2. 更新手順
   - 日本語版ファイルの更新
   - 対応する英訳ファイルの特定と更新
   - mk-clinerules.sh による .clinerules の再生成

### 3. ドキュメント自動生成の改善

- mk-clinerules.sh の安定性向上
- エラーハンドリングの強化
- デバッグ情報の充実化

## Technical Decisions

1. ファイル命名規則
   - 日本語版: docs/setup/cline/rules/[rule-name].md
   - 英訳版: docs/setup/cline/rules/en/[rule-name].md
   - 統合ファイル: .clinerules

2. 更新プロセスの自動化
   - mk-clinerules.sh による自動結合
   - ファイルの存在チェック
   - 適切なエラーメッセージ

## Next Steps

1. 改善提案
   - 英訳の品質チェック機能の追加
   - ファイル間の同期状態の検証
   - 自動翻訳支援ツールの検討

2. 今後の運用方針
   - 定期的な翻訳の整合性チェック
   - 翻訳ガイドラインの整備
   - レビュープロセスの確立