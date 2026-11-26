export const MODIFIABLE_STATS = ['damage','fireDelay','speed','repairDelay','repairRate'] as const;
export type CombatStat = typeof MODIFIABLE_STATS[number];
export type Attributes = Readonly<Record<CombatStat,number> & {maxHp:number;maxShield:number}>;
export type GameplayTag = `state.${string}` | `buff.${string}` | `debuff.${string}`;
export interface Modifier {readonly add?:number;readonly multiply?:number}
export interface TimedEffect {
 readonly id:string;
 readonly duration:number;
 readonly modifiers?:Readonly<Partial<Record<CombatStat,Modifier>>>;
 readonly tags?:readonly GameplayTag[];
}
interface ActiveEffect {definition:TimedEffect;remaining:number}
const MAX_EFFECTS=32;
const MAX_STAT=1e6;
const MIN_DELAY=.01;
const valid=(n:number,min:number,max:number)=>Number.isFinite(n)&&n>=min&&n<=max;

export class AttributeSet {
 readonly base:Attributes;
 private readonly active=new Map<string,ActiveEffect>();
 constructor(base:Attributes){
  for(const key of MODIFIABLE_STATS){
   if(!valid(base[key],key==='fireDelay'?MIN_DELAY:0,MAX_STAT))throw Error('Invalid attribute: '+key);
  }
  if(!valid(base.maxHp,Number.EPSILON,MAX_STAT)||!valid(base.maxShield,0,MAX_STAT))throw Error('Invalid capacity');
  this.base=Object.freeze({...base});
 }
 value(key:CombatStat):number {
  let add=0,multiply=1;
  for(const {definition} of this.active.values()){
   const mod=definition.modifiers?.[key];
   if(mod){add+=mod.add??0;multiply*=mod.multiply??1}
  }
  return Math.max(key==='fireDelay'?MIN_DELAY:0,Math.min(MAX_STAT,(this.base[key]+add)*multiply));
 }
 hasTag(tag:GameplayTag):boolean{
  for(const {definition} of this.active.values())if(definition.tags?.includes(tag))return true;
  return false;
 }
 /** Same ID replaces and refreshes; different IDs combine. Capacities are immutable. */
 apply(effect:TimedEffect):boolean{
  if(typeof effect.id!=='string'||!effect.id.trim()||!valid(effect.duration,Number.EPSILON,86400))return false;
  if(!this.active.has(effect.id)&&this.active.size>=MAX_EFFECTS)return false;
  const modifiers:Partial<Record<CombatStat,Modifier>>={};
  for(const key of Object.keys(effect.modifiers??{})){
   if(!MODIFIABLE_STATS.includes(key as CombatStat))return false;
   const stat=key as CombatStat,mod=effect.modifiers?.[stat];
   if(!mod||!valid(mod.add??0,-MAX_STAT,MAX_STAT)||!valid(mod.multiply??1,0,MAX_STAT))return false;
   modifiers[stat]={add:mod.add??0,multiply:mod.multiply??1};
  }
  const tags=[...(effect.tags??[])];
  if(tags.some(tag=>typeof tag!=='string'||!/^(state|buff|debuff)\..+/.test(tag)||tag==='state.dead'))return false;
  this.active.set(effect.id,{definition:{id:effect.id,duration:effect.duration,modifiers,tags},remaining:effect.duration});
  return true;
 }
 remove(id:string):boolean{return this.active.delete(id)}
 remaining(id:string):number{return this.active.get(id)?.remaining??0}
 advance(dt:number){
  for(const [id,effect] of this.active){
   effect.remaining=Math.max(0,effect.remaining-dt);
   if(effect.remaining<=1e-9)this.active.delete(id);
  }
 }
}
