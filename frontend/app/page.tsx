export const dynamic = "force-dynamic";

async function getData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return res.json();
  } catch (error) {
    return { message: "API接続エラー" };
  }
}

export default async function Page() {
  const data = await getData();

  return <div>{data.message}</div>;
}
