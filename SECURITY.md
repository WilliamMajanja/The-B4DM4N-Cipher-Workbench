# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Yes             |
| < 2.0   | ❌ No              |

Only the latest major version receives security updates. Please upgrade to the latest version to ensure you have the latest security patches.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to **william.majanja@example.com** with the subject line "[SECURITY] B4DM4N Cipher Workbench".

Include the following information:
- Type of vulnerability (e.g., XSS, CSRF, injection, authentication bypass)
- Full description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if known)

We will acknowledge receipt within 48 hours and provide a timeline for resolution.

## Security Features

### Application Security

- **Content Security Policy (CSP)**: Restricts script/style sources to self + approved CDNs (Tailwind, Chart.js) + localhost Ollama
- **Trusted Host Middleware**: Validates Host header against configured allowed hosts
- **CORS Policy**: Restricted to localhost by default, configurable via `.env`
- **Request Body Size Limit**: 1MB maximum to prevent DoS
- **Input Validation**: All API endpoints use Pydantic models with strict length limits
- **No External API Keys**: Local Ollama inference — no cloud credentials stored

### Network Security

- **HTTPS in Production**: Configure reverse proxy (nginx/Traefik) with TLS
- **Ollama Isolation**: Runs in separate container with no external network access
- **No Database**: Stateless design — no persistent storage attack surface

### Dependencies

- **Pinned Versions**: All dependencies pinned in `requirements.txt`
- **Vulnerability Scanning**: Run `pip-audit` regularly
- **Minimal Attack Surface**: Only 7 runtime dependencies (FastAPI, Uvicorn, Pydantic, Pydantic-Settings, HTTPX, Jinja2, Python-Multipart)

## Secure Deployment Checklist

- [ ] Change `SECRET_KEY` in `.env` to a strong random value
- [ ] Set `TRUSTED_HOSTS` to your production domain(s)
- [ ] Configure `CORS_ORIGINS` for your frontend domain only
- [ ] Enable HTTPS via reverse proxy with valid TLS certificates
- [ ] Run Ollama on separate host/network if possible
- [ ] Set resource limits (CPU/memory) in Docker Compose
- [ ] Enable logging and monitoring
- [ ] Regularly run `pip-audit` and update dependencies
- [ ] Review CSP headers for your deployment

## Known Security Considerations

### Ollama Local Inference
The application connects to Ollama at `http://localhost:11434` (or configured `OLLAMA_BASE_URL`). Ensure:
- Ollama is not exposed to the public internet
- Network policies restrict access to the Ollama port
- Model pulls are done during build/deploy, not at runtime

### CSP and External Resources
The CSP allows:
- `self` — same origin
- `https://cdn.tailwindcss.com` — Tailwind CSS
- `https://cdn.jsdelivr.net` — Chart.js
- `http://localhost:11434` — Ollama API

If deploying to a different domain, update the CSP in `app/main.py` accordingly.

### Rate Limiting
The application includes basic rate limiting configuration via environment variables. For production, consider adding a dedicated rate limiter (e.g., `slowapi` with Redis) for distributed deployments.

## Security Updates

Security patches will be released as patch versions (2.0.1, 2.0.2, etc.). Subscribe to GitHub releases or the repository's security advisories for notifications.

## Attribution

This security policy is inspired by GitHub's security policy template and the OpenSSF best practices.