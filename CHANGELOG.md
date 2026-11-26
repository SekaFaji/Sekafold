# Changelog

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
