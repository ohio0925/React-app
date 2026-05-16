"use client";
import styles from "@/app/page.module.css";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown-light.css";
import ReactMarkdown from "react-markdown";

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

            {loading && (
                <div className={styles.loaderWrapper}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            {(!loading && summary) && (
                <div className={styles.summaryContainer}>
                    <h3 className={styles.summaryTitle}>要約結果</h3>
                    <p className={styles.summaryText}>
                        <div className="markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {summary}
                            </ReactMarkdown>
                        </div>
                    </p>
                </div>
            )}
        </div>
    );
}