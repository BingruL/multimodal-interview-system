# 项目使用说明

根目录 [README.md](README.md) 是当前唯一的启动入口。本文件保留中文交接要点，适合第一次接手项目时快速查阅。

## 服务和端口

| 服务 | 目录 | 默认端口 |
| --- | --- | ---: |
| Vue 面试应用 | `interview-web` | 3000 |
| RTC 代理 | `rtc-demo/Server` | 3001 |
| RTC React 客户端 | `rtc-demo` | 3002 |
| FastAPI 分析服务 | `analysis-api` | 8000 |

## 推荐启动顺序

1. 在 `analysis-api` 创建虚拟环境并安装 `requirements.txt`。
2. 复制 `.env.example` 为 `.env`，填写星火密钥（没有密钥时可使用静态分析数据）。
3. 在 `rtc-demo/Server/scenes/Custom.json` 填写火山引擎配置；占位符不能用于真实 RTC 通话。
4. 分别启动分析 API、RTC 代理、RTC 客户端和 Vue 面试应用。
5. 打开 <http://localhost:3000>，选择领域和岗位后开始面试。

完整命令、环境变量和构建方式请以根目录 README 为准。

## 常见排查

- 页面无法获取领域：确认 `analysis-api` 正在监听 8000，且浏览器没有拦截跨域请求。
- RTC 连接失败：确认代理监听 3001，并检查 `Custom.json` 中的 AppId、AppKey、Token 是否有效。
- 星火分析失败：确认 `.env` 中的 `SPARK_APP_ID`、`SPARK_API_KEY`、`SPARK_API_SECRET` 已填写；也可以先使用静态分析模式。
- 摄像头或麦克风不可用：检查浏览器权限，并使用 HTTPS 或 localhost 打开页面。