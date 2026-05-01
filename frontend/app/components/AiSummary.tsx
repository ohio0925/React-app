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
                onClick={() => handleFetchSummary()}
                disabled={loading}>
                {loading ? "要約中..." : "コメントを要約"}
            </button>

            {summary && (
                <div style={{ marginTop: "16px", whiteSpace: "pre-wrap" }}>
                    <h3>要約結果</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}