"use client";
import styles from "@/app/page.module.css";

type Props = {
    searchWord: string;
    setSearchWord: (word: string) => void;
    handleSearch: () => void;
    searchLoading: boolean;
    videoId: string | null;
};

export default function CommentSearchForm({
    searchWord,
    setSearchWord,
    handleSearch,
    searchLoading,
    videoId
}: Props) {
    return (
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
    );
}