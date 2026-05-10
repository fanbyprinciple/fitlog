# fitlog

Fast, distraction-free solo workout tracker. Hevy-style logger UX + analytics + streaks. **No social** (no feed, profiles, follows, comments, likes, sharing, leaderboards, messaging) — locked into Firestore rules. Dark-first, lime accent, gym-friendly one-handed UX.

## Stack

- React 19 + Vite 6 + TypeScript
- Firebase 11 — Auth (Google only) + Firestore (`persistentLocalCache` + multi-tab). No Storage, no Functions, no Realtime DB, no FCM.
- `react-router-dom 7`, `zustand` (active-workout + persist), `recharts` (lazy on /analytics), `framer-motion`, `date-fns`, `lucide-react`

## Hosting

GitHub Pages via `peaceiris/actions-gh-pages@v4` on push to `main`. Deploy URL: `https://fanbyprinciple.github.io/fitlog/`. Vite `base: '/fitlog/'`.

## Visual identity

Defer to `/impeccable` skill. Run `/impeccable teach` (P0.5) to seed PRODUCT.md + DESIGN.md before any screen-level UI work. Register = **product** (UI serves the tracking).

## Build phases

- P0 scaffold + configs (this commit)
- P0.5 /impeccable teach
- P1 auth + app shell
- P2 exercise library
- P3 **workout logger (killer feature, <90s for 3-set workout)**
- P4 routine builder
- P5 home dashboard
- P6 analytics
- P7 streaks + achievements
- P8 settings + export/import + delete-account
- P9 polish + a11y + 1-handed audit
- P10 (v2) Expo `mobile/` clone

## Setup

```bash
cp .env.local.example .env.local
# fill in 6 VITE_FIREBASE_* keys from Firebase console
npm install
npm run dev
```

## Out of scope v1

photo/video upload, Apple/email auth, Apple Health/Strava sync, Expo mobile, Cloud Functions/FCM/push, cardio rich tracking, AI coaching, wearable sync, paid tier, anything social.
