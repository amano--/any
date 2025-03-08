#!/bin/bash

# エラー時に停止し、未定義の変数を使用した場合にエラーを発生
set -eu

# スクリプトのディレクトリを取得
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(cd "$SCRIPT_DIR/../../../.." && pwd)

# 出力ファイル
OUTPUT_FILE="$PROJECT_ROOT/.clinerules"

# デバッグ情報表示
echo "Script directory: $SCRIPT_DIR"
echo "Project root: $PROJECT_ROOT"
echo "Output file: $OUTPUT_FILE"

# ファイルの存在確認
check_file() {
    if [ ! -f "$1" ]; then
        echo "Error: File not found: $1"
        exit 1
    fi
    echo "Found file: $1"
}

# 入力ファイル一覧
declare -a FILES=(
    "$SCRIPT_DIR/personal.md"
    "$SCRIPT_DIR/project.md"
    "$SCRIPT_DIR/coding-standards.md"
    "$SCRIPT_DIR/coding-for-project.md"
    "$SCRIPT_DIR/coding-for-ai.md"
    "$SCRIPT_DIR/git-workflow.md"
    "$SCRIPT_DIR/package-structure.md"
    "$SCRIPT_DIR/tech-stack.md"
    "$SCRIPT_DIR/cline-best-practices.md"
)

echo "Checking files..."
# 各ファイルの存在を確認
for file in "${FILES[@]}"; do
    check_file "$file"
done

echo "Generating .clinerules..."
# 出力ディレクトリの存在確認
if [ ! -d "$(dirname "$OUTPUT_FILE")" ]; then
    echo "Creating output directory: $(dirname "$OUTPUT_FILE")"
    mkdir -p "$(dirname "$OUTPUT_FILE")"
fi

# ファイルを結合
: > "$OUTPUT_FILE"  # ファイルを初期化

for file in "${FILES[@]}"; do
    echo "Adding: $(basename "$file")"
    {
        cat "$file"
        echo -e "\n"  # ファイル間に空行を追加
    } >> "$OUTPUT_FILE" || {
        echo "Error while processing file: $file"
        exit 1
    }
done

if [ -f "$OUTPUT_FILE" ]; then
    echo "Successfully generated: $OUTPUT_FILE"
    echo "File size: $(wc -l < "$OUTPUT_FILE") lines"
else
    echo "Error: Failed to generate output file"
    exit 1
fi