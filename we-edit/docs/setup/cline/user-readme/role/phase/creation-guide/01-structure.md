# エキスパートロール資料集の構造定義

## 1. 基本構造

### 1.1 ディレクトリ構造
```markdown
docs/setup/cline/user-readme/role/phase/
├── creation-guide/          # 本ガイド
│   ├── [README.md](../creation-guide/README.md)
│   ├── [00-overview.md](../creation-guide/00-overview.md)
│   ├── [01-structure.md](../creation-guide/01-structure.md)
│   └── [02-expert-lists.md](../creation-guide/02-expert-lists.md)
│
├── requirements/           # 要件定義フェーズ
│   ├── expert-lists/
│   │   ├── [README.md](../requirements/expert-lists/README.md)
│   │   └── [experts-list-*.md](../requirements/expert-lists/)
│   └── ...
│
└── [other-phases]/        # その他開発フェーズ
```

### 1.2 フェーズディレクトリ構造
```markdown
[phase-name]/
├── expert-lists/          # 専門家リスト
│   ├── README.md
│   ├── experts-list-business-*.md
│   ├── experts-list-technical-*.md
│   ├── experts-list-analysis-*.md
│   └── experts-list-process-*.md
│
├── templates/            # テンプレート
│   ├── README.md
│   └── template-*.md
│
└── examples/            # 活用例
    ├── README.md
    └── example-*.md
```

## 2. 命名規則

### 2.1 ディレクトリ命名
```markdown
1. フェーズディレクトリ
   □ 小文字のみ使用
   □ ハイフン区切り
   例：
   - requirements/
   - design/
   - implementation/
   - testing/
   - maintenance/

2. サブディレクトリ
   □ 機能を表す名前
   □ 複数形で終わる
   例：
   - expert-lists/
   - templates/
   - examples/
```

### 2.2 ファイル命名
```markdown
1. 専門家リスト
   □ プレフィックス: experts-list-
   □ 分野識別子: business/technical/analysis/process
   □ 連番: -nn（同一分野内での連番）
   例：
   - [experts-list-business-01.md](./experts-list-business-01.md)
   - [experts-list-technical-01.md](./experts-list-technical-01.md)

2. その他のファイル
   □ 種類を示すプレフィックス
   □ 説明的な名前
   □ 連番（必要な場合）
   例：
   - [template-basic-01.md](./templates/template-basic-01.md)
   - [example-usage-01.md](./examples/example-usage-01.md)
```

## 3. メタデータ定義

### 3.1 必須メタデータ
```markdown
1. ファイル情報
version: 1.0.0
last_updated: YYYY-MM-DD
status: [draft/review/approved]
phase: [phase-name]

2. 分類情報
category: [business/technical/analysis/process]
type: [expert-list/template/example]
priority: [high/medium/low]
complexity: [basic/intermediate/advanced]
```

### 3.2 オプションメタデータ
```markdown
1. 管理情報
author: [name]
reviewers: [names]
expiry: [date]
next_review: [date]

2. 関連情報
related_files: [file-paths]
dependencies: [dependencies]
tags: [tag-list]
references: [urls/docs]
```

## 4. ドキュメント構造

### 4.1 専門家リストの構造
```markdown
# タイトル
## 専門家一覧（表形式）
## 詳細プロフィール
## 組み合わせ推奨パターン
## 活用シナリオ
## メンテナンス情報
```

### 4.2 READMEの構造
```markdown
# 概要
## ディレクトリ構成
## 使用方法
## 品質基準
## メンテナンス方針
```

## 5. リンク参照規則

### 5.1 内部リンク
```markdown
1. 同一ディレクトリ内
[ファイル名](./ファイル名)
例：[experts-list-business-01.md](./experts-list-business-01.md)

2. 上位ディレクトリ参照
[ファイル名](../ディレクトリ/ファイル名)
例：[README.md](../phase/README.md)
```

### 5.2 相対パス使用
```markdown
1. パスの基本形式
□ ./ - 現在のディレクトリ
□ ../ - 親ディレクトリ
□ ../../ - 親の親ディレクトリ

2. リンク表示
□ 表示名は具体的に
□ パスは相対パスで
□ 拡張子は必ず付ける
□ ディレクトリは/で終わる
```

## 6. メンテナンス規則

### 6.1 更新管理
```markdown
1. バージョン管理
□ セマンティックバージョニング
□ 更新日の記録
□ 変更履歴の維持
□ レビュー状態の管理

2. 品質チェック
□ リンクの有効性
□ フォーマット準拠
□ メタデータ完全性
□ 内容の整合性