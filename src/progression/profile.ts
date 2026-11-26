import {cost,LIMITS,UPGRADES,STAGES,type Upgrade} from '../content/balance.js';
export interface Profile {schemaVersion:1; scraps:number; unlocked:number; upgrades:Record<Upgrade,number>; nextRun:number; settledRun:number}
export const fresh = ():Profile => ({schemaVersion:1,scraps:0,unlocked:1,upgrades:{damage:0,durability:0,reinforcement:0,rate:0},nextRun:1,settledRun:0});
function int(x:unknown,min:number,max:number):x is number {return typeof x==='number'&&Number.isSafeInteger(x)&&x>=min&&x<=max}
export function decode(raw:string):Profile {
 const x:unknown=JSON.parse(raw);
 if(!x||typeof x!=='object')throw Error('Invalid save');
 const p=x as Partial<Profile>;
 if(p.schemaVersion!==1||!int(p.scraps,0,Number.MAX_SAFE_INTEGER)||!int(p.unlocked,1,STAGES.length)||!int(p.nextRun,1,Number.MAX_SAFE_INTEGER)||!int(p.settledRun,0,p.nextRun-1)||!p.upgrades||!UPGRADES.every(k=>int(p.upgrades?.[k],0,LIMITS[k])))throw Error('Invalid or unsupported save');
 return {...p,upgrades:{...p.upgrades}} as Profile;
}
export function buy(p:Profile,k:Upgrade):boolean {
 const n=p.upgrades[k],price=cost(n);
 if(n>=LIMITS[k]||p.scraps<price)return false;
 p.scraps-=price;p.upgrades[k]++;return true;
}
export function settle(p:Profile,id:number,stage:number,earned:number,won:boolean):boolean {
 if(!int(id,1,p.nextRun-1)||id<=p.settledRun||!int(stage,1,p.unlocked)||!int(earned,0,Number.MAX_SAFE_INTEGER))return false;
 p.scraps=Math.min(Number.MAX_SAFE_INTEGER,p.scraps+earned);p.settledRun=id;
 if(won)p.unlocked=Math.max(p.unlocked,Math.min(STAGES.length,stage+1));
 return true;
}
