"use client";
import styles from "@/app/page.module.css";

type Props = {
  url: string;
  setUrl: (value: string) => void;
  handleSubmit: () => void;
  loading: boolean;
};

export default function UrlForm({ 
  url, 
  setUrl, 
  handleSubmit, 
  loading 
}: Props) {
  return (
    <div className={styles.inputGroup}>
      <input
        className={styles.input}
        type="text"
        placeholder="YouTubeのURLを入力"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button 
        className={styles.button}
        onClick={handleSubmit} 
        disabled={loading}>
        {loading ? "解析中..." : "解析"}
      </button>
    </div>
  );
}