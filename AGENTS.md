# Repository Guidelines

## Project Structure & Module Organization
- `rtc-demo/`: React + TypeScript RTC demo (`src/`, `public/`) and Node/Koa gateway in `Server/`.
- `interview-web/`: Vue 3 interview application (`src/components`, `src/hooks`, `src/utils`, `src/assets`).
- `analysis-api/`: FastAPI analysis service (`main.py`, `spark_analyzer.py`, `multimodal_analyzer.py`, `static_analysis_data.py`).
- Root-level docs (`README.md`, `deployment_guide.md`) describe multi-service startup and deployment.

## Build, Test, and Development Commands
- `cd rtc-demo && npm run dev`: run RTC React frontend (default `:3002`).
- `cd rtc-demo/Server && npm run dev`: run Koa proxy server (default `:3001`).
- `cd "interview-web" && npm run start`: run Vue interview app (default `:3000`).
- `cd "analysis-api" && python -m uvicorn main:app --reload --port 8000`: run FastAPI backend.
- `cd rtc-demo && npm run eslint && npm run stylelint && npm run prettier`: apply frontend lint/format checks.
- `cd "analysis-api" && pytest -q`: run backend tests.

## Coding Style & Naming Conventions
- JavaScript/TypeScript follows repo config: 2-space indentation, semicolons, single quotes, max line length 100 (`rtc-demo/.prettierrc`).
- Keep React/Vue component files in PascalCase (for example, `RealtimeInterview.vue`), utilities in camelCase, constants in UPPER_SNAKE_CASE.
- Python uses PEP 8 conventions with 4-space indentation and type hints for request models and service functions.
- Keep API route handlers thin; place analysis/business logic in dedicated analyzer modules.

## Testing Guidelines
- Backend tests use `pytest`/`pytest-asyncio`; place new tests under `analysis-api/` as `test_*.py`.
- React test entrypoint is `cd rtc-demo && npm test` (CRACO/Jest).
- Vue app currently relies on lint + manual verification; validate core flows (RTC join, interview flow, report rendering) for UI changes.

## Commit & Pull Request Guidelines
- No `.git` history is available in this workspace snapshot; use Conventional Commit style: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`.
- Keep commits scoped by service to simplify rollback and review.
- PRs should include: change summary, impacted directories, commands run locally, and screenshots/GIFs for UI updates.

## Security & Configuration Tips
- Do not commit API secrets (Spark, RTC, or cloud credentials); use environment variables or ignored local config files.
- If you change service ports (`3000`, `3001`, `3002`, `8000`) or startup order, update `README.md` accordingly.
