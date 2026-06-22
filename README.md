# The B4DM4N Cipher Workbench

![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Jinja2](https://img.shields.io/badge/Jinja2-B41717?style=for-the-badge&logo=jinja&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

An advanced, all-in-one interactive workbench for analyzing historical ciphers and esoteric texts. This tool combines classical cryptanalysis techniques with AI insights from a local Ollama LLM (llama3:latest) and bundles public domain PDFs of referenced religious/esoteric source texts.

## ✨ Core Features

### 🏛️ Expansive Cipher Library
Analyze a curated list of famous ciphers and esoteric texts:
- **Famous Unsolved**: Kryptos K4 (97 chars)
- **Classical Ciphers**: Kryptos K1/K2, CSA Vicksburg, Bible Atbash (Jeremiah 25:26)
- **Esoteric & Philosophical**: Torah Genesis 1:1-5, Quran Al-Fatiha, Bhagavad Gita 2.47, Dhammapada 5, Tao Te Ching 1, Emerald Tablet, Meditations IV.23
- **Puzzles & Challenges**: Cicada 3301, Rosetta Stone Ptolemy V, Kryptos K3
- **Custom Cipher**: Paste your own text for analysis

### 🛠️ Interactive Solver Suite
- **Vigenère Solver**: Decrypt using a keyword with real-time updates
- **Caesar Solver**: Interactive slider for all 26 rotational shifts
- **Atbash Solver**: One-click decryption for mirror alphabet ciphers

### 🤖 AI-Powered Analysis (Ollama llama3:latest)
- **Context-Aware Insights**: Tailored analysis based on cipher type (Vigenère, Esoteric, Puzzle)
- **AI Keyword Suggestions**: High-probability keyword recommendations for Vigenère ciphers
- **Local Inference**: No API keys required — runs entirely on localhost:11434

### 📈 Professional Cryptanalysis Dashboard (5 Tabs)
1. **Key Length Analysis**: Kasiski Examination + interactive Index of Coincidence (IoC) chart
2. **Frequency Analysis**: Side-by-side ciphertext/plaintext frequency charts vs English norms
3. **N-gram Analysis**: Most frequent digrams and trigrams with percentages
4. **Textual Analysis**: Gematria (6 schemas), Hieroglyphics Lab, Character Set display
5. **AI Analysis**: LLM-powered cryptanalysis with markdown rendering

### 📜 Textual & Esoteric Study Tools
- **Hieroglyphics Lab**: Transliterate names into royal cartouche with Unicode glyphs
- **Multi-Schema Gematria**: Pythagorean, Chaldean, Hebrew, Greek (Isopsephy), Sanskrit (Katapayadi), Latin
- **Character Set Display**: Unique characters with counts from ciphertext
- **Embedded PDFs**: One-click download of all 7 public domain source texts

### 📝 Persistent Workspace
Per-cipher notepad with automatic localStorage persistence for notes and theories.

## 🚀 Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI 0.115+ (async Python 3.13) |
| Templates | Jinja2 with template inheritance |
| Frontend | Vanilla ES6 JavaScript (no bundler) |
| Styling | Tailwind CSS via CDN |
| Charts | Chart.js via CDN |
| AI | Ollama (llama3:latest) via `/api/chat` |
| Testing | pytest + pytest-asyncio (37 tests) |
| Container | Multi-stage Docker + docker-compose |

## 📂 Project Structure

```
├── app/
│   ├── config.py              # Pydantic Settings (.env support)
│   ├── data/
│   │   ├── __init__.py
│   │   └── ciphers.py         # 15 CipherDict entries + pdf_path
│   ├── main.py                # FastAPI app, middleware, routes
│   ├── routes/
│   │   ├── __init__.py
│   │   └── api.py             # 15 REST endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── constants.py       # Alphabets, Gematria schemas, hieroglyphs
│   │   ├── crypto.py          # 13 cryptanalysis functions
│   │   └── ollama.py          # Ollama client + 3 prompt templates
│   └── __init__.py
├── static/
│   ├── css/
│   │   └── style.css          # Scrollbar & utility styles
│   ├── js/
│   │   ├── main.js            # Full app logic, API calls, tabs
│   │   └── charts.js          # Chart.js frequency & IoC bars
│   └── pdfs/                  # 7 public domain source texts
├── templates/
│   ├── base.html              # Layout + Tailwind/Chart.js CDN
│   ├── index.html             # Main page composition
│   └── components/            # 6 partial templates
├── tests/
│   ├── test_crypto.py         # 18 unit tests
│   └── test_api.py            # 6 integration tests
├── Dockerfile                 # Multi-stage python:3.13-slim
├── docker-compose.yml         # App + Ollama services
├── requirements.txt           # Python dependencies
├── .env.example               # Configuration template
└── README.md
```

## 💻 Getting Started: Running Locally

### Prerequisites
- **Python 3.13+**
- **Ollama** with `llama3:latest` model pulled (`ollama pull llama3:latest`)

### 1. Clone the Repository

```bash
git clone https://github.com/WilliamMajanja/b4dm4n-cipher-workbench.git
cd b4dm4n-cipher-workbench
```

### 2. Set Up Python Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment (Optional)

```bash
cp .env.example .env
# Edit .env if needed (defaults work for local dev)
```

### 4. Start Ollama

```bash
ollama serve
# In another terminal:
ollama pull llama3:latest
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload --port 8000
```

The application will be available at **http://localhost:8000**

### 6. Run Tests

```bash
pytest tests/ -v
```

## 🐳 Docker Deployment

### Quick Start

```bash
docker-compose up -d
```

This starts:
- **app**: FastAPI on port 8000
- **ollama**: LLM service on port 11434 (auto-pulls llama3:latest)

### Manual Docker Build

```bash
docker build -t b4dm4n-cipher-workbench .
docker run -p 8000:8000 b4dm4n-cipher-workbench
```

## ⚙️ Configuration (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_VERSION` | `2.0.0` | Application version |
| `SECRET_KEY` | `dev-secret-change-in-production` | Session/CSRF secret |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3:latest` | Model to use |
| `OLLAMA_TIMEOUT` | `60.0` | Request timeout (seconds) |
| `MAX_CIPHERTEXT_LENGTH` | `50000` | Max ciphertext input size |
| `MAX_KEYWORD_LENGTH` | `100` | Max keyword input size |
| `RATE_LIMIT_REQUESTS` | `100` | Requests per window |
| `RATE_LIMIT_WINDOW` | `60` | Rate limit window (seconds) |
| `TRUSTED_HOSTS` | `["localhost","127.0.0.1"]` | Allowed Host headers |

## 🔒 Security Features

- **CSP Headers**: Restricts scripts/styles to self + approved CDNs + Ollama localhost
- **TrustedHost Middleware**: Blocks requests with spoofed Host headers
- **CORS**: Restricted to localhost by default
- **Body Size Limit**: 1MB max request body
- **Input Validation**: Pydantic models with length limits on all endpoints
- **No API Keys**: Local Ollama inference — no external secrets

## 📄 License

This project is licensed under the Creative Commons License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Ollama** for local LLM inference
- **Chart.js** for beautiful frequency/IoC visualizations
- **Tailwind CSS** for utility-first styling
- **FastAPI** for the modern async Python framework
- Public domain texts from Project Gutenberg, Sacred Texts Archive, and other sources