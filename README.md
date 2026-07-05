# FinTrack

A full-stack personal finance tracker — log income and expenses, set monthly budgets, visualize spending, and import real bank statement CSVs with automatic categorization.

**Live demo:** https://fintrack-nine-green.vercel.app
**Demo account:** `demo@fintrack.app` / `Demo@1234`

---

## Features

- **Auth & security** — Supabase Auth with JWT verification, Row Level Security on every table so user data is isolated at the database level, not just the API
- **Transaction management** — full CRUD for income and expenses, categorized, with descriptions and dates
- **Monthly budgets** — set per-category budgets, edit or delete them, copy a month's budgets forward or backward
- **Dashboard analytics** — monthly income/expense/net summary, spending-by-category donut chart, 6-month income vs expense trend, all computed server-side
- **Budget utilisation tracking** — visual progress bars that shift blue → amber → red as spending approaches or exceeds budget
- **CSV bank statement import** — upload real HDFC or SBI export CSVs; the parser normalizes inconsistent date formats, strips currency symbols, detects debit/credit column layouts, auto-categorizes by keyword rules, and skips duplicates on reimport, with a preview screen before anything is saved

## Tech stack

**Frontend:** React (Vite), TanStack Query, Recharts, Tailwind CSS, lucide-react
**Backend:** FastAPI, SQLAlchemy, Python
**Database:** PostgreSQL via Supabase, with Row Level Security
**Auth:** Supabase Auth (JWT)
**Deployment:** Vercel (frontend), Render (backend), UptimeRobot (keeps backend + DB active)

## Architecture

```
React (Vite)  →  FastAPI  →  Supabase PostgreSQL
     ↑               ↑
TanStack Query   Repository pattern
(server state)   (SQL isolated from route handlers,
                   no DB logic in routes)
```

The backend follows a repository pattern — every route calls into a repository file for its database queries, so business logic can be tested independently of the route layer. All chart data is aggregated server-side in Postgres rather than computed on the client.

## Running locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

Create `backend/.env`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
DATABASE_URL=your_postgres_connection_string
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

## Database schema

Two core tables (`transactions`, `budgets`) plus Supabase's built-in `auth.users`, with Row Level Security enforcing `user_id = auth.uid()` on every table.

