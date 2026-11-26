import {WORLD,FORMATION} from '../../content/balance.js';
import {ENEMIES,DIVE} from '../../content/enemies.js';
import type {Enemy,Vec} from '../entities/aircraft.js';
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export function moveEnemy(e:Enemy,player:Vec,side:number,dt:number){
 const spec=ENEMIES[e.kind],speed=e.abilities.stat('speed');
 e.age+=dt;
 let x=side===0?e.originX+Math.sin(e.age*.8*spec.swayRate)*FORMATION.sweep*spec.sweep:e.originX+(side===1?1:-1)*Math.min(e.age*speed,FORMATION.sideAdvance);
 let y=side===0?e.originY+Math.min(e.age*speed,FORMATION.advance):e.originY+Math.sin(e.age*spec.swayRate)*FORMATION.bob*spec.sweep;
 e.divePhase='formation';
 if(e.kind==='diver'){
  const phase=(e.age+e.slot*DIVE.leadPerSlot)%DIVE.period;
  if(phase<DIVE.windupStart||phase>=DIVE.returnEnd)e.diveTarget=null;
  else{
   if(!e.diveTarget)e.diveTarget={x:player.x,y:player.y};
   const target=e.diveTarget;
   if(phase<DIVE.diveStart)e.divePhase='warning';
   else if(phase<DIVE.returnStart){
    e.divePhase='diving';
    const t=(phase-DIVE.diveStart)/(DIVE.returnStart-DIVE.diveStart);
    x=lerp(x,target.x,t);y=lerp(y,target.y,t);
   }else{
    e.divePhase='returning';
    const t=(phase-DIVE.returnStart)/(DIVE.returnEnd-DIVE.returnStart);
    x=lerp(target.x,x,t);y=lerp(target.y,y,t);
   }
  }
 }
 const margin=Math.max(18,e.radius);
 const response=e.divePhase==='diving'||e.divePhase==='returning'?12:4;
 e.x=clamp(lerp(e.x,x,Math.min(1,dt*response)),margin,WORLD.width-margin);
 e.y=clamp(lerp(e.y,y,Math.min(1,dt*response)),margin,WORLD.height-margin);
 const aim=e.diveTarget&&(e.divePhase==='warning'||e.divePhase==='diving')?e.diveTarget:player;
 e.angle=Math.atan2(aim.y-e.y,aim.x-e.x);
}
