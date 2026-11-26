# First campaign vertical slice

User approved building the first MVP in the new GitHub repository. To make a usable vertical slice rather than an empty engine, P001-P006 are combined. Their full acceptance gates remain open where not verified; see STATUS. Use direct TypeScript compilation instead of Vite for now: no bundler required for these browser ES modules, relative URLs work on Pages. TypeScript 5.8.3 is the only development dependency. No imported game assets.

Initial balance is experimental: three stages of 3-5 waves, 4-6 enemies per wave, four capped upgrades, 20 * 1.25^level costs rounded up; damage +0.25, durability +8, reinforcement +5, fire rate +6% per level (denominator). All values centralized in balance.ts or Battle derived-stat construction. Caps protect numeric safety until late-game strategy is designed. Current rewards settle once on reports, including voluntary end flight; no crash recovery for in-flight rewards. Local save v1 backs up prior valid state; invalid saves are read-only to preserve original data. No production recovery interface yet.

CI runs typecheck, compilation and node tests. Pages uses only the deployable site artifact, one-day retention, no recurring source ZIPs. GitHub Pages must use GitHub Actions as source; activation is not the same as enabling Actions. Real browser and phone testing still required. 
