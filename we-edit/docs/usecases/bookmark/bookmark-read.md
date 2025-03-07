# ブックマーク参照

## ユースケース概要

ユーザーが保存されているブックマークの詳細情報を参照する機能を提供します。

## アクター

- [会員] - ブックマーク情報を参照する一般ユーザー
- [システム] - ブックマーク情報を提供するシステム

## 事前条件

- 会員としてログインしていること
- 参照対象のブックマークが存在すること
- ブックマークへのアクセス権限があること（公開設定または共有設定で許可されている）

## 想定シナリオ

[チーム内での技術情報共有]

佐藤さん（28歳、フロントエンドエンジニア）は、同僚が共有しているReactのパフォーマンスチューニングに関するブックマークを見つけました。

記事の内容が自身のプロジェクトに役立ちそうだと感じた佐藤さんは、ブックマークの詳細情報を確認し、付与されているタグやカテゴリから関連する他の記事も探してみることにしました。

ブックマークの詳細画面では、URLやタイトルだけでなく、同僚が付けた説明文やタグ、カテゴリ分類も確認できました。また、同じタグが付いている他のブックマークへのリンクも表示されていたため、関連する技術記事を素早く見つけることができました。

結果として、30分で必要な技術情報を網羅的に収集でき、実装時間を2日短縮することができました。

## 基本フロー

1. [会員]はブックマーク一覧からブックマークを選択
2. [システム]はブックマークの詳細情報を取得
3. [システム]は以下の情報を表示：
   - URL
   - タイトル
   - 説明
   - カテゴリ
   - タグ
   - フォルダ位置
   - 作成者
   - 作成日時
   - 更新日時
   - 共有設定
4. [会員]は関連ブックマークを確認可能
5. [会員]はURLを開くことが可能

## 代替フロー

### アクセス権限が制限されている場合

3a. [システム]は制限された情報のみを表示
3b. [会員]は共有リクエストを送信可能

### URLが無効になっている場合

5a. [システム]は無効なURLである警告を表示
5b. [会員]はブックマーク作成者に通知可能

## 例外フロー

### ブックマークが削除されている場合

2a. [システム]は削除された旨を表示
2b. [会員]はブックマーク一覧に戻る

## 事後条件

- ブックマークの詳細情報が表示されている
- 閲覧履歴が更新されている
- 関連ブックマークが表示されている

## 関連オブジェクト

- ブックマーク
  - URL
  - タイトル
  - 説明
  - カテゴリ
  - タグ
  - フォルダ
  - 共有設定
  - 作成日時
  - 更新日時
  - アクセス履歴

## 補足情報

```mermaid
graph TB
    subgraph ブックマーク参照
        A["ブックマーク選択"] --> B["権限確認"]
        B --> C["情報取得"]
        C --> D["詳細表示"]
        D --> E["関連ブックマーク表示"]
        E --> F["URL開く"]
    end

    Member["[会員]"] -->|選択| A
    System["[システム]"] -->|検証| B
    System -->|表示| D