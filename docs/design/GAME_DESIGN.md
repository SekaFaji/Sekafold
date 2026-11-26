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
Portrait-first twin-stick (D015): left movement, right aiming and firing; mouse/keyboard on desktop. Assisted gliding means quick directional control with small acceleration/deceleration and visual banking, not forced forward travel. Separate aim from movement. Candidate accessibility option: auto-aim/auto-fire, adjustable stick size, reduced motion and effects. Decide idle facing and joystick deadzones through prototypes.

Player durability is main health. Proposed reinforcement is an outer regenerating tape layer: damage hits reinforcement first; every flight starts with zero tape, and after a delay without damage it regenerates at a configurable rate. Main durability requires repair pickups or explicit abilities, and resets at a new battle. Enemy aircraft contact destroys the current enemy and deducts 20% of the player's maximum paper durability directly, ignoring tape reinforcement. Contact resets repair delay and awards the normal kill reward once. Multiple contacts are separate hits; a fatal contact is defeat. Future boss collision exceptions are undecided. Enemies telegraph attacks; remaining damage and invulnerability rules must be defined and tested. Damage effects use creases, tears and a crumple animation; visuals never change hitboxes.

Enemy patterns: arrows, side squadrons, rings, coordinated dives, shields and escorts. Enemy archetypes: basic dart, interceptor, tank/cardboard aircraft, bomber, formation leader. Start small; bosses and advanced attacks expand later. Every stage must have purposeful compositions, not merely higher health.

## Campaign
Main mode; proposed chapter layout of 10 stages, including mini-boss and final boss. Clear all required encounters to advance; stages remain replayable. Unique boss rewards unlock new content. Candidate chapters: The Notebook, The Desk, Paper City, Paper Ocean, Paper Space. Only Notebook is initial scope; further chapters are concepts. Chapter 1 should introduce systems gradually: movement, aiming, rewards, upgrade purchase, enemy patterns, boss.

Proposed hard/expert tiers can reuse environments with altered patterns and reward multipliers, deferred until normal campaign works. See ENDLESS.md for the separate survival mode.

## Progression and equipment
Permanent stat upgrades in the shared Workshop/Hangar catalog; no arbitrary cap on damage/durability/scrap progression in design, but engineering must handle numeric range and realistic late-game scaling. Cap movement, fire rate, critical chance, resistance and projectile count for readability/performance. Global upgrades carry between modes. Weapon mastery, aircraft mastery, additional slots and materials are optional later layers, not MVP prerequisites.

Direct purchase: show fixed price and known stats; unlock specific aircraft/weapon/material. Blueprint crafting: earn a known recipe from milestones, bosses, achievements or later rare drops; spend scraps to craft once. Avoid random-stat duplicate items. Decide whether blueprints are consumed or permanently learned before implementation. See PROGRESSION.md.

## World and UI
The current main menu uses Home, Fly, Workshop and Hangar bottom tabs. Home showcases the equipped starter aircraft; Fly contains campaign stages and locked Endless. Collection and Settings remain future work. Main navigation must remain obvious and quick. Campaign chapter selection and Endless checkpoint selection are separate. Battle HUD: health/reinforcement, objective or two Endless clocks, scraps, pause. Flight Report: outcome, actual earned scraps, kills, time, records, retry and workshop. Never use simulated screenshots as proof of implemented UI.

## Monetization and long-term scope
See MONETIZATION.md. Offline recycling, prestige/refolding, daily challenges, leaderboards and advanced automation are deferred. Build the first fun combat loop before adding retention or revenue systems.

## MVP acceptance
One original aircraft, one main weapon, at least three distinguishable enemy patterns, a small sequence of campaign stages with a boss, permanent scrap upgrades, save/load, responsive portrait controls and a clear retry loop. Endless arrives after campaign foundations, with Head Start and reward/record integrity tests. All features must be testable on desktop and a real Android-class touch device before commercial packaging.

## P008.1 combat content (provisional implemented values)
The first wave of stage 1 stays all basic Darts. Scout appears in wave 2, Heavy in wave 3; Diver arrives in stage 2 wave 3, with more mixed formations later. Each stage retains the original wave count, enemies per wave and scrap reward per kill. Enemy definitions: Dart unchanged; Scout 0.75x stage HP rounded up (min 1), speed 75, damage 5, fire interval 1.9s, radius 13; Heavy 2x HP, speed 26, twin darts at ±0.18 rad, 7 damage each, interval 3.5s, radius 24; Diver 1.25x HP rounded up, speed 48, damage 6, interval 3.1s, radius 17. Diver's six-second cycle captures player position at warning (2.8s), dives from 3.5s to 4.45s and returns until 5.5s; slots stagger by 0.13s. Warning and diving suppress normal firing. All current enemy types are destroyed on contact and cost 20% max player HP, bypassing tape.

Every third projectile kill (not ramming) spawns the next token in the repeating Rapid Fire, Paper Repair, Power Boost sequence. Fly within 27 world units to collect; tokens expire after 12s and oldest is evicted at six simultaneous drops. Rapid Fire multiplies firing delay by 0.65 for 6s, Power Boost multiplies dart damage by 1.5 for 6s, Paper Repair restores up to 20% max HP immediately. Same effect refreshes; different effects coexist. Pickups, timers and rotation reset on retry. Victory still ends immediately after final wave, so uncollected tokens are lost. No permanent reward/economy changes. Boss, Paper Burst and Endless remain future work.
