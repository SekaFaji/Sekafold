# Android release and monetization principles

Commercial planning only. No SDK, payments, analytics or ads are integrated. Prices, audience and release markets are undecided.

## Product approach
Validate the core loop, controls and repeat play first. Keep core gameplay playable without purchases, ads, connection or account. Candidate revenue: explicit opt-in rewarded ad after battle for a transparent extra scrap reward; optional one-time revive (must be balanced and separate from records if it affects fairness); direct cosmetic purchases for patterns/trails/stickers; optional supporter pack. Avoid forced ads, energy gates, paid-only best aircraft, loot boxes and deceptive prompts. No premium currency required at launch.

## Engineering safeguards
A platform service exposes ad availability and reward callbacks; no simulation dependency on ad SDK. Grant only confirmed reward callbacks, once per transaction, and handle failures, dismissal, offline state and app interruption safely. Purchases require verified entitlement/transaction handling, restore support and refund/revocation policy. Never store payment credentials. Ad unavailable means normal play continues. Any paid benefit must be clearly disclosed.

## Release gates
Determine intended audience before integrating advertising; paper visuals may appeal to children but do not alone establish target age. Review current Google Play policies on ads, payments, Families, privacy/data safety, target SDK, testing and store listing at release time. Assess consent and EU privacy obligations for actual data flows. Choose SDKs only after compliance and performance review. No personal data collection by default; local metrics first. Test real Android devices, offline behavior, background/resume, low memory, thermal performance, purchase restoration and consent flows.

## Validation
Observe tutorial completion, first-session return to workshop, repeat sessions, retention and perceived fairness in opt-in playtests. If monetization is later enabled, measure rewarded-ad opt-in, conversion, revenue and effect on retention without overstating results. No revenue projections yet. Source links in docs/research/SOURCES.md are starting points, not legal clearance.
