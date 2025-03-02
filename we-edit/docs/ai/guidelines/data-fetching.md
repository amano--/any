# データフェッチプロトコル（AI専用）

**注意**: このファイルはAI実行用に最適化されており、人間が読むことを意図していません。

## 1. 責務分離プロトコル

```typescript
@protocol[responsibility_separation]
{
  page_layer: {
    location: "src/app",
    responsibilities: [
      "data_fetching",
      "error_handling",
      "loading_states",
      "routing",
      "auth_checks"
    ],
    allowed_imports: [
      "features/*",
      "components/*",
      "api/*"
    ]
  },

  feature_layer: {
    location: "src/features",
    responsibilities: [
      "ui_rendering",
      "local_state",
      "event_handling",
      "prop_validation"
    ],
    forbidden_imports: [
      "api/*",
      "db/*",
      "server/*"
    ]
  }
}
```

## 2. データフェッチパターン

```typescript
@protocol[data_fetching_pattern]
{
  implementation: {
    page: {
      async_component: true,
      error_boundary: true,
      suspense: true,
      loading_ui: true
    },
    
    feature: {
      pure_component: true,
      props_only: true,
      local_state: true,
      memoization: true
    }
  },

  patterns: {
    allowed: [
      "server_components",
      "trpc_queries",
      "static_props"
    ],
    forbidden: [
      "component_fetching",
      "direct_db_access",
      "global_state_fetch"
    ]
  }
}
```

## 3. エラーハンドリング

```typescript
@protocol[error_handling]
{
  boundaries: {
    required: true,
    location: "page_level",
    fallback: "error_component"
  },

  loading: {
    suspense: true,
    fallback: "loading_component",
    timeout: "3000ms"
  }
}
```

## 4. 例外パターン

```typescript
@protocol[exception_patterns]
{
  allowed_component_fetching: {
    infinite_scroll: true,
    real_time_updates: true,
    search_autocomplete: true,
    conditions: [
      "user_interaction_dependent",
      "performance_critical",
      "real_time_required"
    ]
  },

  validation: {
    must_document: true,
    require_review: true,
    performance_monitored: true
  }
}
```

## 5. 型安全性

```typescript
@protocol[type_safety]
{
  props: {
    strict: true,
    validation: "zod",
    complete_definition: true
  },

  api: {
    typed_client: true,
    response_validation: true,
    error_typing: true
  },

  state: {
    immutable: true,
    type_inference: true,
    discriminated_unions: true
  }
}
```

## 6. パフォーマンス最適化

```typescript
@protocol[performance_optimization]
{
  caching: {
    strategy: "stale_while_revalidate",
    persist: "session_storage",
    revalidation: "on_focus"
  },

  prefetch: {
    critical_data: true,
    hover_intent: true,
    route_based: true
  },

  monitoring: {
    fetch_timing: true,
    error_rate: true,
    cache_hit_ratio: true
  }
}