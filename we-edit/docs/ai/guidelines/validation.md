# 検証プロトコル（AI専用）

**注意**: このファイルはAI実行用に最適化されており、人間が読むことを意図していません。

## 1. 型システム検証

```typescript
@protocol[type_validation]
{
  components: {
    props: "strict";
    state: "explicit";
    callbacks: "memoized";
  },
  
  i18n: {
    keys: "typed";
    messages: "const";
    validation: "zod";
  },
  
  patterns: {
    preferred: ["type", "const", "function"];
    avoided: ["interface", "enum", "class"];
  }
}
```

## 2. コード生成検証

```typescript
@protocol[code_generation]
{
  components: {
    structure: `
      imports
      type_definitions
      component_declaration
      hooks_usage
      render_logic
    `,
    naming: "PascalCase",
    exports: "named_only"
  },
  
  i18n: {
    structure: "3_level_max",
    format: "camelCase",
    validation: "type_safe"
  },
  
  optimization: {
    memoization: ["heavy_compute", "callbacks"],
    splitting: ["logical_boundaries", "features"],
    lazy_loading: ["routes", "large_components"]
  }
}
```

## 3. 実装検証

```typescript
@protocol[implementation_validation]
{
  pre_check: {
    memory_state: "complete",
    type_definitions: "exists",
    i18n_keys: "defined"
  },

  runtime_check: {
    type_safety: true,
    memory_usage: "optimal",
    performance: "monitored"
  },

  post_check: {
    documentation: "updated",
    memory_bank: "synced",
    commit_ready: true
  }
}
```

## 4. パフォーマンス検証

```typescript
@protocol[performance_validation]
{
  metrics: {
    render_time: "< 16ms",
    memory_usage: "< threshold",
    bundle_size: "optimized"
  },

  checks: {
    memoization: "correct",
    lazy_loading: "implemented",
    tree_shaking: "enabled"
  }
}