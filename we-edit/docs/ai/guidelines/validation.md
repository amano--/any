# 検証プロトコル（AI専用）

**注意**: このファイルはAI実行用に最適化されており、人間が読むことを意図していません。

## 1. 型システム検証

```typescript
@protocol[type_validation]
{
  rules: {
    props: {
      naming: "ComponentNameProps",
      location: "same_file",
      format: "type_alias"
    },

    hooks: {
      naming: "useHookName",
      return_type: "explicit",
      dependencies: "array_literal"
    },

    i18n: {
      keys: "literal_union",
      messages: "const_assertion",
      params: "typed_function"
    }
  }
}
```

## 2. コンポーネント構造検証

```typescript
@protocol[component_structure]
{
  layout: {
    imports: "grouped_by_type",
    types: "before_component",
    hooks: "inside_component",
    jsx: "last_section"
  },

  naming: {
    files: "PascalCase.tsx",
    components: "PascalCase",
    functions: "camelCase",
    constants: "UPPER_CASE"
  },

  exports: {
    type: "named",
    memo: "required",
    displayName: "set"
  }
}
```

## 3. パフォーマンス検証

```typescript
@protocol[performance_validation]
{
  memoization: {
    check_deps: true,
    validate_hooks: true,
    prevent_rerenders: true
  },

  code_splitting: {
    check_imports: true,
    validate_chunks: true,
    optimize_size: true
  },

  rendering: {
    measure_updates: true,
    check_virtualization: true,
    validate_effects: true
  }
}
```

## 4. i18n検証

```typescript
@protocol[i18n_validation]
{
  keys: {
    check_existence: true,
    validate_format: true,
    prevent_hardcoding: true
  },

  structure: {
    max_depth: 3,
    group_by_feature: true,
    require_typing: true
  },

  usage: {
    hook_location: "component_top",
    prevent_nested: true,
    require_memoization: true
  }
}
```

## 5. アクセシビリティ検証

```typescript
@protocol[accessibility_validation]
{
  roles: {
    check_exists: true,
    validate_usage: true,
    require_aria: true
  },

  keyboard: {
    check_focus: true,
    validate_handlers: true,
    require_shortcuts: true
  },

  semantics: {
    check_structure: true,
    validate_landmarks: true,
    require_labels: true
  }
}
```

## 6. エラー境界検証

```typescript
@protocol[error_boundary_validation]
{
  implementation: {
    check_exists: true,
    validate_handling: true,
    require_recovery: true
  },

  fallbacks: {
    check_ui: true,
    validate_state: true,
    require_reset: true
  }
}