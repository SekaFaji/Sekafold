# Endless Survival specification

Accepted direction: time-based scaling and selectable difficulty start via permanent upgrade. All numeric defaults below are proposals, not validated balance.

## Clock model
- `actualElapsedSeconds`: active gameplay since launch; starts at 0.
- `startOffsetSeconds`: selected unlocked difficulty time, fixed at launch.
- `difficultyElapsedSeconds = startOffsetSeconds + actualElapsedSeconds`.
- Proposed `stepSeconds = 30`, `difficultyIndex = floor(difficultyElapsedSeconds / stepSeconds)`, displayed level = index + 1.
- Pause, app background, loading and end screens do not advance either clock. Use simulation time, never wall-clock elapsed time for combat.
- Example: start at 10:00, survive 2:35, difficulty reads 12:35. Actual record is 2:35, not 12:35.

## Head Start
A permanent Workshop upgrade. Proposed one level grants another 30-second starting option. Max start offset = owned level × 30 seconds; select any unlocked step from zero to max. Upgrade availability additionally requires reaching the next threshold in a previous eligible run (proposed: survive the whole target interval; do not unlock solely via offset). Purchase costs configurable and increasing; show prerequisite and affordability. No forced start at the highest difficulty.

Example: level 20 gives 0:00 through 10:00 inclusive; starting at 7:00 is legal. A save/load preserves level and last selection; invalid selections clamp safely to valid steps.

## Scaling and wave director
Candidate step health multiplier 1.09^index, scrap multiplier 1.06^index, evaluated only on actual spawned/defeated enemies. These exponential examples grow rapidly and are not production values. Use separate, bounded curves for enemy speed, fire rate, spawn frequency and active count; complexity should rise with composition and attack patterns. Profile the worst-case projectile count and clamp spawn budgets. Avoid overflow; document late-game numerical strategy before unlimited progression ships.

Bosses proposed at every 300 difficulty seconds. At launch, treat milestones at or before startOffset as skipped. Next boss is strictly greater than startOffset. Example: start at 10:00, next scheduled boss at 15:00 (5 minutes of actual play); start at 9:30, boss at 10:00. Trigger once when a boundary is crossed, queue if a boss is active, and do not spawn skipped enemies or grant skipped rewards. No instant checkpoint windfall.

## Rewards and records
Earn scraps only from actual eligible kills, pickups and cleared bosses. Award milestone prizes only after the actual combat requirement is satisfied, never merely by selecting a higher start. Track actual survival duration, highest difficulty achieved with combat eligibility, kills and starting offset; distinguish zero-start and boosted-start records. Future leaderboards must partition or disclose offsets and upgrades. No online leaderboard in MVP.

Temporary boosts reset at launch, so high starts can be harder than naturally reaching that difficulty. Proposed solution: limited `Opening Advantage` upgrade with a small deterministic starting bonus; tune via playtest, do not automatically grant all skipped boosts.

## Acceptance cases
- Level 0 starts only at zero; level 20 allows 0..600 seconds in 30-second steps.
- At 29.99 seconds level remains 1; at 30 seconds level becomes 2; 600-second offset begins at level 21.
- Pause/resume and backgrounding preserve both clocks.
- Starting at exactly a boss boundary grants no previous boss loot; next boundary triggers once.
- Defeat/retry resets clocks and temporary state; only actual earned scraps settle once.
- Repeated purchases, malformed saves and out-of-range selections cannot bypass unlock conditions.
- Difficulty/records remain distinct at high starts; long sessions do not exhaust entity or numeric limits.
