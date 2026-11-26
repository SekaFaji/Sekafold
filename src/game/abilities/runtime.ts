import {AttributeSet,type Attributes,type CombatStat,type GameplayTag,type TimedEffect} from './attributes.js';
export interface AbilityDefinition {
 readonly id:string;
 readonly cooldown:number|'fireDelay';
 readonly requiredTags?:readonly GameplayTag[];
 readonly blockedTags?:readonly GameplayTag[];
}
interface AbilityState {definition:AbilityDefinition;remaining:number}
export interface DamageResult {absorbed:number;durabilityLost:number;killed:boolean}
const emptyDamage=():DamageResult=>({absorbed:0,durabilityLost:0,killed:false});
const finiteNonnegative=(n:number)=>Number.isFinite(n)&&n>=0;

/** Run-local state shared by player and enemy aircraft; no DOM, persistence or wall clock. */
export class AbilityRuntime {
 private readonly attributes:AttributeSet;
 private readonly abilities=new Map<string,AbilityState>();
 private durability:number;
 private tape:number;
 private sinceHit=0;
 constructor(base:Attributes,initialTape=base.maxShield){
  this.attributes=new AttributeSet(base);
  if(!finiteNonnegative(initialTape)||initialTape>base.maxShield)throw Error('Invalid initial tape');
  this.durability=base.maxHp;this.tape=initialTape;
 }
 get hp(){return this.durability}
 get shield(){return this.tape}
 get maxHp(){return this.attributes.base.maxHp}
 get maxShield(){return this.attributes.base.maxShield}
 get dead(){return this.hp===0}
 stat(key:CombatStat){return this.attributes.value(key)}
 hasTag(tag:GameplayTag){return tag==='state.dead'?this.dead:this.attributes.hasTag(tag)}
 grant(definition:AbilityDefinition,initialCooldown=0):boolean{
  if(!definition.id.trim()||this.abilities.has(definition.id)||!finiteNonnegative(initialCooldown))return false;
  if(definition.cooldown!=='fireDelay'&&!finiteNonnegative(definition.cooldown))return false;
  this.abilities.set(definition.id,{definition:{...definition,requiredTags:[...(definition.requiredTags??[])],blockedTags:[...(definition.blockedTags??[])]},remaining:initialCooldown});
  return true;
 }
 cooldown(id:string):number|undefined{return this.abilities.get(id)?.remaining}
 canActivate(id:string):boolean{
  const state=this.abilities.get(id);
  return !!state&&!this.dead&&state.remaining===0&&
   (state.definition.requiredTags??[]).every(tag=>this.hasTag(tag))&&
   !(state.definition.blockedTags??[]).some(tag=>this.hasTag(tag));
 }
 /** Commit cooldown before dispatch; actions are synchronous simulation commands. */
 activate(id:string,perform:()=>void):boolean{
  const state=this.abilities.get(id);
  if(!state||!this.canActivate(id))return false;
  state.remaining=state.definition.cooldown==='fireDelay'?this.stat('fireDelay'):state.definition.cooldown;
  perform();return true;
 }
 applyEffect(effect:TimedEffect):boolean{return !this.dead&&this.attributes.apply(effect)}
 removeEffect(id:string):boolean{return this.attributes.remove(id)}
 effectRemaining(id:string):number{return this.attributes.remaining(id)}
 damage(amount:number,bypassTape=false):DamageResult{
  if(this.dead||!finiteNonnegative(amount)||amount===0)return emptyDamage();
  this.sinceHit=0;
  const absorbed=bypassTape?0:Math.min(this.tape,amount);
  this.tape-=absorbed;
  const before=this.durability,remaining=before-(amount-absorbed);
  this.durability=remaining<=this.maxHp*Number.EPSILON*8?0:remaining;
  return {absorbed,durabilityLost:before-this.durability,killed:this.dead};
 }
 heal(amount:number):number{
  if(this.dead||!finiteNonnegative(amount))return 0;
  const before=this.durability;this.durability=Math.min(this.maxHp,before+amount);return this.durability-before;
 }
 restoreTape(amount:number):number{
  if(this.dead||!finiteNonnegative(amount))return 0;
  const before=this.tape;this.tape=Math.min(this.maxShield,before+amount);return this.tape-before;
 }
 advance(dt:number){
  if(!finiteNonnegative(dt))throw Error('Invalid ability timestep');
  if(this.dead||dt===0)return;
  this.attributes.advance(dt);
  for(const state of this.abilities.values())state.remaining=Math.max(0,state.remaining-dt);
  this.sinceHit+=dt;
  if(this.tape<this.maxShield&&this.sinceHit>=this.stat('repairDelay'))this.restoreTape(dt*this.stat('repairRate'));
 }
}
