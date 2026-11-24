# Regal Foundation Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS frontend for the Regal Plastic Surgery Centre Foundation.

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL if backend is not on localhost:8000
npm run dev
```

Open http://localhost:3000

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, impact counters, pillars, next mission |
| `/about` | Story, mission, clinical backing |
| `/programs` | Healthcare, feeding, education, maternal |
| `/missions` | Upcoming + past archive |
| `/missions/[id]` | Mission detail + sponsor CTA |
| `/stories` | Field stories list |
| `/stories/[slug]` | Story detail |
| `/get-involved` | Hub for donate / volunteer / partner / nominate |
| `/get-involved/donate` | Donation form (Paystack / Flutterwave) |
| `/get-involved/volunteer` | Volunteer registration |
| `/get-involved/nominate` | Community nomination |
| `/get-involved/partner` | In-kind / CSR pledge |
| `/contact` | Contact form |

## Design

- Colors: deep navy (`#0B1D36`), warm gold (`#C9A227`), cream background
- Fonts: Inter (body) + Playfair Display (headings)
- Mobile-first, accessible forms, ethical/warm visual tone
