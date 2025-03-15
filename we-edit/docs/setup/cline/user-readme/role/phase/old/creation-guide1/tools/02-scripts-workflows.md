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
      
      - name: Run document validation
        run: |
          npm run validate:structure
          npm run validate:links
          npm run validate:format
      
      - name: Generate quality report
        run: npm run generate:quality-report
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
      
      - name: Generate documents
        run: |
          npm run generate:templates
          npm run generate:indexes
          npm run generate:toc
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          title: 'docs: Update generated documents'
```

## 2. 品質チェックスクリプト

### 2.1 構造チェック
```javascript
// scripts/validate-structure.js
const validateStructure = async (docPath) => {
  const structure = {
    required: ['overview', 'details', 'examples'],
    optional: ['references', 'appendix']
  };

  const doc = await readDocument(docPath);
  const validation = {
    missing: [],
    incomplete: []
  };

  // 必須セクションのチェック
  structure.required.forEach(section => {
    if (!doc[section]) {
      validation.missing.push(section);
    } else if (!isComplete(doc[section])) {
      validation.incomplete.push(section);
    }
  });

  return validation;
};

// 使用例
const main = async () => {
  const results = await validateStructure('path/to/doc');
  generateReport(results);
};
```

### 2.2 リンクチェック
```javascript
// scripts/validate-links.js
const validateLinks = async (docPath) => {
  const links = await extractLinks(docPath);
  const validation = {
    broken: [],
    external: [],
    internal: []
  };

  for (const link of links) {
    const status = await checkLink(link);
    if (!status.valid) {
      validation.broken.push({
        link,
        reason: status.reason
      });
    }
  }

  return validation;
};

// 使用例
const main = async () => {
  const results = await validateLinks('path/to/doc');
  generateReport(results);
};
```

## 3. 自動化スクリプト

### 3.1 テンプレート生成
```javascript
// scripts/generate-template.js
const generateTemplate = async (config) => {
  const template = {
    metadata: {
      title: config.title,
      author: config.author,
      date: new Date().toISOString(),
      version: '1.0.0'
    },
    sections: config.sections.map(section => ({
      title: section,
      content: getDefaultContent(section)
    }))
  };

  await writeTemplate(template, config.output);
};

// 使用例
const main = async () => {
  await generateTemplate({
    title: 'New Document',
    sections: ['overview', 'details', 'examples']
  });
};
```

### 3.2 インデックス生成
```javascript
// scripts/generate-index.js
const generateIndex = async (directory) => {
  const files = await scanDirectory(directory);
  const index = {
    categories: {},
    tags: {},
    authors: {}
  };

  files.forEach(file => {
    const metadata = extractMetadata(file);
    categorizeDocument(index, metadata);
  });

  await writeIndex(index, directory);
};

// 使用例
const main = async () => {
  await generateIndex('path/to/docs');
};
```

## 4. 変更管理スクリプト

### 4.1 バージョン管理
```javascript
// scripts/version-management.js
const updateVersion = async (docPath) => {
  const doc = await readDocument(docPath);
  const changes = await detectChanges(doc);
  
  if (changes.significant) {
    doc.version = incrementMajorVersion(doc.version);
  } else if (changes.minor) {
    doc.version = incrementMinorVersion(doc.version);
  } else {
    doc.version = incrementPatchVersion(doc.version);
  }

  await writeDocument(docPath, doc);
  await updateChangeLog(changes);
};

// 使用例
const main = async () => {
  await updateVersion('path/to/doc');
};
```

### 4.2 差分生成
```javascript
// scripts/generate-diff.js
const generateDiff = async (oldVersion, newVersion) => {
  const diff = {
    added: [],
    removed: [],
    modified: [],
    metadata: {
      date: new Date().toISOString(),
      author: getCurrentUser()
    }
  };

  await compareSections(oldVersion, newVersion, diff);
  await generateDiffReport(diff);
  await updateChangeLog(diff);

  return diff;
};

// 使用例
const main = async () => {
  await generateDiff('v1.0.0', 'v1.1.0');
};