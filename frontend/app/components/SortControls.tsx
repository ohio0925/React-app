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
            <span>いいね数で並び替え：</span>
            <button
                onClick={() => setSortOrder('desc')}
                className={sortOrder === 'desc' ? styles.sortButtonActive : styles.sortButton}
            >
                ▼ 降順
            </button>
            <button
                onClick={() => setSortOrder('asc')}
                className={sortOrder === 'asc' ? styles.sortButtonActive : styles.sortButton}
            >
                ▲ 昇順
            </button>
            {sortOrder !== null && (
                <button onClick={() => setSortOrder(null)} className={styles.sortButtonReset}>
                    リセット
                </button>
            )}
        </div>
    );
}