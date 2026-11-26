# Sekafold

**An original paper-airplane incremental twin-stick shooter by SekaFaji Games.**

> Working title | Foundation v0.0.0 | Design stage | 2026-11-26

Fight organized paper-aircraft squadrons, collect scraps, improve your aircraft and push deeper into a handmade paper universe. A stage-based campaign unlocks new equipment and environments; Endless Survival offers escalating difficulty and purchasable starting checkpoints. Players retain earned progression even after defeat.

## Project status

Documentation and directory scaffold only. No game, dependencies, assets, build pipeline, Android package or deployed website exists in this foundation. Do not claim that any feature is implemented. No external game code or assets are included.

## Start here

1. [AGENTS.md](AGENTS.md) - mandatory project rules for humans and coding agents.
2. [Game design](docs/design/GAME_DESIGN.md) - gameplay and creative vision.
3. [Decision register](docs/DECISIONS.md) - approved directions versus unresolved proposals.
4. [Architecture](docs/engineering/ARCHITECTURE.md) - technical boundaries and planned source tree.
5. [Roadmap](ROADMAP.md) - ordered milestones and acceptance gates.
6. [Current status](docs/STATUS.md) - latest verified state and next task.
7. [Sources](docs/research/SOURCES.md) - reference provenance and IP restrictions.

## Platform and approach

Mobile-first landscape, with desktop keyboard/mouse and optional controller support. Proposed first delivery: TypeScript, HTML5 Canvas and a lightweight web build, tested through GitHub Pages; Android packaging to be evaluated on real devices. All technology choices remain provisional until the engineering foundation is accepted.

## Repository map

```text
AGENTS.md              Mandatory project rules
README.md              Project entry point
ROADMAP.md             Milestones and acceptance criteria
CHANGELOG.md           Verified changes by version
CONTRIBUTING.md         Collaboration and patch workflow
docs/                  Design, architecture, decisions, references and QA
src/                   Planned application modules (empty placeholders)
content/               Data definitions for gameplay and balance
assets/                Original art, audio and provenance records
tests/                 Unit, integration and smoke test locations
tools/                 Future validation and development scripts
platform/              Future Android integration boundary
.github/               Future pull request checks and CI
```

## Ownership

Project attribution: SekaFaji Games. Working title, final legal ownership, contributor rights and distribution license are not yet finalized. No public licensing grant is made by this scaffold. Obtain explicit agreement before publishing code, using third-party assets or launching commercially.
