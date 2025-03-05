# Draw.ioを使用したクラス図作成ガイドライン

## 概要

本ガイドラインでは、VSCodeにおけるDraw.ioを使用したクラス図作成の標準的な手順を定義します。

## 作成手順

### 1. 準備フェーズ

1. 要件の分析
   - 境界付けられたコンテキストの特定
   - 主要クラスの抽出
   - 関係性の整理

2. ファイル構造の準備
   ```bash
   docs/design/modeling/diagrams/[種類]/[YYYY-MM]/[図の名前].txt
   ```

### 2. 実装フェーズ

1. XMLテンプレートの作成
   ```xml
   <mxfile host="app.diagrams.net" modified="[timestamp]" agent="Mozilla/5.0" version="21.0.0" type="device">
     <diagram name="[図の名前]" id="[一意なID]">
       <mxGraphModel>
         <root>
           <mxCell id="0"/>
           <mxCell id="1" parent="0"/>
           <!-- ここにクラス定義を追加 -->
         </root>
       </mxGraphModel>
     </diagram>
   </mxfile>
   ```

2. クラスの定義
   ```xml
   <mxCell id="class1" value="ClassName" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="1">
     <mxGeometry x="[x]" y="[y]" width="160" height="100" as="geometry"/>
   </mxCell>
   ```

3. 属性・メソッドの追加
   ```xml
   <mxCell id="attrs1" value="+ field: type&#10;+ method(): returnType" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="class1">
     <mxGeometry y="26" width="160" height="74" as="geometry"/>
   </mxCell>
   ```

4. 関係性の定義
   ```xml
   <!-- 継承 -->
   <mxCell id="relation1" value="" style="endArrow=block;endSize=16;endFill=0;html=1;rounded=0;" edge="1" parent="1" source="child" target="parent">
     <mxGeometry width="160" relative="1" as="geometry"/>
   </mxCell>

   <!-- 関連 -->
   <mxCell id="relation2" value="" style="endArrow=diamondThin;endFill=1;endSize=12;html=1;rounded=0;" edge="1" parent="1" source="part" target="whole">
     <mxGeometry width="160" relative="1" as="geometry"/>
   </mxCell>
   ```

### 3. 変換フェーズ

1. .txtファイルの保存確認
   ```bash
   git status
   git diff
   ```

2. .drawioへの変換
   ```bash
   mv [元のファイル名].txt [元のファイル名].drawio
   ```

### 4. 検証フェーズ

1. 図の確認
   - VSCodeでのプレビュー表示
   - 要素の配置確認
   - 関係性の正確性確認

2. レビュー
   - XMLの構造確認
   - クラス設計の妥当性確認
   - 命名規則の遵守確認

## 配置のガイドライン

1. 基本レイアウト
   - 左上から右下への配置
   - 関連するクラスのグループ化
   - 適切な余白の確保

2. 推奨サイズ
   - クラス図の標準サイズ: 160x100
   - 余白: 最小20px
   - ページサイズ: 1100x1500

## アンチパターン

1. 避けるべき実装
   - 過度に複雑なXML構造
   - 非標準のスタイル定義
   - インライン座標の直接編集

2. 注意点
   - IDの重複を避ける
   - スタイルの一貫性を保つ
   - 適切な命名規則の使用

## トラブルシューティング

1. よくある問題
   - XMLパースエラー
   - レイアウトの崩れ
   - プレビューの不具合

2. 解決策
   - XMLの構造確認
   - テンプレートとの比較
   - 再変換の実行

## 参考資料

- docs/logs/ai/knowledge/implementation/2025-03/draw-io-class-diagram-techniques.md
- docs/logs/ai/adr/implementation/2025-03/class-diagram-creation-process.md

## 更新履歴

- 2025-03-06: 初版作成
  - 2段階アプローチの導入
  - 実践的な手順の確立
  - トラブルシューティングの追加