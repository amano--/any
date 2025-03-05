# システム概要クラス図（ラフ版）

## 作成背景

このクラス図は以下の資料を元に作成されました：

- docs/usecases/overview.md（2025年3月6日時点）
  - 境界付けられたコンテキスト一覧
  - アクターの説明
  - アクター別ユースケース概要
  - コアシステム仕様

このクラス図は初期の設計フェーズにおける概要を示すものであり、詳細な実装仕様ではありません。実装時には各コンテキストごとに詳細な設計が必要です。

## クラス図

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +UserRole role
        +authenticate()
        +authorize()
    }

    class Member {
        +createBookmark()
        +createNewspaper()
        +sendNotification()
        +managePoints()
    }

    class SystemAdmin {
        +manageSecuritySettings()
        +manageBackups()
        +monitorSystem()
        +approveRefunds()
    }

    class DevelopmentStaff {
        +deployCode()
        +manageTechnicalDocs()
        +analyzeTechnicalIssues()
    }

    class StaffManager {
        +manageStaffAccounts()
        +assignTasks()
        +evaluatePerformance()
    }

    class Staff {
        +manageTags()
        +monitorContent()
        +handleSupport()
    }

    class GroupAdmin {
        +manageGroupSettings()
        +appointOperators()
        +manageSubgroups()
    }

    class GroupOperator {
        +organizeContent()
        +supportMembers()
        +recordActivities()
    }

    class Group {
        +String id
        +String name
        +Group parent
        +List~Group~ children
        +int maxChildren
        +addMember()
        +createChildGroup()
        +manageContent()
    }

    class Bookmark {
        +String id
        +String url
        +String title
        +DateTime createdAt
        +Category category
        +List~Tag~ tags
        +Folder folder
        +save()
        +share()
    }

    class Article {
        +String id
        +String content
        +String title
        +DateTime createdAt
        +Category category
        +List~Tag~ tags
        +save()
        +share()
    }

    class Newspaper {
        +String id
        +String title
        +DateTime createdAt
        +Category category
        +List~Tag~ tags
        +List~Article~ articles
        +publish()
        +addArticle()
    }

    class Tag {
        +String id
        +String name
        +TagType type
        +create()
        +attach()
    }

    class Category {
        +String id
        +String name
        +create()
        +attach()
    }

    class Notification {
        +String id
        +String content
        +DateTime sentAt
        +NotificationType type
        +List~NotificationStatus~ status
        +send()
        +forward()
        +trackStatus()
    }

    class NotificationStatus {
        +String recipientId
        +DateTime readAt
        +StatusType status
    }

    class Point {
        +String id
        +PointType type
        +int amount
        +DateTime expiredAt
        +transfer()
        +use()
        +check()
    }

    class Payment {
        +String id
        +String stripePaymentId
        +PaymentStatus status
        +Money amount
        +DateTime processedAt
        +process()
        +refund()
    }

    class GraphRelation {
        +String id
        +String sourceId
        +String targetId
        +RelationType type
        +Map~String, String~ properties
        +DateTime createdAt
        +create()
        +validate()
        +query()
    }

    class Folder {
        +String id
        +String name
        +Folder parent
        +List~Folder~ children
        +organize()
    }

    User <|-- Member
    User <|-- SystemAdmin
    User <|-- DevelopmentStaff
    User <|-- StaffManager
    User <|-- Staff
    User <|-- GroupAdmin
    User <|-- GroupOperator

    Member "1" --> "*" Group : belongs to
    Group "1" --> "*" Group : has child groups
    Member "1" --> "*" Bookmark : owns
    Member "1" --> "*" Article : creates
    Member "1" --> "*" Newspaper : publishes
    Member "1" --> "*" Notification : sends/receives
    Member "1" --> "*" Point : has
    Member "1" --> "*" Payment : makes

    Bookmark "1" --> "1" Category : categorized by
    Bookmark "*" --> "*" Tag : tagged with
    Bookmark "*" --> "1" Folder : organized in

    Article "1" --> "1" Category : categorized by
    Article "*" --> "*" Tag : tagged with
    Article "*" --> "1" Newspaper : belongs to

    Newspaper "1" --> "1" Category : categorized by
    Newspaper "*" --> "*" Tag : tagged with

    Group "1" --> "*" Content : manages

    Notification "1" --> "*" NotificationStatus : tracks

    class Content {
        <<interface>>
        +share()
        +delete()
    }

    Bookmark ..|> Content
    Article ..|> Content
    Newspaper ..|> Content

    Tag <|-- Category

    class UserRole {
        <<enumeration>>
        SYSTEM_ADMIN
        DEVELOPMENT_STAFF
        STAFF_MANAGER
        STAFF
        GROUP_ADMIN
        GROUP_OPERATOR
        MEMBER
    }

    class TagType {
        <<enumeration>>
        MEMBER
        OFFICIAL
    }

    class PointType {
        <<enumeration>>
        FREE_LOGIN
        FREE_MISSION
        FREE_ACTION
        PAID_MEMBER
        PAID_FRIEND
        PAID_SYSTEM
    }

    class RelationType {
        <<enumeration>>
        MEMBER_GROUP
        NEWSPAPER_ARTICLE
        NEWSPAPER_MEMBER
        TAG_CATEGORY
    }

    class NotificationType {
        <<enumeration>>
        SYSTEM
        USER
        GROUP
    }

    class StatusType {
        <<enumeration>>
        SENT
        DELIVERED
        READ
        FORWARDED
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }
```

## システムの主要コンポーネント

1. ユーザー権限システム
   - 7つの役割（システム管理者からメンバーまで）
   - 階層的な権限管理
   - 操作の分離と制御

2. グループ管理システム
   - 最大100の子グループをサポート
   - グループ管理者とグループ運営者の分離
   - コンテンツとメンバーの管理

3. コンテンツ管理システム
   - 共通インターフェースによる統一的な管理
   - カテゴリとタグによる柔軟な分類
   - フォルダ構造によるブックマークの整理

4. 通知システム
   - 複数の通知タイプをサポート
   - 転送と状態追跡機能
   - 詳細な配信状態管理

5. ポイントと決済システム
   - 無償/有償ポイントの区分け
   - Stripe決済の統合
   - 返金処理のサポート

6. 関係管理システム
   - グラフDBベースの設計
   - 柔軟な関係性の表現
   - 高度なクエリ機能

## 注意事項

- このクラス図は概要レベルの設計を示すものです
- 実装時には各クラスの詳細な属性やメソッドの追加が必要です
- 具体的なデータベーススキーマは別途設計が必要です
- セキュリティやパフォーマンスの詳細は実装フェーズで検討します

## 次のステップ

1. 各境界付けられたコンテキストの詳細設計
2. データベーススキーマの設計
3. APIインターフェースの設計
4. セキュリティ設計の詳細化

## 作成・更新履歴

- 2025-03-06: 初版作成（概要仕様に基づく基本設計）