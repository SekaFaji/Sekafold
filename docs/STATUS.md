# Current project status

Updated: 2026-11-26 | Version: v0.0.7 | P007 portrait/menu slice

Implemented: three replayable stages, assisted gliding, mouse/keyboard and dual touch sticks, paper darts, three entry formations, enemy shots, durability and regenerating tape, flight reports, four permanent upgrades, local versioned saves. Original procedural paper graphics. CI and Pages workflows included; check actual Actions runs for verification.

This is a vertical slice spanning P001-P006, not the full P010 alpha. Balance is provisional. No boss, Endless, Head Start, crafting, audio, ads, Android build, or offline installation yet. Device and browser playtesting, accessibility, save repair UI, lockfile, lint/format tooling, and performance profiling are outstanding. Save corruption preserves raw data and disables writes; interrupted flights do not retain pending rewards.

Next: validate portrait controls, formations and menu usability in Pages on desktop and touch; then continue P007 art/audio and polish. Retain all P000 design documents.

CI note: initial typecheck and build succeeded; one regeneration test failed while hostile projectiles were still active. The revised test isolates uninterrupted repair and checks that damage resets the delay. Added full stage-clear coverage. See Actions for the rerun.

P007 slice: fixed 9:16 logical playfield, narrow desktop phone preview, portrait menu cover, separate campaign navigation and workshop, controls page, consistent HUD and touch placement. No save schema or economy changes. Layout and combat pacing require manual review; see current Actions for test results.
