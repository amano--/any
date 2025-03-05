# ユースケース一覧

## 新聞システム

新聞の作成・管理に関するユースケース図

```mermaid
graph TB
    subgraph 新聞システム
        UC1["np-c-001\n新聞を作成する"]
        UC2["np-u-001\nカテゴリを設定する"]
        UC3["np-u-002\nタグを設定する"]
        UC4["np-r-001\n記事を関連付ける"]
    end

    Member["[会員]"]
    Staff["[スタッフ]"]
    System["[システム]"]

    Member -->|実行| UC1
    Member -->|実行| UC2
    Member -->|実行| UC3
    Member -->|実行| UC4

    Staff -->|管理| UC2
    Staff -->|管理| UC3

    UC1 -->|検証| System
    UC2 -->|検証| System
    UC3 -->|検証| System
    UC4 -->|検証| System
```

### 実装済みユースケース

- [np-c-001 新聞作成](newspaper/newspaper-create.md) - 新聞の基本情報を設定し作成する

### 未実装ユースケース

- np-u-001 カテゴリ設定 - 新聞にカテゴリを設定する
- np-u-002 タグ設定 - 新聞にタグを設定する
- np-r-001 記事関連付け - 新聞に記事を関連付ける

## ブックマークシステム

ブックマークの作成・管理に関するユースケース図

```mermaid
graph TB
    subgraph ブックマークシステム
        UC1["b-c-001\nブックマークを作成する"]
        UC2["b-c-002\nフォルダを管理する"]
        UC3["b-i-001\nChromeブックマークを\nインポート/エクスポート"]
        UC4["b-u-001\nカテゴリを設定する"]
        UC5["b-u-002\nタグを設定する"]
    end

    Member["[会員]"]
    Group["[グループ]"]
    Staff["[スタッフ]"]
    System["[システム]"]
    Chrome["[Chrome]"]

    Member -->|実行| UC1
    Member -->|管理| UC2
    Member -->|実行| UC3
    Member -->|設定| UC4
    Member -->|設定| UC5

    Group -->|実行| UC1
    Group -->|管理| UC2

    Staff -->|管理| UC4
    Staff -->|管理| UC5

    UC1 -->|検証| System
    UC2 -->|検証| System
    UC3 -->|変換| System
    UC4 -->|検証| System
    UC5 -->|検証| System

    Chrome -->|データ提供| UC3
```

### 実装済みユースケース

- [b-c-001 ブックマーク作成](bookmark/bookmark-create.md) - ブックマークの基本情報を設定し作成する

### 未実装ユースケース

- b-c-002 フォルダ管理 - ブックマークを整理するフォルダを作成・編集する
- b-i-001 Chromeブックマーク連携 - Chromeのブックマークをインポート/エクスポートする
- b-u-001 カテゴリ設定 - ブックマークにカテゴリを設定する
- b-u-002 タグ設定 - ブックマークにタグを設定する