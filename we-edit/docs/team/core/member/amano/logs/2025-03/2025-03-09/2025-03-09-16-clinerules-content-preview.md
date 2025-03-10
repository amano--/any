# .clinerules の内容プレビュー

```yaml
# ====================
# メンバールール（最優先）
# ====================

# 個人情報
member:
  team: core
  name: amano
  role: developer

# 個人の作業特性
characteristics:
  programming_skill: high
  preferred_style: test_driven
  ai_collaboration: efficiency_focused
  knowledge_base: github_learned

# エラー防止設定
error_prevention:
  context_check:
    enabled: true
    timing: ["task_start", "decision_point"]
    action: "ask_if_unclear"
  
  test_failure:
    monitor:
      consecutive_failures: 2
      action: "pause_and_review"
    requirements:
      - write_test_code
      - explain_while_coding
      - avoid_blind_attempts

# 自動コミット設定
auto_commit:
  triggers:
    - tool: "attempt_completion"
      action: "commit"
      template: "docs/setup/cline/rules/task/auto-commit-by-task.md"
    - keyword: "タスク完了"
      action: "commit"
      template: "docs/setup/cline/rules/task/auto-commit-by-task.md"
  
  requirements:
    - include_prompt_history: true
    - explain_changes: true
    - record_context: true

# ====================
# チームルール（次優先）
# ====================

# ルール改善設定
rule_improvement:
  auto_detect:
    keywords:
      - "ルールの問題点が見つかりました"
      - "ルールの改善が必要です"
      - "ルールの更新を提案します"
      - "ルールの矛盾を発見しました"
      - "ルールの最適化が可能です"
    action: "create_improvement_proposal"
    template: "docs/setup/cline/rules/task/rule-improvement.md"
  
  manual_trigger:
    keyword: "ルール改善"
    action: "create_improvement_proposal"
    template: "docs/setup/cline/rules/task/rule-improvement.md"

# ====================
# プロジェクトルール（基盤）
# ====================

# 言語設定
language:
  thinking: English
  response: Japanese
  commit: Japanese
  pullRequest: Japanese

# セキュリティ設定
security:
  forbidden_files:
    - ".env"
    - "**/api_key*"
    - "**/token*"
    - "**/auth*"
  
  rules:
    - no_commit_secrets: true
    - use_env_vars: true
    - no_auth_in_logs: true

# 品質管理設定
quality:
  test:
    required: true
    style: "test_driven"
    coverage: "functional"
  
  review:
    explain_changes: true
    document_context: true
    check_security: true

# 通知設定
notifications:
  error_detection: immediate
  test_failure: immediate
  security_violation: immediate

# パス設定
paths:
  member_rules: "docs/team/core/member/amano/rules/"
  team_rules: "docs/team/core/rules/"
  project_rules: "docs/setup/cline/rules/detail/"
```

## 説明

1. メンバールール
   - 個人情報と特性を定義
   - エラー防止メカニズムを設定
   - 自動コミットの条件を指定

2. チームルール
   - ルール改善プロセスを定義
   - 自動検知と手動トリガーを設定

3. プロジェクトルール
   - 言語使用を規定
   - セキュリティ要件を設定
   - 品質管理プロセスを定義

## 確認項目

1. 設定の妥当性
   - メンバールールが最優先されているか
   - エラー防止が適切に設定されているか
   - 自動化が効率的に機能するか

2. セキュリティ
   - 機密情報の保護が十分か
   - アクセス制御が適切か
   - エラー通知が確実か

3. 実用性
   - 作業スタイルに合致しているか
   - 効率的な運用が可能か
   - メンテナンスが容易か