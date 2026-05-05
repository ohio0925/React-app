"use client";

import { useState } from "react";
import { fetchComments, searchComments, fetchSummary } from "@/app/services/commentApi";
import styles from "@/app/page.module.css";
import UrlForm from "@/app/components/UrlForm";
import RankingList from "@/app/components/RankingList";
import CommentSearchForm from "@/app/components/CommentSearchForm";
import SortControls from "@/app/components/SortControls";
import CommentList from "@/app/components/CommentList";
import Tabs from "@/app/components/Tabs";
import AiSummary from "@/app/components/AiSummary";

// APIレスポンスの型定義
type ApiResponse = {
  ranking?: [string, number][];
  docs?: string[][];
  video_id?: string;
  error?: string;
};

// コメントアイテムの型定義
type CommentItem = {
  id: number;
  video_id: string;
  comment_text: string;
  like_cnt: number;
  created_at: string;
};

type AiSummaryResponse = {
  text: string;
};

// ページコンポーネント
export default function Page() {
  // URL関連
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // API結果
  const [data, setData] = useState<ApiResponse | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [summary, setSummary] = useState<AiSummaryResponse | null>(null);

  // 検索関連
  const [searchWord, setSearchWord] = useState("");
  const [searchResults, setSearchResults] = useState<CommentItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // ソート
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | null>(null);

  // タブ切り替え
  const [activeTab, setActiveTab] = useState<"rankinglist" | "ai_summary">("rankinglist");

  // AI要約ロード中状態
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // URL送信処理
  const handleSubmit = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setData(null);
    setSearchResults([]);  // URL変更時に検索結果をリセット
    setSearchWord("");  // 検索単語もリセット

    try {
      // APIにURLを送信して結果を取得
      const result = await fetchComments(url);

      // APIからのレスポンスをstateに保存
      setData(result);
      setVideoId(result.video_id ?? null);
    } catch (e) {
      console.error(e);
      setData({ error: "取得失敗" });
    } finally {
      setLoading(false);
    }
  };

  // 検索処理
  const handleSearch = async (word?: string) => {
    const targetWord = word ?? searchWord;
    if (!targetWord.trim() || !videoId) return;

    setSearchLoading(true);
    setSearchResults([]);

    try {
      // APIに検索ワードとvideoIdを送信して結果を取得
      const result = await searchComments(targetWord, videoId);

      // APIからのレスポンスをstateに保存
      setSearchResults(result);
    } catch (e) {
      console.error(e);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // AI要約取得処理
  const handleFetchSummary = async () => {
    if (!videoId) return;

    setAiSummaryLoading(true);

    try {
      const result = await fetchSummary(videoId);
      setSummary(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAiSummaryLoading(false);
    }
  };

  // テキストをハイライト処理する関数
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    // 大文字小文字を区別しないで分割
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: '#ffff99', padding: '2px' }}>{part}</mark>
      ) : (
        part
      )
    );
  };

  // ソートされた検索結果を計算
  const sortedResults = sortOrder === null
    ? searchResults
    : [...searchResults].sort((a, b) =>
      sortOrder === 'desc' ? b.like_cnt - a.like_cnt : a.like_cnt - b.like_cnt
    );

  // ページ全体の構成
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ヘッダー */}
        <h1 className={styles.title}>
          YouTube <span>コメント分析</span>
        </h1>

        {/* URL入力フォーム */}
        <div>
          <UrlForm
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
        {/* 読み込み中表示 */}
        {loading && (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {/* APIエラー表示 */}
        {data?.error && <div className={styles.empty}>{data.error}</div>}

        {/* API成功時のランキングとコメント表示 */}
        {data && !data.error && (
          <>
            {/* タブ切り替え */}
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* カードコンテナ */}
            <div className={styles.cardsContainer}>
              {/* 頻出単語ランキング + コメント一覧 */}
              {activeTab === "rankinglist" &&
                <>
                  {/* 頻出単語ランキング */}
                  <div className={styles.card} style={{ flex: 1 }}>
                    <RankingList
                      ranking={data?.ranking}
                      docs={data?.docs}
                      setSearchWord={setSearchWord}
                      handleSearch={handleSearch}
                    />
                  </div>

                  {/* コメント一覧*/}
                  <div className={styles.card} style={{ flex: 1 }}>
                    {/* コメント検索フォーム */}
                    <CommentSearchForm
                      searchWord={searchWord}
                      setSearchWord={setSearchWord}
                      handleSearch={handleSearch}
                      searchLoading={searchLoading}
                      videoId={videoId}
                    />

                    <SortControls
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                    <CommentList
                      searchLoading={searchLoading}
                      searchResults={sortedResults}
                      searchWord={searchWord}
                      highlightText={highlightText}
                    />
                  </div>
                </>
              }

              {/* AI要約 */}
              {activeTab === "ai_summary" &&
                <>
                  <AiSummary
                    summary={summary?.text ?? ""}
                    loading={aiSummaryLoading}
                    handleFetchSummary={handleFetchSummary}
                  />
                </>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
