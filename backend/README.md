# Regal Foundation API (Python / FastAPI)

Backend for the **Regal Plastic Surgery Centre Foundation** website — community medical outreach, feeding drives, and child education platform.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | FastAPI (async) |
| Database | MongoDB via Motor |
| Auth | JWT (python-jose) + bcrypt |
| Payments | Paystack & Flutterwave (verify + webhooks) |
| Validation | Pydantic v2 |

## Quick Start

### 1. Prerequisites

- Python 3.11+
- MongoDB running locally or a cloud URI (MongoDB Atlas)

### 2. Install

```bash
cd regal_foundation_backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure

```bash
cp .env.example .env
# Edit .env — set SECRET_KEY, MONGODB_URL, Paystack/Flutterwave keys, SMTP
```

### 4. Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API docs: http://localhost:8000/docs  
- Health: http://localhost:8000/health  

### 5. Bootstrap first admin

```bash
curl -X POST http://localhost:8000/api/v1/auth/bootstrap \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@regalfoundation.org",
    "password": "ChangeMeNow123!",
    "full_name": "Foundation Admin",
    "role": "superadmin"
  }'
```

Then log in:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@regalfoundation.org", "password": "ChangeMeNow123!"}'
```

Use the returned `access_token` as `Authorization: Bearer <token>` for admin routes.

### 6. Seed sample data (optional)

```bash
python -m scripts.seed
```

---

## API Overview

Base path: `/api/v1`

### Public endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/impact` | Live impact counters (homepage) |
| GET | `/missions` | List missions (filter by status, year, state) |
| GET | `/missions/upcoming` | Next upcoming outreaches |
| GET | `/missions/{id}` | Mission detail + gallery |
| POST | `/donations/initiate` | Start Paystack/Flutterwave donation |
| GET | `/donations/verify/{reference}` | Verify payment after callback |
| GET | `/donations/recent` | Recent public donations |
| POST | `/volunteers` | Volunteer registration |
| POST | `/nominations` | Nominate a community |
| GET | `/stories` | Published field stories |
| GET | `/stories/{slug}` | Single story |
| POST | `/contact` | Contact form |
| POST | `/partner` | In-kind / CSR pledge form |

### Admin endpoints (Bearer token required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create another admin user |
| GET | `/auth/me` | Current user profile |
| POST | `/missions` | Create mission |
| PATCH | `/missions/{id}` | Update mission + post-mission stats |
| DELETE | `/missions/{id}` | Delete mission |
| GET | `/donations` | Full donation ledger |
| GET | `/donations/stats` | Raised totals by category |
| GET | `/volunteers` | Volunteer roster (filter by role/location) |
| PATCH | `/volunteers/{id}/verify` | Mark volunteer verified |
| GET | `/nominations` | Nominations queue |
| PATCH | `/nominations/{id}` | Update nomination status |
| POST | `/stories` | Create story |
| PATCH | `/stories/{id}` | Update story |
| PUT | `/impact` | Override impact counters |
| GET | `/contact/messages` | Inbox |
| GET | `/partner/pledges` | In-kind pledges |

### Auth

- `POST /auth/bootstrap` — only works when zero users exist (first setup)
- `POST /auth/login` — returns JWT
- Roles: `superadmin`, `admin`, `editor`

---

## Donation Flow

1. Frontend calls `POST /donations/initiate` with amount, category, donor details, and `gateway` (`paystack` or `flutterwave`).
2. API returns `reference` + public key + init payload.
3. Frontend opens Paystack Inline / Flutterwave checkout using that data.
4. On success, frontend (or webhook) calls `GET /donations/verify/{reference}`.
5. API confirms with the gateway, marks donation `success`, and (TODO) sends PDF receipt email.

Configure Paystack webhook URL: `POST /api/v1/donations/webhook/paystack`.

---

## Project Structure

```
regal_foundation_backend/
├── app/
│   ├── main.py              # FastAPI app + CORS + routers
│   ├── core/
│   │   ├── config.py        # Settings from env
│   │   ├── database.py      # Motor connection + indexes
│   │   └── security.py      # JWT + password hashing + deps
│   ├── models/
│   │   └── schemas.py       # Pydantic models / enums
│   ├── routers/
│   │   ├── auth.py
│   │   ├── missions.py
│   │   ├── donations.py
│   │   ├── volunteers.py
│   │   ├── nominations.py
│   │   ├── stories.py
│   │   └── public.py        # impact, contact, partner
│   └── services/            # (extend for email, PDF receipts, media)
├── scripts/
│   └── seed.py
├── .env.example
├── requirements.txt
└── README.md
```

---

## Production Notes

- Set a strong `SECRET_KEY` and turn `DEBUG=False`.
- Use MongoDB Atlas or a hardened MongoDB instance with auth.
- Put the API behind HTTPS (Nginx / Caddy) and restrict CORS to your real frontend domain.
- Implement real SMTP for donation receipts and volunteer confirmations.
- Add rate limiting on public forms (contact, nominations, volunteer signup).
- Store uploaded field photos on object storage (S3 / Cloudflare R2) with WebP conversion.
- Disable or protect `/auth/bootstrap` after the first admin is created.

---

## Next Steps (aligned with phased rollout)

- **Phase 1:** Home metrics, missions list, donation initiate + verify, contact form.
- **Phase 2:** Volunteer + nomination forms, full admin dashboard endpoints (already present).
- **Phase 3:** Stories/galleries, impact aggregation from completed missions, donor email receipts.
