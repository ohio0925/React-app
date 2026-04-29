"use client";
import styles from "@/app/page.module.css";

type Props = {
  ranking?: [string, number][];
  docs?: string[][];
  setSearchWord: (word: string) => void;
  handleSearch: (word?: string) => void;
};

export default function RankingList({
  ranking,
  docs,
  setSearchWord,
  handleSearch
}: Props) {
  return (
    <>
      <div className={styles.sectionTitle}>
        頻出単語ランキング
      </div>
      <div className={styles.sectionTitle}>
        取得コメント数: {docs?.length ?? 0}件
      </div>
      {ranking?.length ? (
        ranking.map(([word, count], i) => {
          const maxCount = ranking?.[0]?.[1] ?? 1;
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
    </>
  );
}