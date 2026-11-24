# Regal Foundation — Full Stack

Community medical outreach, feeding drives & child education platform for the **Regal Plastic Surgery Centre Foundation**.

## Structure

```
regal_foundation/
├── backend/          # Python FastAPI + MongoDB API
└── frontend/         # Next.js 15 + TypeScript + Tailwind
```

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Set MONGODB_URL, SECRET_KEY, Paystack/Flutterwave keys

# Start MongoDB, then:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Bootstrap first admin:

```bash
curl -X POST http://localhost:8000/api/v1/auth/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@regalfoundation.org","password":"ChangeMeNow123!","full_name":"Admin","role":"superadmin"}'
```

Optional seed data: `python -m scripts.seed`

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Site: http://localhost:3000

## Features

**Public site**
- Home with live impact counters and next-mission spotlight
- About, Programs, Missions archive, Field Stories
- Donate (Paystack / Flutterwave), Volunteer, Nominate community, In-kind/CSR, Contact

**Backend API**
- JWT admin auth
- Missions CRUD + impact stats
- Donations initiate / verify / webhook / ledger
- Volunteer roster, nominations queue, stories, contact inbox

## Design

Warm, human-centered UI: navy + gold palette, dignity-focused storytelling, mobile-friendly for Nigerian networks.

See `backend/README.md` and `frontend/README.md` for detailed API and page docs.
