# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

There are no lint, type-check, or test scripts configured.

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The `NEXT_PUBLIC_` prefix is intentional — `vite.config.js` explicitly adds it to `envPrefix` so Vite exposes these variables to the browser. The app runs without them, falling back to localStorage + seed data.

## Architecture

### Data flow

The app has two parallel data layers:

1. **localStorage** (always active) — primary persistence. State is stored under the key `vehicle-tracker-clean-state-v1` and loaded on mount. Falls back to `lib/seed.js` when nothing is stored.
2. **Supabase** (optional) — `lib/supabaseClient.ts` exports a `supabase` client and a `supabaseReady` boolean. `App.jsx` only uses Supabase today to check connectivity (counts rows in `vehicles`); it does **not** bidirectionally sync with Supabase.

All mutable state lives in a single `state` object inside `App.jsx` with this shape:

```js
{ vehicles, maintenance_logs, repairs, fuel_logs, parts, documents, photos, reminders }
```

Form inputs use a parallel `drafts` object (`createEmptyDrafts()` in `lib/seed.js`). On submit, handlers call `crypto.randomUUID()`, stamp an ISO timestamp, append to the relevant array, and reset the draft.

### Component model

State is owned entirely by `App.jsx` — there is no context, Redux, or external store. Child components (`VehicleCard`, `EmptyState`) are pure display components that receive props. All event handlers live in `App.jsx`.

### Styling

All styles are in `src/styles.css` as a single file. Colors and spacing use CSS custom properties defined at `:root`. Layout is CSS Grid. Breakpoints are at 960 px and 640 px.

### Database

`supabase/schema.sql` defines 8 tables (`vehicles`, `maintenance_logs`, `repairs`, `fuel_logs`, `parts`, `documents`, `photos`, `reminders`). All tables have UUIDs as primary keys, indexes on `vehicle_id` foreign keys, and permissive RLS policies (`using (true)`). Run this file in the Supabase SQL editor to initialize a new project; optionally follow with `supabase/seed.sql` for the example vehicle.
