# ディレクトリ構造とファイル命名規則

## 1. 基本的なディレクトリ構造

### 1.1 標準構成
```
phase-name/
├── README.md                                     # フェーズの概要と使用方法
├── experts-list-[category]-[number].md          # 専門家リスト
├── role-usage-guide.md                          # ロールの具体的な活用方法
├── case-studies.md                              # 実際の活用事例集
├── quick-reference.md                           # クイックリファレンス
├── troubleshooting.md                           # よくある課題と解決策
└── additional-resources/                        # 追加リソース
    ├── templates/                               # 各種テンプレート
    ├── workshops/                               # ワークショップガイド
    └── examples/                                # 具体的な例
```

### 1.2 ファイルの役割と責任
```markdown
### コアドキュメント
README.md
- フェーズの目的と概要
- 資料の全体構成
- 使用方法の説明
- 前提条件と制約

experts-list-[category]-[number].md
- 専門家の詳細情報
- 活用シナリオ
- プロンプト例
- 組み合わせパターン

role-usage-guide.md
- ロール別の活用方法
- シチュエーション別ガイド
- プロンプトパターン
- ベストプラクティス

### サポートドキュメント
case-studies.md
- 実際の適用事例
- 成功/失敗の要因
- 学んだ教訓
- 改善提案

quick-reference.md
- よく使うプロンプト
- チェックリスト
- クイックスタートガイド
- 参照情報

troubleshooting.md
- 一般的な問題と解決策
- トラブルシューティングフロー
- 予防的アプローチ
- エスカレーション基準
```

## 2. フェーズ別の特徴的な構成

### 2.1 要求分析フェーズ
```markdown
requirements-analysis/
├── experts-list-methodology-01.md               # 要求工学の専門家
├── experts-list-domain-01.md                    # ドメイン分析の専門家
├── templates/
│   ├── requirement-specification.md             # 要求仕様書
│   ├── user-story.md                           # ユーザーストーリー
│   └── acceptance-criteria.md                   # 受け入れ基準
└── workshops/
    ├── requirement-elicitation.md               # 要求抽出
    ├── domain-analysis.md                       # ドメイン分析
    └── stakeholder-interview.md                 # ステークホルダーインタビュー
```

### 2.2 設計フェーズ
```markdown
design-phase/
├── experts-list-architecture-01.md              # アーキテクチャ専門家
├── experts-list-patterns-01.md                  # パターン専門家
├── templates/
│   ├── architecture-design.md                   # アーキテクチャ設計
│   ├── component-spec.md                        # コンポーネント仕様
│   └── interface-design.md                      # インターフェース設計
└── workshops/
    ├── architecture-review.md                   # アーキテクチャレビュー
    ├── pattern-selection.md                     # パターン選択
    └── design-validation.md                     # 設計検証
```

### 2.3 実装フェーズ
```markdown
implementation/
├── experts-list-development-01.md               # 開発手法の専門家
├── experts-list-quality-01.md                   # 品質管理の専門家
├── templates/
│   ├── coding-guidelines.md                     # コーディングガイドライン
│   ├── test-plan.md                            # テスト計画
│   └── review-checklist.md                      # レビューチェックリスト
└── workshops/
    ├── code-review.md                           # コードレビュー
    ├── testing-strategy.md                      # テスト戦略
    └── quality-assurance.md                     # 品質保証
```

## 3. ファイル命名規則

### 3.1 専門家リストのファイル命名
```markdown
experts-list-[category]-[number].md

カテゴリ例：
- methodology    # 方法論の専門家
- domain        # ドメイン知識の専門家
- architecture  # アーキテクチャの専門家
- development   # 開発手法の専門家
- quality       # 品質管理の専門家
- process       # プロセス改善の専門家

番号規則：
- 01から開始
- 1ファイルあたり4-5名
- 関連する専門家をグループ化
```

### 3.2 テンプレートのファイル命名
```markdown
[purpose]-[type]-[variant].md

目的（purpose）例：
- requirement   # 要求関連
- architecture  # アーキテクチャ関連
- component    # コンポーネント関連
- interface    # インターフェース関連
- test        # テスト関連

種類（type）例：
- spec        # 仕様書
- guideline   # ガイドライン
- checklist   # チェックリスト
- template    # テンプレート

バリエーション（variant）例：
- basic       # 基本版
- detailed    # 詳細版
- simple      # 簡易版
```

### 3.3 ワークショップガイドのファイル命名
```markdown
[activity]-[purpose].md

活動（activity）例：
- workshop    # ワークショップ
- review     # レビュー
- planning   # 計画策定
- analysis   # 分析作業

目的（purpose）例：
- elicitation # 抽出
- validation  # 検証
- improvement # 改善
- training    # トレーニング
```

## 4. コンテンツ構造のガイドライン

### 4.1 README.mdの構造
```markdown
1. フェーズ概要
   - 目的と範囲
   - 主要な活動
   - 期待される成果物

2. ディレクトリ構成
   - ファイル一覧
   - 各ファイルの役割
   - 相互関係

3. 使用方法
   - 基本的なワークフロー
   - 状況別のガイド
   - カスタマイズ方法

4. 参考情報
   - 関連リソース
   - 注意点
   - サポート情報
```

### 4.2 専門家リストの構造
```markdown
1. 専門家一覧
   - 基本情報
   - 専門分野
   - 主要な貢献

2. 詳細解説
   - プロフィール
   - 活用シーン
   - 期待される成果物

3. プロンプト例
   - 基本構造
   - バリエーション
   - 使用上の注意

4. 補足情報
   - 組み合わせパターン
   - 注意点
   - 参考資料
```

### 4.3 テンプレートの構造
```markdown
1. 基本情報
   - 目的
   - 対象者
   - 前提条件

2. テンプレート本体
   - 構造化された内容
   - 記入ガイド
   - 例示

3. 使用方法
   - 記入手順
   - カスタマイズポイント
   - チェックリスト

4. 補足情報
   - 関連テンプレート
   - 参考資料
   - 注意事項
```

## 5. メンテナンスと更新

### 5.1 バージョン管理
```markdown
1. バージョニング規則
   - メジャーバージョン：大規模な構造変更
   - マイナーバージョン：内容の追加・更新
   - パッチバージョン：軽微な修正

2. 更新履歴の記録
   - 変更内容
   - 変更理由
   - 影響範囲
```

### 5.2 品質管理
```markdown
1. レビュープロセス
   - 構造の一貫性
   - 内容の正確性
   - 形式の遵守

2. 更新手順
   - バックアップ
   - 変更の適用
   - 検証とテスト