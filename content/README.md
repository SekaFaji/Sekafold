# Content data

Reserved for validated, versioned data definitions for aircraft, weapons, enemies, formations, campaign, upgrades and Endless scaling. No data has been implemented. Runtime schemas live in src/content; avoid duplicating balance constants in code. All IDs stable and unique; validate cross-references and numeric bounds. Introduce actual JSON or TypeScript content only with the relevant feature patch.
