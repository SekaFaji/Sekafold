import {WORLD,FLIGHT,STAGES,FORMATION,CONTACT} from '../../content/balance.js';
import type {Profile} from '../../progression/profile.js';
import {createPlayer,createEnemy,type Player,type Enemy,type Vec} from '../entities/aircraft.js';
import {PAPER_DART,ENEMY_DART,PROJECTILE_SPEED} from '../../content/weapons.js';
import {ENEMIES,enemyKind} from '../../content/enemies.js';
import {moveEnemy} from './enemy-motion.js';
import {BattlefieldPickups} from './pickups.js';
export type {Vec,Enemy} from '../entities/aircraft.js';
export interface Command {move:Vec;aim:Vec;fire:boolean}
export interface Shot extends Vec {vx:number;vy:number;friendly:boolean;damage:number}
export interface Scrap extends Vec {life:number;kind:'shot'|'ram'}
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
const unit=(v:Vec):Vec=>{const n=Math.max(1,Math.hypot(v.x,v.y));return {x:v.x/n,y:v.y/n}};
const dist=(a:Vec,b:Vec)=>Math.hypot(a.x-b.x,a.y-b.y);
export class Battle {
 readonly stage:typeof STAGES[number];
 readonly player:Player;
 get maxHp(){return this.player.abilities.maxHp}
 get maxShield(){return this.player.abilities.maxShield}
 enemies:Enemy[]=[];shots:Shot[]=[];scraps:Scrap[]=[];
 readonly pickups=new BattlefieldPickups();
 time=0;wave=0;kills=0;earned=0;status:'active'|'won'|'lost'='active';
 private waveWait=.8;
 constructor(stage:number,p:Profile){
  this.stage=STAGES[stage-1]??STAGES[0];this.player=createPlayer(p.upgrades);
 }
 private spawnWave(){
 this.wave++;const side=(this.wave-1)%3;const count=this.stage.count;
 for(let i=0;i<count;i++){const offset=(i-(count-1)/2)*Math.min(FORMATION.spacing,(WORLD.width-2*(FORMATION.margin+FORMATION.sweep))/Math.max(1,count-1));
 const x=side===0?WORLD.width/2+offset:side===1?FORMATION.margin:WORLD.width-FORMATION.margin;
 const y=side===0?FORMATION.margin+Math.abs(offset)*.22:WORLD.height/2+offset*FORMATION.sideSpacing;
 this.enemies.push(createEnemy(x,y,this.stage.hp,i,undefined,enemyKind(this.stage.id,this.wave,i)));
 }}
 private fire(from:Vec,angle:number,friendly:boolean,damage:number){
 if(this.shots.length>=FLIGHT.maxBullets)return;
 const s=friendly?PROJECTILE_SPEED.player:PROJECTILE_SPEED.enemy;
 this.shots.push({x:from.x+Math.cos(angle)*16,y:from.y+Math.sin(angle)*16,vx:Math.cos(angle)*s,vy:Math.sin(angle)*s,friendly,damage});
 }
 private recordKill(e:Enemy,kind:Scrap['kind']){
  this.kills++;this.earned+=this.stage.reward;
  this.scraps.push({x:e.x,y:e.y,life:CONTACT.burstDuration,kind});
  if(kind==='shot')this.pickups.onShotKill(e);
 }
 hit(damage:number,bypassTape=false){
  if(this.status!=='active')return;
  if(this.player.abilities.damage(damage,bypassTape).killed)this.status='lost';
 }
 private resolveContact(){
  for(const e of this.enemies){
   if(this.status!=='active')break;
   if(e.hp<=0||dist(this.player,e)>FLIGHT.radius+e.radius)continue;
   if(e.abilities.damage(e.hp,true).killed)this.recordKill(e,'ram');
   this.hit(this.maxHp*CONTACT.durabilityFraction,true);
  }
  this.enemies=this.enemies.filter(e=>e.hp>0);
 }
 step(dt:number,cmd:Command){
 if(this.status!=='active')return;
 this.time+=dt;const p=this.player;const m=unit(cmd.move);
 p.abilities.advance(dt);const speed=p.abilities.stat('speed');
 const t=1-Math.exp(-FLIGHT.response*dt);
 p.vx+=(m.x*speed-p.vx)*t;p.vy+=(m.y*speed-p.vy)*t;
 p.x=clamp(p.x+p.vx*dt,18,WORLD.width-18);p.y=clamp(p.y+p.vy*dt,18,WORLD.height-18);
 if(Math.hypot(cmd.aim.x,cmd.aim.y)>.05)p.angle=Math.atan2(cmd.aim.y,cmd.aim.x);
 else if(Math.hypot(m.x,m.y)>.05)p.angle=Math.atan2(m.y,m.x);
 this.pickups.advance(dt,p);
 if(cmd.fire)p.abilities.activate(PAPER_DART.id,()=>this.fire(p,p.angle,true,p.abilities.stat('damage')));
 if(!this.enemies.length){if(this.wave===this.stage.waves){this.status='won';return}this.waveWait-=dt;if(this.waveWait<=0){this.spawnWave();this.waveWait=.9}}
 for(const e of this.enemies)moveEnemy(e,p,(this.wave-1)%3,dt);
 // Resolve contact after movement, before an overlapping aircraft can fire.
 this.resolveContact();
 if(this.status!=='active')return;
 for(const e of this.enemies){
  e.abilities.advance(dt);
  if(e.divePhase!=='warning'&&e.divePhase!=='diving')e.abilities.activate(ENEMY_DART.id,()=>{
   for(const offset of ENEMIES[e.kind].spread)this.fire(e,e.angle+offset,false,e.abilities.stat('damage'));
  });
 }
 const survivors:Shot[]=[];
 for(const s of this.shots){s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.x<0||s.x>WORLD.width||s.y<0||s.y>WORLD.height)continue;
 if(s.friendly){const e=this.enemies.find(e=>e.hp>0&&dist(e,s)<e.radius);if(e){if(e.abilities.damage(s.damage).killed)this.recordKill(e,'shot');continue}}
 else if(dist(p,s)<FLIGHT.radius){if(this.status==='active')this.hit(s.damage);continue}
 survivors.push(s)}
 this.shots=survivors;this.enemies=this.enemies.filter(e=>e.hp>0);
 this.scraps=this.scraps.filter(s=>(s.life-=dt)>0);
 }
}
