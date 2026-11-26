# Proposed technical architecture

Decision pending: TypeScript strict, Vite web build, Canvas 2D renderer, DOM/CSS menus and accessible controls; Node-based tests (candidate Vitest) and browser smoke checks (candidate Playwright). Prefer minimal dependencies; pin selected versions and commit lockfile at P001. Evaluate Canvas performance before adopting a rendering library. Capacitor Android wrapper is a candidate, not an accepted or tested choice.

## Module boundaries
| Path | Responsibility |
|---|---|
| src/app | Bootstrap, scene transitions, application composition |
| src/core | Fixed timestep, seeded RNG, vector math, events and lifecycle primitives |
| src/input | Touch, keyboard, mouse, controller normalization into commands |
| src/game | Battle state, modes, combat, AI, spawning, entities and effects |
| src/progression | Upgrade costs, equipment unlocks, rewards, records and economy |
| src/content | Typed schemas, loading and validation of data in content/ |
| src/render | Canvas rendering, sprite drawing, visual-only particles and camera |
| src/ui | Menus, HUD, settings, end-of-run summaries |
| src/persistence | Save envelope, migrations, backup and storage adapter |
| src/platform | Platform interfaces for lifecycle, audio, ads, billing and device services |

Simulation depends on core + validated content, not renderer, UI or platform. Input produces commands; simulation processes them and emits domain events; app coordinates rewards and state transitions; UI/renderer consume read-only snapshots. Progression and persistence remain independently testable. Data IDs must not depend on filenames or display text. No game state in DOM, no ad SDK in combat.

## Runtime contract
Use requestAnimationFrame for presentation and a fixed 1/60s simulation step as candidate, with bounded catch-up and explicit pause on background. Delta handling must not generate burst spawns or reward duplicate events. Seeded RNG for reproducible simulation tests; separate visual RNG. Use logical world coordinates and aspect-safe viewport transform; map touch coordinates to world coordinates. Profile before optimizing, then bound active projectile/enemy counts, reuse frequently allocated objects if beneficial and cache background/geometry. DPR cap and visual quality settings as candidates. Use Web Audio only after user interaction; stop/pause correctly.

## Combat and modifier model
Data-driven weapon definitions (cooldown, projectile, targeting, damage, effects); components for transform, health, movement, weapon state and faction. Small effect lifecycle (apply, tick, expire) with explicit stacking rule and duration. Shared damage pipeline: validate hit, resistance, reinforcement, durability, event, death. Start simple; introduce additional abilities only when needed. No full GAS clone or speculative ECS. Unit tests should exercise damage and effect logic without canvas.

## Save model (proposed)
Envelope: schemaVersion, gameVersion, profile, settings, owned upgrades, unlocked/crafted/equipped IDs, campaign clears, Endless records, wallet, processed transaction IDs (bounded or otherwise durable replay protection). Store transient battle state separately if checkpoint recovery is later supported. Validate and migrate using tested incremental versions; preserve backup before overwrite. Corrupt save: offer backup recovery/export and explicit reset, never silently delete. Web adapter initially local storage or IndexedDB after evaluation; native adapter through platform boundary. Client save is not authoritative for future online rankings or purchases. Decide number representation before unlimited progression.

## Build and delivery
P001 configures dev, build, format, lint, typecheck and test scripts; document actual commands then. GitHub Actions can run checks and Pages build with correct relative base; do not create recurring ZIP artifacts. Use actual commit and deployment links only. Android packaging follows performance validation; keep signing secrets out of repo, test release builds and migrations. No CI workflow is active in P000.

## Release integrity (P007.3.1)
The build cleans dist, compiles to dist/src for unit tests, then assembles dist/site with HTML referencing releases/vVERSION-HASH/style.css and releases/vVERSION-HASH/src/app/main.js. The hash includes template, stylesheet, version, paths and all compiled files. Relative imports stay inside that namespace. Pages and local serve only dist/site. Do not solve stale imports by adding a query solely to the entry module. Existing localStorage stays on the same origin and key. Old cached HTML may need one reload to obtain the new release; there is no guarantee of immediate CDN propagation.
