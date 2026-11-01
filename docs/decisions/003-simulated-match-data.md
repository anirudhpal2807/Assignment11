# ADR 003: Deterministic Simulated Match & Chat Dataset

## Context
A live demo cannot rely on unpredictable external sports APIs that may be out of season, rate-limited, or lack scripted controversy for reviewers.

## Decision
We authored a realistic, high-drama T20 chase: **Mumbai Mavericks vs Chennai Chargers (Final)**:
- 186 target chase starting at Over 14 (124/3).
- Scripted high-emotion moments:
  - Over 16.2: DRS Controversy (clear LBW not reviewed).
  - Over 17.4: Dropped Catch (skier spilled at deep midwicket).
  - Over 18.5: Double Wickets (middle stump knocked out).
  - Over 19.6: 14 needed off the last over, 4 off 1 ball, boundary on the final ball.
- Synced Chat replay: 54 realistic messages tagged with user names, types, and authentic slang.

## Consequences
- Every reviewer experiences the full spectrum of AI co-host behaviors deterministically in 2 minutes.
- Works offline, in private networks, and without live external third-party subscriptions.
