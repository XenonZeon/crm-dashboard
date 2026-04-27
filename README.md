# NexusFlow CRM

A modern CRM platform built for managing clients and deals. NexusFlow provides a clean dashboard with real-time statistics, client management, deal tracking, and multi-user support with secure data isolation.

## Features

- **Dashboard** — overview of clients, active deals, and revenue with charts
- **Client Management** — add, edit, and track clients with status labels
- **Deal Tracking** — manage deals with statuses: active, won, lost, new
- **Multi-user Support** — each user sees only their own data
- **Authentication** — secure sign in and registration via Supabase Auth
- **Analytics** — bar chart for monthly deals, donut chart for client statuses
- **Smooth Animations** — fade + slide transitions on page load

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Database** — Supabase (PostgreSQL + RLS)
- **Auth** — Supabase Auth
- **Styling** — Tailwind CSS
- **Charts** — Recharts
- **Forms** — React Hook Form + Zod
- **Data Fetching** — TanStack Query

## Project Structure

```
app/
├── components/          # Shared components (charts, animations)
├── clients/             # Clients list and new client form
│   ├── [id]/            # Client detail page with edit and delete
│   └── new/             # New client form
├── deals/               # Deals list and new deal form
│   └── new/             # New deal form
├── login/               # Login page
├── register/            # Registration page
├── page.tsx             # Dashboard
└── layout.tsx           # Root layout with sidebar
lib/
├── client.ts            # Supabase browser client
└── server.ts            # Supabase server client
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/XenonZeon/crm-app.git
cd crm-app
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

Two tables in Supabase:

- `clients` — id, name, company, email, phone, status, user_id
- `deals` — id, title, client, amount, status, user_id

Row Level Security (RLS) is enabled on both tables — users can only access their own records.
