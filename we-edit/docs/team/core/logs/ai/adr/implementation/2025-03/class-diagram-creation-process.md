# ADR: Draw.ioを使用したクラス図作成プロセスの改善

## Status
- 承認済み
- 実装済み

## Context
VSCodeでDraw.ioを使用したクラス図の作成が困難な状況が発生していた。効率的なクラス図作成プロセスが必要とされていた。

## Decision
以下の2段階アプローチを採用することを決定：

1. .txt形式でのDraw.io互換XMLファイル作成
2. .drawio形式へのリネームによる変換

このアプローチにより：
- VSCodeでの直接編集が可能
- バージョン管理が容易
- チーム間でのレビューが効率的

## Consequences

### Positive
- クラス図作成の効率化
- バージョン管理の改善
- レビュープロセスの簡素化

### Negative
- 2段階のプロセスが必要
- XMLの直接編集に慣れが必要

### Risks
- XMLフォーマットの誤りによる図の破損
- Draw.ioバージョン間の互換性問題

## Implementation
- モデリングガイドラインに手順を追加
- サンプルとしてシステム全体のクラス図を作成

## References
- docs/guidelines/design/modeling/guidelines.md
- docs/design/modeling/diagrams/rough/2025-03/system-overview-class.drawio