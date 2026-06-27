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

- `/home` 進入時自動呼叫 `/api/auth/me` 驗證 session，無效則跳回 `/`
- 所有 API 呼叫包含 try-catch，網路錯誤時顯示友善提示

## 專案結構

```
├── src/
│   ├── app/
│   │   ├── page.tsx           # ① 輸入 Email 頁
│   │   ├── password/
│   │   │   └── page.tsx       # ② 輸入密碼頁
│   │   ├── home/
│   │   │   └── page.tsx       # ③ 登入成功頁
│   │   └── GoogleLogo.tsx
│   └── lib/
│       └── api.ts             # 共用 fetch 工具（API_URL 常數、統一錯誤處理）
├── deploy/
│   └── k8s/
│       ├── deployment.yaml    # k8s Deployment（2 replicas、probe）
│       └── service.yaml       # k8s ClusterIP Service
└── .gitlab-ci.yml             # GitLab CI/CD Pipeline
```

## 安全機制

| 項目 | 實作 |
|---|---|
| 安全 Headers | X-Frame-Options、CSP、X-Content-Type-Options、Referrer-Policy（next.config.ts）|
| API 呼叫 | `credentials: include`，統一錯誤處理 |
| Docker | non-root user（appuser）執行 |

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://your-api-host:8080 \
  -t google-login-frontend .

docker run -p 3000:3000 google-login-frontend
```

> ⚠️ `NEXT_PUBLIC_API_URL` 在 **build 時**注入 JS bundle，多環境需各自 build image。

## Kubernetes 部署

```yaml
env:
  - name: NEXT_PUBLIC_API_URL
    value: "http://google-login-api-service:8080"
```

## GitLab CI/CD

### Pipeline 流程
```
push to main
    ↓
[build] docker build → push to GitLab Registry
    ↓
[deploy] kubectl apply → kubectl set image → rollout status
```

### 需設定的 CI Variables

| 變數 | 說明 |
|---|---|
| `KUBE_CONFIG` | base64 編碼的 kubeconfig |
| `KUBE_NAMESPACE` | 部署的 k8s namespace |
| `NEXT_PUBLIC_API_URL` | API 的完整 URL（build 時注入）|

> 部署前請將 `deploy/k8s/deployment.yaml` 中的 `registry.gitlab.com/YOUR_GROUP/...` 換成實際路徑。

## 已知限制（學習 / Demo 用途）

- `NEXT_PUBLIC_API_URL` build-time baked，正式多環境部署需為每個環境各自 build
- 無資料庫，用戶資料存在後端記憶體
- CSP 中 `connect-src` 僅允許 `localhost:8080`，正式環境需更新
