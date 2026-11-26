# Game design document - Sekafold (working title)

Version 0.1 design draft | 2026-11-26 | No implementation

## Vision and pillars
An original mobile-first top-down paper-airplane incremental shooter. A simple folded aircraft evolves into a customized combat machine in a handmade paper universe. Responsive dodging and aiming reward skill; every battle contributes to permanent growth. Preserve the appeal of Shootr without replicating its code, presentation or assets.

Pillars: satisfying immediate combat; visible permanent power growth; organized enemy formations rather than pure chasing hordes; charming readable paper art; short sessions with long-term goals; optional commercial features without mandatory spending.

## Player loop
1. Select the next campaign stage or replay a cleared stage. Later select Endless and a starting difficulty.
2. Equip an aircraft and available weapon/loadout; launch.
3. Glide and aim independently, destroy squadrons, dodge readable attacks, collect temporary boosts and earn scraps.
4. Complete the objective or be defeated. Settle only earned rewards once, update records and eligible unlocks.
5. Return to the Workshop; purchase stat upgrades, unlock equipment directly or craft using blueprints and scraps; retry or advance.

Proposed first battle duration: 30-180 seconds. No lives or energy system. No permanent progress lost on defeat. A retry starts a fresh battle; temporary effects reset. Exact reward settlement and crash handling are engineering requirements to finalize before implementation.

## Combat
Landscape twin-stick: left movement, right aiming and firing; mouse/keyboard on desktop. Assisted gliding means quick directional control with small acceleration/deceleration and visual banking, not forced forward travel. Separate aim from movement. Candidate accessibility option: auto-aim/auto-fire, adjustable stick size, reduced motion and effects. Decide idle facing and joystick deadzones through prototypes.

Player durability is main health. Proposed reinforcement is an outer regenerating tape layer: damage hits reinforcement first; after a delay without damage it regenerates at a configurable rate. Main durability requires repair pickups or explicit abilities, and resets at a new battle. Enemies telegraph attacks; damage, collision and invulnerability rules must be defined and tested. Damage effects use creases, tears and a crumple animation; visuals never change hitboxes.

Enemy patterns: arrows, side squadrons, rings, coordinated dives, shields and escorts. Enemy archetypes: basic dart, interceptor, tank/cardboard aircraft, bomber, formation leader. Start small; bosses and advanced attacks expand later. Every stage must have purposeful compositions, not merely higher health.

## Campaign
Main mode; proposed chapter layout of 10 stages, including mini-boss and final boss. Clear all required encounters to advance; stages remain replayable. Unique boss rewards unlock new content. Candidate chapters: The Notebook, The Desk, Paper City, Paper Ocean, Paper Space. Only Notebook is initial scope; further chapters are concepts. Chapter 1 should introduce systems gradually: movement, aiming, rewards, upgrade purchase, enemy patterns, boss.

Proposed hard/expert tiers can reuse environments with altered patterns and reward multipliers, deferred until normal campaign works. See ENDLESS.md for the separate survival mode.

## Progression and equipment
Permanent stat upgrades in Workshop; no arbitrary cap on damage/durability/scrap progression in design, but engineering must handle numeric range and realistic late-game scaling. Cap movement, fire rate, critical chance, resistance and projectile count for readability/performance. Global upgrades carry between modes. Weapon mastery, aircraft mastery, additional slots and materials are optional later layers, not MVP prerequisites.

Direct purchase: show fixed price and known stats; unlock specific aircraft/weapon/material. Blueprint crafting: earn a known recipe from milestones, bosses, achievements or later rare drops; spend scraps to craft once. Avoid random-stat duplicate items. Decide whether blueprints are consumed or permanently learned before implementation. See PROGRESSION.md.

## World and UI
Workshop is a paper desk/notebook-inspired menu: Play, Upgrades, Hangar, Collection, Settings. Main navigation must remain obvious and quick. Campaign chapter selection and Endless checkpoint selection are separate. Battle HUD: health/reinforcement, objective or two Endless clocks, scraps, pause. Flight Report: outcome, actual earned scraps, kills, time, records, retry and workshop. Never use simulated screenshots as proof of implemented UI.

## Monetization and long-term scope
See MONETIZATION.md. Offline recycling, prestige/refolding, daily challenges, leaderboards and advanced automation are deferred. Build the first fun combat loop before adding retention or revenue systems.

## MVP acceptance
One original aircraft, one main weapon, at least three distinguishable enemy patterns, a small sequence of campaign stages with a boss, permanent scrap upgrades, save/load, responsive landscape controls and a clear retry loop. Endless arrives after campaign foundations, with Head Start and reward/record integrity tests. All features must be testable on desktop and a real Android-class touch device before commercial packaging.
