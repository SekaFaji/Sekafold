# Current project status

Updated: 2026-11-26 | Version: v0.0.16 | P008.1 enemy variants and battlefield pickups

Implemented: three replayable stages, assisted gliding, mouse/keyboard and dual touch sticks, paper darts, three entry formations, enemy shots, durability and regenerating tape, flight reports, seven permanent upgrades, local versioned saves. Original procedural paper graphics. CI and Pages workflows included; check actual Actions runs for verification.

This is a vertical slice spanning P001-P006, not the full P010 alpha. Balance is provisional. No boss, Endless, Head Start, crafting, audio, ads, Android build, or offline installation yet. Device and browser playtesting, accessibility, save repair UI, lockfile, lint/format tooling, and performance profiling are outstanding. Save corruption preserves raw data and disables writes; interrupted flights do not retain pending rewards.

Next: validate portrait controls, formations and menu usability in Pages on desktop and touch; then continue P007 art/audio and polish. Retain all P000 design documents.

CI note: initial typecheck and build succeeded; one regeneration test failed while hostile projectiles were still active. The revised test isolates uninterrupted repair and checks that damage resets the delay. Added full stage-clear coverage. See Actions for the rerun.

P007 slice: fixed 9:16 logical playfield, narrow desktop phone preview, portrait menu cover, separate campaign navigation and workshop, controls page, consistent HUD and touch placement. No save schema or economy changes. Layout and combat pacing require manual review; see current Actions for test results.

P007.1: user reported oversized portrait layout. Capped outer frame at 360 CSS pixels, contained canvas independently from layout, and added Chromium checks at five desktop/mobile viewport sizes. GAS work deferred to a separate subsequent patch; no ability-system code committed here. See Actions for actual browser results.

P007.2: bottom Home/Fly/Workshop/Hangar navigation, animated original starter plane preview, actual combat defeat crumple and debris, reduced-motion fallback and immediate idempotent settlement before presentation. Hangar is preview only; no aircraft inventory or GAS yet. See CI for verification; visual review on a physical phone remains open.

P007.3: user reported broken/app-like presentation; prioritize layout and game feel before GAS. Flexible home scene grid, original cut-paper landscape, direct launch current unlocked stage, styled tabs and paper combat feedback. Browser checks now assert home content fits and is clickable without scrolling. Visual quality and unspecified reported bugs require user playtest; no claim that all bugs are resolved. GAS planned P007.4.

P007.3.1: user screenshot shows exact v0.0.7 menu wording with v0.0.10 footer and frame. Git main contains the new menu; Pages succeeded. Mixed runtime assets are confirmed by the screenshot, with browser/CDN caching the likely cause. Complete release fingerprint fixes stable module URLs, including nested imports. Tests exercise stale legacy URLs and save persistence; live browser cache on the user's device remains unverified. GAS remains deferred.

P007.3.2: touching an existing enemy destroys it immediately, grants the normal kill reward once and costs 20% of maximum paper durability, bypassing tape. Circular contact uses the player radius plus enemy radius. Multiple contacts cost separately; fatal contact is defeat even on the last enemy. Paper burst and HP feedback are visual. GAS and future boss-specific contact rules remain open. See Actions for checks; manual game-feel review pending.

P007.3.3: redesigned Fly and Workshop tabs; stage status follows highest unlocked stage (earlier stages cleared, latest current, final clear not recorded by v1 save). Mission reward is maximum base kill reward, not a completion bonus. Attack/Defence card previews use shared existing stat formulas. UI allows internal scrolling on short displays with fixed tabs; no change to progression rules or save schema. GAS still planned separately.

P007.4: lightweight Gameplay Ability System is integrated into the live simulation code for both factions. Attributes, cooldowns, timed effects, tags, damage, healing/tape restore and regeneration are run-local. Ramming still bypasses tape for 20% max HP. No special ability button, pickup spawns, new enemies or saved temporary effects yet. Balance and save v1 unchanged. See Actions for actual regression results; manual playtest remains open.

P007.4.1: every player aircraft starts with 0 tape and full HP; after the existing 3-second delay, base 8 tape/s regeneration begins. New capped permanent speed, repair rate and repair delay upgrades. Shared compact catalog in Workshop/Hangar; no aircraft ownership changes. Save schema 2 migrates schema 1 in place under the same storage key; previous fields retained, new levels zero, corrupt data remains protected. See CI; manual visual and balance review outstanding.

P008.1: original Dart plus Scout (faster sweeps/attack), Heavy (2x base HP, twin darts, larger contact radius) and Diver (fixed-target warning then dive/return). Gradual roster in three existing stages; same counts and scraps. Every third projectile kill drops Rapid Fire, Paper Repair or Power Boost in deterministic rotation; pickup lifetime 12s, max six on field, collect by contact. GAS-backed timers and heal; no persistent buffs. First boss is separate P008.2. Provisional combat values need manual playtesting. Previous v0.0.15 Pages deployment succeeded. See Actions for actual v0.0.16 checks.
