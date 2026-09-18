# 多模态 AI 面试系统

这是一个由 Vue 面试应用、FastAPI 分析服务和实时音视频（RTC）服务组成的多模态面试系统。候选人可以完成语音面试，查看实时字幕，并获得基于文本、语音和视频信号的结构化反馈。

## 项目结构

```text
analysis-api/       FastAPI 分析服务，端口 8000
interview-web/      Vue 3 面试应用，端口 3000
rtc-demo/           React RTC 客户端 + Node/Koa 代理
  Server/           RTC 代理服务，端口 3001
  (client)          RTC React 客户端，建议端口 3002
tools/              调试、验证和回归脚本
```

## 环境要求

- Node.js 18 或更高版本，npm 9 或更高版本
- Python 3.9–3.11
- 摄像头和麦克风（使用实时面试功能时）
- 火山引擎 RTC、讯飞星火或 Coze 的账号配置（按需启用）

## 快速启动（Windows PowerShell）

首次使用时分别安装三个 Node.js 服务和一个 Python 服务的依赖：

```powershell
cd analysis-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env

cd ..\interview-web
npm install
Copy-Item .env.example .env.local

cd ..\rtc-demo\Server
npm install

cd ..
npm install
```

在 `analysis-api/.env` 中填写星火配置，在 `rtc-demo/Server/scenes/Custom.json` 中填写 RTC/火山引擎配置。`interview-web/.env.local` 中的 Coze PAT 和 Firebase 配置均为可选项；所有密钥只保存在本地环境文件中。

打开四个终端，按下面顺序启动：

```powershell
# 终端 1：分析 API
cd analysis-api
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000

# 终端 2：RTC 代理
cd rtc-demo\Server
npm run dev

# 终端 3：RTC React 客户端
cd rtc-demo
$env:PORT=3002
npm run start

# 终端 4：Vue 面试应用
cd interview-web
npm run start
```

启动后可访问：

- 面试应用：<http://localhost:3000>
- RTC 代理：<http://localhost:3001>
- RTC 客户端：<http://localhost:3002>
- FastAPI 文档：<http://localhost:8000/docs>
- API 健康检查：<http://localhost:8000/health>

## API 能力

分析服务提供领域与岗位查询、面试记录分析和多模态分析接口：

- `GET /domains`
- `GET /roles/{domain}`
- `GET /questions/{domain}/{role}`
- `POST /analyze-interview`
- `POST /analyze-multimodal`

未配置星火凭据时，可以把 `useStaticData` 设为 `true` 使用内置演示数据；这样可以先验证前后端联调和报告页面。

## 测试与构建

```powershell
cd analysis-api
.\.venv\Scripts\Activate.ps1
pytest -q

cd ..\interview-web
npm run lint
npm run build

cd ..\rtc-demo
npm run build
```

## 安全说明

仓库中的配置文件只保留占位符。不要提交 `.env`、`.env.local`、真实 RTC 场景文件、Coze PAT 或星火密钥。如果这些凭据曾经出现在旧版本或聊天记录中，请在对应平台撤销并重新生成。

## 许可证

各子项目沿用其原始许可证；RTC 示例使用 BSD-3-Clause。发布前请同时检查第三方依赖和素材的许可证要求。