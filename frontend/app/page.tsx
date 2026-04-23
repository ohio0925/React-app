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

      {data.error && <p>{data.error}</p>}

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