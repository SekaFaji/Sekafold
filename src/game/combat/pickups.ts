import {PICKUPS,PICKUP_ORDER,PICKUP_LABELS,RAPID_EFFECT,POWER_EFFECT,type PickupKind} from '../../content/pickups.js';
import type {Player,Vec} from '../entities/aircraft.js';
export interface Pickup extends Vec {readonly kind:PickupKind;remaining:number}
export class BattlefieldPickups {
 items:Pickup[]=[];
 notice:{text:string;remaining:number}|null=null;
 private shotKills=0;
 onShotKill(at:Vec){
  this.shotKills++;
  if(this.shotKills%PICKUPS.everyShotKills!==0)return;
  const index=this.shotKills/PICKUPS.everyShotKills-1;
  if(this.items.length>=PICKUPS.maxActive)this.items.shift();
  this.items.push({x:at.x,y:at.y,kind:PICKUP_ORDER[index%PICKUP_ORDER.length],remaining:PICKUPS.lifetime});
 }
 advance(dt:number,player:Player){
  if(player.abilities.dead)return;
  if(this.notice){this.notice.remaining-=dt;if(this.notice.remaining<=0)this.notice=null}
  const survivors:Pickup[]=[];
  for(const item of this.items){
   item.remaining-=dt;
   if(item.remaining<=0)continue;
   if(Math.hypot(player.x-item.x,player.y-item.y)>PICKUPS.radius){survivors.push(item);continue}
   const a=player.abilities;
   if(item.kind==='repair'){
    const healed=a.heal(a.maxHp*PICKUPS.healFraction);
    this.notice={text:healed>0?'+'+Math.ceil(healed)+' paper HP':'Paper HP full',remaining:PICKUPS.noticeDuration};
   }else{
    a.applyEffect(item.kind==='rapid'?RAPID_EFFECT:POWER_EFFECT);
    this.notice={text:PICKUP_LABELS[item.kind],remaining:PICKUPS.noticeDuration};
   }
  }
  this.items=survivors;
 }
}
