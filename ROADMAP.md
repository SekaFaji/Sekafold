# Roadmap

P000 imported. P001-P006 have an initial playable vertical slice in v0.0.6; their complete acceptance gates remain open (see docs/STATUS.md). P007 portrait layout and main-menu slice implemented in v0.0.7; full art/audio and device review remain open. P007.1 compact portrait frame and Chromium layout regression gate in v0.0.8. P007.2 tab navigation, aircraft showcase and defeat feedback in v0.0.9. P007.3 presentation recovery in v0.0.10; P007.3.1 release cache isolation in v0.0.11; P007.3.2 aircraft contact in v0.0.12; P007.3.3 campaign and Workshop visual redesign in v0.0.13; P007.4 lightweight GAS implemented in v0.0.14; P007.4.1 empty starting tape and expanded compact upgrades in v0.0.15; P008.1 enemy variants and pickups in v0.0.16; active special abilities remain planned. The remainder of P008 and P009-P016 are planned. Versions are proposed; keep patches small and acceptance-driven rather than promise dates. Do not jump to monetization or large content before core quality.

| Patch | Version | Scope | Acceptance gate |
|---|---|---|---|
| P000 | 0.0.0 | Design docs, rules and scaffold | Documentation cross-links and archive verified; no runtime |
| P001 | 0.0.1 | Web engineering foundation | Approved stack, pinned deps, strict TS, lint/typecheck/test/build, responsive empty scene, Pages check setup |
| P002 | 0.0.2 | Flight and input | Twin-stick and desktop commands; responsive glide; release/cancel; pause; fixed-step tests |
| P003 | 0.0.3 | First combat slice | Original plane and dart; enemy formation; damage/hit/death; deterministic tests |
| P004 | 0.0.4 | Defense and combat feedback | Durability/reinforcement, repair delay, readable hit/crumple effects, reduced motion |
| P005 | 0.0.5 | Campaign and retry | Data-driven stages, victory/failure report, progression, replay, no duplicate rewards |
| P006 | 0.0.6 | Workshop economy and saves | Scraps, global damage/defense upgrades, fixed costs, validated versioned save, recovery tests |
| P007 | 0.0.7 | Art/UX pass (portrait/menu slice) | Original paper assets, usable phone HUD/menu, audio controls, real-device review |
| P007.1 | 0.0.8 | Compact portrait fit | 360px maximum, 9:16 battlefield, no page overflow, actual Chromium menu/battle navigation at multiple viewport sizes |
| P007.2 | 0.0.9 | Tabbed menu and crumple sequence | Persistent four-tab menu, starter showcase, frozen defeat presentation and reward settlement, portrait browser checks |
| P007.3 | 0.0.10 | Game presentation recovery | Home scene fits without scrolling; reachable controls, direct launch, tactile tabs and paper combat readability |
| P007.3.1 | 0.0.11 | Release cache isolation | Fingerprinted complete module graph and CSS; legacy-cache browser regression, preserved save |
| P007.3.2 | 0.0.12 | Aircraft contact damage | Destroy contacted enemy, 20% max durability bypassing tape, paper burst, single rewards and fatal-contact tests |
| P007.3.3 | 0.0.13 | Mission board and folding bench | Stage states, maximum base rewards, grouped illustrated upgrade cards, accurate previews and browser purchase checks |
| P007.4 | 0.0.14 | Lightweight GAS foundation | Migrate existing weapons and vitals without balance or save changes; test effects and ability lifecycles |
| P007.4.1 | 0.0.15 | Empty tape and compact upgrade catalog | Zero starting tape, three GAS-backed upgrades, v1 to v2 migration, shared Hangar/Workshop purchases |
| P008.1 | 0.0.16 | Enemy variants and battlefield pickups | Distinct Scout/Heavy/Diver patterns, readable telegraph, GAS pickups, existing stage rewards and collision rules |
| P008.2 | 0.0.17 | First boss (planned) | Boss pattern, short coherent chapter slice, reward/unlock once |
| P009 | 0.0.18 | Endless and Head Start | Separate mode, two clocks, 30s candidate curve, selectable unlocked offset, boss skipping/record tests |
| P010 | 0.1.0 | First playable alpha | Campaign + Endless, save integrity, touch playtests, documented balance/performance gaps |
| P011 | 0.1.x | Equipment unlocks | Direct purchase plus blueprint crafting, stable IDs, equip/preview, clear UI |
| P012 | 0.1.x | Content and replayability | Additional aircraft/weapons, temporary boosts, meaningful formations, balance iterations |
| P013 | 0.2.0 | Android prototype | Assess Capacitor or alternative; actual device build, offline, lifecycle, migration and thermal tests |
| P014 | 0.2.x | Closed playtest | Observe usability, retention and economy; polish based on evidence; no mandatory ads |
| P015 | 0.3.0+ | Optional monetization | Audience and policy review, consent, rewarded ads/cosmetics only if validated; failure/idempotence tests |
| P016 | 1.0.0 | Release candidate | Store compliance, privacy, signing, supported devices, performance, regression and release checklist |

## Scope guardrails
- First-MVP exception approved by the user's request to build a playable game: P001-P006 combined into a vertical slice. Follow-up patches return to small scope; no Android monetization.
- P002-P006 prove the core loop before producing a large catalog. Use a small campaign slice rather than all proposed chapters.
- P009 unlock condition may be first boss clear; define exact requirements before coding. Do not implement online rankings.
- P011 can be split into direct purchase and crafting patches if scope grows. Mastery, materials and secondary slots only when needed.
- Later backlog: harder chapter variants, additional worlds, offline recycler, prestige/refolding, automation, daily challenges, leaderboards, expanded cosmetics. Each requires a separate approved scope.

## Release criteria
Core fun and readable combat; reproducible tests; no known progression-loss or reward-duplication defects; actual device verification; original or licensed assets; compliant platform integrations; no fabricated release claims. Revisit this roadmap after every patch.
