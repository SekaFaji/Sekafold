import {WORLD,aircraftStats,type Upgrade} from '../../content/balance.js';
import {PAPER_DART,ENEMY_DART,ENEMY_WEAPON} from '../../content/weapons.js';
import {AbilityRuntime} from '../abilities/runtime.js';
import {ENEMIES,type EnemyKind} from '../../content/enemies.js';
export interface Vec {x:number;y:number}
interface Body extends Vec {angle:number;readonly abilities:AbilityRuntime;readonly hp:number;readonly maxHp:number}
export interface Player extends Body {vx:number;vy:number;readonly shield:number}
export interface Enemy extends Body {slot:number;originX:number;originY:number;age:number;readonly kind:EnemyKind;readonly radius:number;diveTarget:Vec|null;divePhase:'formation'|'warning'|'diving'|'returning'}
export function createPlayer(levels:Readonly<Record<Upgrade,number>>):Player{
 const abilities=new AbilityRuntime(aircraftStats(levels),0);
 abilities.grant(PAPER_DART);
 return {x:WORLD.width/2,y:WORLD.height*.7,angle:-Math.PI/2,vx:0,vy:0,abilities,
  get hp(){return abilities.hp},get maxHp(){return abilities.maxHp},get shield(){return abilities.shield}};
}
export function createEnemy(x:number,y:number,hp:number,slot:number,initialCooldown=ENEMY_WEAPON.initialDelay+slot*ENEMY_WEAPON.slotDelay,kind:EnemyKind='dart'):Enemy{
 const spec=ENEMIES[kind];
 const abilities=new AbilityRuntime({damage:spec.damage,fireDelay:spec.fireDelay,speed:spec.speed,maxHp:Math.max(1,Math.ceil(hp*spec.hpScale)),maxShield:0,repairDelay:0,repairRate:0});
 abilities.grant(ENEMY_DART,initialCooldown);
 return {x,y,originX:x,originY:y,angle:Math.PI/2,slot,age:0,abilities,kind,radius:spec.radius,diveTarget:null,divePhase:'formation',
  get hp(){return abilities.hp},get maxHp(){return abilities.maxHp}};
}
