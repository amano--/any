# Standard Coding Rules

## 1. Role Definition

You should act as a TypeScript + React expert engineer and UI/UX designer.

## 2. Basic Policy

### 2.1 Language Policy

- Code elements (variable names, function names, class names, file names): English
- Comments, README, documentation, commit messages: Japanese

### 2.2 README Creation and Maintenance

- Always create `README.md` in Japanese
- Update `README.md` whenever changes occur
- Avoid duplicate content, maintain single source of truth
- Add emojis to README sections to improve readability

## 3. Coding Principles

### 3.1 Basic Principles

1. **DRY (Don't Repeat Yourself)**

   - Improve reusability by modularizing identical/similar processes into functions

2. **Separation of Concerns**

   - Each module, class, and function should have a clear single responsibility, separating presentation, logic, and data processing

3. **KISS (Keep It Simple, Stupid)**

   - Keep code as simple as possible, avoid unnecessary complexity

4. **Divide and Conquer**

   - Break down large problems into smaller units to improve testability and maintainability

5. **Defensive Programming**

   - Implement input validation, exception handling, and error measures to ensure robustness and security

6. **YAGNI (You Aren't Gonna Need It)**

   - Focus on current requirements, avoid over-implementation based on unnecessary future predictions

7. **Readability and Documentation**

   - Use clear English names for variables, functions, and classes that immediately convey their role
   - Clearly explain code intent and logic in Japanese comments and README

8. **Test Driven Development (TDD) and Unit Testing**

   - Prepare unit tests for basic functionality
   - Encourage TDD, establishing the requirements → test → implementation → refactoring cycle

9. **Version Control and Code Review**

   - Manage change history with Git, conduct code reviews through pull requests
   - When modifying files, commit changes for each file separately to maintain clear history

10. **SOLID Principles Application**
    - Consider SRP, OCP, LSP, ISP, DIP to achieve extensible and maintainable design

### 3.2 Functional Programming

#### 3.2.1 Utilizing Lodash

We use Lodash for functional programming implementation, but only import necessary functions to optimize file size:

```typescript
// Bad: Import everything
import _ from "lodash";

// Good: Import only necessary functions
import flow from "lodash/flow";
import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import trim from "lodash/trim";
import assign from "lodash/assign";

// Function composition example
const processUser = flow([
  (user: User) => pick(user, ["id", "name", "email"]),
  (user: Pick<User, "id" | "name" | "email">) => mapValues(user, trim),
  (user: UserDTO) => assign({}, user, { updatedAt: new Date() }),
]);

// Collection operations
import filter from "lodash/filter";
import map from "lodash/map";
import sortBy from "lodash/sortBy";

const processUsers = (users: User[]): UserSummary[] =>
  sortBy(
    map(filter(users, "isActive"), (user) => pick(user, ["id", "name"])),
    "name",
  );

// Memoization
import memoize from "lodash/memoize";

const expensiveCalculation = memoize((input: string): number => {
  // Complex calculation
  return input.length;
});
```

#### 3.2.2 Immutability

Implement immutable operations by importing only necessary functions:

```typescript
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import concat from "lodash/concat";

// Object update
const updateUser = (user: User, updates: Partial<User>): User => {
  const newUser = cloneDeep(user);
  return Object.entries(updates).reduce(
    (acc, [key, value]) => set(acc, key, value),
    newUser,
  );
};

// Array operations
const addItem = <T>(items: T[], item: T): T[] => concat(items, [item]);

// Nested object update
const updateNestedField = <T>(obj: T, path: string, value: any): T =>
  set(cloneDeep(obj), path, value);
```

#### 3.2.3 Performance Optimization

- Import only necessary functions to reduce bundle size
- Maximize Tree Shaking effects
- Apply memoization to high-cost operations

```typescript
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import once from "lodash/once";

// Search input optimization
const handleSearch = debounce((query: string) => {
  // Search processing
}, 300);

// Scroll event optimization
const handleScroll = throttle((event: Event) => {
  // Scroll processing
}, 100);

// Initialization (execute only once)
const initialize = once(() => {
  // Application initialization
});
```

# Important Implementation Guidelines for TypeScript + React Projects

## 1. Type Safety

### 1.1 Variable Declaration

- Use only `type` and `const`
- Prohibit use of `class`, `interface`, `enum`, `namespace`, `let`, and `var`
- Add explicit type annotations to all variables

```typescript
// Good
type User = {
  id: string;
  name: string;
};

const user: User = {
  id: "1",
  name: "John",
};

// Bad
let name = "John"; // Using let
var id = 1; // Using var
```

### 1.2 Tagged Union

- Actively use Tagged Union for data with multiple states
- Ensure type safety of states
- Utilize pattern matching

```typescript
// Good
type LoadState<T> =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; data: T }
  | { type: "error"; error: Error };

// Usage example
switch (type) {
  case "idle":
    return <Idle />;
  case "loading":
    return <Loading />;
  case "success":
    return <Success data={state.data} />;
  case "error":
    return <Error error={state.error} />;
  default:
    const _exhaustiveCheck: never = type
    throw new Error("unreachable:" + _exhaustiveCheck)
}
```

## 2. Internationalization (i18n)

### 2.1 Text Management

- Manage all text in i18n resource files
- Prohibit hardcoded strings
- Manage translation keys in hierarchical structure

```typescript
// Good
const title = t("common.header.title");

// Bad
const title = "Welcome to our app"; // Hardcoded
```

### 2.2 Dates and Numbers

- Consider localization for dates and numbers
- Handle timezones explicitly
- Change number format according to locale

## 3. Testing and Documentation

### 3.1 Collocation

- Place test files in the same directory as implementation files
- Place Storybook files similarly
- Group related files together

```
components/
  Button/
    Button.tsx
    Button.test.tsx
    Button.stories.tsx
    Button.module.css
```

### 3.2 Test Coverage

- Create unit tests for all components
- Document major use cases in Storybook
- Always include edge case tests

## 4. Error Handling

### 4.1 Exception Handling

- Use typed errors
- Clearly define error boundaries
- Prevent unhandled exceptions

```typescript
type Result<T> =
  | { type: "success"; value: T }
  | { type: "error"; error: Error };

const fetchData = async (): Promise<Result<Data>> => {
  try {
    const data = await api.get();
    return { type: "success", value: data };
  } catch (e) {
    return { type: "error", error: e as Error };
  }
};
```

## 5. Component Design

### 5.1 Props Type Definition

- Explicit type definitions for all Props
- Clear distinction between required and optional properties
- Reuse common Props types

```typescript
type ButtonProps = {
  variant: "primary" | "secondary";
  size: "small" | "medium" | "large";
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};
```

### 5.2 State Management

- Use only `useState` for local state
- Centralize global state in store
- Manage async state with Tagged Union

## 6. Performance

### 6.1 Memoization

- Use `useMemo` for high-cost calculations
- Use `memo` for render optimization
- Explicitly define dependency arrays

### 6.2 Side Effects

- Execute side effects only within `useEffect`
- Properly implement cleanup functions
- Minimize dependency array changes

## 7. Code Style

### 7.1 Naming Conventions

- Components: PascalCase
- Functions: camelCase
- Types: PascalCase
- Constants: UPPER_SNAKE_CASE

### 7.2 File Structure

- Split directories by feature
- Expose public API in index.ts
- Appropriately place tests and stories