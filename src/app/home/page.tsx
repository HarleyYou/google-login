"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function HomeContent() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") ?? "";
  const name = email.split("@")[0];

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="40" height="14" viewBox="0 0 75 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.64 12.2c0-.63-.06-1.25-.16-1.84H15.36v3.48h7.99a6.83 6.83 0 01-2.96 4.48v3.72h4.79c2.8-2.58 4.46-6.38 4.46-9.84z" fill="#4285F4"/>
            <path d="M15.36 24c4.01 0 7.38-1.33 9.84-3.6l-4.79-3.72c-1.33.89-3.03 1.41-5.05 1.41-3.88 0-7.17-2.62-8.34-6.14H2.08v3.84A14.87 14.87 0 0015.36 24z" fill="#34A853"/>
            <path d="M7.02 11.95a8.97 8.97 0 010-5.73V2.38H2.08a14.87 14.87 0 000 13.41l4.94-3.84z" fill="#FBBC05"/>
            <path d="M15.36 4.75a8.05 8.05 0 015.69 2.22l4.27-4.27A14.32 14.32 0 0015.36 0 14.87 14.87 0 002.08 8.16l4.94 3.84c1.17-3.52 4.46-6.14 8.34-6.14z" fill="#EA4335"/>
            <text x="33" y="18" fontFamily="Arial" fontSize="22" fill="#5f6368" fontWeight="400">oogle</text>
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#5f6368" }}>{email}</span>
          <div style={styles.avatar}>{name[0]?.toUpperCase()}</div>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.bigAvatar}>{name[0]?.toUpperCase()}</div>
          <h2 style={{ fontSize: 24, fontWeight: 400, margin: "16px 0 4px" }}>
            您好，{name}！
          </h2>
          <p style={{ fontSize: 16, color: "#5f6368", margin: "0 0 24px" }}>{email}</p>
          <div style={styles.infoBadge}>✅ 已成功登入</div>
          <button onClick={async () => { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }); router.push("/"); }} style={styles.logoutBtn}>
            登出
          </button>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #e8eaed" },
  avatar: { width: 32, height: 32, background: "#1a73e8", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 },
  main: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  card: { textAlign: "center", padding: 48, border: "1px solid #dadce0", borderRadius: 8, minWidth: 360 },
  bigAvatar: { width: 80, height: 80, background: "#1a73e8", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 600, margin: "0 auto" },
  infoBadge: { display: "inline-block", background: "#e6f4ea", color: "#137333", borderRadius: 4, padding: "8px 16px", fontSize: 14, marginBottom: 24 },
  logoutBtn: { display: "block", width: "100%", padding: "10px", background: "#fff", border: "1px solid #dadce0", borderRadius: 4, fontSize: 14, color: "#1a73e8", cursor: "pointer", fontWeight: 500 },
};
