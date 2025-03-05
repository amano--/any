# ユースケース一覧

## 新聞システム

新聞の作成・管理に関するユースケース図

```mermaid
graph TB
    subgraph 新聞システム
        UC1["新聞を作成する"]
        UC2["カテゴリを設定する"]
        UC3["タグを設定する"]
        UC4["記事を関連付ける"]
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

- [新聞作成](newspaper/newspaper-create.md) - 新聞の基本情報を設定し作成する

### 未実装ユースケース

- カテゴリ設定 - 新聞にカテゴリを設定する
- タグ設定 - 新聞にタグを設定する
- 記事関連付け - 新聞に記事を関連付ける