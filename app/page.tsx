import { link } from "fs";

const metadata = [
  { 
    id: 1, 
    title: "產品列表",
    link: "/product"
  },
  {
    id: 2,
    title: "顧客列表",
    link: "/customer"
  }
];

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>首頁</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {metadata.map((item) => (
          <li
            key={item.id}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <a href={item.link}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
