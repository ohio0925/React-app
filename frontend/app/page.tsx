import Image from "next/image";

async function getData() {
  const res = await fetch("http://localhost:8000/");
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return <div>{data.message}</div>;
}
