# Changelog

## v0.0.16 - 2026-11-26 - Enemy variants and battlefield pickups (P008.1)
- Introduce Scouts, Heavy aircraft and telegraphed Divers with distinct silhouettes, GAS attributes and attack patterns. Keep the first training wave unchanged, preserve stage counts and per-kill scraps.
- Every third projectile kill drops a collectible in rotation: Rapid Fire (6s), Paper Repair (20% max HP), Power Boost (6s). Drops expire after 12s; timed effects refresh rather than stack. No drops from ramming.
- Add pickup art, health indicators for heavies/damaged variants, dive warning line and active buff timers. Preserve save v2, zero starting tape and 20% max-HP contact penalty. Boss and active special ability deferred.

## v0.0.15 - 2026-11-26 - Empty tape and compact upgrades (P007.4.1)
- Start every flight with zero tape and full paper HP; normal delay and regeneration apply. Tape capacity remains 25 plus upgrades.
- Add Light Folds (speed), Quick Tape (regeneration), Fast Seal (delay) via GAS. Compact three-column cards, two columns on narrow screens, shared by Workshop and Hangar. Existing costs/stats unchanged.
- Migrate schema 1 saves to schema 2 under the existing storage key with all previous levels, wallet and progression retained. New levels start at zero. Existing backup policy retained. Regression tests cover migration and purchases.

## v0.0.14 - 2026-11-26 - Lightweight gameplay ability system (P007.4)
- Add typed run-local attributes, timed effects, tag checks, ability grants and cooldowns, common durability/tape damage and repair.
- Migrate real player/enemy darts and contact damage to the shared runtime. Existing stat formulas, stage rewards and save schema unchanged.
- Same effect ID refreshes/replaces, distinct IDs combine additive then multiplicative modifiers; no temporary capacity changes or persistent effects. New special abilities and pickups remain future content.
- Add lifecycle, validation, combat integration, stat/cadence parity and retry tests.

## v0.0.13 - 2026-11-26 - Mission board and folding bench (P007.3.3)
- Fly presents a chapter progress strip, mission tickets with current/replay/locked states, enemy totals and maximum base rewards, and a distinct locked Endless card.
- Workshop presents illustrated Attack and Defence cards, current/next stats, actual costs, affordability and max states. Purchase retains scroll position.
- Extract existing stat formulas unchanged for shared battle/UI use. Add stat parity and browser purchase/navigation checks. No balance, save schema or combat mechanic changes.

## v0.0.12 - 2026-11-26 - Aircraft contact (P007.3.2)
- Contact destroys existing enemy aircraft and deals 20% of the player's maximum durability directly, bypassing tape and resetting repair delay. Each destroyed enemy grants its normal scrap reward once; fatal contact remains defeat.
- Add paper burst, impact ring and -20% HP feedback. Centralize contact radius and fraction; share enemy destruction with projectile kills.
- Add contact regressions; no changes to saves, upgrade formulas or menus.

## v0.0.11 - 2026-11-26 - Release cache isolation (P007.3.1)
- User screenshot showed v0.0.7 menu markup rendered with v0.0.10 shell and CSS; unversioned JS paths allowed mixed releases.
- Clean build and fingerprint HTML, CSS and all compiled modules together. Deploy only the isolated site directory; no stable runtime module URLs. Keep same page origin and local save key.
- Browser regression warms legacy JS/CSS URLs, loads the new release, checks all runtime request paths, tab count, home layout and saved progression. No gameplay or menu redesign.

## v0.0.10 - 2026-11-26 - Presentation recovery (P007.3)
- Replace rigid home content with a responsive scene, paper landscape, animated aircraft, direct launch and tactile bottom tabs.
- Restyle stage selection, workshop, flight report and combat HUD; refine paper texture and projectile silhouettes without changing hitboxes.
- Strengthen Chromium regression coverage for home-content fit, hit targets, help navigation and direct launch. No GAS, economy or save changes.

## v0.0.9 - 2026-11-26 - Flight Club menu and crumple feedback (P007.2)
- Introduce Home, Fly, Workshop and Hangar tabs; animate the current starter aircraft in Home and Hangar. Move locked Endless to Fly.
- Freeze simulation on defeat, settle earned scraps before the visual sequence, fold the plane into a faceted paper ball with a small scrap burst, then open the report. Reduced-motion variant; voluntary end skips destruction.
- Preserve compact portrait sizing, balance, save schema and existing campaign. Add death timeline and browser navigation/defeat regression checks.

## v0.0.8 - 2026-11-26 - Compact portrait frame (P007.1)
- Cap the complete game frame at 360 CSS pixels, reserve viewport height for chrome, and remove intrinsic canvas sizing from layout.
- Keep the 540x960 simulation and pointer mapping intact; preserve menu, combat, economy and saves.
- Add actual Chromium layout/navigation regression checks at desktop and mobile viewport sizes. Physical-device checks remain open.

## v0.0.7 - 2026-11-26 - Portrait preview and main menu (P007 slice)
- Changed the logical battlefield from 960x540 to 540x960, with bounded portrait formation spacing and responsive phone-sized framing.
- Added original layered paper cover illustration and dedicated Campaign, Workshop and How to play screens. Endless remains unavailable.
- Preserved save schema, stage counts, rewards and upgrade economy. Updated aim-coordinate mapping and HUD elements; added portrait regression tests.
- Full art/audio pass, actual device checks and portrait combat tuning remain open.

## v0.0.6 - 2026-11-26 - First campaign MVP (P001-P006 vertical slice)
- Added TypeScript Canvas runtime, fixed timestep, desktop and touch input, stage waves, projectiles, tape regeneration and durability.
- Added replay, defeat/victory reports, scrap settlement, four upgrades and local save validation/backup.
- Added original procedural paper art, CI tests and Pages workflow. Exact balance is provisional.
- Remaining gates: browser/device checks, lint/format, lockfile, explicit recovery UI, art polish and full alpha.

## v0.0.0 - 2026-11-26 - Documentation foundation
- Added project rules, design specifications, decision register, proposed architecture, QA plan, roadmap and source register.
- Created empty module directories with `.gitkeep` placeholders.
- No gameplay implementation, dependencies, assets, Git repository, CI execution or Android build.
