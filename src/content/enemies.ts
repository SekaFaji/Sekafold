import {FLIGHT,CONTACT} from './balance.js';
import {ENEMY_WEAPON} from './weapons.js';
export type EnemyKind='dart'|'scout'|'heavy'|'diver';
interface EnemySpec {readonly hpScale:number;readonly speed:number;readonly damage:number;readonly fireDelay:number;readonly radius:number;readonly sweep:number;readonly swayRate:number;readonly spread:readonly number[]}
export const ENEMIES:Readonly<Record<EnemyKind,EnemySpec>>={
 dart:{hpScale:1,speed:FLIGHT.enemySpeed,damage:ENEMY_WEAPON.damage,fireDelay:FLIGHT.enemyFireDelay,radius:CONTACT.enemyRadius,sweep:1,swayRate:1,spread:[0]},
 scout:{hpScale:.75,speed:75,damage:5,fireDelay:1.9,radius:13,sweep:1.35,swayRate:1.9,spread:[0]},
 heavy:{hpScale:2,speed:26,damage:7,fireDelay:3.5,radius:24,sweep:.55,swayRate:.65,spread:[-.18,.18]},
 diver:{hpScale:1.25,speed:48,damage:6,fireDelay:3.1,radius:17,sweep:.7,swayRate:1,spread:[0]}
};
export const DIVE={period:6,windupStart:2.8,diveStart:3.5,returnStart:4.45,returnEnd:5.5,leadPerSlot:.13};
/** Deliberately introduce new patterns after the first training wave. */
export function enemyKind(stage:number,wave:number,slot:number):EnemyKind{
 if(stage===1&&wave===1)return 'dart';
 if(wave>=3&&stage>=2&&slot===2)return 'diver';
 if(wave>=3&&slot===1)return 'heavy';
 if(stage>=2&&wave>=2&&slot===3)return 'heavy';
 if(stage>=3&&wave>=2&&slot===4)return 'diver';
 if(slot===0||(stage>=2&&wave>=2&&slot===4))return 'scout';
 return 'dart';
}
