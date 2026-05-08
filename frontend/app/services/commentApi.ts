export const fetchComments = async (url: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) throw new Error("APIエラー");
  return res.json();
};

export const searchComments = async (word: string, video_id: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API_URL}/comments/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, video_id }),
  });

  if (!res.ok) throw new Error("検索エラー");
  return res.json();
};

export const fetchSummary = async (video_id: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API_URL}/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id }),
  });

  if (!res.ok) throw new Error("要約エラー");
  return res.json();
};