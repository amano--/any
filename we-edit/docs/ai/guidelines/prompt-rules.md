# プロンプト規則集

## 作業終了プロンプト規則

### トリガーワード
- 「おつかれ」
- 「本日の作業の終了」

### 実行する作業

1. 週次作業ログの更新
   ```
   docs/logs/work-log/[YYYY]/YYYY-MM_[WEEKNUMBER].md
   ```

2. Architecture Decision Recordの作成
   ```
   docs/logs/ai/adr/[開発フェーズ]/YYYY-MM/
   ```

3. 知見のまとめ作成
   ```
   docs/logs/ai/knowledge/[開発フェーズ]/YYYY-MM/YYYY-MM-DD-[内容のタイトルの英名].md
   ```

4. メモリバンクの更新
   - systemPatterns.md
   - activeContext.md
   - progress.md

### システムプロンプトへの追加

```
if input contains "おつかれ" or "本日の作業の終了":
    execute_work_completion_process()
```

### エラー防止策

1. 作業開始時にルールを読み込む
2. トリガーワード検出時に必ずルールを確認
3. 作業完了後のチェックリストで確認

## 作業終了記録の必須項目

1. 週次作業ログ
   - 実施したタスク
   - 成果物
   - 次回への課題

2. ADR
   - 決定事項
   - 検討した代替案
   - 影響範囲

3. 知見まとめ
   - 主要な発見
   - 改善提案
   - 次のステップ

4. メモリバンク更新
   - パターンの追加
   - コンテキストの更新
   - 進捗の記録

## 更新履歴

- 2025-03-07: 初版作成
  - 作業終了プロンプト規則の定義
  - 必須項目の整理
  - エラー防止策の追加