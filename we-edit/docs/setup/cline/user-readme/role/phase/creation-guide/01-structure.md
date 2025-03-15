# エキスパートロール資料集の構造定義

## 1. ディレクトリ構造

### 1.1 基本構造
```markdown
[phase-name]/
├── expert-lists/
│   ├── README.md
│   ├── experts-list-[domain]-[nn].md
│   ├── experts-list-[domain]-[nn].md
│   └── ...
├── templates/
│   ├── README.md
│   └── [template files]
└── examples/
    ├── README.md
    └── [example files]
```

### 1.2 命名規則
```markdown
1. ディレクトリ
   □ 小文字のみ使用
   □ ハイフン区切り
   □ 複数形で終わる
   □ 具体的な名前

2. ファイル
   □ プレフィックス使用
   □ 連番付与
   □ 領域識別子
   □ .md拡張子
```

## 2. メタデータ構造

### 2.1 必須メタデータ
```markdown
1. バージョン情報
   □ version: 1.0.0
   □ last_updated: YYYY-MM-DD
   □ status: [draft/review/approved]
   □ phase: [phase-name]

2. 分類情報
   □ category: [domain]
   □ type: [expert-list/template/example]
   □ priority: [high/medium/low]
   □ complexity: [basic/intermediate/advanced]
```

### 2.2 オプションメタデータ
```markdown
1. 管理情報
   □ author: [name]
   □ reviewers: [names]
   □ expiry: [date]
   □ next_review: [date]

2. 関連情報
   □ related_files: [file-paths]
   □ dependencies: [dependencies]
   □ tags: [tag-list]
   □ references: [urls/docs]
```

## 3. 文書構造

### 3.1 基本要素
```markdown
1. ヘッダー部
   □ タイトル（h1）
   □ メタデータブロック
   □ 概要セクション
   □ 目次（必要に応じて）

2. 本文部
   □ 見出し階層（h2-h4）
   □ コードブロック
   □ リスト
   □ 表
```

### 3.2 特殊要素
```markdown
1. プロンプト例
   □ コードブロックで囲む
   □ 言語指定：markdown
   □ インデント：2スペース
   □ コメント活用

2. 参照リンク
   □ 相対パス使用
   □ リンクテキスト明示
   □ 参照ID活用
   □ エスケープ処理
```

## 4. コンテンツ要素

### 4.1 リスト構造
```markdown
1. 箇条書き
   □ ハイフン使用
   □ インデント：2スペース
   □ 入れ子：最大3階層
   □ 空行による区切り

2. 番号付きリスト
   □ ピリオド使用
   □ 自動番号付け
   □ 階層構造維持
   □ 参照可能性
```

### 4.2 表形式
```markdown
1. 基本形式
   □ 左揃えデフォルト
   □ ヘッダー行必須
   □ 区切り行必須
   □ 空セル処理

2. 拡張形式
   □ 位置揃え指定
   □ 幅指定
   □ 結合セル
   □ スタイル指定
```

## 5. 相互参照

### 5.1 内部リンク
```markdown
1. ファイル参照
   □ 相対パス使用
   □ .md拡張子必須
   □ リンクテキスト明示
   □ エスケープ処理

2. セクション参照
   □ アンカー使用
   □ 自動ID活用
   □ フラグメント指定
   □ 階層構造考慮
```

### 5.2 外部リンク
```markdown
1. URL参照
   □ フルパス指定
   □ プロトコル明示
   □ リンクテキスト説明
   □ 参照形式活用

2. リソース参照
   □ 永続的URL
   □ バージョン指定
   □ アクセス制御考慮
   □ 可用性確認
```

## 6. バージョン管理

### 6.1 変更履歴
```markdown
1. 記録項目
   □ 変更日時
   □ 変更者
   □ 変更内容
   □ 変更理由

2. 管理方法
   □ コミットメッセージ
   □ タグ付け
   □ ブランチ戦略
   □ マージ基準
```

### 6.2 品質管理
```markdown
1. チェック項目
   □ リンク有効性
   □ フォーマット準拠
   □ 内容の整合性
   □ メタデータ正確性

2. レビュープロセス
   □ レビュー担当割当
   □ チェックリスト使用
   □ フィードバック収集
   □ 承認フロー