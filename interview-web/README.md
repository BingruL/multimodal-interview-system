# interview-web

`interview-web` 是 Vue 3 面试前端，负责登录、岗位选择、实时面试、字幕和报告展示。

## 运行

```powershell
npm install
Copy-Item .env.example .env.local
npm run start
```

默认地址为 <http://localhost:3000>。分析 API 默认使用 `http://localhost:8000`，RTC 代理默认使用 `http://localhost:3001`，可以在 `.env.local` 中覆盖。

## 构建与检查

```powershell
npm run lint
npm run build
```

Coze PAT、Firebase 配置和其它令牌只能放在 `.env.local`，不要直接写入 `src/`。