# Contribution workflow

1. Read AGENTS.md and STATUS. Agree on a small patch and its acceptance criteria.
2. Start from the latest main commit; use a topic branch such as `feat/p001-foundation`.
3. Keep data, presentation, simulation and platform services separate. Add tests alongside behavior.
4. Review the diff and run all configured checks. Record actual results, including blocked checks.
5. Update changelog and current status. Request review; merge only after approval and passing checks, unless an explicit exception is documented.

Commit examples: `feat(combat): add deterministic projectile collision`, `fix(save): preserve rewards on retry`, `docs: clarify endless checkpoints`.

## Patch report template
- Patch ID/version and base commit
- Scope and excluded work
- Changed files and user-facing behavior
- Test commands, results, devices and screenshots (only if actually tested/captured)
- Save/content migration implications and rollback
- Remaining risks and recommended next patch

## Collaboration
Keep work reviewable for two developers; avoid editing the same module simultaneously. Use issues for decisions and bugs, and small pull requests for implementation. No automatic artifact ZIP generation. GitHub Pages is the proposed web test channel; deployment must be configured and verified before a playable URL is advertised.
