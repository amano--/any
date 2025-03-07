# MCP (Model Context Protocol) 連携ガイド

## 1. MCPの基本概念

### 1.1 概要
```
MCPとは：
- AIシステムと外部リソース/ツールを接続するプロトコル
- ローカルで動作するサーバーを通じた機能拡張
- 型安全な通信プロトコル
```

### 1.2 主要コンポーネント
```
1. MCPサーバー
   - 外部機能の提供
   - リソース管理
   - ツール実装

2. ツール
   - 実行可能な機能
   - 入力パラメータ定義
   - 出力形式定義

3. リソース
   - 静的/動的データ
   - URIベースのアクセス
   - MIME型による形式指定
```

## 2. サーバーの作成と設定

### 2.1 基本構造
```
プロジェクト構造:
/Users/me/Documents/Cline/MCP/
└── your-server/
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts
```

### 2.2 セットアップ手順
```
1. プロジェクト作成
   ```bash
   cd /Users/me/Documents/Cline/MCP
   npx @modelcontextprotocol/create-server your-server-name
   ```

2. 依存関係インストール
   ```bash
   cd your-server-name
   npm install
   ```

3. 基本設定
   - package.json: ES Modules設定
   - tsconfig.json: コンパイル設定
   - 実行権限の設定
```

### 2.3 環境設定
```
設定ファイルの場所:
1. VSCode用:
   /Users/me/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json

2. Claude Desktop用:
   ~/Library/Application Support/Claude/claude_desktop_config.json

設定例:
{
  "mcpServers": {
    "your-server": {
      "command": "node",
      "args": ["/path/to/your-server/build/index.js"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## 3. ツールとリソースの実装

### 3.1 ツール実装
```typescript
// ツールの定義例
this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'your_tool',
      description: 'Tool description',
      inputSchema: {
        type: 'object',
        properties: {
          param1: {
            type: 'string',
            description: 'Parameter description'
          }
        },
        required: ['param1']
      }
    }
  ]
}));

// ツールの実装例
this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'your_tool') {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${request.params.name}`
    );
  }

  // ツールのロジック実装
  return {
    content: [
      {
        type: 'text',
        text: 'Tool result'
      }
    ]
  };
});
```

### 3.2 リソース実装
```typescript
// リソース一覧の定義
this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: `your-protocol://resource-path`,
      name: `Resource name`,
      mimeType: 'application/json',
      description: 'Resource description'
    }
  ]
}));

// リソーステンプレートの定義
this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
  resourceTemplates: [
    {
      uriTemplate: 'your-protocol://{param}/resource',
      name: 'Template name',
      mimeType: 'application/json',
      description: 'Template description'
    }
  ]
}));

// リソースの読み込み実装
this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  // URIのパース処理
  const match = request.params.uri.match(/^your-protocol:\/\/([^/]+)/);
  if (!match) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Invalid URI format: ${request.params.uri}`
    );
  }

  // リソースの取得処理
  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          // リソースデータ
        }, null, 2)
      }
    ]
  };
});
```

## 4. 実装例: Weather API サーバー

### 4.1 基本実装
```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  throw new Error('OPENWEATHER_API_KEY environment variable is required');
}

class WeatherServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: 'weather-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: 'http://api.openweathermap.org/data/2.5',
      params: {
        appid: API_KEY,
        units: 'metric',
      },
    });

    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Weather MCP server running on stdio');
  }
}

const server = new WeatherServer();
server.run().catch(console.error);
```

### 4.2 ツール実装例
```typescript
private setupToolHandlers() {
  this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'get_forecast',
        description: 'Get weather forecast for a city',
        inputSchema: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: 'City name',
            },
            days: {
              type: 'number',
              description: 'Number of days (1-5)',
              minimum: 1,
              maximum: 5,
            },
          },
          required: ['city'],
        },
      },
    ],
  }));

  this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== 'get_forecast') {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
    }

    const { city, days = 3 } = request.params.arguments;
    
    try {
      const response = await this.axiosInstance.get('forecast', {
        params: {
          q: city,
          cnt: days * 8,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: 'text',
              text: `Weather API error: ${
                error.response?.data.message ?? error.message
              }`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  });
}
```

### 4.3 リソース実装例
```typescript
private setupResourceHandlers() {
  this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: `weather://Tokyo/current`,
        name: `Current weather in Tokyo`,
        mimeType: 'application/json',
        description: 'Real-time weather data for Tokyo',
      },
    ],
  }));

  this.server.setRequestHandler(
    ListResourceTemplatesRequestSchema,
    async () => ({
      resourceTemplates: [
        {
          uriTemplate: 'weather://{city}/current',
          name: 'Current weather for a city',
          mimeType: 'application/json',
          description: 'Real-time weather data for a specified city',
        },
      ],
    })
  );

  this.server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request) => {
      const match = request.params.uri.match(/^weather:\/\/([^/]+)\/current$/);
      if (!match) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Invalid URI format: ${request.params.uri}`
        );
      }

      const city = decodeURIComponent(match[1]);

      try {
        const response = await this.axiosInstance.get('weather', {
          params: { q: city },
        });

        return {
          contents: [
            {
              uri: request.params.uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  temperature: response.data.main.temp,
                  conditions: response.data.weather[0].description,
                  humidity: response.data.main.humidity,
                  wind_speed: response.data.wind.speed,
                  timestamp: new Date().toISOString(),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `Weather API error: ${
              error.response?.data.message ?? error.message
            }`
          );
        }
        throw error;
      }
    }
  );
}
```

## 5. ベストプラクティス

### 5.1 設計原則
```
1. 単一責任の原則
   - 各サーバーは明確な目的を持つ
   - ツールとリソースは論理的にグループ化
   - 機能の重複を避ける

2. エラー処理
   - 適切なエラーコードの使用
   - 明確なエラーメッセージ
   - エラーの伝播制御

3. セキュリティ
   - 環境変数による認証情報管理
   - 入力のバリデーション
   - アクセス制御の実装
```

### 5.2 実装のヒント
```
1. 効率的な実装
   - キャッシュの活用
   - 非同期処理の適切な利用
   - リソースの適切な解放

2. テスト容易性
   - モジュール化された設計
   - テスト可能なインターフェース
   - モックの活用

3. メンテナンス性
   - 明確なコードコメント
   - バージョン管理
   - ドキュメントの整備
```

### 5.3 運用のポイント
```
1. モニタリング
   - ログ出力の実装
   - エラー監視
   - パフォーマンス追跡

2. デプロイメント
   - 設定ファイルの管理
   - 依存関係の管理
   - バージョン管理

3. 継続的改善
   - フィードバックの収集
   - 定期的な見直し
   - アップデート管理
```

## 更新履歴

- 2025-03-08: 初版作成
  - MCPの基本概念の説明
  - サーバー作成手順の詳細化
  - Weather APIサーバーの実装例を追加
  - ベストプラクティスの整理