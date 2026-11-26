import test from 'node:test';
import assert from 'node:assert/strict';
import {aircraftStats,FLIGHT} from '../../dist/src/content/balance.js';
import {upgradeStat} from '../../dist/src/ui/flight-pages.js';
import {fresh} from '../../dist/src/progression/profile.js';
import {Battle} from '../../dist/src/game/combat/battle.js';
test('workshop previews use the same unchanged stats as battle',()=>{
 const p=fresh();p.upgrades={...p.upgrades,damage:3,durability:4,reinforcement:5,rate:6};
 const s=aircraftStats(p.upgrades),b=new Battle(1,p);
 assert.equal(s.damage,1.75);assert.equal(s.maxHp,92);assert.equal(s.maxShield,50);
 assert.equal(s.fireDelay,FLIGHT.fireDelay/(1+6*.06));
 assert.equal(b.maxHp,92);assert.equal(b.maxShield,50);
 assert.equal(upgradeStat(p.upgrades,'damage'),1.75);
 assert.equal(upgradeStat(p.upgrades,'durability'),92);
 assert.equal(upgradeStat(p.upgrades,'reinforcement'),50);
 assert.equal(upgradeStat(p.upgrades,'rate'),1/s.fireDelay);
});

test('new upgrades change actual GAS stats and remain capped',()=>{
 const p=fresh();p.upgrades.speed=3;p.upgrades.repairRate=4;p.upgrades.repairDelay=10;
 const b=new Battle(1,p),a=b.player.abilities;
 assert.equal(a.stat('speed'),260);assert.equal(a.stat('repairRate'),12);assert.equal(a.stat('repairDelay'),1);
 for(const key of ['speed','repairRate','repairDelay'])assert.equal(upgradeStat(p.upgrades,key),a.stat(key));
 assert.equal(b.player.shield,0);assert.equal(b.maxShield,25);
 a.advance(.99);assert.equal(b.player.shield,0);a.advance(.02);assert.ok(b.player.shield>0);
});
