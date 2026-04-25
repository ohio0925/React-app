"use client";

import { useState } from "react";
import styles from "./page.module.css";

type ApiResponse = {
  ranking?: [string, number][];
  docs?: string[][];
  error?: string;
};

export default function Page() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setData(null);

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
            {/* ランキング */}
            <div className={styles.card}>
              <div className={styles.sectionTitle}>単語ランキング</div>
            {data.ranking?.length ? (
              data.ranking.map(([word, count], i) => {
                const maxCount = data?.ranking?.[0]?.[1] ?? 1;
                const ratio = (count / maxCount) * 100;

                return (
                  <div key={i} className={styles.rankItem}>
                    {/* バー */}
                    <div
                      className={styles.rankBar}
                      style={{ width: `${ratio}%` }}
                    />

                    {/* コンテンツ */}
                    <div className={styles.rankContent}>
                      <div className={styles.rankLeft}>
                        <span className={styles.rankNum}>{i + 1}</span>
                        <span className={styles.rankWord}>{word}</span>
                      </div>
                      <span className={styles.rankCount}>{count}回</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.empty}>ランキングなし</div>
            )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
