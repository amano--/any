# AIガイドライン作成の手順書（人間用）

## 1. 前提条件の整理

### 1.1 必要な情報収集
- docs/guidelines/*.md の全ファイル
  - react-components.md: Reactコンポーネントの実装規則
  - i18n-guidelines.md: 多言語対応の規則
  - data-fetching.md: データフェッチの規則
  - ai-development.md: AI開発支援規則

### 1.2 出力先の構造
```
docs/ai/guidelines/
├── index.md         # 実装ガイドライン索引
├── meta.md          # ガイドライン生成メタデータ
├── execution.md     # 実行プロトコル
├── validation.md    # 検証ルール
├── errors.md        # エラー処理
├── data-fetching.md # データフェッチ
├── documentation.md # ドキュメント管理
└── decision-log.md  # 意思決定ログ
```

### 1.3 参照元と規則
1. プロジェクトガイドライン
   - react-components.md: コンポーネント実装規則
   - i18n-guidelines.md: 多言語対応規則
   - data-fetching.md: データフェッチ規則
   - ai-development.md: AI開発支援規則

2. 管理ファイル
   - .clinerules: プロジェクト固有のルール
   - .cline/memory/: メモリバンク

### 1.4 収集時の注意点
- 相互に依存する規則の特定
- 優先順位の把握
- 暗黙的なルールの明文化

## 2. 情報の構造化

### 2.1 プロトコル形式への変換
```typescript
@protocol[category] {
  rules: Type[];
  validation: ValidationRules;
  priority: number;
}
```

### 2.2 構造化のポイント
- 機械的に検証可能な形式
- 明確な型定義
- 優先順位の数値化

## 3. 実装手順の定義

### 3.1 基本ステップ
1. ガイドライン全体の読み込み
2. 既存のAI用プロトコルの確認
3. 新規要素の抽出と統合
4. プロトコル形式への変換
5. 文書化と検証

### 3.2 ファイル構成
1. 実行プロトコル（execution.md）
   - コンポーネント実装ルール
   - 多言語対応ルール
   - メモリ管理ルール

2. 検証プロトコル（validation.md）
   - 型チェックルール
   - コード構造検証
   - 命名規則検証

3. エラー処理（errors.md）
   - エラー検出ルール
   - リカバリー手順
   - ログ記録規則

4. データフェッチ（data-fetching.md）
   - 責務分離ルール
   - 実装パターン
   - パフォーマンス最適化

5. ドキュメント管理（documentation.md）
   - 実装計画書ルール
   - コメント構造規則
   - バージョン管理規則

## 4. 学んだ教訓

### 4.1 効果的だった方法
- プロトコルベースの定義
  - 明確な入力と出力の定義
  - 検証可能なルール
  - エラー処理の標準化

- 階層構造の活用
  - 関連ルールのグループ化
  - 優先順位の明確化
  - 依存関係の可視化

- ドキュメント管理の統合
  - 実装計画書の標準化
  - コメント構造の定義
  - ナレッジ蓄積の仕組み

### 4.2 改善点
- 自動検証システムの追加
- メトリクスの定義
- 更新手順の自動化

## 5. メンテナンス

### 5.1 更新タイミング
- 新しいガイドラインの追加時
- 既存ガイドラインの変更時
- エラーパターンの発見時

### 5.2 更新手順
1. 既存のガイドラインを全て読み込む
2. 既存のAIプロトコルを確認
3. 変更内容の影響範囲を特定
4. プロトコルの更新
5. ドキュメントの更新

## 6. 品質管理

### 6.1 検証項目
- 型の整合性
- 実行可能性
- エラー検出の確実性

### 6.2 テスト方法
1. 静的解析
2. ランタイムチェック
3. パフォーマンス測定

## 7. 新たに学んだベストプラクティス

### 7.1 メタ情報の構造化
```typescript
@protocol[meta_information] {
  timestamp: string;    // 生成時刻
  version: string;      // バージョン番号
  source_files: {      // 元となるファイル
    path: string;
    priority: number;   // 優先度
    extracted: string[];// 抽出した要素
  }[];
}
```

### 7.2 相互参照マップの作成
```typescript
@protocol[cross_reference_map] {
  component_patterns: {
    primary: string;      // 主要ドキュメント
    references: string[]; // 関連参照
  };
  error_handling: {
    primary: string;
    references: string[];
  };
  // 他のカテゴリも同様
}
```

### 7.3 判断基準の体系化
1. 機能実装の優先順位
   - セキュリティとデータ整合性
   - 基本機能
   - エラーハンドリング
   - パフォーマンス最適化
   - UX改善

2. 技術選択の判断基準
   - 既存パターンとの整合性
   - メンテナンス性と拡張性
   - パフォーマンスへの影響
   - 学習曲線と実装コスト

3. リファクタリングの判断基準
   - コードの重複度
   - パフォーマンスへの影響
   - 機能拡張の容易性
   - テストの保守性

### 7.4 最適化メトリクス
```typescript
@protocol[optimization_metrics] {
  code_patterns: {
    duplication: "minimized";
    consistency: "maximized";
    clarity: "high";
  };
  validation_rules: {
    coverage: "complete";
    specificity: "high";
    automation: "maximized";
  };
  documentation: {
    structure: "hierarchical";
    format: "machine_readable";
    references: "explicit";
  };
}
```

## まとめ

AIガイドラインの作成は、以下の点を重視して行います：

1. 完全性
   - すべてのガイドラインの読み込み
   - 暗黙知の明文化
   - 相互依存関係の把握
   - メタ情報の構造化

2. 構造化
   - プロトコルベースの定義
   - 明確な型システム
   - 検証可能なルール
   - 相互参照マップの整備

3. メンテナンス性
   - ファイル分割による管理
   - 更新手順の標準化
   - 自動検証の導入
   - 最適化メトリクスの定義

4. ドキュメント管理
   - 実装計画書の標準化
   - コメント構造の定義
   - ナレッジベースの構築
   - 判断基準の体系化

---
Version: 2025.03.03
Last Updated: 2025.03.03 09:47 JST
