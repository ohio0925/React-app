"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";
import UrlForm from "@/app/components/UrlForm";
import RankingList from "@/app/components/RankingList";
import CommentSearchForm from "@/app/components/CommentSearchForm";
import SortControls from "@/app/components/SortControls";
import CommentList from "@/app/components/CommentList";

type ApiResponse = {
  ranking?: [string, number][];
  docs?: string[][];
  video_id?: string;
  error?: string;
};

type CommentItem = {
  id: number;
  video_id: string;
  comment_text: string;
  like_cnt: number;
  created_at: string;
};

export default function Page() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchWord, setSearchWord] = useState("");  // 統合された検索単語state
  const [searchResults, setSearchResults] = useState<CommentItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | null>(null);

  // 検索処理（searchWordのみを使用）
  const handleSearch = async (word?: string) => {
    const targetWord = word ?? searchWord;
    if (!targetWord.trim() || !videoId) return;

    setSearchLoading(true);
    setSearchResults([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/comments/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: targetWord, video_id: videoId }),
      });

      if (!res.ok) throw new Error("検索エラー");

      const result = await res.json();
      setSearchResults(result);
    } catch (e) {
      console.error(e);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setData(null);
    setSearchResults([]);  // URL変更時に検索結果をリセット
    setSearchWord("");  // 検索単語もリセット

    try {
      const res = await fetch("http://127.0.0.1:8000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("APIエラー");

      const result = await res.json();
      setData(result);
      setVideoId(result.video_id ?? null);
    } catch (e) {
      console.error(e);
      setData({ error: "取得失敗" });
    } finally {
      setLoading(false);
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

  const sortedResults = sortOrder === null
    ? searchResults
    : [...searchResults].sort((a, b) =>
      sortOrder === 'desc' ? b.like_cnt - a.like_cnt : a.like_cnt - b.like_cnt
    );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          YouTube <span>コメント分析</span>
        </h1>

        <div>
          <UrlForm
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        {loading && <div className={styles.loading}>読み込み中...</div>}

        {data?.error && <div className={styles.empty}>{data.error}</div>}

        {data && !data.error && (
          <>
            {/* ランキング + コメントを並べるコンテナ */}
            <div className={styles.cardsContainer}>
              {/* ランキング */}
              <RankingList
                ranking={data?.ranking}
                docs={data?.docs}
                setSearchWord={setSearchWord}
                handleSearch={handleSearch}
              />

              {/* コメント（常に表示） */}
              <div className={styles.card} style={{ flex: 1, maxHeight: '600px', overflowY: 'auto' }}>
                {/* コメントカードの上に検索フォームを追加 */}
                <CommentSearchForm
                  searchWord={searchWord}
                  setSearchWord={setSearchWord}
                  handleSearch={handleSearch}
                  searchLoading={searchLoading}
                  videoId={videoId}
                />

                <h2 className={styles.sectionTitle}>
                  {searchResults.length > 0 ? `"${searchWord}" を含むコメント` : "コメント"}
                </h2>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
