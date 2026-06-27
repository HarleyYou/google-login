# Google Login — 前端 (Next.js)

仿 Google 登入 UI，使用 Next.js 16 + TypeScript 實作。

## 技術

- **框架**：Next.js 16 / React 19
- **語言**：TypeScript
- **後端 API**：Spring Boot（需另行啟動，見 `google-login-api/`）

## 本機開發

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`

> 後端預設為 `http://localhost:8080`，可透過環境變數覆寫：
> ```bash
> NEXT_PUBLIC_API_URL=http://your-api-host npm run dev
> ```

## 登入流程

```
① / (輸入 Email)  →  ② /password (輸入密碼)  →  ③ /home (登入成功)
```

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://your-api-host:8080 \
  -t google-login-frontend .

docker run -p 3000:3000 google-login-frontend
```

## Kubernetes 部署

```yaml
# 在 Deployment 的 env 設定 API URL
env:
  - name: NEXT_PUBLIC_API_URL
    value: "http://google-login-api-service:8080"
```

> `NEXT_PUBLIC_API_URL` 在 build 時注入，部署前請確認此值正確。
