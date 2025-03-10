# .clinerules プレビュー

## 1. メンバールール（最優先）

### 1.1 個人情報
```yaml
teamName: core
userName: amano
role: プロジェクトメンバー
lastUpdate: "2025-03-09"
```

### 1.2 ユーザー特性
```yaml
技術レベル:
  programmingSkill: 高
  speciality: "GitHubからの広範な知識"
  expertise: "アルゴリズム・ライブラリの実装"

作業方針:
  style: "テスト駆動開発"
  aiCollaboration: "時短重視"
  qualityControl: "テストコードによる確認"
  documentation: "実装中の説明重視"

注意事項:
  challenge: "コンテキストに応じた処理"
  countermeasure: "不明確な場合は即時確認"
```

### 1.3 タスク完了時の自動化
```yaml
autoCommit:
  triggers:
    - condition: "attempt_completionツール使用時"
      type: "自動"
    - condition: "タスク完了の明示的な指示時"
      type: "手動"
  
  template: "docs/setup/cline/rules/task/auto-commit-by-task.md"
  
  requirements:
    - プロンプト履歴の含有
    - 変更内容の明確な説明
    - コンテキストの記録
```

### 1.4 エラー防止機能
```yaml
testFailure:
  condition: "2回以上連続で失敗"
  actions:
    - "現在の状況を整理"
    - "仮説の構築"
    - "解決方法の共同検討"

contextCheck:
  timing: "作業開始時と重要な判断時"
  actions:
    - "コンテキストの明確化"
    - "不明点の質問"
    - "理解度の確認"

qualityControl:
  process:
    - "テストコードの作成"
    - "動作確認の実施"
    - "ユーザーへの説明"
```

## 2. チームルール（次優先）

### 2.1 ルール改善プロセス
```yaml
検知キーワード:
  - "ルールの問題点が見つかりました"
  - "ルールの改善が必要です"
  - "ルールの更新を提案します"
  - "ルールの矛盾を発見しました"
  - "ルールの最適化が可能です"

手動トリガー:
  - keyword: "ルール改善"

template: "docs/setup/cline/rules/task/rule-improvement.md"
```

## 3. プロジェクトルール（基盤）

### 3.1 言語設定
```yaml
thinking: English
response: Japanese
commit: Japanese
pullRequest: Japanese
```

### 3.2 セキュリティ設定
```yaml
forbidden:
  - .env
  - "**/api_key*"
  - "**/token*"
  - "**/auth*"

rules:
  - "機密ファイルを絶対にコミットしない"
  - "シークレット情報は環境変数を使用"
  - "ログや出力に認証情報を含めない"
```

## 4. レビュー項目

### 4.1 機能面
- [ ] テスト関連の設定は適切か
- [ ] 自動コミットの設定は正確か
- [ ] エラー防止機能は十分か

### 4.2 ユーザー特性
- [ ] プログラミングスキルを活かせる設定か
- [ ] テスト駆動の作業スタイルに合致しているか
- [ ] AIとの協業が効率的に行えるか

### 4.3 セキュリティ
- [ ] 機密情報の保護は十分か
- [ ] アクセス制御は適切か
- [ ] エラー処理は安全か

## 5. 承認依頼

以上の内容でよろしければ、承認をお願いいたします。
変更が必要な箇所がございましたら、ご指摘ください。

特に以下の点についてご確認をお願いします：
1. ユーザー特性の反映が適切か
2. エラー防止機能が十分か
3. 自動化設定が要件を満たしているか