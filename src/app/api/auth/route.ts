import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, checkPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { action, email, password } = await req.json();

  if (action === "check-email") {
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "請輸入有效的電子郵件地址" }, { status: 400 });
    }
    if (!checkUserExists(email)) {
      return NextResponse.json({ error: "找不到這個 Google 帳戶" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "login") {
    if (!email || !password) {
      return NextResponse.json({ error: "請輸入電子郵件與密碼" }, { status: 400 });
    }
    if (!checkPassword(email, password)) {
      return NextResponse.json({ error: "密碼錯誤，請再試一次" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, email });
    res.cookies.set("auth_email", email, { httpOnly: true, path: "/", sameSite: "lax" });
    return res;
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("auth_email");
    return res;
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 });
}
