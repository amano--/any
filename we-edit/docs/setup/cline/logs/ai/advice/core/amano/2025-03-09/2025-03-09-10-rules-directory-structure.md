# ルール改善提案

## 1. 概要

### 対象ファイル
docs/setup/cline/rules/以下のディレクトリ構造全体

### 改善の動機
- AIの理解度確認を効率化
- ルールの階層構造を明確化
- トークン数を最適化
- メンテナンス性の向上

### 期待される成果
- AIの効率的なルール理解
- トークン使用量の削減
- ユーザーとAIの役割分担の明確化
- 一貫性のあるドキュメント管理

## 2. 現状の課題

### 2.1 問題点
- ファイルの順序関係が不明確
- 翻訳版と原案の関係が不明瞭
- 理解度確認プロセスが非効率
- ファイル名規則が統一されていない

### 2.2 影響範囲
- ルールファイルの構成全体
- AIの理解度確認プロセス
- .clinerules生成プロセス
- ドキュメントメンテナンス作業

## 3. 改善提案

### 3.1 変更内容
```diff
  docs/setup/cline/rules/
- ├── personal.md
- ├── project.md
- └── task/
-     ├── knowledge-update.md
-     ├── adr-creation.md
-     └── guideline-revision.md

+ ├── 00-basic.md                # 基本ルール（言語・セキュリティ）
+ ├── 01-trigger-task.md         # トリガーとタスク定義
+ ├── 02-git-workflow.md         # Git運用ルール
+ ├── 03-project.md             # プロジェクト全体ルール
+ ├── 04-personal.md            # 個人設定ルール
+ │
+ ├── en/                       # 英語翻訳（AI管理）
+ │   ├── 00-basic.md
+ │   ├── 01-trigger-task.md
+ │   ├── 02-git-workflow.md
+ │   ├── 03-project.md
+ │   └── 04-personal.md
+ │
+ └── detail/                   # 詳細説明（ユーザー管理）
+     ├── 00-basic/
+     │   ├── language-usage.md
+     │   └── security.md
+     ├── 01-trigger-task/
+     │   ├── auto-triggers.md
+     │   └── task-definitions.md
+     └── 02-git-workflow/
+         ├── commit-rules.md
+         └── branch-management.md
```

### 3.2 変更理由
1. ファイル命名規則の統一
   - 番号プレフィックスによる順序の明確化
   - 内容を反映した分かりやすい名前
   - 一貫性のある命名パターン

2. ディレクトリ構造の最適化
   - 明確な役割分担（原案/翻訳/詳細）
   - 論理的な階層構造
   - 効率的な参照関係

3. 理解度確認の効率化
   - 各原案ファイルにチェックポイントを集約
   - 必要に応じて詳細を参照
   - トークン数の最適化

## 4. 実装計画

### 4.1 実装手順
1. ディレクトリ構造の整備
   ```bash
   mkdir -p docs/setup/cline/rules/{en,detail/{00-basic,01-trigger-task,02-git-workflow}}
   ```

2. ファイルの移動と名前変更
   ```bash
   # 既存ファイルの移動と名前変更
   mv personal.md 04-personal.md
   mv project.md 03-project.md
   ```

3. 新規ファイルの作成
   ```bash
   # 原案ファイル
   touch 00-basic.md 01-trigger-task.md 02-git-workflow.md
   
   # 英語版
   touch en/{00-basic.md,01-trigger-task.md,02-git-workflow.md}
   
   # 詳細説明
   touch detail/00-basic/{language-usage.md,security.md}
   touch detail/01-trigger-task/{auto-triggers.md,task-definitions.md}
   touch detail/02-git-workflow/{commit-rules.md,branch-management.md}
   ```

4. 内容の移行
   - 既存内容の新構造への移行
   - 理解度チェックポイントの追加
   - 英語版の生成
   - 詳細ドキュメントの作成

### 4.2 検証項目
- ファイル間の参照整合性
- 理解度確認プロセスの効率
- トークン使用量の変化
- ドキュメント更新の容易さ

## 5. リスク評価

### 5.1 潜在的な問題
- 既存ツールとの互換性
  → mk-clinerules.shの更新で対応
- 移行期の混乱
  → 段階的な移行と明確なガイドライン提供
- メンテナンスの複雑化
  → 明確な役割分担とドキュメントで対応

### 5.2 代替案
1. フラットな構造を維持
   - メリット：シンプルな管理
   - デメリット：スケール時の管理が困難

2. 機能別ディレクトリのみ
   - メリット：機能の分類が明確
   - デメリット：理解度確認の効率が低下