# Design decision register

Use status `Accepted direction`, `Proposed`, `Deferred` or `Rejected`. Accepted direction means agreed in conversation, not implemented. Exact numbers in examples are not binding.

| ID | Status | Decision |
|---|---|---|
| D001 | Accepted direction | Paper airplanes, original layered papercraft aesthetic. |
| D002 | Accepted direction | Preserve incremental twin-stick shooter combat and permanent progression. |
| D003 | Accepted direction | Stage-based campaign plus separate unlockable Endless Survival. |
| D004 | Accepted direction | Assisted gliding: responsive free movement, slight momentum and banking. |
| D005 | Accepted direction | Endless difficulty progresses with time; permanent upgrade permits selecting higher starting difficulty. |
| D006 | Accepted direction | Direct equipment purchase plus blueprint crafting; avoid random-stat inventory clutter as core loop. |
| D007 | Accepted direction | Future Android commercial potential; brainstorm and document before implementation. |
| D008 | Proposed | Working title Sekafold; SekaFaji Games branding. |
| D009 | Proposed | Landscape-first, web prototype, desktop support; TypeScript + Canvas + Vite; evaluate Capacitor. |
| D010 | Proposed | 30-second difficulty steps, 5-minute boss intervals; Head Start costs and prerequisite; two clocks. |
| D011 | Proposed | Scraps, blueprints, workshop, direct unlocks, mastery, materials, slots and regenerating reinforcement. |
| D012 | Proposed | Chapter length, enemy roster, milestone rewards, formulas, temporary boosts, modes and difficulty tiers. |
| D013 | Proposed | Optional rewarded ads and cosmetic IAP only after retention validation; no forced ads or energy gates. |
| D014 | Deferred | Prestige, offline recycling, automation, online leaderboards, extra difficulty modes, premium currency. |
| D015 | Accepted direction | Portrait phone-sized preview and portrait playfield for current web testing; supersedes landscape-first layout in D009. Final Android orientation and optional landscape support remain open. |

| D016 | Accepted direction | Compact portrait phone testing frame, capped at 360 CSS pixels and fitted to the available viewport; no gameplay or save changes. |

| D017 | Accepted direction | Bottom Home/Fly/Workshop/Hangar navigation, animated equipped plane, brief paper crumple/burst on combat defeat before report. Single-aircraft preview until actual loadouts are implemented. |

| D019 | Accepted direction | Game-like presentation rather than an application dashboard. Home is a compact illustrated aircraft scene with direct flight launch and persistent tabs. Fix presentation before GAS. |

| D020 | Accepted direction | Contact destroys the current enemy aircraft and costs 20% of maximum player HP. Implementation choice: bypass tape, reset repair delay, grant normal kill rewards once, use existing circular radii. Future boss exceptions not defined. |

| D021 | Accepted direction | Fly as mission dossier with progress and reward previews; Workshop as illustrated Attack/Defence upgrade cards with actual stats and costs. Preserve existing stage/save semantics; final-stage clear tracking deferred. |

## Open design questions
- Title and audience (general vs children-directed); paper art mockup and readable color language.
- How many weapons, stats and slots are truly necessary? Aiming direction vs flight facing and firing behavior.
- Stage victory, retry rules, difficulty curve, boss cadence, health/reinforcement and pickups.
- Whether Head Start levels require prior difficulty reached, completed interval or boss clear; exact pricing; how to handle skipped power-ups.
- Whether scraps are awarded instantly or settled at battle end, and how crashes recover pending rewards.
- Which materials affect stats, whether aircraft mastery is needed, and how blueprint drops work.
- Android packaging, billing, privacy/consent, and playtest acceptance thresholds.

When a decision is finalized, add the date, rationale and affected documents; keep previous decisions traceable.
