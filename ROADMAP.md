# Roadmap

P000 imported. P001-P006 have an initial playable vertical slice in v0.0.6; their complete acceptance gates remain open (see docs/STATUS.md). P007-P016 are planned. Versions are proposed; keep patches small and acceptance-driven rather than promise dates. Do not jump to monetization or large content before core quality.

| Patch | Version | Scope | Acceptance gate |
|---|---|---|---|
| P000 | 0.0.0 | Design docs, rules and scaffold | Documentation cross-links and archive verified; no runtime |
| P001 | 0.0.1 | Web engineering foundation | Approved stack, pinned deps, strict TS, lint/typecheck/test/build, responsive empty scene, Pages check setup |
| P002 | 0.0.2 | Flight and input | Twin-stick and desktop commands; responsive glide; release/cancel; pause; fixed-step tests |
| P003 | 0.0.3 | First combat slice | Original plane and dart; enemy formation; damage/hit/death; deterministic tests |
| P004 | 0.0.4 | Defense and combat feedback | Durability/reinforcement, repair delay, readable hit/crumple effects, reduced motion |
| P005 | 0.0.5 | Campaign and retry | Data-driven stages, victory/failure report, progression, replay, no duplicate rewards |
| P006 | 0.0.6 | Workshop economy and saves | Scraps, global damage/defense upgrades, fixed costs, validated versioned save, recovery tests |
| P007 | 0.0.7 | Art/UX pass | Original paper assets, usable phone HUD/menu, audio controls, real-device review |
| P008 | 0.0.8 | Enemy diversity and boss | Three or more patterns, first boss, short coherent chapter slice, reward/unlock once |
| P009 | 0.0.9 | Endless and Head Start | Separate mode, two clocks, 30s candidate curve, selectable unlocked offset, boss skipping/record tests |
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
