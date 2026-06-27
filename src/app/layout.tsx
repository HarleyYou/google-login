import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入 - Google 帳戶",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, fontFamily: "'Google Sans', Roboto, Arial, sans-serif", background: "#fff", color: "#202124" }}>
        {children}
      </body>
    </html>
  );
}
