### 3.2 スキーマの切り替え - ロケールに応じたバリデーション

```typescript
import { z } from 'zod';

function validateData(data: any, locale: string) {
  let schema: z.ZodObject<any>;

  switch (locale) {
    case 'en':
      schema = englishSchema;
      break;
    case 'ja':
      schema = japaneseSchema;
      break;
    default:
      schema = englishSchema; // デフォルトは英語
  }

  try {
    const parsedData = schema.parse(data);
    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
}
```

### 3.3 エラーメッセージのローカライズ

```typescript
import { z } from 'zod';

const errorMessages = {
  en: {
    required: 'This field is required.',
    email: 'Invalid email address.',
    date: 'Invalid date format.',
  },
  ja: {
    required: 'このフィールドは必須です。',
    email: 'メールアドレスの形式が正しくありません。',
    date: '日付の形式が正しくありません。',
  },
};

function getErrorMessage(error: z.ZodIssue, locale: string) {
  const messages = errorMessages[locale] || errorMessages.en; // デフォルトは英語
  switch (error.code) {
    case 'too_small':
      return messages.required;
    case 'invalid_type':
      return messages.required;
    case 'invalid_string':
      if (error.validation == 'email') {
        return messages.email;
      }
      if (error.path.includes('date')) {
        return messages.date;
      }
      return 'Invalid input';
    default:
      return 'Invalid input';
  }
}

function validateData(data: any, locale: string) {
  // ... (スキーマの選択とバリデーション)

  try {
    const parsedData = schema.parse(data);
    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: getErrorMessage(err, locale),
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
}
```

## 5. その他の考慮事項

*   **日付と時間の処理:** タイムゾーンや日付のフォーマットなど、言語によって異なる日付と時間の処理に注意します。
*   **数値の表現:** 数値の表現（例：小数点、桁区切り）が、言語によって異なる場合があります。
*   **文字列の長さ:** 文字列の最大長や最小長が、言語によって異なる場合があります。
*   **テスト:** 各言語のスキーマとエラーメッセージが正しく動作することを確認するために、包括的なテストを行います。

## 6. まとめ - zod で実現する多言語対応

zod を使用することで、多言語対応のアプリケーションにおけるデータバリデーションを、型安全かつ柔軟に実装できます。言語ごとのスキーマを定義し、ロケールに応じて適切なスキーマを切り替えることで、ローカライズされたバリデーションを実現できます。本ドキュメントで紹介したベストプラクティスを参考に、zod を活用して、多言語対応のアプリケーションを開発してください。