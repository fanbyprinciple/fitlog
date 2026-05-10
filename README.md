# fitlog

Fast, distraction-free solo workout tracker. Hevy-style logger UX + analytics + streaks. **No social anything.**

Live: `https://fanbyprinciple.github.io/fitlog/` (after first deploy)

## Stack

React 19 + Vite + TypeScript · Firebase Auth (Google) + Firestore (offline-first) · Zustand · Recharts · Framer Motion · React Router 7

## Local setup

```bash
cp .env.local.example .env.local
# fill in 6 VITE_FIREBASE_* keys from Firebase Console
# (Project Settings -> Your apps -> Web app)
npm install
npm run dev
```

App at http://localhost:5173/fitlog/

## Deploy

Push to `main`. GitHub Action builds with secrets and publishes to GitHub Pages. Auto.

## Project context

See `CLAUDE.md` for build phases + scope.
