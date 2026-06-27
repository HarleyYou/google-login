"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleLogo from "../GoogleLogo";
import { apiFetch } from "@/lib/api";

function PasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password.trim()) { setError("請輸入密碼"); return; }
    setLoading(true);
    setError("");
    try {
      const { res, data } = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { setError(data.error ?? "發生錯誤，請稍後再試"); return; }
      router.push("/home");
    } catch {
      setError("無法連線到伺服器，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* 左側 */}
        <div style={styles.left}>
          <GoogleLogo />
          <h1 style={styles.title}>歡迎使用</h1>
          <div style={styles.emailPill} onClick={() => router.push("/")}>
            <span style={styles.avatarIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </span>
            <span style={{ fontSize: 14, color: "#1f1f1f" }}>{email}</span>
            <span style={{ fontSize: 12, color: "#5f6368" }}>▾</span>
          </div>
        </div>

        {/* 右側 */}
        <div style={styles.right}>
          <div>
            <div style={styles.inputWrap}>
              <input
                type={show ? "text" : "password"}
                placeholder="輸入您的密碼"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{ ...styles.input, borderColor: error ? "#d93025" : "#dadce0" }}
                autoFocus
              />
              {error && <p style={styles.error}>{error}</p>}
            </div>

            <label style={styles.showPwLabel}>
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} style={{ accentColor: "#4338CA" }} />
              顯示密碼
            </label>
          </div>

          <div style={styles.btnRow}>
            <a href="#" style={styles.forgotLink}>忘記密碼？</a>
            <button onClick={handleLogin} disabled={loading} style={styles.nextBtn}>
              {loading ? "..." : "下一步"}
            </button>
          </div>
        </div>
      </div>

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

export default function PasswordPage() {
  return (
    <Suspense>
      <PasswordForm />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#EEF2FF" },
  card: { display: "flex", flexDirection: "row", gap: 48, background: "#fff", borderRadius: 16, padding: "48px 48px 40px", width: 740, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
  left: { flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 16 },
  title: { fontSize: 32, fontWeight: 400, margin: 0, color: "#1f1f1f" },
  emailPill: { display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #dadce0", borderRadius: 20, padding: "6px 12px", cursor: "pointer", width: "fit-content" },
  avatarIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: "#f1f3f4" },
  right: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 },
  inputWrap: { display: "flex", flexDirection: "column" },
  input: { padding: "14px 16px", fontSize: 16, border: "1px solid #dadce0", borderRadius: 8, outline: "none", boxSizing: "border-box", background: "#fff" },
  error: { fontSize: 12, color: "#d93025", margin: "4px 0 0" },
  showPwLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444746", marginTop: 12, cursor: "pointer" },
  btnRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  forgotLink: { fontSize: 14, color: "#4338CA", textDecoration: "none", fontWeight: 500 },
  nextBtn: { background: "#4338CA", color: "#fff", border: "none", borderRadius: 24, padding: "12px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", width: 740, marginTop: 24, padding: "0 4px" },
  footerLang: { fontSize: 13, color: "#444746", cursor: "pointer" },
  footerLinks: { display: "flex", gap: 24 },
  footerLink: { fontSize: 13, color: "#444746", textDecoration: "none" },
};
