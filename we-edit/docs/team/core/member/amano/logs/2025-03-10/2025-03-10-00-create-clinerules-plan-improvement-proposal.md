# create-clinerules-plan.md 改善提案

## 1. 改善の背景

### 1.1 現状の課題
- テンプレートの説明が不十分
- パス指定の形式が不統一
- ディレクトリ構造の可視化が必要

### 1.2 改善の必要性
- テンプレート適用の確実性向上
- パス指定エラーの防止
- 構造理解の促進

## 2. 具体的な改善提案

### 2.1 ルール構造セクションの強化

```markdown
## 2. ルール構造

### 2.1 必須ディレクトリ
```bash
docs/setup/cline/rules/
├── 00-personal.md    # 個人ルールテンプレート
├── 01-team.md        # チームルールテンプレート
├── 02-project.md     # プロジェクトルールテンプレート
└── detail/
    ├── basic/
    │   ├── 00-basic.md
    │   ├── 01-trigger-task.md
    │   ├── 02-git-workflow.md
    │   └── 03-clinerules-best-practices.md
    └── trigger-task/
        ├── adr-creation.md
        ├── auto-commit-by-task.md
        ├── guideline-revision.md
        ├── knowledge-update.md
        ├── rule-improvement.md
        └── weekly-report-update.md
```

### 2.2 ファイル関連定義の明確化

```markdown
### 2.2 参照ルール

1. テンプレート位置
   - 個人ルール: docs/setup/cline/rules/00-personal.md
   - チームルール: docs/setup/cline/rules/01-team.md
   - プロジェクトルール: docs/setup/cline/rules/02-project.md

2. ルール適用先
   - 個人ルール: docs/team/[teamName]/member/[userName]/rules/
   - チームルール: docs/team/[teamName]/rules/
   - プロジェクトルール: docs/setup/cline/rules/detail/

3. 命名規則
   - ファイル名は数字2桁-説明.md形式
   - 例：00-basic.md, 01-workflow.md
```

### 2.3 テンプレート確認プロセスの追加

```markdown
### 2.3 テンプレート確認手順

1. 構造の確認
   - セクション構成
   - インデント規則
   - 番号付け規則

2. 内容の確認
   - 必須項目の存在
   - 参照先の正確性
   - 用語の一貫性

3. フォーマットの確認
   - Markdownの文法
   - 箇条書きの形式
   - コードブロックの形式
```

### 2.4 エラー防止の強化

```markdown
### 2.4 エラー防止チェックリスト

[ ] すべてのパスが "docs" から始まる
[ ] ディレクトリ構造が最新
[ ] テンプレートファイルの存在確認
[ ] 参照先の存在確認
[ ] フォーマットの一貫性確認
```

## 3. 期待される効果

### 3.1 品質向上
- テンプレート適用の正確性向上
- パス指定エラーの削減
- 構造把握の容易化

### 3.2 効率化
- 確認作業の明確化
- エラーの早期発見
- 修正コストの削減

## 4. 実装方針

### 4.1 改善の進め方
1. ディレクトリ構造の可視化
2. パス指定の標準化
3. チェックリストの導入

### 4.2 留意点
- 既存の構造は維持
- 必要最小限の変更にとどめる
- 後方互換性を確保