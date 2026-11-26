# Progression, economy and equipment

## Currency
Scraps are the primary soft currency. Earn via actual combat; spend on permanent global upgrades and predictable equipment unlocks. Blueprints are named unlock requirements, not necessarily a fungible currency. Candidate later Golden Clips premium currency is deferred; avoid currency clutter. Currency values must be nonnegative and validated, with idempotent reward/purchase transactions and visible prices.

## Upgrade candidates
| Group | Candidates | Initial constraint |
|---|---|---|
| Offense | Damage, fire rate, crit chance/damage, piercing, multishot | Damage uncapped in design; bounded fire rate, crit and projectile counts |
| Defense | Durability, reinforcement, repair rate/delay, resistance | Health growth; bounded delay/resistance |
| Flight | Speed, acceleration, handling | Bounded for controls and collision |
| Economy | Scrap earnings, boss bounty | Growth balanced against enemy rewards and costs |
| Endless | Head Start, opening bonus, emergency tape, power-up duration | Head Start is core; others later |
| Automation | Aim assistance, auto-retry | Accessibility separate from monetized power; defer automation |

Proposed costs: `baseCost * growth^currentLevel`, rounded predictably; define one shared cost function and tested purchase logic. Do not pick production growth rates without simulation and playtests. Milestones can unlock new mechanics, but avoid extra complexity in the first release. Bulk buy 1/5/Max later only after exact affordability and overflow behavior are tested.

## Equipment acquisition
A: direct fixed-price purchase with known stats. B: blueprint earned through defined progression then crafted with scraps. No paid-exclusive combat equipment or random-stat loot as the core system. Proposed rare boss blueprints must have a fair deterministic fallback if implemented. Unlock IDs must be stable; re-purchase cannot double charge. Preview equipment before purchase and distinguish unlock, craft and equip.

Candidate aircraft: Original (balanced), Interceptor (fast/fragile), Glider (defense), Bomber (area damage), Twinfold (multiple shots). Candidate primary weapons: paper darts, ink blaster, origami stars, paper bombs, confetti cannon; paper clips can be an orbiting secondary. Start with Original and Paper Darts only, expand after combat is stable. Proposed slots: primary, secondary, passive, special ability; do not add all in first patch.

Materials later: notebook paper (balanced), cardboard (durable/heavy), tracing paper (light), metallic paper (resistance), washi (handling), newspaper (economy). Cosmetic patterns and trails do not alter stats. Avoid combinations that create dominant builds. Mastery later can award cosmetics and modest transparent bonuses; no mandatory grind.

## Balance process
Track stage completion, time-to-upgrade, damage dealt/taken, earned/spent scraps and retries via local debug logs during tests. Test economy at early, mid and high upgrade levels; check that farming and new-stage progression are both useful and Head Start does not create free rewards. Publish balance sheets or data fixtures when actual numbers are approved. No market/revenue forecasts are assumed.

## P007.4.1 implemented provisional balance
Existing damage, durability, tape capacity and fire-rate formulas/caps unchanged. All new upgrades cost ceil(20 * 1.25 ** level), using the existing cost curve. Light Folds: 245 + 5 per level speed, cap 15 (320). Quick Tape: 8 + 1 per level tape/s, cap 20 (28). Fast Seal: max(1, 3 - 0.2 * level) seconds, cap 10 (1 second). All flights start with zero current tape and full HP; capacity remains 25 + 5 per reinforcement level. Save schema 2 migrates original four levels, currency and progression, setting three new levels to zero. Same origin/key and existing backup validation. Older clients do not understand v2; do not downgrade. Values provisional pending playtest.
