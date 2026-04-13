# Shaik Jouzia Afreen H — Dynamic Portfolio

Full-stack portfolio with Supabase backend and admin dashboard.
Stack: React + Vite, Tailwind CSS, Framer Motion, Supabase.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a free project at https://supabase.com
2. Open **SQL Editor** and run the entire contents of `supabase-schema.sql`
3. Go to **Storage → New bucket**, name it `certificates`, set to **Public**
4. Go to **Authentication → Users → Add user**, create your login email/password

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and paste your Supabase URL and anon key from:
**Dashboard → Settings → API**

### 4. Run locally
```bash
npm run dev
```

Portfolio → http://localhost:5173  
Admin    → http://localhost:5173/admin

---

## Deployment (Vercel — free)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → Import project
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

Your live URL will be something like `jouzia.vercel.app`

---

## File Structure

```
src/
├── supabaseClient.js      — DB connection
├── main.jsx               — Router entry point
├── App.jsx                — Portfolio (Hero, About, Projects, Certs, Contact)
├── index.css              — Glassmorphism design system
├── components/
│   └── CertificateVault.jsx — Dynamic certificate grid
└── pages/
    └── Admin.jsx          — Protected admin dashboard
```

---

## Admin Dashboard Features

- **Certificates**: Upload PDF → auto-stored in Supabase Storage → URL saved to DB
- **Projects**: Add/delete projects with tags, URLs, featured flag
- **Auth**: Supabase Auth gate — only your account can access `/admin`
- **UX**: Loading spinners + success/error toast notifications
- **Design**: Side-nav layout, glassmorphism panels, zero clutter
