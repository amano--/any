#!/bin/bash

# 出力ファイルのパスを設定
OUTPUT_FILE="docs/ai/guidelines/standards-guidelines-all.md"
STANDARDS_DIR="docs/guidelines/implementation/standards"

# 出力ディレクトリの存在確認と作成
mkdir -p "$(dirname "$OUTPUT_FILE")"

# 既存ファイルがあれば削除
[ -f "$OUTPUT_FILE" ] && rm "$OUTPUT_FILE"

# ヘッダー情報の作成
cat << 'EOF' > "$OUTPUT_FILE"
# AI Implementation Standards Guidelines (AI読み込み専用)

⚠️ **注意: このファイルはAI実装用の統合ガイドラインです** ⚠️

このドキュメントは自動生成された実装標準ガイドラインの統合ファイルです。
人間による直接参照は意図されていません。代わりに個別のガイドラインを参照してください。

## ソースファイル一覧

EOF

# ソースファイル一覧の作成
find "$STANDARDS_DIR" -type f -name "*.md" | while read -r file; do
    rel_path=$(python3 -c "import os.path; print(os.path.relpath('$file', '$(dirname "$OUTPUT_FILE")'))")
    echo "- [$(basename "$file")]($rel_path)" >> "$OUTPUT_FILE"
done

# セパレータの追加
echo -e "\n---\n" >> "$OUTPUT_FILE"

# 各ガイドラインファイルの結合
find "$STANDARDS_DIR" -type f -name "*.md" | sort | while read -r file; do
    echo -e "\n# $(basename "$file" .md)\n" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo -e "\n---\n" >> "$OUTPUT_FILE"
done

# 生成完了メッセージ
echo "ガイドライン統合ファイルが生成されました: $OUTPUT_FILE"