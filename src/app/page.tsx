"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLogo from "./GoogleLogo";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!email.trim()) { setError("請輸入電子郵件地址或電話號碼"); return; }
    setLoading(true);
    setError("");
    try {
      const { res, data } = await apiFetch("/api/auth/check-email", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { setError(data.error ?? "發生錯誤，請稍後再試"); return; }
      router.push(`/password?email=${encodeURIComponent(email)}`);
    } catch {
      setError("無法連線到伺服器，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* 左側：Logo + 標題 */}
        <div style={styles.left}>
          <GoogleLogo />
          <h1 style={styles.title}>登入</h1>
          <p style={styles.subtitle}>使用你的 Google 帳戶</p>
        </div>

        {/* 右側：輸入欄位 + 按鈕 */}
        <div style={styles.right}>
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

          <a href="#" style={styles.forgotLink}>忘記電子郵件地址？</a>

          <div style={styles.btnRow}>
            <a href="#" style={styles.createBtn}>建立帳戶</a>
            <button onClick={handleNext} disabled={loading} style={styles.nextBtn}>
              {loading ? "..." : "下一步"}
            </button>
          </div>
        </div>
      </div>

      {/* 頁尾 */}
      <footer style={styles.footer}>
        <span style={styles.footerLang}>繁體中文 ▾</span>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>說明</a>
          <a href="#" style={styles.footerLink}>隱私權設定</a>
          <a href="#" style={styles.footerLink}>條款</a>
        </div>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#EEF2FF" },
  card: { display: "flex", flexDirection: "row", gap: 48, background: "#fff", borderRadius: 16, padding: "48px 48px 40px", width: 740, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
  left: { flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 8 },
  title: { fontSize: 32, fontWeight: 400, margin: "16px 0 4px", color: "#1f1f1f" },
  subtitle: { fontSize: 15, color: "#444746", margin: 0 },
  right: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 },
  inputWrap: { display: "flex", flexDirection: "column" },
  input: { padding: "14px 16px", fontSize: 16, border: "1px solid #dadce0", borderRadius: 8, outline: "none", boxSizing: "border-box", background: "#fff" },
  error: { fontSize: 12, color: "#d93025", margin: "4px 0 0" },
  forgotLink: { fontSize: 14, color: "#4338CA", textDecoration: "none", fontWeight: 500 },
  btnRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 },
  createBtn: { fontSize: 14, color: "#4338CA", textDecoration: "none", fontWeight: 500 },
  nextBtn: { background: "#4338CA", color: "#fff", border: "none", borderRadius: 24, padding: "12px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", width: 740, marginTop: 24, padding: "0 4px" },
  footerLang: { fontSize: 13, color: "#444746", cursor: "pointer" },
  footerLinks: { display: "flex", gap: 24 },
  footerLink: { fontSize: 13, color: "#444746", textDecoration: "none" },
};
