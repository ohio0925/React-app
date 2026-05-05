"use client";
import { ReactNode } from "react";
import styles from "@/app/page.module.css";

type CommentItem = {
    id: number;
    video_id: string;
    comment_text: string;
    like_cnt: number;
    created_at: string;
};

type Props = {
    searchLoading: boolean;
    searchResults: CommentItem[];
    searchWord: string;
    highlightText: (text: string, highlight: string) => ReactNode;
};

export default function CommentList({
    searchLoading,
    searchResults,
    searchWord,
    highlightText
}: Props) {
    return (
        <>
            <h2 className={styles.searchComment}>
                {searchResults.length > 0 ? `"${searchWord}" を含むコメント` : "コメント"}
            </h2>
            {searchLoading ? (
                <div>検索中...</div>
            ) : searchResults.length ? (
                searchResults.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                        <div>{highlightText(comment.comment_text, searchWord)}</div>
                        <div className={styles.commentMeta}>
                            {comment.video_id} / {new Date(comment.created_at).toLocaleString()} / いいね数: {comment.like_cnt}
                        </div>
                    </div>
                ))
            ) : searchWord ? (
                <div>該当するコメントはありません</div>
            ) : (
                <div className={styles.empty}>単語をクリックまたは検索してください</div>
            )}
        </>
    );
}