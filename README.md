# Multimodal AI Interview System

**English** | [简体中文](README.zh-CN.md)

A multimodal interview system built with a Vue interview application, a FastAPI analysis service, and real-time communication (RTC) services. Candidates can practice voice interviews, follow live subtitles, and receive structured feedback based on text, audio, and video signals.

## Project Structure

```text
analysis-api/       FastAPI analysis service, port 8000
interview-web/      Vue 3 interview application, port 3000
rtc-demo/           React RTC client and Node/Koa proxy
  Server/           RTC proxy service, port 3001
  (client)          React RTC client, recommended port 3002
tools/              Debugging, verification, and regression scripts
```

## Requirements

- Node.js 18 or later and npm 9 or later
- Python 3.9–3.11
- A camera and microphone for real-time interviews
- Account credentials for Volcengine RTC, iFlytek Spark, or Coze, depending on the features you enable

## Quick Start (Windows PowerShell)

Install the dependencies for the three Node.js services and the Python service:

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

Configure Spark credentials in `analysis-api/.env` and RTC/Volcengine settings in `rtc-demo/Server/scenes/Custom.json`. The Coze PAT and Firebase settings in `interview-web/.env.local` are optional. Keep credentials in local configuration files and out of Git.

Open four terminals, each starting from the repository root, and launch the services in this order:

```powershell
# Terminal 1: Analysis API
cd analysis-api
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000

# Terminal 2: RTC proxy
cd rtc-demo\Server
npm run dev

# Terminal 3: React RTC client
cd rtc-demo
$env:PORT=3002
npm run start

# Terminal 4: Vue interview application
cd interview-web
npm run start
```

Once the services are running, open:

- Interview application: <http://localhost:3000>
- RTC proxy: <http://localhost:3001>
- RTC client: <http://localhost:3002>
- FastAPI documentation: <http://localhost:8000/docs>
- API health check: <http://localhost:8000/health>

## API Features

The analysis service provides domain and role lookup, interview transcript analysis, and multimodal analysis:

- `GET /domains`
- `GET /roles/{domain}`
- `GET /questions/{domain}/{role}`
- `POST /analyze-interview`
- `POST /analyze-multimodal`

If Spark credentials are not configured, set `useStaticData` to `true` to use the built-in demo data. This lets you check frontend/backend integration and report rendering before connecting the live service.

## Testing and Building

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

## Security

Configuration files in this repository contain placeholders only. Do not commit `.env`, `.env.local`, RTC scene files containing real credentials, Coze PATs, or Spark keys. If credentials have appeared in previous versions or shared conversations, revoke them and generate replacements on the relevant platform.

## License

Each subproject retains its original license; the RTC demo uses BSD-3-Clause. Review the licenses of third-party dependencies and assets before redistribution.
