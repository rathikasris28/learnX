# LearnX Backend

Express + TypeScript API for the LearnX React application.

## Local setup

1. Create a PostgreSQL database named `learnx` (or use Supabase/Neon).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. Install dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:4000`. It applies `src/config/schema.sql` on startup. Without SMTP settings, verification OTPs are printed to the backend console for local development only.

Session booking expects ISO timestamps in UTC and returns a unique `meeting_room_id` for a Jitsi-compatible room.

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `GET /api/auth/me` (Bearer token required)
- `POST /api/matches` (Bearer token required; weighted explainable matching)
- `GET /api/skills?q=python&domain=technical&category=Programming`
- `GET /api/skills/categories`
- `GET /api/skills/domains`
- `POST /api/sessions` (Bearer token required; checks availability and credits)
- `GET /api/sessions` (Bearer token required)
- `PUT /api/sessions/:id/cancel` (Bearer token required)
- `PUT /api/sessions/:id/complete` (Bearer token required)

The frontend can use `VITE_API_URL=http://localhost:4000/api`.
