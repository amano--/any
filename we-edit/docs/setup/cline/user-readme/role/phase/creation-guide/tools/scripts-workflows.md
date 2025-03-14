# スクリプトとワークフロー集

## 1. CI/CDワークフロー

### 1.1 文書検証ワークフロー
```yaml
# .github/workflows/document-validation.yml
name: Document Validation

on:
  push:
    paths:
      - 'docs/**'
  pull_request:
    paths:
      - 'docs/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run structure validation
        run: |
          npm run validate:structure
          npm run validate:links
          npm run validate:format
      
      - name: Run quality checks
        run: |
          npm run check:completeness
          npm run check:consistency
          npm run check:style
      
      - name: Generate validation report
        run: npm run generate:validation-report
      
      - name: Upload report artifact
        uses: actions/upload-artifact@v2
        with:
          name: validation-report
          path: reports/validation
```

### 1.2 自動生成ワークフロー
```yaml
# .github/workflows/document-generation.yml
name: Document Generation

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup environment
        run: |
          npm install
          npm run setup:tools
      
      - name: Generate documents
        run: |
          npm run generate:templates
          npm run generate:indexes
          npm run generate:toc
      
      - name: Run quality checks
        run: npm run quality:check
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          title: 'docs: Update generated documents'
          branch: update-docs
          commit-message: 'docs: Update generated documents'
```

## 2. 検証スクリプト

### 2.1 構造検証
```javascript
// scripts/validate-structure.js
const validateStructure = async (docPath) => {
  const structure = {
    required: ['概要', '目的', '詳細', '結論'],
    optional: ['参考', '付録']
  };

  const doc = await readDocument(docPath);
  const validation = {
    missing: [],
    incomplete: [],
    invalid: []
  };

  // 必須セクションのチェック
  structure.required.forEach(section => {
    if (!doc[section]) {
      validation.missing.push(section);
    } else if (!isComplete(doc[section])) {
      validation.incomplete.push(section);
    }
  });

  // 構造の整合性チェック
  validateHierarchy(doc, validation);
  validateReferences(doc, validation);
  validateFormatting(doc, validation);

  return validation;
};

// 使用例
const main = async () => {
  const results = await validateStructure('path/to/doc');
  generateReport(results);
};
```

### 2.2 品質検証
```javascript
// scripts/validate-quality.js
const validateQuality = async (docPath) => {
  const quality = {
    readability: [],
    consistency: [],
    completeness: [],
    accuracy: []
  };

  const doc = await readDocument(docPath);

  // 可読性チェック
  quality.readability = checkReadability(doc);

  // 一貫性チェック
  quality.consistency = checkConsistency(doc);

  // 完全性チェック
  quality.completeness = checkCompleteness(doc);

  // 正確性チェック
  quality.accuracy = checkAccuracy(doc);

  return quality;
};

// 使用例
const main = async () => {
  const results = await validateQuality('path/to/doc');
  generateQualityReport(results);
};
```

## 3. 自動化スクリプト

### 3.1 インデックス生成
```javascript
// scripts/generate-index.js
const generateIndex = async (directory) => {
  const files = await scanDirectory(directory);
  const index = {
    categories: {},
    tags: {},
    authors: {},
    updated: new Date()
  };

  // ファイルの解析と分類
  for (const file of files) {
    const metadata = await extractMetadata(file);
    categorizeDocument(index, metadata);
    indexTags(index, metadata);
    trackAuthors(index, metadata);
  }

  // インデックスの生成
  await writeIndex(index, directory);
  await generateNavigation(index);
  await updateSearchIndex(index);

  return index;
};

// 使用例
const main = async () => {
  await generateIndex('docs/');
};
```

### 3.2 レポート生成
```javascript
// scripts/generate-report.js
const generateReport = async (validationResults) => {
  const report = {
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    },
    details: {
      structure: [],
      quality: [],
      links: []
    },
    timestamp: new Date()
  };

  // 結果の集計
  summarizeResults(report, validationResults);
  
  // 詳細レポートの生成
  generateDetailedReport(report);
  
  // HTML形式のレポート生成
  await generateHtmlReport(report);
  
  // 通知の送信
  await notifyResults(report);

  return report;
};

// 使用例
const main = async () => {
  const validation = await runValidation();
  await generateReport(validation);
};