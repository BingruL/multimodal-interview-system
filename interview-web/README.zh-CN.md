# interview-web

这是系统的 Vue 3 面试前端，包含岗位选择、实时语音面试、字幕、摄像头和分析报告页面。

```powershell
npm install
Copy-Item .env.example .env.local
npm run start
```

默认访问 <http://localhost:3000>。API 和 RTC 地址可通过 `.env.local` 中的 `VUE_APP_API_BASE_URL`、`VUE_APP_RTC_PROXY_HOST` 修改。