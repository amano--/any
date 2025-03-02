# ガイドライン生成メタデータ（AI専用）

**注意**: このファイルはAI実行用に最適化されており、人間が読むことを意図していません。

## 1. 生成プロセス

```typescript
@protocol[generation_process]
{
  timestamp: "2025-03-03T08:26:27+09:00",
  version: "2025.03.03.1",
  source_files: [
    {
      path: "docs/guidelines/react-components.md",
      priority: 1,
      extracted: [
        "component_patterns",
        "type_safety",
        "performance"
      ]
    },
    {
      path: "docs/guidelines/i18n-guidelines.md",
      priority: 2,
      extracted: [
        "translation_patterns",
        "key_management",
        "validation"
      ]
    },
    {
      path: "docs/guidelines/data-fetching.md",
      priority: 3,
      extracted: [
        "responsibility_separation",
        "error_handling",
        "performance"
      ]
    },
    {
      path: "docs/guidelines/ai-development.md",
      priority: 4,
      extracted: [
        "documentation_patterns",
        "version_control",
        "knowledge_management"
      ]
    }
  ]
}
```

## 2. 変換プロセス

```typescript
@protocol[transformation_process]
{
  steps: [
    {
      phase: "analysis",
      actions: [
        "read_guidelines",
        "extract_patterns",
        "identify_dependencies"
      ]
    },
    {
      phase: "structuring",
      actions: [
        "create_protocols",
        "define_validations",
        "establish_hierarchies"
      ]
    },
    {
      phase: "optimization",
      actions: [
        "remove_redundancy",
        "standardize_formats",
        "add_cross_references"
      ]
    }
  ]
}
```

## 3. 出力ファイル構造

```typescript
@protocol[output_structure]
{
  files: {
    "execution.md": {
      purpose: "implementation_rules",
      dependencies: ["react-components.md", "i18n-guidelines.md"],
      protocols: ["component", "i18n", "memory"]
    },
    "validation.md": {
      purpose: "validation_rules",
      dependencies: ["react-components.md", "data-fetching.md"],
      protocols: ["type", "structure", "performance"]
    },
    "errors.md": {
      purpose: "error_handling",
      dependencies: ["data-fetching.md"],
      protocols: ["detection", "recovery", "logging"]
    },
    "data-fetching.md": {
      purpose: "data_management",
      dependencies: ["data-fetching.md"],
      protocols: ["separation", "patterns", "optimization"]
    },
    "documentation.md": {
      purpose: "documentation_rules",
      dependencies: ["ai-development.md"],
      protocols: ["planning", "comments", "versioning"]
    }
  }
}
```

## 4. 最適化メトリクス

```typescript
@protocol[optimization_metrics]
{
  code_patterns: {
    duplication: "minimized",
    consistency: "maximized",
    clarity: "high"
  },
  
  validation_rules: {
    coverage: "complete",
    specificity: "high",
    automation: "maximized"
  },
  
  documentation: {
    structure: "hierarchical",
    format: "machine_readable",
    references: "explicit"
  }
}
```

## 5. バージョン履歴

```typescript
@protocol[version_history]
{
  versions: [
    {
      version: "2025.03.03.1",
      changes: [
        "initial_creation",
        "added_documentation_protocol",
        "integrated_ai_development_guidelines"
      ],
      source_commit: "feat: AIガイドラインシステムの確立",
      validation_status: "passed"
    }
  ],
  
  next_update: {
    scheduled: "on_guideline_change",
    triggers: [
      "new_guideline_addition",
      "existing_guideline_update",
      "protocol_enhancement"
    ]
  }
}
```

## 6. 相互参照マップ

```typescript
@protocol[cross_reference_map]
{
  component_patterns: {
    primary: "execution.md",
    references: [
      "validation.md#type_system",
      "documentation.md#structure"
    ]
  },
  
  error_handling: {
    primary: "errors.md",
    references: [
      "execution.md#recovery",
      "data-fetching.md#failures"
    ]
  },
  
  documentation: {
    primary: "documentation.md",
    references: [
      "execution.md#comments",
      "validation.md#rules"
    ]
  }
}