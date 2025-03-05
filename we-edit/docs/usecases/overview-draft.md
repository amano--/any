# システムクラス図

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

## 図の説明

1. ユーザー権限システム
   - Userを基底クラスとし、各役割を継承で表現
   - UserRoleで権限レベルを管理
   - 各役割に応じた操作を定義

2. グループ管理システム
   - 階層構造（最大100子グループ）
   - グループ管理者とグループ運営者の権限分離
   - コンテンツとメンバーの管理機能

3. コンテンツ管理システム
   - Content interfaceによる共通機能の定義
   - カテゴリとタグによる分類
   - フォルダによる階層管理（ブックマーク）

4. 通知システム
   - 通知の種類と状態管理
   - 転送機能と状況追跡
   - NotificationStatusによる詳細な状態管理

5. ポイントと決済システム
   - 無償/有償ポイントの種類を詳細化
   - Stripe連携のための決済クラス
   - 決済状態の管理

6. 関係管理システム
   - GraphRelationによるグラフDB対応
   - 柔軟なプロパティ管理
   - 関係性のクエリ機能

7. セキュリティと監査
   - ユーザー認証と承認の分離
   - 操作履歴の追跡
   - システム全体のモニタリング