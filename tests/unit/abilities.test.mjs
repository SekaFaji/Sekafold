import test from 'node:test';
import assert from 'node:assert/strict';
import {AbilityRuntime} from '../../dist/src/game/abilities/runtime.js';
import {Battle} from '../../dist/src/game/combat/battle.js';
import {createEnemy} from '../../dist/src/game/entities/aircraft.js';
import {PAPER_DART,ENEMY_DART} from '../../dist/src/content/weapons.js';
import {WORLD,FLIGHT,aircraftStats} from '../../dist/src/content/balance.js';
import {fresh} from '../../dist/src/progression/profile.js';
const base={damage:2,fireDelay:.25,speed:245,maxHp:60,maxShield:25,repairRate:8,repairDelay:3};
const idle={move:{x:0,y:0},aim:{x:0,y:0},fire:false};
test('grant, cooldown, independent actors and tag-gated ability',()=>{
 const a=new AbilityRuntime(base),b=new AbilityRuntime(base);
 assert.equal(a.grant(PAPER_DART),true);assert.equal(a.grant(PAPER_DART),false);b.grant(PAPER_DART);
 let fired=0;const fire=()=>fired++;
 assert.equal(a.activate(PAPER_DART.id,fire),true);assert.equal(a.activate(PAPER_DART.id,fire),false);
 assert.equal(b.canActivate(PAPER_DART.id),true);a.advance(.125);assert.equal(a.cooldown(PAPER_DART.id),.125);
 a.advance(.125);assert.equal(a.canActivate(PAPER_DART.id),true);
 a.applyEffect({id:'stun',duration:1,tags:['state.stunned']});assert.equal(a.activate(PAPER_DART.id,fire),false);
 a.advance(1);assert.equal(a.activate(PAPER_DART.id,fire),true);assert.equal(fired,2);
});
test('effects refresh same ID, combine distinct IDs, remove and expire exactly',()=>{
 const a=new AbilityRuntime(base);
 const effect={id:'boost',duration:2,modifiers:{damage:{multiply:2}},tags:['buff.damage']};
 assert.equal(a.applyEffect(effect),true);assert.equal(a.stat('damage'),4);
 a.advance(1);a.applyEffect(effect);assert.equal(a.effectRemaining('boost'),2);assert.equal(a.stat('damage'),4);
 a.applyEffect({id:'bonus',duration:1,modifiers:{damage:{add:1}},tags:['buff.damage']});assert.equal(a.stat('damage'),6);
 a.advance(1);assert.equal(a.stat('damage'),4);assert.equal(a.hasTag('buff.damage'),true);
 a.advance(1);assert.equal(a.stat('damage'),2);assert.equal(a.hasTag('buff.damage'),false);
 a.applyEffect(effect);assert.equal(a.removeEffect('boost'),true);assert.equal(a.stat('damage'),2);
});
test('invalid effects cannot corrupt attributes and copied definitions are isolated',()=>{
 const a=new AbilityRuntime(base);
 assert.equal(a.applyEffect({id:'bad',duration:NaN}),false);
 assert.equal(a.applyEffect({id:'bad',duration:1,modifiers:{damage:{multiply:Infinity}}}),false);
 assert.equal(a.applyEffect({id:'bad',duration:1,modifiers:{maxHp:{add:5}}}),false);
 assert.equal(a.applyEffect({id:'bad',duration:1,tags:['state.dead']}),false);
 const effect={id:'safe',duration:1,modifiers:{damage:{add:2}}};
 a.applyEffect(effect);effect.modifiers.damage.add=100;assert.equal(a.stat('damage'),4);
 assert.throws(()=>a.advance(-1));
});
test('shared damage, repair, healing and dead-state lifecycle',()=>{
 const a=new AbilityRuntime(base);a.grant(PAPER_DART);
 assert.deepEqual(a.damage(30),{absorbed:25,durabilityLost:5,killed:false});
 a.advance(2);assert.equal(a.shield,0);a.advance(1);assert.equal(a.shield,8);
 assert.deepEqual(a.damage(12,true),{absorbed:0,durabilityLost:12,killed:false});
 assert.equal(a.shield,8);a.advance(2);assert.equal(a.shield,8);
 assert.equal(a.heal(100),17);assert.equal(a.hp,60);
 assert.equal(a.restoreTape(100),17);assert.equal(a.shield,25);
 assert.equal(a.damage(1000).killed,true);assert.equal(a.hasTag('state.dead'),true);
 assert.equal(a.damage(1).killed,false);assert.equal(a.heal(50),0);assert.equal(a.restoreTape(50),0);
 assert.equal(a.activate(PAPER_DART.id,()=>assert.fail()),false);
 assert.equal(a.applyEffect({id:'dead',duration:1}),false);
});
test('required tags, modifiers, active cooldown snapshot and retry isolation',()=>{
 const a=new AbilityRuntime(base);
 a.grant({id:'special',cooldown:'fireDelay',requiredTags:['buff.ready']});
 assert.equal(a.canActivate('special'),false);
 a.applyEffect({id:'ready',duration:1,modifiers:{fireDelay:{multiply:.5}},tags:['buff.ready']});
 assert.equal(a.activate('special',()=>{}),true);assert.equal(a.cooldown('special'),.125);
 a.removeEffect('ready');assert.equal(a.cooldown('special'),.125);assert.equal(a.stat('fireDelay'),.25);
 const p=fresh(),b=new Battle(1,p);b.player.abilities.applyEffect({id:'boost',duration:1,modifiers:{damage:{add:2}}});
 assert.equal(new Battle(1,p).player.abilities.stat('damage'),1);assert.equal(p.upgrades.damage,0);
});
test('real player dart uses modified damage and cooldown, then expires on simulation time',()=>{
 const p=fresh();p.upgrades.damage=2;p.upgrades.rate=3;
 const b=new Battle(1,p),a=b.player.abilities,s=aircraftStats(p.upgrades);
 a.applyEffect({id:'rapid',duration:.5,modifiers:{damage:{multiply:2},fireDelay:{multiply:.5}}});
 b.step(WORLD.step,{...idle,fire:true});
 assert.equal(b.shots.length,1);assert.equal(b.shots[0].damage,s.damage*2);
 assert.equal(a.cooldown(PAPER_DART.id),s.fireDelay*.5);
 const before=a.effectRemaining('rapid');assert.ok(before>0); // No wall-clock advancement.
 for(let i=0;i<31;i++)b.step(WORLD.step,idle);
 assert.equal(a.stat('damage'),s.damage);assert.equal(a.stat('fireDelay'),s.fireDelay);
});
test('enemy weapon uses shared ability runtime and blocked tag',()=>{
 const b=new Battle(1,fresh()),e=createEnemy(100,100,4,0,0);b.enemies=[e];
 e.abilities.applyEffect({id:'jam',duration:.1,tags:['state.disarmed']});
 b.step(WORLD.step,idle);assert.equal(b.shots.length,0);
 for(let i=0;i<8;i++)b.step(WORLD.step,idle);
 assert.equal(b.shots.length,1);assert.equal(b.shots[0].damage,8);assert.ok(e.abilities.cooldown(ENEMY_DART.id)>2);
});
test('baseline player shot cadence and stats stay identical',()=>{
 const p=fresh();p.upgrades={...p.upgrades,damage:4,rate:2,durability:3,reinforcement:2};
 const b=new Battle(1,p),s=aircraftStats(p.upgrades);let oldCooldown=0;
 // Compare to v0.0.13 cooldown arithmetic across fixed ticks without spawn.
 for(let i=0;i<45;i++){
  b.shots=[];oldCooldown=Math.max(0,oldCooldown-WORLD.step);
  const expected=oldCooldown===0;
  if(expected)oldCooldown=s.fireDelay;
  b.step(WORLD.step,{...idle,fire:true,aim:{x:0,y:-1}});
  assert.equal(b.shots.length,expected?1:0);
  assert.equal(b.player.abilities.cooldown(PAPER_DART.id),oldCooldown);
 }
 assert.equal(b.maxHp,84);assert.equal(b.maxShield,35);
 assert.equal(b.player.abilities.stat('speed'),FLIGHT.speed);
});
