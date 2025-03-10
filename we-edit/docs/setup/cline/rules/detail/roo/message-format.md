# Rooからのメッセージフォーマット

## 1. 基本構造

```xml
<user_message>
ユーザーからのメッセージ
</user_message>

<environment_details>
# VSCode Visible Files
[ファイルリスト]

# VSCode Open Tabs
[開いているタブのリスト]

# Current Time
[タイムスタンプ]

# Current Context Size
[コンテキストサイズ]

# Current Mode
[現在のモード]
</environment_details>
```

## 2. 形式の特徴

1. XMLタグ（Rooが付与）
   - メッセージの構造化
   - 種類の識別
   - 範囲の明示

2. 環境情報（生の形式）
   - #で始まるセクション
   - キーと値のペア
   - 階層構造

## 3. 理解すべきポイント

1. データの提供者
   - XMLタグ付け: Roo
   - 環境情報: システム
   - メッセージ: ユーザー

2. 形式の目的
   - 構造化された通信
   - 必要な文脈の提供
   - 一貫性の維持