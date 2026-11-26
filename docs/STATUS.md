# Current project status

Updated: 2026-11-26 | Version: v0.0.6 | First campaign MVP

Implemented: three replayable stages, assisted gliding, mouse/keyboard and dual touch sticks, paper darts, three entry formations, enemy shots, durability and regenerating tape, flight reports, four permanent upgrades, local versioned saves. Original procedural paper graphics. CI and Pages workflows included; check actual Actions runs for verification.

This is a vertical slice spanning P001-P006, not the full P010 alpha. Balance is provisional. No boss, Endless, Head Start, crafting, audio, ads, Android build, or offline installation yet. Device and browser playtesting, accessibility, save repair UI, lockfile, lint/format tooling, and performance profiling are outstanding. Save corruption preserves raw data and disables writes; interrupted flights do not retain pending rewards.

Next: validate controls and balance in Pages; address any defects, then P007 art and UX. Retain all P000 design documents.

CI note: initial typecheck and build succeeded; one regeneration test failed while hostile projectiles were still active. The revised test isolates uninterrupted repair and checks that damage resets the delay. Added full stage-clear coverage. See Actions for the rerun.
