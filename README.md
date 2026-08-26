# LitreGre Bet

Full-stack Next.js sportsbook (Phase 1 hybrid MVP).

## Stack

- Next.js 14 App Router
- Prisma + PostgreSQL
- Tailwind CSS (custom dark sportsbook UI)
- Phone + PIN auth (httpOnly JWT cookie)

## Setup

```bash
cd litregre-bet
cp .env.example .env
# Set DATABASE_URL and JWT_SECRET
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Coolify

- Build pack: Dockerfile
- Port: 3000
- Env: `DATABASE_URL`, `JWT_SECRET`, `APP_URL`

## Phase 1 features

- Mobile-first home, live strip, sports browser, event detail
- Native betslip (50 legs), quote API, share/load codes
- Optional SportyBet export on code generation
- Auth + demo wallet (₦5,000 bonus seed)

## Phase 2

- Paystack deposits, real bet placement, settlement
