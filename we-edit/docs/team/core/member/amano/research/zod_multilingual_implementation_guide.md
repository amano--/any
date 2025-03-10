# Zodによる多言語対応の実装ガイド - Zodの作者より

## なぜこの解説文書が必要か

2025年現在、TypeScriptを使用したグローバルアプリケーションの開発において、型安全性とバリデーションの重要性が増しています。特に以下の課題に直面するケースが増えています：

1. 異なる言語圏でのデータ検証要件の違い（日付形式、数値表記等）
2. エラーメッセージの適切なローカライゼーション
3. 言語固有の文字種や長さの制約
4. パフォーマンスを考慮したバリデーションの切り替え

Zodは、これらの課題に対して型安全かつ効率的なソリューションを提供できますが、具体的な実装方法について詳細な解説が求められています。

## 1. 多言語対応のアーキテクチャ設計

### 1.1 基本アーキテクチャ

```typescript
import { z } from 'zod';

// 言語設定の型定義
type SupportedLocale = 'en' | 'ja' | 'zh';

// ロケール依存のスキーマファクトリ
interface LocalizedSchemaFactory<T> {
  createSchema: (locale: SupportedLocale) => z.ZodType<T>;
}

// スキーママネージャー
class LocalizedSchemaManager<T> {
  private schemaCache: Map<SupportedLocale, z.ZodType<T>> = new Map();
  
  constructor(private factory: LocalizedSchemaFactory<T>) {}

  getSchema(locale: SupportedLocale): z.ZodType<T> {
    if (!this.schemaCache.has(locale)) {
      this.schemaCache.set(locale, this.factory.createSchema(locale));
    }
    return this.schemaCache.get(locale)!;
  }
}
```

### 1.2 エラーメッセージの管理

```typescript
// エラーメッセージの型定義
interface ErrorMessages {
  required: string;
  invalidType: string;
  invalidDate: string;
  tooLong: (max: number) => string;
  tooShort: (min: number) => string;
}

// 言語別エラーメッセージ
const errorMessages: Record<SupportedLocale, ErrorMessages> = {
  en: {
    required: 'This field is required',
    invalidType: 'Invalid input type',
    invalidDate: 'Invalid date format',
    tooLong: (max) => `Must be at most ${max} characters`,
    tooShort: (min) => `Must be at least ${min} characters`,
  },
  ja: {
    required: 'この項目は必須です',
    invalidType: '入力形式が正しくありません',
    invalidDate: '日付の形式が正しくありません',
    tooLong: (max) => `${max}文字以内で入力してください`,
    tooShort: (min) => `${min}文字以上で入力してください`,
  },
  zh: {
    required: '此字段为必填项',
    invalidType: '输入类型无效',
    invalidDate: '日期格式无效',
    tooLong: (max) => `不能超过${max}个字符`,
    tooShort: (min) => `不能少于${min}个字符`,
  },
};
```

## 2. 高度なバリデーション実装

### 2.1 言語固有の制約

```typescript
// 言語固有の文字列制約
interface StringConstraints {
  maxLength: number;
  minLength: number;
  pattern?: RegExp;
}

const stringConstraints: Record<SupportedLocale, StringConstraints> = {
  en: {
    maxLength: 100,
    minLength: 2,
    pattern: /^[a-zA-Z0-9\s]*$/,
  },
  ja: {
    maxLength: 50, // 日本語は文字あたりの情報量が多いため
    minLength: 1,
    pattern: /^[a-zA-Z0-9\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]*$/,
  },
  zh: {
    maxLength: 50,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\s\u4E00-\u9FAF]*$/,
  },
};

// 制約を適用するファクトリ関数
const createLocalizedStringSchema = (locale: SupportedLocale) => {
  const constraints = stringConstraints[locale];
  const messages = errorMessages[locale];
  
  return z.string({
    required_error: messages.required,
    invalid_type_error: messages.invalidType,
  })
    .min(constraints.minLength, {
      message: messages.tooShort(constraints.minLength),
    })
    .max(constraints.maxLength, {
      message: messages.tooLong(constraints.maxLength),
    })
    .regex(constraints.pattern || /.*/, {
      message: messages.invalidType,
    });
};
```

### 2.2 日付と数値のバリデーション

```typescript
// 日付フォーマットの定義
const dateFormats: Record<SupportedLocale, RegExp> = {
  en: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  ja: /^\d{4}年\d{1,2}月\d{1,2}日$/, // YYYY年MM月DD日
  zh: /^\d{4}年\d{1,2}月\d{1,2}日$/, // YYYY年MM月DD日
};

// 数値フォーマットの定義
const numberFormats: Record<SupportedLocale, {
  decimal: string;
  thousand: string;
}> = {
  en: { decimal: '.', thousand: ',' },
  ja: { decimal: '.', thousand: ',' },
  zh: { decimal: '.', thousand: ',' },
};

// 日付バリデーションスキーマの作成
const createLocalizedDateSchema = (locale: SupportedLocale) => {
  const format = dateFormats[locale];
  const messages = errorMessages[locale];
  
  return z.string({
    required_error: messages.required,
    invalid_type_error: messages.invalidType,
  }).regex(format, {
    message: messages.invalidDate,
  }).transform((str) => {
    // 文字列から Date オブジェクトへの変換ロジック
    return new Date(str);
  });
};
```

## 3. 実践的な使用例

### 3.1 ユーザープロファイルのバリデーション

```typescript
// ユーザープロファイルのスキーマファクトリ
class UserProfileSchemaFactory implements LocalizedSchemaFactory<UserProfile> {
  createSchema(locale: SupportedLocale) {
    const msgs = errorMessages[locale];
    
    return z.object({
      name: createLocalizedStringSchema(locale),
      birthDate: createLocalizedDateSchema(locale),
      bio: z.string()
        .max(stringConstraints[locale].maxLength * 2, {
          message: msgs.tooLong(stringConstraints[locale].maxLength * 2),
        })
        .optional(),
      email: z.string().email({
        message: msgs.invalidType,
      }),
    });
  }
}

// 使用例
const userProfileManager = new LocalizedSchemaManager(new UserProfileSchemaFactory());

function validateUserProfile(data: unknown, locale: SupportedLocale) {
  const schema = userProfileManager.getSchema(locale);
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    throw error;
  }
}
```

### 3.2 パフォーマンス最適化

```typescript
// スキーマのコンパイル
const createCompiledSchema = <T>(
  factory: LocalizedSchemaFactory<T>,
  locales: SupportedLocale[]
) => {
  const manager = new LocalizedSchemaManager(factory);
  
  // 事前にすべてのロケールのスキーマを生成
  locales.forEach(locale => {
    manager.getSchema(locale);
  });
  
  return manager;
};

// メモ化されたバリデーション関数
const createMemoizedValidator = <T>(
  factory: LocalizedSchemaFactory<T>,
  locales: SupportedLocale[]
) => {
  const compiledSchema = createCompiledSchema(factory, locales);
  const resultCache = new Map<string, {
    data: unknown;
    result: { success: boolean; data?: T; errors?: any[] };
  }>();
  
  return (data: unknown, locale: SupportedLocale) => {
    const cacheKey = `${locale}:${JSON.stringify(data)}`;
    const cached = resultCache.get(cacheKey);
    
    if (cached && cached.data === data) {
      return cached.result;
    }
    
    const result = validateUserProfile(data, locale);
    resultCache.set(cacheKey, { data, result });
    return result;
  };
};
```

## 4. テストとメンテナンス

### 4.1 テスト戦略

```typescript
describe('LocalizedSchemaManager', () => {
  const factory = new UserProfileSchemaFactory();
  const manager = new LocalizedSchemaManager(factory);
  
  test.each(['en', 'ja', 'zh'] as const)(
    'validates user profile in %s locale',
    (locale) => {
      const schema = manager.getSchema(locale);
      const validData = {
        name: 'Test User',
        birthDate: locale === 'en' ? '2000-01-01' : '2000年1月1日',
        email: 'test@example.com',
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    }
  );
});
```

### 4.2 メンテナンス考慮事項

1. **新しい言語の追加**
   - SupportedLocale 型の更新
   - エラーメッセージの追加
   - 言語固有の制約の定義
   - 日付/数値フォーマットの追加

2. **既存のバリデーションの更新**
   - スキーマの変更は全言語に影響
   - テストケースの更新が必要
   - キャッシュの無効化考慮

3. **パフォーマンスモニタリング**
   - キャッシュヒット率の監視
   - バリデーション実行時間の計測
   - メモリ使用量の監視

## まとめ

Zodを使用した多言語対応の実装は、型安全性とパフォーマンスの両立を可能にします。本ガイドで紹介した手法を基に、プロジェクトの要件に応じた実装を検討してください。特に重要な点は：

1. 言語固有の要件を型安全に実装
2. エラーメッセージの適切な管理
3. パフォーマンスを考慮したキャッシング戦略
4. テストと保守性の確保

これらの要素を適切に組み合わせることで、堅牢な多言語対応システムを構築できます。