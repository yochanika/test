# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

HTML、CSS、JavaScriptで構築された日本語の備品管理SaaSアプリケーションです。企業の機器や備品を管理するためのモダンでレスポンシブなインターフェースを提供します。

## アプリケーション アーキテクチャ

### コアコンポーネント
- **InventoryAppクラス**: 全てのビジネスロジックとUI操作を処理するメインアプリケーションコントローラー
- **データストレージ**: 備品アイテムのクライアントサイド永続化にlocalStorageを使用
- **モーダルシステム**: 追加/編集フォーム用のカスタムモーダル実装
- **リアルタイムフィルタリング**: ページリロードなしでのライブ検索とカテゴリ/ステータスフィルタリング

### データモデル
アイテムは以下の構造を持ちます:
```javascript
{
  id: timestamp,
  name: string,
  category: string, // オフィス用品, IT機器, 家具, その他
  status: string,   // 利用可能, 使用中, メンテナンス, 故障
  location: string,
  description: string,
  quantity: number,
  createdAt: ISO string,
  updatedAt: ISO string (任意)
}
```

### 主要機能
- ホバーエフェクト付きのグリッドベースアイテム表示
- 名前、説明、場所でのリアルタイム検索
- ドロップダウンセレクタによるカテゴリとステータスフィルタリング
- フォームバリデーション付きCRUD操作
- モバイルファーストアプローチのレスポンシブデザイン
- ユーザーフィードバック用の通知システム
- 新規ユーザー向けのサンプルデータ自動読み込み

## 開発ワークフロー

### アプリケーションの実行
```bash
# ブラウザで直接開く
open index.html

# または互換性向上のためPython HTTPサーバーで配信
python3 -m http.server 8000
# その後 http://localhost:8000 にアクセス
```

### ファイル構成
- `index.html` - モーダルフォーム付きのメインアプリケーションマークアップ
- `styles.css` - レスポンシブデザインとアニメーション込みの完全なスタイリング
- `script.js` - ES6クラス構造での完全なアプリケーションロジック

### デザインシステム
- プライマリカラー: ブルーグラデーション (#4facfe から #00f2fe)
- 背景: パープルグラデーション (#667eea から #764ba2)
- フォント: Font Awesomeアイコン付きSegoe UIファミリー
- レイアウト: アイテムカードにCSS Grid、コントロールにFlexbox
- アニメーション: 全体的に滑らかなトランジションとホバーエフェクト

### アプリケーションの拡張
- 新しいカテゴリの追加: HTMLセレクトオプションとサンプルデータの両方を更新
- 新しいステータスタイプの追加: ステータスオプションとCSSステータスクラスを更新
- データモデルの変更: InventoryAppクラスのアイテム作成/編集ロジックを更新
- 永続化の追加: saveToStorage()メソッドのlocalStorageをバックエンドAPI呼び出しに置き換え