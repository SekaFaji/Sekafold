import {WORLD,FLIGHT,STAGES,FORMATION} from '../../content/balance.js';
import type {Profile} from '../../progression/profile.js';
export interface Vec {x:number;y:number}
export interface Command {move:Vec;aim:Vec;fire:boolean}
interface Body extends Vec {angle:number}
export interface Enemy extends Body {hp:number;maxHp:number;slot:number;originX:number;originY:number;age:number;cooldown:number}
export interface Shot extends Vec {vx:number;vy:number;friendly:boolean;damage:number}
export interface Scrap extends Vec {life:number}
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
const unit=(v:Vec):Vec=>{const n=Math.max(1,Math.hypot(v.x,v.y));return {x:v.x/n,y:v.y/n}};
const dist=(a:Vec,b:Vec)=>Math.hypot(a.x-b.x,a.y-b.y);
export class Battle {
 readonly stage:typeof STAGES[number]; readonly maxHp:number;readonly maxShield:number;
 readonly player:Body & {vx:number;vy:number;hp:number;shield:number};
 enemies:Enemy[]=[];shots:Shot[]=[];scraps:Scrap[]=[];
 time=0;wave=0;kills=0;earned=0;status:'active'|'won'|'lost'='active';
 private cooldown=0;private sinceHit=0;private waveWait=.8;private readonly damage:number;private readonly fireDelay:number;
 constructor(stage:number,p:Profile){
 this.stage=STAGES[stage-1]??STAGES[0];this.maxHp=60+p.upgrades.durability*8;this.maxShield=25+p.upgrades.reinforcement*5;
 this.player={x:WORLD.width/2,y:WORLD.height*.7,angle:-Math.PI/2,vx:0,vy:0,hp:this.maxHp,shield:this.maxShield};
 this.damage=1+p.upgrades.damage*.25;this.fireDelay=FLIGHT.fireDelay/(1+p.upgrades.rate*.06);
 }
 private spawnWave(){
 this.wave++;const side=(this.wave-1)%3;const count=this.stage.count;
 for(let i=0;i<count;i++){const offset=(i-(count-1)/2)*Math.min(FORMATION.spacing,(WORLD.width-2*(FORMATION.margin+FORMATION.sweep))/Math.max(1,count-1));
 const x=side===0?WORLD.width/2+offset:side===1?FORMATION.margin:WORLD.width-FORMATION.margin;
 const y=side===0?FORMATION.margin+Math.abs(offset)*.22:WORLD.height/2+offset*FORMATION.sideSpacing;
 this.enemies.push({x,y,originX:x,originY:y,angle:Math.PI/2,hp:this.stage.hp,maxHp:this.stage.hp,slot:i,age:0,cooldown:1.2+i*.25});
 }}
 private fire(from:Vec,angle:number,friendly:boolean,damage:number){
 if(this.shots.length>=FLIGHT.maxBullets)return;
 const s=friendly?FLIGHT.bulletSpeed:FLIGHT.enemyBulletSpeed;
 this.shots.push({x:from.x+Math.cos(angle)*16,y:from.y+Math.sin(angle)*16,vx:Math.cos(angle)*s,vy:Math.sin(angle)*s,friendly,damage});
 }
 hit(damage:number){this.sinceHit=0;const absorbed=Math.min(this.player.shield,damage);this.player.shield-=absorbed;this.player.hp=Math.max(0,this.player.hp-(damage-absorbed));if(this.player.hp===0)this.status='lost'}
 step(dt:number,cmd:Command){
 if(this.status!=='active')return;
 this.time+=dt;this.sinceHit+=dt;const p=this.player;const m=unit(cmd.move);
 const t=1-Math.exp(-FLIGHT.response*dt);
 p.vx+=(m.x*FLIGHT.speed-p.vx)*t;p.vy+=(m.y*FLIGHT.speed-p.vy)*t;
 p.x=clamp(p.x+p.vx*dt,18,WORLD.width-18);p.y=clamp(p.y+p.vy*dt,18,WORLD.height-18);
 if(Math.hypot(cmd.aim.x,cmd.aim.y)>.05)p.angle=Math.atan2(cmd.aim.y,cmd.aim.x);
 else if(Math.hypot(m.x,m.y)>.05)p.angle=Math.atan2(m.y,m.x);
 this.cooldown=Math.max(0,this.cooldown-dt);
 if(cmd.fire&&this.cooldown===0){this.fire(p,p.angle,true,this.damage);this.cooldown=this.fireDelay}
 if(this.sinceHit>=FLIGHT.repairDelay)p.shield=Math.min(this.maxShield,p.shield+dt*FLIGHT.repairRate);
 if(!this.enemies.length){if(this.wave===this.stage.waves){this.status='won';return}this.waveWait-=dt;if(this.waveWait<=0){this.spawnWave();this.waveWait=.9}}
 for(const e of this.enemies){
 e.age+=dt;e.angle=Math.atan2(p.y-e.y,p.x-e.x);
 const side=(this.wave-1)%3;const targetX=side===0?e.originX+Math.sin(e.age*.8)*FORMATION.sweep:e.originX+(side===1?1:-1)*Math.min(e.age*FLIGHT.enemySpeed,FORMATION.sideAdvance);
 const targetY=side===0?e.originY+Math.min(e.age*FLIGHT.enemySpeed,FORMATION.advance):e.originY+Math.sin(e.age)*FORMATION.bob;
 e.x+=(targetX-e.x)*Math.min(1,dt*4);e.y+=(targetY-e.y)*Math.min(1,dt*4);
 e.cooldown-=dt;if(e.cooldown<=0){this.fire(e,e.angle,false,8);e.cooldown=FLIGHT.enemyFireDelay}
 }
 const survivors:Shot[]=[];
 for(const s of this.shots){s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.x<0||s.x>WORLD.width||s.y<0||s.y>WORLD.height)continue;
 if(s.friendly){const e=this.enemies.find(e=>e.hp>0&&dist(e,s)<17);if(e){e.hp-=s.damage;if(e.hp<=0){this.kills++;this.earned+=this.stage.reward;this.scraps.push({x:e.x,y:e.y,life:.45})}continue}}
 else if(dist(p,s)<FLIGHT.radius){if(this.status==='active')this.hit(s.damage);continue}
 survivors.push(s)}
 this.shots=survivors;this.enemies=this.enemies.filter(e=>e.hp>0);
 this.scraps=this.scraps.filter(s=>(s.life-=dt)>0);
 }
}
