# RTC 代理服务

该目录提供 RTC 场景配置和 Node/Koa 代理服务。服务启动时会读取 `scenes/*.json`，并通过接口返回可用场景。

## 运行

```powershell
npm install
npm run dev
```

默认监听 <http://localhost:3001>。启动前请在 `scenes/Custom.json` 中填入真实火山引擎配置；仓库中的文件只包含占位符。

前端通过 `GET /get_scenes` 获取场景，并通过其它接口创建或结束 AI RTC 任务。真实凭据不要提交到 Git。