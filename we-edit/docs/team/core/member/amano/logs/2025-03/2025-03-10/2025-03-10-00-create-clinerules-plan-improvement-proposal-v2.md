# create-clinerules-plan.md 改善提案

## 1. 改善の背景

### 1.1 現状の課題
- mermaidダイアグラムが複雑で理解しにくい
- YAMLでの記述が冗長
- 一部のセクションが重複
- 作業記録のパス指定が曖昧

### 1.2 改善の必要性
- 構造の簡略化と明確化
- 冗長な記述の削除
- パス指定の標準化
- エラー防止の強化

## 2. 具体的な改善提案

### 2.1 削除対象

1. 複雑なmermaidダイアグラム（1.0.1節）
2. YAMLでの記述（1.0.2節）
3. 重複するバイリンガル対応セクション（2.4節と3.4節）

### 2.2 ディレクトリ構造の簡略化

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
```

### 2.3 作業記録パスの標準化

```markdown
### 4.1 ログの保存場所

作業記録は以下のパスに保存：
docs/setup/cline/logs/ai/advice/[teamName]/[userName]/YYYY-MM-DD-HH-[内容].md

例：
- docs/setup/cline/logs/ai/advice/core/amano/2025-03-10-00-clinerules-plan.md
- docs/setup/cline/logs/ai/advice/core/amano/2025-03-10-00-clinerules-preview.md
```

### 2.4 エラー防止の統合

```markdown
## 3. エラー防止メカニズム

### 3.1 確認チェックリスト

[ ] パスがすべて "docs" から始まる
[ ] ディレクトリ構造が最新
[ ] テンプレートファイルの存在確認
[ ] 参照先の存在確認
[ ] フォーマットの一貫性確認
[ ] バイリンガル対応の確認
```

## 3. 期待される効果

### 3.1 整理・簡略化
- 構造の理解が容易に
- メンテナンスが簡単に
- エラーの発見が容易に

### 3.2 標準化
- パス指定の一貫性向上
- 作業記録の管理改善
- バイリンガル対応の明確化

## 4. 実装方針

### 4.1 削除手順
1. 複雑なダイアグラムの削除
2. 重複セクションの統合
3. 冗長な記述の簡略化

### 4.2 追加手順
1. ディレクトリ構造の視覚化
2. パス指定の標準化
3. チェックリストの導入

### 4.3 留意点
- 既存の基本構造は維持
- 必要最小限の変更にとどめる
- 後方互換性を確保