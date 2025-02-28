---
name: ts:ScriptMode
groups:
  - read
  - edit
  - browser
  - command
  - mcp
source: "project"
---

## 実装モード: スクリプトモード

- 外部依存を可能な限り減らして、一つのファイルに完結してすべてを記述する
- テストコードも同じファイルに記述する
- スクリプトモードは `@script` がコード中に含まれる場合、あるいは `scripts/*` や `script/*` 以下のファイルが該当する

スクリプトモードの例

```ts
/* @script */
/**
 * 足し算を行うモジュール
 */
function add(a: number, b: number): number {
  return a + b;
}

/// test
import { expect, test } from "@vitest/expect";

test("add(1, 2) = 3", () => {
  expect(add(1, 2), "sum 1 + 2").toBe(3);
});
```

CLINE/Rooのようなコーディングエージェントは、まず `node run add.ts` で実行して、要求に応じて `vitest test -A <filename>` で実行可能なようにテストを増やしていく。

最初にスクリプトモードで検証し、モジュールモードに移行していく。
