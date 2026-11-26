# Mandatory project rules

Applies to the entire repository, including AI-generated patches. Read this file, README, docs/STATUS.md, docs/DECISIONS.md, the relevant design spec and ROADMAP.md before changing anything. Treat approved user decisions as authoritative; document changes rather than silently overriding them.

## 1. Scope and evidence
- Use the latest actual repository state or latest supplied archive, not stale snapshots. Check branch, commit and relevant files before editing.
- Implement one cohesive milestone or bug fix at a time. Never modify unrelated systems, rename APIs, rebalance existing content, or regenerate assets without a reason in scope.
- Do not invent implemented features, screenshots, test results, source findings, file paths or commits. Distinguish observed, proposed and unverified claims.
- Design-first for large changes; update the decision register when user approval changes scope. Do not treat a brainstorm as approval of numerical balance or new monetization.
- Original implementation and assets only unless explicit license review permits otherwise. Never copy Shootr code, assets, UI layouts or proprietary content. Record all asset and dependency provenance.

## 2. Clean code
- Prefer TypeScript strict mode, ES modules, explicit types at boundaries, small cohesive functions and meaningful names. Avoid `any`, unsafe casts and undocumented magic numbers.
- No monolithic game file, global mutable gameplay state, circular module imports, duplicated logic, hidden singletons, or unnecessary dependency/framework additions.
- Keep simulation independent of canvas, DOM, storage, ads, billing and device APIs. Rendering reads state; it never changes gameplay. UI sends commands rather than mutating state directly.
- Centralize balance values in typed content definitions; use stable IDs and validated schemas. No scattered hard-coded costs, caps or spawn rates.
- Use composition for aircraft, weapons, modifiers, effects and abilities. Build small shared primitives only when there is a concrete need; no speculative full ECS or heavyweight ability framework.
- Prefer deterministic fixed-step simulation, injectable seeded randomness, explicit units (seconds, world units, scraps), and separate visual time from simulation time.
- Manage object lifetimes, listeners, timers, pooling and cleanup explicitly. Reset all transient state on retry; avoid allocation-heavy per-frame logic where profiling shows a problem.
- Validate input, save data and content at boundaries; do not silently swallow exceptions or corrupt saves. Keep secrets and signing credentials out of Git and logs.
- Use clear English for names, docs and comments; use hyphens rather than em dashes in player-facing text. Comments explain why, not what.

## 3. Mobile, UX and accessibility
- Portrait-first phone-sized testing is the current primary layout (D015); account for aspect ratio, touch safe areas, interruption/resume and screen scaling. Keep menus legible and touch targets large enough for comfortable use.
- Keep twin-stick gameplay responsive. Do not require tiny buttons or obscure essential controls. Offer optional aim assistance, reduced motion/particles, adjustable audio and readable projectile contrast.
- Measure actual performance. Initial target: stable 60 FPS on agreed baseline devices; offer a 30 FPS quality fallback. Never claim targets met without measurements.
- Core play must work offline after installation; no mandatory account, ads, network request, or purchase. Ad and billing adapters default to unavailable until explicitly integrated.

## 4. Saves, rewards and balance
- Version save schemas. Supply migrations, validation, backup/recovery and tests before changing persistent data. Never erase existing progress as a routine patch step.
- Reward settlement must be idempotent. Skipped Endless time awards no scraps, kills, boss loot or survival time. Freeze difficulty while paused or backgrounded.
- Any economy change must document before/after formulas, caps, rationale and save implications. Do not use punitive failure, forced ads or energy gates.

## 5. Patch quality gates
- Before implementation: inspect current state, define scope and acceptance checks.
- During implementation: keep diffs focused; add/update tests for new behavior and regressions. Use formatter, lint, typecheck, unit tests and build when configured.
- After implementation: inspect diff for unrelated edits, test results and changed assets. If testing is blocked, report exactly which checks could not run. Do not label untested builds verified.
- Update CHANGELOG, ROADMAP status and docs/STATUS.md. Update relevant design/architecture decisions only if changed. Include migration notes when appropriate.
- Git: use a short-lived branch and reviewable commits; integrate into main only when requested/authorized and checks pass. Never force-push or rewrite history without explicit authorization. Do not fabricate Git actions.
- CI: small, reproducible checks. Avoid automatic full-project and drop-in ZIP artifacts; publish artifacts only when explicitly needed, with short retention. Prefer Pages deployment and ordinary Git history. Do not delete existing artifacts without permission.

## 6. Definition of done
A patch is done only when the scoped behavior and acceptance checks are met, required documentation is updated, the diff is clean, and actual test status is recorded. If a blocker remains, label the patch partial. Provide a concise summary, changed paths, tests actually run, known issues and next milestone. Supply ZIPs or screenshots only when requested and actually generated.
