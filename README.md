# Sekafold

**An original paper-airplane incremental twin-stick shooter by SekaFaji Games.**

First campaign MVP v0.0.12 with portrait phone preview and a redesigned main menu. Fly through organized paper squadrons, earn scraps, upgrade your aircraft and replay stages. Campaign and separate Endless Survival are the long-term direction; Endless is not implemented yet.

## Play / develop
- [Browser playtest](https://sekafaji.github.io/Sekafold/) (requires successful Pages deployment; select GitHub Actions in Settings > Pages).
- [Actions](https://github.com/SekaFaji/Sekafold/actions)
- Node 22: `npm install`, `npm test`, `npm start`. TypeScript 5.8.3, Canvas, no runtime dependencies. Build output in dist.
- WASD/arrows move, mouse aims, hold left click or Space to shoot. Touch: left stick move, right stick aim/fire. Escape pauses. Compact portrait preview is capped at 360 CSS pixels and fits smaller viewports. Browser regression checks: npm run test:browser (Google Chrome required).

## Start here
1. [AGENTS.md](AGENTS.md) - mandatory project rules.
2. [Game design](docs/design/GAME_DESIGN.md)
3. [Decision register](docs/DECISIONS.md)
4. [Architecture](docs/engineering/ARCHITECTURE.md)
5. [Roadmap](ROADMAP.md)
6. [Current status](docs/STATUS.md)
7. [Sources](docs/research/SOURCES.md)
8. [Changelog](CHANGELOG.md)

## Ownership
Project attribution: SekaFaji Games. Working title, final legal ownership, contributor rights and distribution license are not yet finalized. No public licensing grant is made. Original implementation and procedural artwork; Shootr is a design reference only.

## Release packaging
`npm run build` generates compiled unit-test modules in `dist/src` and the deployable site in `dist/site`. HTML references a content-fingerprinted release directory containing the entire JS module graph and stylesheet. Serve only `dist/site`. A fresh page load selects the new asset namespace; existing local saves remain on the same origin and key.
