// 模擬用戶資料庫
export const USERS: Record<string, string> = {
  "user@gmail.com": "password123",
  "test@gmail.com": "test1234",
};

export function checkUserExists(email: string): boolean {
  return email in USERS;
}

export function checkPassword(email: string, password: string): boolean {
  return USERS[email] === password;
}
