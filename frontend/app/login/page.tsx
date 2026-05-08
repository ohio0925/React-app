"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { redirect } from "next/dist/server/api-utils";

export default function LoginForm() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "ログイン失敗");
        setLoading(false);
        return;
      }

      document.cookie = `token=${data.access_token}; path=/`;

      setMessage("ログイン成功");

      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      setMessage("通信エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ログイン</h2>

      <input
        className={styles.input}
        placeholder="ユーザID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <input
        className={styles.input}
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        className={styles.button}
        onClick={handleLogin}
        disabled={loading}>
        {loading ? (
          <div className={styles.spinner}></div>
        ) : (
          "ログイン"
        )}
      </button>
      {message && <p className={styles.error}>{message}</p>}
    </div>
  );
}