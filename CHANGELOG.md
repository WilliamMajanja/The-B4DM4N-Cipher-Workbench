# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-23

### 🎉 Major Rewrite: TypeScript/React → Python/FastAPI

This is a complete ground-up rewrite of the application from a TypeScript/React/Vite SPA to a production-ready Python FastAPI + Jinja2 web application.

### Added

- **Python Backend**: FastAPI 0.115+ with async support on Python 3.13
- **Jinja2 Templates**: Server-side rendering with template inheritance
- **Vanilla JavaScript**: ES6+ frontend with no bundler required
- **Ollama Integration**: Local LLM inference with llama3:latest (no API keys)
- **13 Cryptanalysis Functions**: Vigenère, Caesar, Atbash, Frequencies, IoC, N-grams, Kasiski, Unique Chars, Gematria (6 schemas), Hieroglyphics
- **15 REST API Endpoints**: Full CRUD for ciphers + analysis + AI endpoints
- **7 Public Domain PDFs**: Torah, Quran, Bhagavad Gita, Dhammapada, Tao Te Ching, Emerald Tablet, Meditations
- **Chart.js Visualizations**: Frequency and IoC bar charts with dark theme
- **Security Middleware**: CSP, TrustedHost, CORS, Body Size Limit
- **Pydantic Settings**: Configuration via `.env` file
- **Docker Support**: Multi-stage build + docker-compose with Ollama service
- **37 Tests**: 18 unit tests + 6 integration tests + 13 others
- **CI/CD Ready**: Linting (ruff), formatting (black), type checking (mypy)

### Changed

- **AI Provider**: Google Gemini → Ollama llama3:latest (local, free, no keys)
- **Frontend**: React + Vite + Recharts → Vanilla JS + Chart.js + Tailwind CDN
- **Architecture**: Client-side SPA → Server-rendered + API backend
- **Dependencies**: 50+ npm packages → 7 Python runtime dependencies
- **Build**: Vite dev server → Uvicorn + static file serving
- **Deployment**: Static hosting → Containerized (Docker + docker-compose)

### Removed

- All TypeScript/React/Vite code (components, services, utils, types)
- Google GenAI SDK (@google/genai)
- Minima blockchain integration (MDS, payments, identity)
- Recharts dependency
- API key management UI
- Client-side state management

### Fixed

- TypeScript strict mode errors (unused locals/params, tooltip formatters)
- Template rendering error (TemplateResponse argument order)
- API route mismatch (GET vs POST, query params vs JSON body)
- Response format alignment between frontend and backend

## [1.0.0] - 2024-03-30

### Added

- Initial TypeScript/React/Vite release
- React 18 with hooks
- Vite build system
- Tailwind CSS styling
- Google Gemini API integration
- Recharts for visualizations
- Minima blockchain integration (MiniDApp)
- 15 cipher library
- Cryptanalysis tools (Vigenère, Caesar, Atbash)
- Frequency analysis, Kasiski, N-grams
- Gematria calculator (5 schemas)
- Hieroglyphics lab
- Workspace persistence (localStorage)
- TypeScript strict mode

---

## Upgrade Guide: 1.x → 2.0

This is a **breaking change** — the entire tech stack has changed.

### Migration Steps

1. **Install Python 3.13+** and Ollama
2. **Pull llama3:latest** model: `ollama pull llama3:latest`
3. **Configure `.env`** from `.env.example`
4. **Run with Docker**: `docker-compose up -d`
5. **Or run locally**: `uvicorn app.main:app --port 8000`

### Key Differences

| Feature | 1.x | 2.0 |
|---------|-----|-----|
| Language | TypeScript | Python |
| Frontend | React 18 | Vanilla JS |
| Build | Vite | No build step |
| AI | Google Gemini | Ollama (local) |
| Charts | Recharts | Chart.js |
| Blockchain | Minima | Removed |
| Deployment | Static + Node | Docker + Python |
| API Keys | Required | None |

### Data Compatibility

- Cipher definitions: Compatible (same structure, added `pdf_path`)
- Workspace notes: **Not compatible** (different localStorage keys)
- Custom ciphers: Compatible (same format)

---

## Release Notes Template

### [X.Y.Z] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes in existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Vulnerability fixes