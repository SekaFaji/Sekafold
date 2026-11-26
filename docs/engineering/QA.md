# Quality and test plan

No test runner or runtime exists yet. The following is a planned matrix.

| Area | Required verification |
|---|---|
| Foundation | Clean install from lockfile, typecheck, lint, unit tests, production build; console free of unexpected errors |
| Input | Simultaneous two-finger movement/aim, release/cancel, keyboard/mouse, pause, viewport resize, no stuck input |
| Combat | Direction, cooldown, hit detection, damage routing, enemy death once, clean retry |
| Campaign | Deterministic encounter order, clear/fail, replay, unlock and boss reward once |
| Economy | Affordability, no negative wallet, duplicate transaction prevention, save/load, upgrade effect |
| Endless | Clock boundary, skipped rewards, offset limits, next boss boundary, pause/resume, records and long-run stress |
| Persistence | Migration, malformed/old data, backup/recovery, reset confirmation, interrupted writes |
| Mobile | Landscape phone aspect ratios, safe areas, touch targets, rotation/background, offline, memory/thermal profiling |
| Art | Contrast, readable projectiles, consistent pivots, reduced motion, stable hitboxes |
| Android later | Install/upgrade, offline start, billing/ad callback failure, restoration, consent, release signing |

Use deterministic simulation tests for rules; integration tests for scene/transaction flow; browser smoke tests for input and UI; manual real-device playtests for controls, performance and balance. Candidate baseline target 60 FPS, fallback 30 FPS, establish exact hardware and test scenarios before claims. Document measured FPS/frame times, active entity counts and device/browser/build ID. Capture screenshots only from actual running build and label device/commit. Test failure is not a pass; blocked tests must be reported.
