# analysis-api

`analysis-api` 是系统的 Python FastAPI 服务，负责领域/岗位数据、面试记录分析和多模态分析。

## 本地运行

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn main:app --reload --port 8000
```

`.env` 中的变量：

```dotenv
SPARK_APP_ID=
SPARK_API_KEY=
SPARK_API_SECRET=
SPARK_DOMAIN=x1
SPARK_URL=wss://spark-api.xf-yun.com/v1/x1
```

星火变量为空时，接口仍可使用静态演示数据。不要把真实密钥写入 Python 文件或提交到 Git。

## 接口

- `GET /health`
- `GET /domains`
- `GET /roles/{domain}`
- `GET /questions/{domain}/{role}`
- `POST /analyze-interview`
- `POST /analyze-multimodal`
- `GET /docs`

## 测试

```powershell
pytest -q
```

`test_api.py` 覆盖基础接口，`test_spark_analyzer.py` 覆盖分析器的请求构造；需要真实星火服务时再配置凭据。