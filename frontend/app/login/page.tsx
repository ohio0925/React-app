"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { redirect } from "next/dist/server/api-utils";

export default function LoginForm() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        password: password,
      }),
    });

    if (!res.ok) {
      alert("ログイン失敗");
      return;
    }

    const data = await res.json();

    document.cookie = `token=${data.access_token}; path=/`;

    alert("ログイン成功");

    router.push("/dashboard");
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

      <button type="button" className={styles.button} onClick={handleLogin}>
        ログイン
      </button>
    </div>
  );
}