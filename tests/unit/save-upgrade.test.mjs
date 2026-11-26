import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,decode,buy} from '../../dist/src/progression/profile.js';
import {Battle} from '../../dist/src/game/combat/battle.js';
import {AbilityRuntime} from '../../dist/src/game/abilities/runtime.js';
import {aircraftStats,WORLD} from '../../dist/src/content/balance.js';
const old={schemaVersion:1,scraps:280,unlocked:3,upgrades:{damage:2,durability:3,reinforcement:4,rate:5},nextRun:12,settledRun:10};
test('v1 save migration preserves all old progress and zero-initializes new upgrades',()=>{
 const p=decode(JSON.stringify(old));
 assert.deepEqual(p,{...old,schemaVersion:2,upgrades:{...old.upgrades,speed:0,repairRate:0,repairDelay:0}});
 assert.equal(buy(p,'speed'),true);assert.equal(p.scraps,260);
 assert.deepEqual(decode(JSON.stringify(p)),p);
 assert.throws(()=>decode(JSON.stringify({...old,schemaVersion:2})));
 assert.throws(()=>decode(JSON.stringify({...old,upgrades:{...old.upgrades,damage:-1}})));
 assert.throws(()=>decode(JSON.stringify({...p,upgrades:{...p.upgrades,speed:16}})));
});
test('all flights start with empty tape, full HP, recharge after delay and retry resets tape',()=>{
 const p=decode(JSON.stringify(old));const b=new Battle(1,p);
 assert.equal(b.player.shield,0);assert.equal(b.maxShield,45);assert.equal(b.player.hp,b.maxHp);
 const idle={move:{x:0,y:0},aim:{x:0,y:0},fire:false};
 for(let i=0;i<174;i++){b.shots=[];b.step(WORLD.step,idle)}
 assert.equal(b.player.shield,0);
 for(let i=0;i<24;i++){b.shots=[];b.step(WORLD.step,idle)}
 assert.ok(b.player.shield>0);b.player.abilities.restoreTape(999);
 assert.equal(new Battle(1,p).player.shield,0);
 assert.throws(()=>new AbilityRuntime(aircraftStats(fresh().upgrades),26));
});
