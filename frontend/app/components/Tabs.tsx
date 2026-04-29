"use client";

import styles from "@/app/page.module.css";

type Props = {
    activeTab: "rankinglist" | "ai_summary";
    setActiveTab: (tab: "rankinglist" | "ai_summary") => void;
};

export default function Tabs({
    activeTab,
    setActiveTab
}: Props) {
    return (
        <div className={styles.tabs}>
            <button
                className={activeTab === "rankinglist" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("rankinglist")}
            >
                ランキングリスト
            </button>

            <button
                className={activeTab === "ai_summary" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("ai_summary")}
            >
                AI要約
            </button>
        </div>
    );
}