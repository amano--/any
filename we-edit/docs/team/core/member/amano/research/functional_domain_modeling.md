# 関数型ドメインモデリング解説書

## なぜ今、関数型ドメインモデリングか

本プロジェクトでは、tRPC、Zod、Drizzle ORMなどの最新のTypeScriptエコシステムを採用し、型安全性を重視したアーキテクチャを構築しています。この文脈において、関数型ドメインモデリングの採用は、以下の理由で極めて重要な意味を持ちます：

1. 型安全性の強化：代数的データ型とパターンマッチングによる網羅的な状態管理
2. テスト容易性：純粋関数による予測可能な振る舞いの実現
3. 並行処理の簡素化：イミュータブルなデータ構造による状態管理の単純化
4. ドメインの整合性：代数的データ型による不正な状態の型レベルでの排除

## 1. 関数型ドメインモデリングの基本原則

### 1.1 イミュータビリティの徹底

```typescript
// 悪い例：ミュータブルな状態管理
class Order {
  private items: OrderItem[] = [];
  
  addItem(item: OrderItem) {
    this.items.push(item);  // 状態を直接変更
  }
}

// 良い例：イミュータブルな状態管理
type Order = Readonly<{
  items: ReadonlyArray<OrderItem>;
}>;

const addItem = (order: Order, item: OrderItem): Order => ({
  ...order,
  items: [...order.items, item]
});
```

### 1.2 代数的データ型による状態表現

```typescript
// 支払い状態を代数的データ型で表現
type PaymentStatus =
  | { type: 'PENDING' }
  | { type: 'PROCESSING'; transactionId: string }
  | { type: 'COMPLETED'; transactionId: string; completedAt: Date }
  | { type: 'FAILED'; error: string };

// 状態遷移を純粋関数として実装
const processPayment = (status: PaymentStatus, transactionId: string): PaymentStatus => {
  switch (status.type) {
    case 'PENDING':
      return { type: 'PROCESSING', transactionId };
    default:
      throw new Error(`Invalid state transition from ${status.type}`);
  }
};
```

## 2. ドメインモデルの実装パターン

### 2.1 Smart Constructors パターン

```typescript
// ドメインオブジェクトの不変条件を型で表現
type NonEmptyString = string & { readonly _brand: unique symbol };

// Smart Constructor: 生成時に不変条件を検証
const createNonEmptyString = (value: string): Option<NonEmptyString> => {
  return value.trim().length > 0
    ? Some(value as NonEmptyString)
    : None;
};

// Product型の定義
type Product = Readonly<{
  id: UUID;
  name: NonEmptyString;
  price: PositiveNumber;
}>;
```

### 2.2 Effect Systemによる副作用の分離

```typescript
// 副作用を表現する型
type ProductEffect<A> = Reader<Dependencies, Promise<A>>;

// リポジトリの操作を効果として表現
interface ProductRepository {
  find: (id: UUID) => ProductEffect<Option<Product>>;
  save: (product: Product) => ProductEffect<void>;
}

// ユースケースの実装
const updateProductPrice = (
  id: UUID,
  newPrice: PositiveNumber
): ProductEffect<Option<Product>> => {
  return pipe(
    ask<Dependencies>(),
    chain(deps => deps.productRepo.find(id)),
    chain(maybeProduct =>
      pipe(
        maybeProduct,
        map(product => ({ ...product, price: newPrice })),
        traverse(deps.productRepo.save)
      )
    )
  );
};
```

## 3. 実践的なパターン適用

### 3.1 集約の実装

```typescript
// 値オブジェクトの定義
type Money = Readonly<{
  amount: number;
  currency: Currency;
}>;

// 集約ルートの定義
type Order = Readonly<{
  id: OrderId;
  items: ReadonlyArray<OrderItem>;
  total: Money;
  status: OrderStatus;
}>;

// 集約操作の実装
const OrderAggregate = {
  create: (id: OrderId): Order => ({
    id,
    items: [],
    total: { amount: 0, currency: 'JPY' },
    status: { type: 'DRAFT' }
  }),

  addItem: (order: Order, item: OrderItem): Option<Order> =>
    pipe(
      validateItemAddition(order, item),
      map(validated => ({
        ...order,
        items: [...order.items, item],
        total: calculateNewTotal(order.total, item)
      }))
    ),

  submit: (order: Order): Option<Order> =>
    pipe(
      validateOrderSubmission(order),
      map(validated => ({
        ...order,
        status: { type: 'SUBMITTED', submittedAt: new Date() }
      }))
    )
};
```

### 3.2 境界づけられたコンテキストの統合

```typescript
// コンテキスト間の変換を明示的に定義
type OrderContext = {
  Order: Order;
  Customer: Customer;
};

type ShippingContext = {
  ShipmentOrder: ShipmentOrder;
  Address: Address;
};

// Anti-Corruption Layer の実装
const ShippingAdapter = {
  toShipmentOrder: (order: OrderContext['Order']): ShippingContext['ShipmentOrder'] =>
    pipe(
      order,
      validateForShipment,
      map(convertToShipmentFormat),
      getOrThrow
    )
};
```

## 4. テスト戦略

### 4.1 Property-Based Testing

```typescript
import * as fc from 'fast-check';

// ドメインルールのプロパティテスト
describe('Order Aggregate', () => {
  it('should maintain invariants after any valid operation', () => {
    fc.assert(
      fc.property(
        orderArbitrary,
        orderItemArbitrary,
        (order, item) => {
          const result = OrderAggregate.addItem(order, item);
          return pipe(
            result,
            map(validateOrderInvariants),
            getOrElse(() => true)
          );
        }
      )
    );
  });
});
```

### 4.2 副作用のテスト

```typescript
// ReaderTaskEither を使用した副作用のモック
type TestDependencies = {
  productRepo: ProductRepository;
  eventBus: EventBus;
};

const testUpdateProductPrice = pipe(
  updateProductPrice(productId, newPrice),
  provide({
    productRepo: mockProductRepo,
    eventBus: mockEventBus
  })
);
```

## まとめ

関数型ドメインモデリングは、型安全性、テスト容易性、保守性の向上に大きく貢献します。特に：

1. イミュータブルなデータ構造による予測可能な状態管理
2. 代数的データ型による不正な状態の排除
3. 副作用の明示的な分離と制御
4. プロパティベースドテストによる堅牢性の確保

これらの特徴は、本プロジェクトで採用している最新のTypeScriptエコシステムと完全に整合し、保守性の高い堅牢なシステムの構築を可能にします。