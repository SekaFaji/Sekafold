# Current project status

Updated: 2026-11-26 | Version: v0.0.12 | P007.3.2 aircraft contact

Implemented: three replayable stages, assisted gliding, mouse/keyboard and dual touch sticks, paper darts, three entry formations, enemy shots, durability and regenerating tape, flight reports, four permanent upgrades, local versioned saves. Original procedural paper graphics. CI and Pages workflows included; check actual Actions runs for verification.

This is a vertical slice spanning P001-P006, not the full P010 alpha. Balance is provisional. No boss, Endless, Head Start, crafting, audio, ads, Android build, or offline installation yet. Device and browser playtesting, accessibility, save repair UI, lockfile, lint/format tooling, and performance profiling are outstanding. Save corruption preserves raw data and disables writes; interrupted flights do not retain pending rewards.

Next: validate portrait controls, formations and menu usability in Pages on desktop and touch; then continue P007 art/audio and polish. Retain all P000 design documents.

CI note: initial typecheck and build succeeded; one regeneration test failed while hostile projectiles were still active. The revised test isolates uninterrupted repair and checks that damage resets the delay. Added full stage-clear coverage. See Actions for the rerun.

P007 slice: fixed 9:16 logical playfield, narrow desktop phone preview, portrait menu cover, separate campaign navigation and workshop, controls page, consistent HUD and touch placement. No save schema or economy changes. Layout and combat pacing require manual review; see current Actions for test results.

P007.1: user reported oversized portrait layout. Capped outer frame at 360 CSS pixels, contained canvas independently from layout, and added Chromium checks at five desktop/mobile viewport sizes. GAS work deferred to a separate subsequent patch; no ability-system code committed here. See Actions for actual browser results.

P007.2: bottom Home/Fly/Workshop/Hangar navigation, animated original starter plane preview, actual combat defeat crumple and debris, reduced-motion fallback and immediate idempotent settlement before presentation. Hangar is preview only; no aircraft inventory or GAS yet. See CI for verification; visual review on a physical phone remains open.

P007.3: user reported broken/app-like presentation; prioritize layout and game feel before GAS. Flexible home scene grid, original cut-paper landscape, direct launch current unlocked stage, styled tabs and paper combat feedback. Browser checks now assert home content fits and is clickable without scrolling. Visual quality and unspecified reported bugs require user playtest; no claim that all bugs are resolved. GAS planned P007.4.

P007.3.1: user screenshot shows exact v0.0.7 menu wording with v0.0.10 footer and frame. Git main contains the new menu; Pages succeeded. Mixed runtime assets are confirmed by the screenshot, with browser/CDN caching the likely cause. Complete release fingerprint fixes stable module URLs, including nested imports. Tests exercise stale legacy URLs and save persistence; live browser cache on the user's device remains unverified. GAS remains deferred.

P007.3.2: touching an existing enemy destroys it immediately, grants the normal kill reward once and costs 20% of maximum paper durability, bypassing tape. Circular contact uses the player radius plus enemy radius. Multiple contacts cost separately; fatal contact is defeat even on the last enemy. Paper burst and HP feedback are visual. GAS and future boss-specific contact rules remain open. See Actions for checks; manual game-feel review pending.
