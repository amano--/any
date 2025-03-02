# 実行プロトコル（AI専用）

**注意**: このファイルはAI実行用に最適化されており、人間が読むことを意図していません。

## 1. コンポーネント実装プロトコル

```typescript
@protocol[component_implementation]
{
  imports: [
    "react",
    "i18n",
    "hooks",
    "types"
  ],

  files: {
    component: "PascalCase.tsx",
    types: "types.ts",
    hooks: "useHookName.ts"
  },

  structure: {
    imports: "top",
    types: "after_imports",
    component: "default_export",
    i18n: "useText_hook"
  },

  patterns: {
    preferred: [
      "type",
      "arrow_function",
      "hooks",
      "memo"
    ],
    avoided: [
      "class",
      "enum",
      "interface",
      "default_export"
    ]
  }
}
```

## 2. 型安全性プロトコル

```typescript
@protocol[type_safety]
{
  validation: {
    props: "zod_schema",
    i18n: "keyof_typeof",
    state: "generic_type"
  },

  naming: {
    props: "ComponentNameProps",
    hooks: "useHookName",
    handlers: "handleEventName"
  },

  checks: {
    strict: true,
    noImplicitAny: true,
    noUncheckedIndexedAccess: true
  }
}
```

## 3. メモリ最適化プロトコル

```typescript
@protocol[memory_optimization]
{
  memoization: {
    components: "expensive_render",
    callbacks: "event_handlers",
    values: "heavy_computation"
  },

  code_splitting: {
    routes: "lazy_loading",
    features: "dynamic_import",
    translations: "by_language"
  }
}
```

## 4. エラー処理プロトコル

```typescript
@protocol[error_handling]
{
  types: {
    validation: "compile_time",
    runtime: "try_catch",
    i18n: "key_missing"
  },

  recovery: {
    props: "default_values",
    i18n: "fallback_text",
    state: "initial_state"
  }
}
```

## 5. i18n実装プロトコル

```typescript
@protocol[i18n_implementation]
{
  structure: {
    max_depth: 3,
    naming: "camelCase",
    scope: "feature_based"
  },

  validation: {
    keys: "type_safe",
    values: "string_only",
    params: "typed_functions"
  },

  loading: {
    timing: "component_mount",
    strategy: "lazy_load",
    fallback: "key_name"
  }
}
```

## 6. パフォーマンス最適化プロトコル

```typescript
@protocol[performance_optimization]
{
  rendering: {
    conditions: "early_return",
    lists: "virtualization",
    updates: "memo"
  },

  data: {
    caching: "react_query",
    storage: "local_storage",
    prefetch: "critical_data"
  }
}
```

## 7. コードレビュープロトコル

```typescript
@protocol[code_review]
{
  checks: [
    "type_safety",
    "i18n_coverage",
    "performance_impact",
    "error_handling"
  ],

  patterns: [
    "consistent_naming",
    "single_responsibility",
    "minimal_props"
  ]
}