"use client";
import styles from "@/app/page.module.css";

type Props = {
    sortOrder: 'desc' | 'asc' | null;
    setSortOrder: (order: 'desc' | 'asc' | null) => void;
};

export default function CommentSearchForm({
    sortOrder,
    setSortOrder
}: Props) {
    return (
        <div className={styles.sortControls}>
            <p>いいね数：</p>
            <button
                onClick={() => setSortOrder('desc')}
                className={sortOrder === 'desc' ? styles.sortButtonActive : styles.sortButton}
            >
                ▼
            </button>
            <button
                onClick={() => setSortOrder('asc')}
                className={sortOrder === 'asc' ? styles.sortButtonActive : styles.sortButton}
            >
                ▲
            </button>
            <button 
                onClick={() => setSortOrder(null)} 
                className={styles.sortButtonReset}>
                リセット
            </button>
        </div>
    );
}