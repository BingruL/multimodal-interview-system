# analysis-api 排障

## 服务是否启动

```powershell
Invoke-WebRequest http://localhost:8000/health
```

如果无法连接，确认已进入 `analysis-api` 目录，并运行：

```powershell
python -m uvicorn main:app --reload --port 8000
```

## 端口被占用

```powershell
netstat -ano | findstr :8000
taskkill /PID <进程ID> /F
```

## 星火请求失败

确认 `.env` 中三项凭据都已填写，并检查 `SPARK_DOMAIN` 与 `SPARK_URL` 匹配。没有凭据时，前端请求应使用静态分析模式。

## 跨域错误

开发环境从 `http://localhost:3000` 访问 API；如果修改端口，请同步修改前端 `VUE_APP_API_BASE_URL` 和后端 CORS 配置。