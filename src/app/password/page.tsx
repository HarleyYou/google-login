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
      router.push(`/home`);
    } catch {
      setError("無法連線到伺服器，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <GoogleLogo />
        </div>
        <h1 style={styles.title}>歡迎使用</h1>

        {/* 帳號 pill */}
        <div style={styles.emailPill} onClick={() => router.push("/")}>
          <span style={styles.avatar}>{email[0]?.toUpperCase()}</span>
          <span style={{ fontSize: 14 }}>{email}</span>
          <span style={{ marginLeft: 6, fontSize: 12, color: "#5f6368" }}>▾</span>
        </div>

        <div style={{ marginTop: 24 }}>
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

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5f6368", marginTop: 12, cursor: "pointer" }}>
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
            顯示密碼
          </label>

          <div style={styles.btnRow}>
            <a href="#" style={styles.linkBtn}>忘記密碼？</a>
            <button onClick={handleLogin} disabled={loading} style={styles.nextBtn}>
              {loading ? "..." : "下一步"}
            </button>
          </div>
        </div>
      </div>
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
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  card: { width: 400, padding: "48px 40px 36px", border: "1px solid #dadce0", borderRadius: 8 },
  title: { fontSize: 24, fontWeight: 400, margin: "0 0 16px", textAlign: "center" },
  emailPill: { display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #dadce0", borderRadius: 20, padding: "6px 12px", cursor: "pointer", marginLeft: "50%", transform: "translateX(-50%)" },
  avatar: { width: 24, height: 24, background: "#1a73e8", color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 },
  inputWrap: { position: "relative" },
  input: { width: "100%", padding: "13px 15px", fontSize: 16, border: "1px solid #dadce0", borderRadius: 4, outline: "none", boxSizing: "border-box" },
  error: { fontSize: 12, color: "#d93025", margin: "4px 0 0" },
  btnRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 },
  linkBtn: { fontSize: 14, color: "#1a73e8", textDecoration: "none", fontWeight: 500 },
  nextBtn: { background: "#1a73e8", color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
};
