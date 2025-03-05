# イベントストアスキーマ設計

## 設計原則

1. イミュータビリティ
   - レコードの更新なし
   - 新規追加のみ
   - 論理削除の使用

2. パフォーマンス
   - 効率的なイベント取得
   - スナップショット管理
   - 適切なインデックス

3. 整合性
   - バージョン管理
   - 一意制約
   - 外部キー制約

## テーブル構造

### イベントストア

```sql
-- イベントの永続化
CREATE TABLE events (
    -- イベント識別子
    id TEXT PRIMARY KEY,  -- ULID
    
    -- イベント分類
    bounded_context CHAR(1) NOT NULL,
    group_context CHAR(1) NOT NULL,
    feature_context CHAR(1) NOT NULL,
    action_type VARCHAR(10) NOT NULL,
    
    -- イベントメタデータ
    aggregate_id TEXT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- イベントデータ
    payload JSONB NOT NULL,
    metadata JSONB,
    
    -- 整合性制約
    CONSTRAINT events_version_check CHECK (version >= 0),
    CONSTRAINT events_bounded_context_check CHECK (
        bounded_context IN ('b','n','nt','p','t','c','r','s','e')
    ),
    CONSTRAINT events_group_context_check CHECK (
        group_context IN ('m','c','s')
    ),
    CONSTRAINT events_feature_context_check CHECK (
        feature_context IN ('c','u','d','r')
    ),
    CONSTRAINT events_aggregate_version_unique 
        UNIQUE (aggregate_id, version)
);
```

### スナップショット

```sql
-- 状態のスナップショット
CREATE TABLE snapshots (
    -- スナップショット識別子
    aggregate_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    
    -- スナップショットデータ
    state JSONB NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- 整合性制約
    PRIMARY KEY (aggregate_id, version),
    CONSTRAINT snapshots_version_check CHECK (version >= 0)
);
```

## インデックス戦略

### イベントストアインデックス

```sql
-- 集約IDとバージョンによる検索
CREATE INDEX idx_events_aggregate ON events (aggregate_id, version);

-- タイムスタンプベースの検索
CREATE INDEX idx_events_timestamp ON events 
USING BRIN (timestamp);

-- コンテキストベースの検索
CREATE INDEX idx_events_context ON events (
    bounded_context,
    group_context,
    feature_context
);

-- イベントタイプベースの検索
CREATE INDEX idx_events_type ON events (event_type);
```

### スナップショットインデックス

```sql
-- 最新バージョン取得の効率化
CREATE INDEX idx_snapshots_latest ON snapshots (
    aggregate_id,
    version DESC
);

-- タイムスタンプベースの検索
CREATE INDEX idx_snapshots_timestamp ON snapshots 
USING BRIN (timestamp);
```

## パーティショニング

### 時系列パーティショニング

```sql
-- 月次パーティションの作成
CREATE TABLE events_partitioned (
    LIKE events INCLUDING ALL
) PARTITION BY RANGE (timestamp);

-- パーティションの作成
CREATE TABLE events_y2025m01 PARTITION OF events_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE events_y2025m02 PARTITION OF events_partitioned
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### コンテキストパーティショニング

```sql
-- コンテキストごとのパーティション
CREATE TABLE events_by_context (
    LIKE events INCLUDING ALL
) PARTITION BY LIST (bounded_context);

-- パーティションの作成
CREATE TABLE events_bookmark PARTITION OF events_by_context
    FOR VALUES IN ('b');

CREATE TABLE events_note PARTITION OF events_by_context
    FOR VALUES IN ('n');
```

## メンテナンス戦略

### 自動クリーンアップ

```sql
-- 古いスナップショットの削除
CREATE FUNCTION cleanup_old_snapshots()
RETURNS void AS $$
BEGIN
    WITH latest_versions AS (
        SELECT aggregate_id, MAX(version) as max_version
        FROM snapshots
        GROUP BY aggregate_id
    )
    DELETE FROM snapshots s
    USING latest_versions lv
    WHERE s.aggregate_id = lv.aggregate_id
    AND s.version < lv.max_version - 5;  -- 最新5バージョンを保持
END;
$$ LANGUAGE plpgsql;
```

### 統計情報の収集

```sql
-- イベント統計の収集
CREATE MATERIALIZED VIEW event_statistics AS
SELECT
    bounded_context,
    group_context,
    event_type,
    COUNT(*) as event_count,
    MIN(timestamp) as first_event,
    MAX(timestamp) as last_event
FROM events
GROUP BY
    bounded_context,
    group_context,
    event_type
WITH DATA;

-- 定期的な更新
CREATE FUNCTION refresh_event_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY event_statistics;
END;
$$ LANGUAGE plpgsql;
```

## 監視クエリ

### パフォーマンスモニタリング

```sql
-- テーブルサイズの監視
CREATE VIEW table_sizes AS
SELECT
    schemaname,
    relname,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) 
        as index_size
FROM pg_catalog.pg_statio_user_tables
WHERE schemaname = 'public'
AND relname LIKE 'events%';

-- インデックス使用状況
CREATE VIEW index_usage AS
SELECT
    schemaname,
    relname,
    indexrelname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
AND relname LIKE 'events%';