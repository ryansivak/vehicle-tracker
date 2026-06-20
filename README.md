# Vehicle Tracker

A clean React + Vite vehicle logbook that is ready for GitHub, Vercel, and Supabase.

## What’s in here

- One seeded example vehicle: 2010 Chevy Equinox
- Local editable maintenance logs and reminders
- Supabase client wiring with environment-variable-only config
- Supabase schema and seed SQL

## Project layout

- `src/` - app entry point and UI
- `components/` - reusable UI pieces
- `lib/` - seed data and Supabase client
- `supabase/` - database schema and seed SQL

## Local setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Optionally run `supabase/seed.sql` to insert the example vehicle.
4. Add these environment variables in Vercel and your local `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The app uses `NEXT_PUBLIC_` names on purpose and Vite is configured to expose them.

## Vercel deployment

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add the Supabase env vars in the Vercel project settings.

## Notes

- No API keys are committed.
- The app falls back to local seeded data if Supabase is not configured yet.
- The old workspace app was left untouched; this folder is the clean deployable project.
