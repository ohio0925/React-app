"use client";
import styles from "@/app/page.module.css";

type Props = {
    summary: string;
    loading: boolean;
    handleFetchSummary: () => void;
};

export default function AiSummary({
    summary,
    loading,
    handleFetchSummary
}: Props) {
    return (
        <div className={styles.card} style={{ flex: 1 }}>
            <div className={styles.sectionTitle}>
                AI要約
            </div>
            <button
                className={styles.button}
                onClick={() => handleFetchSummary()}
                disabled={loading}>
                {loading ? "要約中..." : "コメントを要約"}
            </button>

            {summary && (
                <div className={styles.summaryContainer}>
                    <h3 className={styles.summaryTitle}>要約結果</h3>
                    <p className={styles.summaryText}>{summary}</p>
                </div>
            )}
        </div>
    );
}