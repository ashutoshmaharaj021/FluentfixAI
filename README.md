# FluentFix AI

AI-powered writing workspace for spelling, grammar, and fluency correction.

## Overview

FluentFix AI is a full-stack writing assistant made up of a React workspace and a FastAPI backend. A user pastes or types text into the workspace, picks a correction mode, and the backend runs the text through a spelling corrector, a grammar-correction model, and a fluency checker, returning the result of each stage along with a final corrected version.

## Features

- ✍️ Writing workspace with a live input/output layout
- 🔤 Spelling correction mode
- 📝 Grammar correction mode
- 🌊 Fluency correction mode
- ✨ Combined "Correct AI" (all-in-one) mode
- 🎯 Selected correction mode is highlighted and shown alongside the results
- 📊 Confidence score displayed with each result
- 📋 Copy corrected text to clipboard
- 📄 Export result as TXT
- 🧾 Export result as PDF (generated client-side with jsPDF)
- 🗂️ Create, rename, delete, and switch between multiple documents
- 💾 Autosave with a "Saving… / Saved" status indicator
- 🕘 Document/correction history, stored in the browser
- 🔁 Restoring a previously opened document's content and last result
- ⏳ Loading state while a correction request is in flight
- ⚠️ Basic error handling for failed backend requests

> > All document/history data is persisted in the browser's `localStorage` — there is currently no server-side storage of documents or correction history (see [Known Limitations](#known-limitations)).

## How It Works

1. The user types or pastes text into the **Input Text** panel and selects a correction mode.
2. The frontend sends the text and mode to the backend via `POST /corrections/`.
3. The backend routes the request through a correction pipeline that calls one or more correction services depending on the mode.
4. The response — containing the original text, the output of each stage, the final corrected text, and a confidence score — is returned to the frontend and rendered in the **Corrected Output** panel.
5. The result is saved into the currently open document in `localStorage`.

## Correction Modes

| Mode | Endpoint value | What runs |
|---|---|---|
| Spelling | `spelling` | Spelling correction only |
| Grammar | `grammar` | Grammar correction only |
| Fluency | `fluency` | Fluency correction only |
| Correct AI (all) | `all` (default) | Spelling → Grammar → Fluency, chained |

In "all" mode, each stage's output is fed into the next: the spelling-corrected text is passed to the grammar corrector, and that result is passed to the fluency checker.

### Spelling correction

Implemented with **SymSpell** (`symspellpy`) and **wordfreq**. A dictionary is built at startup from the top 100,000 English words in `wordfreq`, filtered to words with a Zipf frequency ≥ 3.5. For each word in the input, punctuation is stripped and preserved, common words (Zipf frequency ≥ 3.5) are left untouched, and uncommon words are looked up in SymSpell (max edit distance 2) for the closest correction, preserving original capitalization.

### Grammar correction

Implemented with a Hugging Face **transformers** sequence-to-sequence model, `vennify/t5-base-grammar-correction`, run locally via PyTorch (`torch`). The input text is prefixed with `"grammar: "`, tokenized, and passed to `model.generate()` with beam search (4 beams, max length 512).

### Fluency correction

Implemented with **LanguageTool** via the `language_tool_python` package (`en-US` ruleset). The text is checked and corrected using LanguageTool's built-in rule-based corrections.

### Selected mode: frontend → backend

The workspace keeps the selected mode in React state and sends it as the `mode` field in the JSON body of the `POST /corrections/` request. The backend's `CorrectionRequest` schema defaults `mode` to `"all"` if not provided.

### API response contents

The response always includes all four text fields (`original`, `spelling`, `grammar`, `fluency`) plus `corrected` and `confidence` — for single-stage modes, the fields for skipped stages are simply set to the original input text. The backend currently returns a fixed `confidence` value of `0.98` for every request.

## Architecture

```mermaid
flowchart TD
    A[User] --> B[React Frontend - Workspace]
    B -->|POST /corrections/| C[FastAPI Backend]
    C --> D[Correction Endpoint]
    D --> E[Correction Pipeline]
    E --> F[Spelling Service - SymSpell + wordfreq]
    E --> G[Grammar Service - T5 Transformer]
    E --> H[Fluency Service - LanguageTool]
    F --> I[Correction Response]
    G --> I
    H --> I
    I --> B
    B --> J[localStorage - documents & history]
```

## Tech Stack

**Frontend**
| Area | Technology |
|---|---|
| Framework | React 19 (with `react-router-dom` for routing) |
| Build tool | Vite |
| Styling | Tailwind CSS (via `@tailwindcss/vite`) |
| HTTP client | Axios |
| Icons | `lucide-react`, `react-icons` |
| PDF generation | `jsPDF` |
| Other libraries present | `framer-motion`, `react-hot-toast` |

**Backend**
| Area | Technology |
|---|---|
| Language | Python (`>=3.10`; `.python-version` pins `3.10`) |
| Framework | FastAPI |
| ASGI server | Uvicorn (`uvicorn[standard]`) |
| Validation / config | Pydantic + `pydantic-settings` |
| Spelling | `symspellpy`, `wordfreq` |
| Grammar | `transformers`, `torch`, `sentencepiece`, `accelerate` |
| Fluency | `language-tool-python` |
| Database layer | SQLAlchemy (async), `asyncpg`, `psycopg[binary]`, `alembic` |
| Dependency management | `uv` (`pyproject.toml` + `uv.lock`); `requirements.txt` is also provided |

> **Note:** The backend wires up an async SQLAlchemy engine and a `/health/database` endpoint that runs `SELECT 1`, but no SQLAlchemy models are currently defined (`app/models/` only contains an empty `__init__.py`). The database is not currently used to store documents or corrections.

## Project Structure

```
FluentfixAI/
├── LICENSE
├── README.md
├── backend/
│   ├── .env.example
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── uv.lock
│   ├── resources/
│   │   └── dictionaries/
│   │       └── frequency_dictionary_en_82_765.txt
│   └── app/
│       ├── main.py                # FastAPI app entrypoint
│       ├── api/
│       │   └── v1/
│       │       ├── router.py      # includes health + corrections routers
│       │       └── endpoints/
│       │           ├── corrections.py
│       │           └── health.py
│       ├── config/
│       │   ├── settings.py        # Pydantic settings (env-driven)
│       │   └── logging.py
│       ├── db/
│       │   ├── base.py            # SQLAlchemy declarative base
│       │   ├── engine.py          # async engine
│       │   ├── session.py         # async session factory
│       │   ├── dependencies.py    # get_db dependency
│       │   └── init_db.py
│       ├── models/                # empty — no ORM models defined yet
│       ├── schemas/
│       │   └── correction.py      # CorrectionRequest / CorrectionResponse
│       ├── services/
│       │   └── ai/
│       │       ├── pipeline.py    # process_text(): mode routing
│       │       ├── spell.py       # SymSpell + wordfreq
│       │       ├── grammar.py     # T5 transformer model
│       │       ├── fluency.py     # LanguageTool
│       │       └── explanation.py # unused placeholder function
│       ├── middleware/
│       ├── exceptions/
│       └── utils/
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx                 # routes: "/" and "/workspace"
        ├── services/
        │   └── api.js               # axios instance (baseURL http://127.0.0.1:8000)
        ├── pages/
        │   ├── Home.jsx
        │   └── Workspace.jsx        # main writing workspace (core feature logic)
        └── components/
            ├── Navbar.jsx
            ├── Hero.jsx
            ├── Features.jsx
            ├── About.jsx
            ├── TextInput.jsx
            ├── ConfidenceBar.jsx    # currently empty
            ├── Footer.jsx           # currently empty
            ├── Loading.jsx          # currently empty
            ├── ResultCard.jsx       # currently empty
            └── TextEditor.jsx       # currently empty
```

## Installation

### Prerequisites

- Python `>=3.10`
- [`uv`](https://docs.astral.sh/uv/) (used for backend dependency management via `pyproject.toml`/`uv.lock`)
- Node.js and npm (frontend uses `package.json`/`package-lock.json`)
- A PostgreSQL instance (referenced by `DATABASE_URL`; used only for the `/health/database` check at present)

### Backend Setup

```bash
cd backend

# Install dependencies with uv
uv sync

# Copy the example environment file and fill in real values
cp .env.example .env
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Environment Variables

Defined in `app/config/settings.py` and required for the backend to start (see `backend/.env.example` for a reference file):

| Variable | Description |
|---|---|
| `APP_NAME` | Application display name |
| `APP_VERSION` | Application version string |
| `DEBUG` | Enables debug mode / SQL echo |
| `API_V1_PREFIX` | Declared in settings, currently **not** applied to the API router (all routes are mounted without a prefix) |
| `SECRET_KEY` | Application secret key |
| `DATABASE_HOST` | Database host |
| `DATABASE_PORT` | Database port |
| `DATABASE_NAME` | Database name |
| `DATABASE_USER` | Database user |
| `DATABASE_PASSWORD` | Database password |
| `DATABASE_URL` | Full async SQLAlchemy connection string (e.g. `postgresql+asyncpg://user:password@host:port/dbname`) |
| `MODEL_PATH` | Path setting reserved for AI model storage |

> `backend/.env.example` currently lists some of these under different names (`DB_HOST`, `DB_PORT`, etc.), which do not match the field names required by `settings.py`. Use the variable names in the table above when creating your `.env`.

## Running the Application

**Backend** (from `backend/`):

```bash
uv run uvicorn app.main:app --reload
```

**Frontend** (from `frontend/`):

```bash
npm run dev
```

The frontend's Axios client points to `http://127.0.0.1:8000` by default, and the backend's CORS configuration allows requests from `http://localhost:5173` (Vite's default dev port).

## API Documentation

### `POST /corrections/`

Runs text through the correction pipeline for the given mode.

**Request body**

```json
{
  "text": "i hav a dreem",
  "mode": "spelling"
}
```

`mode` accepts `"spelling"`, `"grammar"`, `"fluency"`, or `"all"` (default).

### `GET /health/database`

Checks database connectivity by running `SELECT 1`.

### `GET /`

Root endpoint, returns a welcome message and the current `DEBUG` value.

## Example Request

```bash
curl -X POST http://127.0.0.1:8000/corrections/ \
  -H "Content-Type: application/json" \
  -d '{"text": "i hav a dreem", "mode": "all"}'
```

## Example Response

```json
{
  "original": "i hav a dreem",
  "spelling": "i have a dream",
  "grammar": "I have a dream.",
  "fluency": "I have a dream.",
  "corrected": "I have a dream.",
  "confidence": 0.98
}
```

> Actual grammar/fluency output will vary based on the loaded T5 model and LanguageTool's rules; `confidence` is currently a fixed value returned by the backend rather than a computed score.

## Screenshots

![FluentFix AI Workspace](screenshots/workspace.png)

![Correction Modes](screenshots/correction-modes.png)

![Correction Result](screenshots/correction-result.png)

*[ADD SCREENSHOT] — screenshots are not yet included in the repository.*

## Future Improvements

The following features are planned for future versions of FluentFix AI:

- ☁️ **Cloud document storage** — Persist documents and correction history on the server instead of relying only on browser storage.
- 📊 **Real confidence scoring** — Replace the current fixed confidence value with a dynamically calculated confidence score.
- 🧠 **Advanced contextual rewriting** — Provide more context-aware suggestions for improving clarity, tone, and readability.
- 👤 **User authentication** — Add user accounts and personalized workspaces.
- 🔎 **Document search** — Allow users to quickly search through their saved documents.
- 📈 **Writing analytics** — Provide insights into writing quality, common errors, and correction patterns.
- 🌐 **Production deployment** — Deploy the frontend and backend for public access.

## Known Limitations

- Documents and correction history are stored only in the browser's `localStorage` — clearing browser data removes all saved work.
- The `confidence` score returned by the API is a hardcoded value (`0.98`), not a calculated metric.
- No authentication or user accounts.
- Database connectivity is wired up (SQLAlchemy, `asyncpg`/`psycopg`) but no models or persistence logic for documents/corrections exist yet — the database is currently used only for a basic health check.
- `.env.example` variable names don't fully match the variables required in `app/config/settings.py`.
- Several frontend component files (`ConfidenceBar.jsx`, `Footer.jsx`, `Loading.jsx`, `ResultCard.jsx`, `TextEditor.jsx`) are currently empty/unused.

## Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a pull request.

## License

Licensed under the [MIT License](LICENSE).

## Author

**Ashutosh Maharaj**
GitHub: [ashutoshmaharaj021](https://github.com/ashutoshmaharaj021)
Project: [FluentfixAI](https://github.com/ashutoshmaharaj021/FluentfixAI)

[ADD LIVE DEMO URL]