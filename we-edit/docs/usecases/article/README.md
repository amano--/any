# 記事管理ユースケース図

## 概要

記事の作成、カテゴリ設定、タグ付けに関する一連のユースケースを定義します。

## アクター関係図

```mermaid
graph TD
    Member["[会員]"]
    Editor["[編集者]"]
    Staff["[スタッフ]"]
    System["[システム]"]
    AI["[AI支援]"]

    Editor -->|管理| Member
    Staff -->|カテゴリ管理| Editor
    AI -->|支援| Member
    System -->|サービス提供| Member
```

## ユースケース図

```mermaid
graph TB
    subgraph 記事管理
        Save["記事保存"]
        Category["カテゴリ設定"]
        Tag["タグ付け"]
        Draft["下書き管理"]
        Search["検索・発見"]
    end

    subgraph アクター
        Member["[会員]"]
        Editor["[編集者]"]
        Staff["[スタッフ]"]
        System["[システム]"]
        AI["[AI支援]"]
    end

    Member -->|作成・編集| Save
    Member -->|設定| Category
    Member -->|付与| Tag
    Member -->|保存| Draft
    Member -->|利用| Search

    Editor -->|承認| Save
    Editor -->|管理| Category
    Editor -->|管理| Tag

    Staff -->|定義| Category

    System -->|検証| Save
    System -->|インデックス| Search
    System -->|バックアップ| Draft

    AI -->|提案| Tag
    AI -->|提案| Category
```

## ユースケース一覧

1. [記事保存](./article-save.md)
   - 記事の作成
   - 下書き保存
   - 記事の更新

2. [カテゴリ設定](./article-category.md)
   - カテゴリの選択
   - 新規カテゴリのリクエスト
   - カテゴリの変更

3. [タグ付け](./article-tag.md)
   - タグの追加
   - AI支援によるタグ提案
   - タグの管理

## 主要なフロー

```mermaid
sequenceDiagram
    participant M as 会員
    participant S as システム
    participant AI as AI支援
    
    M->>S: 記事作成開始
    S->>M: エディタ表示
    M->>S: 記事保存
    S->>S: 入力検証
    
    opt カテゴリ設定
        M->>S: カテゴリ選択
        S->>S: カテゴリ検証
    end
    
    opt タグ付け
        M->>S: タグ付け要求
        S->>AI: タグ提案要求
        AI->>S: タグ候補提供
        S->>M: タグ候補表示
        M->>S: タグ選択
    end
    
    S->>S: 検索インデックス更新
    S->>M: 完了通知
```

## 注意事項

1. データの整合性
   - カテゴリとタグの一貫性維持
   - 検索インデックスの即時更新
   - 下書きの定期バックアップ

2. パフォーマンス
   - 大量の記事の効率的な管理
   - 検索の応答性確保
   - AI提案の最適化

3. セキュリティ
   - 適切な権限管理
   - 変更履歴の追跡
   - データの保護