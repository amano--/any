## グループ単位に変更

setup/prompt/rules/package-structure.md　の　### 1.1 Package by Feature　に機能グループ単位に分けるように変更して

---

src/
├── features/ # 機能ごとのディレクトリ
│ ├── [fetureGroup]/ # 認証機能
│ 　 　├── [feture]/ # 認証関連のコンポーネント
│ 　　 └── common/ # 機能グループ共有の共通コンポーネント
│
└── common/ # プロジェクト全体の共通コンポーネント

---

## パッケージングに関するルール作りに使用したプロンプト

setup/prompt/rules/package-structure.md にこのプロジェクトにが推奨するパッケージングに関するルールが規定されているファイルを作成してください。

以下の条件が盛り込まれている

原則的に　package by feature　にする
コロケーション重視
その他あなたが必要だと考えた記述

---

## docs/setup/cline/rules 以下を元に.clinerulesを作成するために使ったプロンプト

docs/setup/cline/rules 以下のファイルを cat して繋げるシェルスクリプトを書いてください
条件は以下の通り

出力先はルートで、ファイル名は　.clinerules
シェルのファイル名は mk-clinerules.sh

cat の順番は

personal.md
project.md
coding-standards.md
coding-for-project.md
coding-by-ai.md
git-workflow.md
package-structure.md
tech-stack.md
cline-best-practices.md

---
