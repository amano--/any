# エキスパートロール資料集作成手順書

## 1. 目的と概要
本手順書は、各開発フェーズでAIを活用して高品質な文書を作成するために必要なエキスパートロール資料を作成するためのガイドを提供します。

## 2. ドキュメント構成

### 2.1 基本構造
```markdown
creation-guide/
├── [README.md](./README.md)                    # 本手順書
├── [00-overview.md](./00-overview.md)          # 全体概要
├── [01-structure.md](./01-structure.md)        # 基本構造定義
├── [02-expert-lists.md](./02-expert-lists.md)  # 専門家リスト作成手順
└── expert-lists/                              # 実装例
```

### 2.2 エキスパートリストの基本構造
```markdown
[phase-name]/expert-lists/
├── [README.md](./expert-lists/README.md)
├── [experts-list-business-01.md](./expert-lists/experts-list-business-01.md)
├── [experts-list-technical-01.md](./expert-lists/experts-list-technical-01.md)
├── [experts-list-analysis-01.md](./expert-lists/experts-list-analysis-01.md)
└── [experts-list-process-01.md](./expert-lists/experts-list-process-01.md)
```

## 3. 作成手順

### 3.1 準備作業
```markdown
1. 対象フェーズの分析
   □ フェーズの特徴把握
   □ 必要な専門性の特定
   □ 求められる成果物の定義
   □ 想定される課題の整理

プロンプト例：
「[phase-name]フェーズの特徴と必要な専門性を分析してください：

フェーズ特性：
[フェーズの説明]

分析観点：
1. 必要な専門性の種類
2. 主要な成果物
3. 品質要件
4. 潜在的な課題」
```

### 3.2 基本構造の作成
```markdown
1. ディレクトリ作成
   □ mkdir -p docs/setup/cline/user-readme/role/phase/[phase-name]/expert-lists
   □ touch expert-lists/README.md
   □ touch expert-lists/experts-list-{business,technical,analysis,process}-*.md

2. README.mdの作成
   □ 全体構成の説明
   □ 専門家カテゴリーの定義
   □ 活用ガイドラインの記述
   □ メンテナンス方針の明記

プロンプト例：
「[phase-name]フェーズのエキスパートリストのREADMEを作成してください：

必要項目：
1. 全体構成
2. 専門家カテゴリー
3. 活用ガイドライン
4. メンテナンス方針」
```

### 3.3 専門家リストの作成
```markdown
1. 各分野の専門家特定
   □ 分野別の第一人者
   □ 主要な貢献内容
   □ 活用可能な知見
   □ プロンプト例

プロンプト例：
「[domain]分野の専門家リストを作成してください：

必要情報：
1. 専門家名と実績
2. 主な貢献内容
3. 活用シーン
4. プロンプト例」
```

## 4. 作成のポイント

### 4.1 専門家の選定基準
```markdown
1. 分野での影響力
   □ 理論・手法の確立
   □ 実践的な成果
   □ 後続への影響
   □ 現代的な関連性

2. 活用可能性
   □ 知見の具体性
   □ 手法の実用性
   □ 検証可能性
   □ 応用範囲
```

### 4.2 プロンプト設計
```markdown
1. 基本構造
   □ 役割の明確化
   □ 状況の具体化
   □ 期待の明示
   □ 制約の提示

2. 評価項目
   □ 具体的な基準
   □ 測定可能性
   □ 実用性
   □ フィードバック方法
```

## 5. 品質基準

### 5.1 必須要件
```markdown
1. 構造面
   □ 規定の構造に準拠
   □ MDリンクの正確性
   □ メタデータの完備
   □ 相互参照の整合性

2. 内容面
   □ 専門家選定の妥当性
   □ プロンプトの実用性
   □ 組み合わせの有効性
   □ メンテナンス性
```

### 5.2 検証方法
```markdown
1. 基本検証
   □ リンクの動作確認
   □ フォーマット検証
   □ 内容の正確性
   □ 参照の整合性

2. 実用性検証
   □ プロンプトのテスト
   □ 組み合わせの試行
   □ フィードバック収集
   □ 改善点の特定
```

## 6. メンテナンス

### 6.1 更新方針
```markdown
1. 定期レビュー
   □ 最新性の確認
   □ 有効性の評価
   □ フィードバックの反映
   □ 改善の実施

2. 品質管理
   □ 検証の実施
   □ 問題点の修正
   □ 改善の反映
   □ 効果の確認