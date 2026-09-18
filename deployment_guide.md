# 部署指南

本文说明如何把多模态 AI 面试系统部署到开发机或生产环境。生产部署建议把四个服务分别构建，并由反向代理统一暴露 HTTPS 入口。

## 服务拓扑

```text
浏览器 → interview-web (Vue, 3000)
       → analysis-api (FastAPI, 8000)
       → rtc-demo/Server (Koa, 3001)
       → rtc-demo (React RTC 客户端, 3002)
```

开发环境的默认端口和启动命令见根目录 [README.md](README.md)。

## 生产环境准备

- Node.js 18 LTS 或更高版本
- Python 3.9–3.11
- 可用的 RTC、星火和 Coze 服务账号
- HTTPS 证书；摄像头和麦克风在非 localhost 场景下通常要求 HTTPS
- 反向代理（Nginx、Caddy 或云负载均衡）

## 配置密钥

1. 复制 `analysis-api/.env.example` 为服务器上的 `.env`，填写 `SPARK_APP_ID`、`SPARK_API_KEY` 和 `SPARK_API_SECRET`。
2. 复制并修改 `rtc-demo/Server/scenes/Custom.json`，填写火山引擎的账号、RTC AppId/AppKey 和场景参数。
3. 复制 `interview-web/.env.example` 为 `.env.local`，填写前端需要的 API 地址；Coze PAT 和 Firebase 参数按功能需要配置。
4. 为配置文件设置仅服务账号可读的权限，不要将它们放进 Git 或构建产物。

## 构建与启动

```bash
# FastAPI
cd analysis-api
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Vue 面试应用
cd ../interview-web
npm install
npm run build
# 将 dist/ 交给 Nginx 或其它静态文件服务器

# RTC React 客户端
cd ../rtc-demo
npm install
npm run build

# RTC 代理
cd Server
npm install --omit=dev
npm start
```

## 反向代理建议

- 将 `/api/` 转发到 FastAPI 8000，或在 `VUE_APP_API_BASE_URL` 中使用完整 API 地址。
- 将 RTC 请求转发到 Koa 3001，并在 `VUE_APP_RTC_PROXY_HOST` 中保持一致。
- 对 WebSocket 请求启用 `Upgrade` 和 `Connection` 头。
- 只开放必要端口；数据库、分析服务和代理服务不要直接暴露到公网。

## 验证清单

- `GET /health` 返回成功状态。
- `GET /docs` 可以打开 FastAPI 文档。
- 面试应用可以加载领域、岗位和问题。
- 真实账号配置完成后，RTC 可以加入房间并显示字幕。
- 未配置第三方密钥时，静态分析模式仍可生成演示报告。

## 安全与运维

不要使用仓库历史中出现过的密钥；如果旧密钥曾经被提交或分享，先撤销再部署。生产环境建议使用云密钥管理服务、HTTPS、日志脱敏和定期依赖更新。