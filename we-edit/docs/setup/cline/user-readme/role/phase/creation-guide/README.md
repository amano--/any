# エキスパートロール資料集作成手順書

## 1. 目的と概要
各開発フェーズでAIを活用して高品質な文書を作成するために、フェーズごとに最適な専門家の知見を整理し、エキスパートロール資料を作成するための手順を提供します。

## 2. 基本情報

### 2.1 対象パス
```
docs/setup/cline/user-readme/role/phase/[phase-name]/
```

### 2.2 フェーズ名の標準形式
```markdown
requirements/          # 要件定義フェーズ
design/               # 設計フェーズ
implementation/       # 実装フェーズ
testing/              # テストフェーズ
deployment/           # デプロイフェーズ
maintenance/          # 保守フェーズ
```

### 2.3 フェーズ内の標準構成
```markdown
[phase-name]/
├── expert-lists/           # 専門家リスト
│   ├── README.md
│   ├── experts-list-business-01.md
│   ├── experts-list-technical-02.md
│   ├── experts-list-analysis-03.md
│   └── experts-list-process-04.md
│
├── templates/             # テンプレート集
│   ├── README.md
│   ├── template-basic-01.md
│   ├── template-advanced-02.md
│   └── ...
│
└── examples/             # 活用例
    ├── README.md
    ├── example-basic-01.md
    ├── example-advanced-02.md
    └── ...
```

## 3. 作成手順

### 3.1 フェーズディレクトリの作成
```markdown
1. ディレクトリ作成
   □ mkdir -p docs/setup/cline/user-readme/role/phase/[phase-name]
   □ cd docs/setup/cline/user-readme/role/phase/[phase-name]
   □ mkdir expert-lists templates examples

2. 基本ファイル作成
   □ README.md
   □ expert-lists/README.md
   □ templates/README.md
   □ examples/README.md
```

### 3.2 専門家リストの作成
```markdown
1. 専門家の分類
   □ ビジネス領域（business）
   □ 技術領域（technical）
   □ 分析領域（analysis）
   □ プロセス領域（process）

2. リストファイルの作成
   □ experts-list-business-01.md
   □ experts-list-technical-02.md
   □ experts-list-analysis-03.md
   □ experts-list-process-04.md
```

## 4. 開始手順

### 4.1 フェーズ分析
```markdown
プロンプト例：
「以下の開発フェーズに必要なエキスパートロール資料の分析をお願いします：

フェーズ：[phase-name]
目的：[フェーズの目的]
作成文書：[必要な文書タイプ]

分析項目：
1. 必要な専門性の種類
2. 推奨される専門家
3. 専門家の組み合わせパターン
4. 注意すべきポイント」
```

### 4.2 専門家リスト作成
```markdown
プロンプト例：
「以下の専門分野のエキスパートリストを作成してください：

分野：[専門分野名]
フェーズ：[phase-name]
必要スキル：[スキルセット]

出力項目：
1. 専門家の基本情報
2. 主な実績と貢献
3. 活用可能なシーン
4. プロンプト例」
```

## 5. 品質基準

### 5.1 必須要件
```markdown
1. ファイル構成
   □ 規定のディレクトリ構造
   □ 命名規則の準拠
   □ 必須ファイルの存在
   □ README.mdの完備

2. 内容要件
   □ 専門家情報の正確性
   □ プロンプト例の具体性
   □ 活用シーンの明確さ
   □ 組み合わせ指針の提示
```

### 5.2 推奨要件
```markdown
1. 拡張性
   □ カスタマイズ容易性
   □ 更新しやすさ
   □ 再利用可能性
   □ 柔軟な適用性

2. 使いやすさ
   □ わかりやすい説明
   □ 具体的な例示
   □ 実践的なガイド
   □ トラブル対応情報
```

## 6. メンテナンス

### 6.1 更新管理
```markdown
1. 定期レビュー
   □ 月次：効果確認
   □ 四半期：内容更新
   □ 半期：構成見直し
   □ 年次：全面改訂

2. 品質確認
   □ 正確性チェック
   □ 有効性確認
   □ フィードバック収集
   □ 改善実施
```

### 6.2 問題対応
```markdown
1. 一般的な問題
   □ 専門家情報の古さ
   □ プロンプトの機能不全
   □ 組み合わせの不調和
   □ 使用結果の期待外れ

2. 対応方法
   □ 情報の更新
   □ プロンプトの改善
   □ 組み合わせの見直し
   □ フィードバックの反映