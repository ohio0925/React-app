# YouTube Comment Analyzer

YouTube動画のコメントを取得し、頻出単語の分析・コメント検索・AI要約を行うWebアプリケーションです。

## 概要

YouTubeのコメント欄には視聴者の率直な意見が集まる一方で、コメント数が多い動画では全体の傾向を把握することが困難です。

本アプリでは、YouTube動画のコメントを収集し、頻出単語分析やAI要約を行うことで、視聴者の反応や評価傾向を短時間で把握できるようにすることを目的として開発しました。

---

## 使用技術

### フロントエンド

* Next.js
* React
* TypeScript
* CSS Modules

### バックエンド

* FastAPI
* Python

### データベース

* PostgreSQL（Neon）

### 認証

* JWT Authentication
* Passlib（bcrypt）

### AI

* Google Gemini API

### 外部API

* YouTube Data API v3

### 自然言語処理

* MeCab
* fugashi

---

## 主な機能

### コメント取得

YouTube動画URLを入力することで、YouTube Data APIからコメントを取得します。

### 頻出単語ランキング

取得したコメントを形態素解析し、出現頻度の高い単語をランキング形式で表示します。

### コメント検索

任意のキーワードを含むコメントを検索できます。

### コメント並び替え

取得したコメントを以下の条件で並び替えることができます。

* いいね数降順
* いいね数昇順

### AI要約

Google Gemini APIを利用してコメント全体を要約します。

以下の内容を自動で分析します。

* 動画に対する評価傾向
* ポジティブな意見
* ネガティブな意見
* 視聴者の関心ポイント

### ログイン機能

JWT認証を利用したユーザーログイン機能を実装しています。

---

## システム構成

```text
Next.js
   ↓
FastAPI
   ↓
PostgreSQL

FastAPI
   ├─ YouTube Data API
   └─ Gemini API
```

---

## 画面機能

### コメント分析画面

* 頻出単語ランキング表示
* コメント検索
* キーワードハイライト
* コメントソート
* AI要約表示

### ログイン画面

* ユーザID認証
* JWT発行
* ログイン状態管理

---

## 工夫したポイント

### パフォーマンス改善

コメント保存時にSQLAlchemyの `bulk_save_objects()` を利用し、大量データ登録時の処理速度を改善しました。

### UI/UX

* タブによる画面切り替え
* ローディングスピナー
* モダンなカードレイアウト
* キーワードハイライト表示
* MarkdownによるAI要約表示

### セキュリティ

* bcryptによるパスワードハッシュ化
* JWT認証
* APIキーの環境変数管理
* CORS設定

---

## ディレクトリ構成

```text
project/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── public/
│
├── backend/
│   ├── routers/
│   ├── services/
│   ├── db/
│   ├── schemas/
│   ├── models/
│   └── main.py
│
└── README.md
```

---

## セットアップ

### Frontend

```bash
cd frontend

npm install

npm run dev
```

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## 環境変数

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### backend/.env

```env
DATABASE_URL=postgresql://xxxxx

GEMINI_API_KEY=xxxxx

YOUTUBE_API_KEY=xxxxx

SECRET_KEY=xxxxx
```

---

## 今後の改善予定

* レスポンシブ対応
* コメント感情分析
* AI要約履歴保存
* お気に入り動画機能
* 管理者機能
* CI/CD構築
* テストコード整備

---

## 学習・技術的な取り組み

本アプリの開発を通じて以下の技術を学習しました。

* Reactによるコンポーネント設計
* Next.js App Router
* FastAPIによるREST API開発
* PostgreSQL設計
* JWT認証
* Gemini API連携
* YouTube Data API利用
* SQLAlchemy ORM
* デプロイ（Vercel / Render）
* 環境変数管理
* Git / GitHub

---

## 作者

QAエンジニアとしての経験を活かしながら、Webエンジニアへのキャリアチェンジを目指して開発したポートフォリオ作品です。

フロントエンド・バックエンド・データベース・外部API連携まで一貫して実装し、実践的なWebアプリケーション開発を経験しました。
