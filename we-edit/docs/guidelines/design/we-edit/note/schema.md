# ノートシステムスキーマ設計

## 設計原則

1. イミュータビリティ
   - 履歴管理の重視
   - 論理削除の採用
   - バージョン管理

2. 検索効率
   - 全文検索対応
   - タグベース検索
   - カテゴリツリー

3. 整合性
   - 外部キー制約
   - 一意性制約
   - NULL制約

## テーブル構造

### ノート基本情報

```sql
-- ノートの基本情報
CREATE TABLE notes (
    -- 識別子
    id TEXT PRIMARY KEY,  -- ULID
    
    -- 基本データ
    title TEXT NOT NULL,
    content_format TEXT NOT NULL,
    content TEXT NOT NULL,
    raw_content TEXT,
    
    -- メタデータ
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    version INTEGER NOT NULL DEFAULT 1,
    author TEXT NOT NULL,
    category_id TEXT REFERENCES categories(id),
    
    -- 制約
    CONSTRAINT notes_title_not_empty CHECK (length(title) > 0),
    CONSTRAINT notes_content_not_empty CHECK (length(content) > 0),
    CONSTRAINT notes_format_valid CHECK (
        content_format IN ('plain', 'markdown', 'rich-text')
    ),
    CONSTRAINT notes_version_positive CHECK (version > 0)
);

-- 全文検索用のカラム
ALTER TABLE notes ADD COLUMN textsearch tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', title), 'A') ||
        setweight(to_tsvector('english', content), 'B')
    ) STORED;
```

### タグ管理

```sql
-- タグマスタ
CREATE TABLE tags (
    id TEXT PRIMARY KEY,  -- ULID
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tags_name_not_empty CHECK (length(name) > 0)
);

-- ノートとタグの関連
CREATE TABLE note_tags (
    note_id TEXT NOT NULL REFERENCES notes(id),
    tag_id TEXT NOT NULL REFERENCES tags(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (note_id, tag_id)
);
```

### カテゴリ管理

```sql
-- カテゴリツリー
CREATE TABLE categories (
    id TEXT PRIMARY KEY,  -- ULID
    name TEXT NOT NULL,
    parent_id TEXT REFERENCES categories(id),
    path TEXT[] NOT NULL,  -- 階層パス
    depth INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT categories_name_not_empty CHECK (length(name) > 0),
    CONSTRAINT categories_depth_valid CHECK (depth >= 0)
);
```

### バージョン管理

```sql
-- ノートの変更履歴
CREATE TABLE note_versions (
    id TEXT PRIMARY KEY,  -- ULID
    note_id TEXT NOT NULL REFERENCES notes(id),
    version INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_format TEXT NOT NULL,
    raw_content TEXT,
    category_id TEXT REFERENCES categories(id),
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT note_versions_version_positive CHECK (version > 0),
    UNIQUE (note_id, version)
);

-- 変更詳細
CREATE TABLE note_changes (
    id TEXT PRIMARY KEY,  -- ULID
    note_id TEXT NOT NULL REFERENCES notes(id),
    version INTEGER NOT NULL,
    change_type TEXT NOT NULL,
    before_value JSONB,
    after_value JSONB,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT note_changes_type_valid CHECK (
        change_type IN ('title', 'content', 'tags', 'category')
    )
);
```

## インデックス戦略

### 検索最適化

```sql
-- 全文検索インデックス
CREATE INDEX idx_notes_textsearch ON notes USING GIN (textsearch);

-- タグ検索
CREATE INDEX idx_note_tags_tag ON note_tags (tag_id);
CREATE INDEX idx_tags_name ON tags (name);

-- カテゴリツリー
CREATE INDEX idx_categories_path ON categories USING GIN (path);
CREATE INDEX idx_categories_parent ON categories (parent_id);
```

### 時系列アクセス

```sql
-- タイムスタンプインデックス
CREATE INDEX idx_notes_created ON notes USING BRIN (created_at);
CREATE INDEX idx_notes_updated ON notes USING BRIN (updated_at);
CREATE INDEX idx_notes_archived ON notes USING BRIN (archived_at);
```

## パーティショニング戦略

### アーカイブパーティショニング

```sql
-- アーカイブ状態でのパーティショニング
CREATE TABLE notes_partitioned (
    LIKE notes INCLUDING ALL
) PARTITION BY LIST (
    CASE WHEN archived_at IS NULL THEN 'active'
         ELSE 'archived'
    END
);

-- パーティションの作成
CREATE TABLE notes_active 
    PARTITION OF notes_partitioned 
    FOR VALUES IN ('active');

CREATE TABLE notes_archived 
    PARTITION OF notes_partitioned 
    FOR VALUES IN ('archived');
```

## メンテナンス

### 自動クリーンアップ

```sql
-- 古いバージョンの削除
CREATE FUNCTION cleanup_old_versions()
RETURNS void AS $$
BEGIN
    WITH latest_versions AS (
        SELECT note_id, MAX(version) as max_version
        FROM note_versions
        GROUP BY note_id
    )
    DELETE FROM note_versions nv
    USING latest_versions lv
    WHERE nv.note_id = lv.note_id
    AND nv.version < (lv.max_version - 10);  -- 最新10バージョンを保持
END;
$$ LANGUAGE plpgsql;
```

## 監視クエリ

### 統計情報

```sql
-- ノート統計
CREATE MATERIALIZED VIEW note_statistics AS
SELECT
    COUNT(*) as total_notes,
    COUNT(CASE WHEN archived_at IS NOT NULL THEN 1 END) as archived_notes,
    AVG(version) as avg_versions,
    MAX(version) as max_version,
    MIN(created_at) as oldest_note,
    MAX(created_at) as newest_note
FROM notes
WITH DATA;

-- タグ使用状況
CREATE MATERIALIZED VIEW tag_usage AS
SELECT
    t.name,
    COUNT(nt.note_id) as usage_count
FROM tags t
LEFT JOIN note_tags nt ON t.id = nt.tag_id
GROUP BY t.name
WITH DATA;