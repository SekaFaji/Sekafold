# Lightweight gameplay ability system - P007.4

An original TypeScript runtime inspired by the general Gameplay Ability System concept, not a port or dependency. This patch is a behavior-preserving refactor.

## Modules

- `src/game/abilities/attributes.ts`: immutable base attributes, bounded timed effects, exact-match gameplay tags and effective stats.
- `src/game/abilities/runtime.ts`: per-aircraft ability grants, cooldown checks, damage, durability, tape, healing and regeneration.
- `src/game/entities/aircraft.ts`: constructs the player and enemies with independent runtime state. Read-only HP getters keep existing HUD and renderer consumers compatible.
- `src/content/weapons.ts`: paper dart and enemy dart definitions; existing projectile speed and enemy attack values.
- `src/game/combat/battle.ts`: orchestrates simulation, movement, projectiles, collision, death and rewards. Only a lethal transition grants a kill reward.

## Attributes and lifecycle

Permanent Workshop formulas remain in balance.ts. The runtime snapshots them at battle creation. Effective damage, fire delay, speed, repair delay and repair rate are modifiable. Max durability and tape capacities stay fixed for a flight; temporary capacity semantics require a future design. The effective value is (base + sum of additive modifiers) * product of multipliers, bounded to nonnegative finite values (fire delay has a .01s floor). Up to 32 simultaneous effect IDs per aircraft. Applying the same ID replaces the full definition and resets duration, not stacks. Different IDs combine. Definitions are copied on application. Tags are exact names such as state.stunned or buff.damage; state.dead is derived and cannot be granted by an effect. Expiry/removal removes that effect's modifiers/tags, not other effects sharing a tag.

Ability definitions carry a stable ID, cooldown (fixed seconds or effective fireDelay), required and blocked tags. Grants and timers are actor-local. Activation checks alive state, tags and cooldown, then commits cooldown before dispatching a synchronous simulation command. Current darts are blocked by disarmed/stunned tags. Cooldown snapshots effective delay at activation; later modifier changes do not retroactively alter an active timer. A capped projectile array still consumes the fire attempt's cooldown, as before. No ability charges, resource costs, channeling, networking or generalized targeting yet.

Advance only with active simulation dt. Expire effects and decrement cooldowns, then regenerate tape when the repair delay is met. Pausing or backgrounding stops the Battle step. Dead actors cannot activate, apply effects, heal or regenerate. Retry creates a fresh runtime. Healing/tape restoration are capped, non-reviving primitives for future pickups.

## Damage

Normal projectiles absorb through tape first, then paper durability; damage resets repair delay. Ramming destroys the contacted enemy and costs exactly 20% of player max HP, bypassing tape. Existing hit order and rewards remain: contact before enemy firing/projectile resolution, one reward per destroyed enemy, fatal contact remains defeat. No new damage resistance, boss exceptions or hit invulnerability. Projectile damage snapshots at spawn.

## Adding content later

Define a new ability in content, grant it to the relevant aircraft, and trigger through runtime.activate with a simulation callback. A pickup can apply a timed effect (for example a damage multiplier for five seconds), heal or restore tape. Do not write another independent cooldown or directly mutate HP. Wire inputs, feedback, data validation and regression tests in the relevant content patch. Paper Burst, pickup drops and additional enemies are not enabled in P007.4.

## Verification

Run npm test and npm run test:browser. Tests cover effects, replacement/expiry, copied definitions, tags, cooldowns, shared damage, repair, death, retry, real weapon activation, baseline cadence and previous collision/reward/save regressions. Real-device performance and manual game-feel review remain outstanding. No new dependencies or save migration.

## P007.4.1
Player factory passes initialTape=0; generic runtime defaults to full capacity unless explicitly configured. The permanent stat snapshot now includes speed, repairRate and repairDelay upgrades. All are live GAS base attributes. No temporary state persisted. Profile schema 2 adds permanent levels only.

## P008.1
Enemy kind definitions grant the same dart ability with independent stats; heavy attack emits two projectiles per activation. The movement module computes diver warning/attack phase and target without wall-clock timers. BattlefieldPickups applies RAPID_EFFECT and POWER_EFFECT through GAS or invokes heal, without modifying persistent upgrades. All drops are simulation-local, deterministic, capped and reset with Battle.
