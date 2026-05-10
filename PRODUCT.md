# fitlog — product

## Register

**Product.** The UI serves the workout tracking — design exists to make logging faster and progress clearer, not to be the product itself.

## One-line

The cleanest, fastest personal workout tracker on the web — with zero social.

## Users

- **Solo gym-goer (primary).** Trains 3–5x/week, has a programme they follow (PPL, Upper/Lower, 5/3/1, custom). Phone in pocket between sets. Wants to log a set in under 2 seconds. Doesn't care what anyone else lifted.
- **Returning lifter.** Comes back after a layoff, wants to find their last working weights instantly so they can pick up where they left off.
- **Self-coached intermediate.** Reviews trends weekly — strength on lifts, weekly volume per muscle, consistency. Wants honest data, not motivational noise.

These users have **opted out** of fitness social media. They don't want a feed. They don't want followers. They don't want anyone to see what they lifted today.

## Product purpose

Replace the spreadsheet / Apple Notes / Hevy-with-feed-muted with something that:

1. Logs a set in two taps and remembers everything.
2. Resumes a workout exactly where the user left off — even if they killed the tab mid-set.
3. Shows whether they're getting stronger and showing up consistently. Nothing else.
4. Stays out of the way during the workout. Big numbers, big buttons, no ads, no cards-of-other-people, no tips, no upsells.

## What we will not build

Locked at the rules layer (per-user Firestore subtree only) so future-Claude can't accidentally add it:

- Social feed, profiles, followers, likes, comments, public sharing
- Community tabs, leaderboards, group challenges
- DMs / messaging
- Photo or video upload of any kind
- Coach marketplace, premium subscription, in-app purchases
- AI form check, video analysis
- Anything that makes another human visible to the user inside the app

## Strategic principles

1. **Speed is a feature.** If logging a set takes more than 2 sec from app-open, it's a bug.
2. **The workout is sacred.** During a workout, nothing else loads, nothing animates more than necessary, nothing pulls focus.
3. **Trust the user.** No nag screens, no streak-shaming, no manipulative retention.
4. **Show, don't sell.** Progress charts and PRs do the motivating. Copy stays terse and factual.
5. **Offline first.** A dropped signal in a basement gym must not lose a single set.
6. **One-handed is the default.** Right-thumb arc on a 4.7" phone reaches every primary action.
7. **Premium feel, not premium price.** v1 is free.

## Tone

- **Voice:** factual, lowercase, lifter-direct. Not coach-y. Not gamified. Not emoji-laden.
- **Copy examples:**
  - ✓ "next: bench press · 3 sets · last 80kg × 6"
  - ✓ "+5kg from last session"
  - ✓ "rest 1:30"
  - ✗ "Crush it today, Ashwin! 💪"
  - ✗ "You're 3 workouts away from a streak milestone! 🔥"

## Anti-references (specifically not these)

- **Hevy** — great logger UX, but the feed pulls focus and the social tab is the wrong gravity. fitlog is what Hevy looks like with the feed surgically removed.
- **MyFitnessPal** — feature creep, ads, calorie-shaming.
- **Strava** — community-first; the workout is just an excuse to post.
- **Fitbod** — heavy onboarding, push notifications, premium-tier nags.
- **Apple Fitness** — too much "ring" gamification; close-the-ring guilt.

## Differentiator

**The promise:** "The Hevy-shaped logger with no feed and no future feed." It's a permanent design constraint, not a v1 limitation. Users can recommend the app to a friend with that one sentence and the friend will instantly know what they're getting.

## Success looks like

- A returning user can sign in, hit "quick start", and finish logging their first set within 30 seconds.
- A user with 100 logged workouts opens analytics and immediately sees their bench going up over 3 months.
- A user kills the tab mid-set on the subway, re-opens at home, and the workout resumes with zero friction.
- A user opens the app every gym day for 6 months without ever once being asked to share, follow, like, or rate anything.
