import {FLIGHT} from './balance.js';
import type {AbilityDefinition} from '../game/abilities/runtime.js';
import type {GameplayTag} from '../game/abilities/attributes.js';
const blockedTags:readonly GameplayTag[]=['state.disarmed','state.stunned'];
export const PAPER_DART:AbilityDefinition={id:'weapon.paper-dart',cooldown:'fireDelay',blockedTags};
export const ENEMY_DART:AbilityDefinition={id:'weapon.enemy-dart',cooldown:'fireDelay',blockedTags};
export const ENEMY_WEAPON={damage:8,initialDelay:1.2,slotDelay:.25};
export const PROJECTILE_SPEED={player:FLIGHT.bulletSpeed,enemy:FLIGHT.enemyBulletSpeed};
