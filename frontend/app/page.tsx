"use client";

import { useState } from "react";
import styles from "./page.module.css";

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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          YouTube <span>コメント分析</span>
        </h1>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            type="text"
            placeholder="YouTube URLを入力"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "解析中..." : "解析"}
          </button>
        </div>

        {loading && <div className={styles.loading}>読み込み中...</div>}

        {data?.error && <div className={styles.empty}>{data.error}</div>}

        {data && !data.error && (
          <>
            {/* ランキング + コメントを並べるコンテナ */}
            <div className={styles.cardsContainer}>
              {/* ランキング */}
              <div className={styles.card} style={{ flex: 1 }}>
                <div className={styles.sectionTitle}>単語出現ランキング</div>
                <div className={styles.sectionTitle}>取得コメント数: {data.docs?.length ?? 0}件</div>
                {data.ranking?.length ? (
                  data.ranking.map(([word, count], i) => {
                    const maxCount = data?.ranking?.[0]?.[1] ?? 1;
                    const ratio = (count / maxCount) * 100;

                    return (
                      <div 
                        key={i}
                        className={styles.rankItem}
                        onClick={() => {
                          setSearchWord(word);
                          handleSearch(word);
                        }}
                      >
                        <div
                          className={styles.rankBar}
                          style={{ width: `${ratio}%` }}
                        />
                        <div className={styles.rankContent}>
                          <div className={styles.rankLeft}>
                            <span className={styles.rankNum}>{i + 1}</span>
                            <span className={styles.rankWord}>{word}</span>
                          </div>
                          <span className={styles.rankCount}>{count}件</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.empty}>ランキングなし</div>
                )}
              </div>

              {/* コメント（常に表示） */}
              <div className={styles.card} style={{ flex: 1, maxHeight: '600px', overflowY: 'auto' }}>
                {/* コメントカードの上に検索フォームを追加 */}
                <div className={styles.searchGroup}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="検索単語を入力"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                  />
                  <button
                    className={styles.button}
                    onClick={() => handleSearch()}
                    disabled={searchLoading || !videoId}
                  >
                    {searchLoading ? "検索中..." : "検索"}
                  </button>
                </div>

                <h2 className={styles.sectionTitle}>
                  {searchResults.length > 0 ? `"${searchWord}" を含むコメント` : "コメント"}
                </h2>
                {searchLoading ? (
                  <div>検索中...</div>
                ) : searchResults.length ? (
                  searchResults.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div>{comment.comment_text}</div>
                      <div className={styles.commentMeta}>
                        {comment.video_id} / {new Date(comment.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : searchWord ? (
                  <div>該当するコメントはありません</div>
                ) : (
                  <div className={styles.empty}>単語をクリックまたは検索してください</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
