# Contributing to The B4DM4N Cipher Workbench

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** with clear, focused commits
3. **Write/update tests** for any new functionality
4. **Ensure all tests pass** and linting is clean
5. **Submit a Pull Request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/b4dm4n-cipher-workbench.git
cd b4dm4n-cipher-workbench

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install pre-commit hooks (optional)
pip install pre-commit
pre-commit install
```

### Running the Application

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Pull model (first time only)
ollama pull llama3:latest

# Terminal 3: Run app with hot reload
uvicorn app.main:app --reload --port 8000
```

### Running Tests

```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=term-missing

# Specific test file
pytest tests/test_crypto.py -v
```

## Code Style

### Python
- **Formatter**: `black` (line length 100)
- **Linter**: `ruff` (replaces flake8, isort, etc.)
- **Type Checking**: `mypy --strict`
- **Import Sorting**: `isort` (handled by ruff)

```bash
# Format code
black .

# Lint
ruff check .

# Type check
mypy app/
```

### JavaScript
- **ES6+** vanilla (no bundler)
- **Style**: 2-space indent, semicolons, single quotes
- **Lint**: `eslint` (optional, not currently configured)

### Templates (Jinja2)
- 2-space indent
- Use `{% raw %}` blocks for inline JavaScript
- Keep logic minimal — prefer passing computed data from Python

### General
- **Commit Messages**: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `test:`, `refactor:`)
- **Branch Names**: `feature/description`, `fix/description`, `docs/description`

## Testing

### Test Structure

```
tests/
├── test_crypto.py    # Unit tests for crypto functions (18 tests)
└── test_api.py       # Integration tests for API endpoints (6 tests)
```

### Writing Tests

- **Unit tests**: Test individual functions in isolation
- **Integration tests**: Test API endpoints via FastAPI TestClient
- **Naming**: `test_<function>_<scenario>` (e.g., `test_vigenere_decrypt_known_pair`)
- **Async tests**: Use `@pytest.mark.asyncio` for async functions

### Test Requirements

- All new code must have tests
- Maintain >90% coverage for new modules
- Tests must be deterministic (no external dependencies)
- Mock Ollama calls in tests

## Pull Request Process

1. **Create a focused PR** — one logical change per PR
2. **Update documentation** — README, docstrings, comments as needed
3. **Add tests** — new functionality requires tests
4. **Run the full test suite** — `pytest tests/ -v` must pass
5. **Run linting** — `ruff check . && black --check . && mypy app/` must pass
6. **Request review** — tag maintainers
7. **Address feedback** — respond to all review comments
8. **Merge** — squash and merge after approval

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] `ruff check .` passes
- [ ] `black --check .` passes
- [ ] `mypy app/` passes
- [ ] `pytest tests/ -v` passes
- [ ] No breaking changes without major version bump
- [ ] CHANGELOG.md updated (for non-trivial changes)

## Reporting Issues

### Bug Reports

Use the bug report template with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment (Python version, OS, Ollama version)
- Screenshots/logs if applicable

### Feature Requests

Use the feature request template with:
- Problem statement
- Proposed solution
- Alternatives considered
- Use cases

### Security Issues

**Do not file public issues for security vulnerabilities.** See [SECURITY.md](SECURITY.md) for responsible disclosure.

## Architecture Overview

### Adding New Ciphers

1. Add entry to `app/data/ciphers.py` with `CipherDict` type
2. Include `pdf_path` for source text PDF (place in `static/pdfs/`)
3. Test appears in cipher selector automatically

### Adding New Crypto Functions

1. Implement in `app/services/crypto.py`
2. Add type hints and docstring
3. Add unit tests in `tests/test_crypto.py`
4. Expose via new endpoint in `app/routes/api.py`
5. Add integration tests in `tests/test_api.py`
6. Update frontend in `static/js/main.js` if needed

### Adding New Gematria Schemas

1. Add values to `GEMATRIA_VALUES` in `app/services/constants.py`
2. Add unit test in `tests/test_crypto.py`
3. Update schema dropdown in `templates/components/analysis_dashboard.html`

### Modifying AI Prompts

Edit the prompt builder functions in `app/services/ollama.py`:
- `build_vigenere_prompt()`
- `build_esoteric_prompt()`
- `build_puzzle_prompt()`

## Questions?

Open a [Discussion](https://github.com/WilliamMajanja/b4dm4n-cipher-workbench/discussions) or check existing [Issues](https://github.com/WilliamMajanja/b4dm4n-cipher-workbench/issues).