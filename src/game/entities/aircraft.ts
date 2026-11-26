import {FLIGHT,WORLD,aircraftStats,type Upgrade} from '../../content/balance.js';
import {PAPER_DART,ENEMY_DART,ENEMY_WEAPON} from '../../content/weapons.js';
import {AbilityRuntime} from '../abilities/runtime.js';
export interface Vec {x:number;y:number}
interface Body extends Vec {angle:number;readonly abilities:AbilityRuntime;readonly hp:number;readonly maxHp:number}
export interface Player extends Body {vx:number;vy:number;readonly shield:number}
export interface Enemy extends Body {slot:number;originX:number;originY:number;age:number}
export function createPlayer(levels:Readonly<Record<Upgrade,number>>):Player{
 const abilities=new AbilityRuntime({...aircraftStats(levels),speed:FLIGHT.speed,repairDelay:FLIGHT.repairDelay,repairRate:FLIGHT.repairRate});
 abilities.grant(PAPER_DART);
 return {x:WORLD.width/2,y:WORLD.height*.7,angle:-Math.PI/2,vx:0,vy:0,abilities,
  get hp(){return abilities.hp},get maxHp(){return abilities.maxHp},get shield(){return abilities.shield}};
}
export function createEnemy(x:number,y:number,hp:number,slot:number,initialCooldown=ENEMY_WEAPON.initialDelay+slot*ENEMY_WEAPON.slotDelay):Enemy{
 const abilities=new AbilityRuntime({damage:ENEMY_WEAPON.damage,fireDelay:FLIGHT.enemyFireDelay,speed:FLIGHT.enemySpeed,maxHp:hp,maxShield:0,repairDelay:0,repairRate:0});
 abilities.grant(ENEMY_DART,initialCooldown);
 return {x,y,originX:x,originY:y,angle:Math.PI/2,slot,age:0,abilities,
  get hp(){return abilities.hp},get maxHp(){return abilities.maxHp}};
}
