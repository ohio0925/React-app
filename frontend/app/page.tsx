export const dynamic = "force-dynamic";

async function getData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/comments", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return res.json();
  } catch (error) {
    return { docs: [], error: "API接続エラー" };
  }
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h1>コメント解析結果</h1>

      {/* ランキング表示 */}
      <h2>単語ランキング</h2>
      {data.ranking?.length > 0 ? (
        data.ranking.map(([word, count], i) => (
          <div key={i}>
            {i + 1}位：{word}（{count}回）
          </div>
        ))
      ) : (
        <p>ランキングなし</p>
      )}

      {/* 元のdocs表示（必要なら） */}
      <h2>コメント分解</h2>
      {data.docs?.length > 0 ? (
        data.docs.map((doc, i) => (
          <div key={i}>
            {doc.join(" / ")}
          </div>
        ))
      ) : (
        <p>データなし</p>
      )}
    </div>
  );
}