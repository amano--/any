# ロールベースシステム - Draw.io作成手順

## クラス配置構成

### 中心クラス
1. User (320, 40)
   - 属性: id, name, email, roles
   - メソッド: authenticate(), authorize(), hasRole(), addRole(), removeRole()

2. Role インターフェース (320, 240)
   - 属性: type, permissions
   - メソッド: hasPermission(), checkPermission()

### ロール実装クラス (左側配置)
1. SystemAdminRole (120, 400)
   - メソッド: manageSecuritySettings(), manageBackups(), monitorSystem(), approveRefunds()

2. DevelopmentStaffRole (120, 520)
   - メソッド: deployCode(), manageTechnicalDocs(), analyzeTechnicalIssues()

3. StaffManagerRole (120, 640)
   - メソッド: manageStaffAccounts(), assignTasks(), evaluatePerformance()

4. StaffRole (120, 760)
   - メソッド: manageTags(), monitorContent(), handleSupport()

### ロール実装クラス (右側配置)
1. GroupAdminRole (520, 400)
   - メソッド: manageGroupSettings(), appointOperators(), manageSubgroups()

2. GroupOperatorRole (520, 520)
   - メソッド: organizeContent(), supportMembers(), recordActivities()

3. MemberRole (520, 640)
   - メソッド: createBookmark(), createNewspaper(), sendNotification()

### 権限関連クラス
1. Permission (320, 360)
   - 属性: id, name, description, scope
   - メソッド: validate()

2. PermissionScope (Enum) (520, 360)
   - 値: SYSTEM, GROUP, CONTENT, MEMBER

### コンテンツ関連クラス
1. Content (Interface) (720, 40)
   - 属性: id, title, createdAt, category, tags
   - メソッド: share(), delete()

2. Bookmark (720, 200)
   - 属性: url, folder
   - メソッド: import(), export()

3. Article (720, 360)
   - 属性: content, newspaper
   - メソッド: 継承メソッド

4. Newspaper (720, 520)
   - 属性: articles
   - メソッド: publish(), addArticle()

### サポートクラス
1. Tag (920, 40)
   - 属性: id, name, type
   - メソッド: create(), attach()

2. Category (920, 200)
   - 属性: id, name
   - メソッド: create(), attach()

3. Group (920, 360)
   - 属性: id, name, parent, children, maxChildren
   - メソッド: addMember(), createChildGroup(), manageContent()

## 関連性

### 継承関係 (実線三角形矢印)
- Role <- SystemAdminRole, DevelopmentStaffRole, StaffManagerRole, StaffRole
- Role <- GroupAdminRole, GroupOperatorRole, MemberRole
- Content <- Bookmark, Article, Newspaper
- Tag <- Category

### 関連関係 (実線矢印)
1. User関連
   - User "1" --> "*" Role
   - User "1" --> "*" Group
   - User "1" --> "*" Content

2. Role関連
   - Role "*" --> "*" Permission

3. Content関連
   - Content "1" --> "1" Category
   - Content "*" --> "*" Tag

### 列挙型 (Enum)
1. RoleType
   - SYSTEM_ADMIN
   - DEVELOPMENT_STAFF
   - STAFF_MANAGER
   - STAFF
   - GROUP_ADMIN
   - GROUP_OPERATOR
   - MEMBER

2. TagType
   - MEMBER
   - OFFICIAL

## スタイルガイド

1. クラス表示
   - クラス名: 太字
   - 属性: 標準
   - メソッド: 標準
   - インターフェース: <<interface>>表記

2. 色使い
   - 基本クラス: 白背景
   - インターフェース: 薄い青背景
   - 列挙型: 薄い緑背景
   - ロール実装: 薄い黄背景

3. 線種
   - 継承: 実線、三角形矢印
   - 関連: 実線、通常矢印
   - 実装: 点線、三角形矢印

## 注意点
1. クラス間の適切な間隔を保つ（最低50ピクセル）
2. 関連線の交差を最小限に抑える
3. 各クラスの属性とメソッドは重要なもののみ表示
4. 可読性を確保するため、関連線は可能な限り直角に配置