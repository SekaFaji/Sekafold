import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle} from '../../dist/src/game/combat/battle.js';
import {createEnemy,createPlayer} from '../../dist/src/game/entities/aircraft.js';
import {moveEnemy} from '../../dist/src/game/combat/enemy-motion.js';
import {BattlefieldPickups} from '../../dist/src/game/combat/pickups.js';
import {ENEMIES,enemyKind,DIVE} from '../../dist/src/content/enemies.js';
import {PICKUPS,RAPID_EFFECT,POWER_EFFECT} from '../../dist/src/content/pickups.js';
import {WORLD,FLIGHT,STAGES} from '../../dist/src/content/balance.js';
import {fresh} from '../../dist/src/progression/profile.js';
const idle={move:{x:0,y:0},aim:{x:0,y:0},fire:false};
test('enemy roster is introduced gradually and fits all campaign waves',()=>{
 assert.ok(Array.from({length:4},(_,i)=>enemyKind(1,1,i)).every(k=>k==='dart'));
 assert.equal(enemyKind(1,2,0),'scout');assert.equal(enemyKind(1,3,1),'heavy');
 assert.equal(enemyKind(2,3,2),'diver');
 for(const stage of STAGES)for(let w=1;w<=stage.waves;w++)for(let i=0;i<stage.count;i++)assert.ok(ENEMIES[enemyKind(stage.id,w,i)]);
});
test('variants have distinct GAS stats and heavy fires twin darts',()=>{
 const b=new Battle(1,fresh()),heavy=createEnemy(200,100,3,0,0,'heavy'),scout=createEnemy(100,100,3,1,10,'scout');
 assert.equal(heavy.maxHp,6);assert.equal(scout.maxHp,3);assert.ok(scout.abilities.stat('speed')>heavy.abilities.stat('speed'));
 b.enemies=[heavy,scout];b.step(WORLD.step,idle);
 assert.equal(b.shots.length,2);assert.ok(b.shots.every(s=>!s.friendly&&s.damage===7));assert.notEqual(b.shots[0].vx,b.shots[1].vx);
});
test('diver warns then targets fixed location and stays inside bounds',()=>{
 const e=createEnemy(270,60,4,0,0,'diver'),p={x:280,y:700};
 for(let i=0;i<Math.ceil((DIVE.windupStart+.1)/WORLD.step);i++)moveEnemy(e,p,0,WORLD.step);
 assert.equal(e.divePhase,'warning');assert.deepEqual(e.diveTarget,p);
 const oldY=e.y;const moved={x:50,y:900};
 for(let i=0;i<65;i++)moveEnemy(e,moved,0,WORLD.step);
 assert.ok(e.y>oldY+200);assert.deepEqual(e.diveTarget,p);
 for(let i=0;i<200;i++){moveEnemy(e,moved,0,WORLD.step);assert.ok(e.x>=e.radius&&e.x<=WORLD.width-e.radius&&e.y>=e.radius&&e.y<=WORLD.height-e.radius)}
});
test('heavy contact uses variant radius and still destroys enemy for 20% HP',()=>{
 const b=new Battle(1,fresh()),e=createEnemy(b.player.x+33,b.player.y,20,0,10,'heavy');b.enemies=[e];
 b.step(WORLD.step,idle);assert.equal(b.kills,1);assert.equal(b.earned,4);assert.equal(b.player.hp,48);
});
test('pickup drops are deterministic, capped and do not spawn on ramming',()=>{
 const drops=new BattlefieldPickups();for(let i=0;i<9;i++)drops.onShotKill({x:100,y:100});
 assert.deepEqual(drops.items.map(x=>x.kind),['rapid','repair','power']);
 for(let i=0;i<30;i++)drops.onShotKill({x:100,y:100});
 assert.equal(drops.items.length,PICKUPS.maxActive);
 const b=new Battle(1,fresh());
 for(let i=0;i<3;i++){b.enemies=[createEnemy(b.player.x,b.player.y,1,0,10)];b.step(WORLD.step,idle)}
 assert.equal(b.kills,3);assert.equal(b.pickups.items.length,0);
});
test('real projectile kills spawn a pickup; collection and retry use GAS',()=>{
 const b=new Battle(1,fresh()),p=b.player;
 b.enemies=[0,1,2].map(i=>createEnemy(100+70*i,100,1,i,10));
 for(const e of b.enemies)b.shots.push({x:e.x,y:e.y,vx:0,vy:0,damage:100,friendly:true});
 b.step(WORLD.step,idle);assert.equal(b.kills,3);assert.equal(b.earned,12);assert.equal(b.pickups.items.length,1);
 const drop=b.pickups.items[0];p.x=drop.x;p.y=drop.y;
 b.step(WORLD.step,idle);assert.equal(b.pickups.items.length,0);assert.equal(p.abilities.stat('fireDelay'),FLIGHT.fireDelay*.65);
 assert.equal(p.abilities.effectRemaining(RAPID_EFFECT.id),6);
 assert.equal(new Battle(1,fresh()).player.abilities.effectRemaining(RAPID_EFFECT.id),0);
});
test('repair is capped, power refreshes not stacks, and expired drops cannot collect',()=>{
 const p=createPlayer(fresh().upgrades),drops=new BattlefieldPickups();
 p.abilities.damage(20,true);
 drops.items=[{x:p.x,y:p.y,kind:'repair',remaining:1}];drops.advance(WORLD.step,p);
 assert.equal(p.hp,52);assert.equal(drops.items.length,0);
 drops.items=[{x:p.x,y:p.y,kind:'repair',remaining:1},{x:p.x,y:p.y,kind:'power',remaining:1}];drops.advance(WORLD.step,p);
 assert.equal(p.hp,60);assert.equal(p.abilities.stat('damage'),1.5);
 p.abilities.advance(2);
 drops.items=[{x:p.x,y:p.y,kind:'power',remaining:1}];drops.advance(WORLD.step,p);
 assert.equal(p.abilities.stat('damage'),1.5);assert.equal(p.abilities.effectRemaining(POWER_EFFECT.id),6);
 p.abilities.advance(6);assert.equal(p.abilities.stat('damage'),1);
 drops.items=[{x:p.x,y:p.y,kind:'rapid',remaining:.01}];drops.advance(.02,p);
 assert.equal(p.abilities.effectRemaining(RAPID_EFFECT.id),0);
});
test('all stages still clear with original enemy counts and rewards',()=>{
 for(const stage of STAGES){
  const b=new Battle(stage.id,fresh());
  for(let i=0;i<1000&&b.status==='active';i++){
   b.shots=[];for(const e of b.enemies)b.shots.push({x:e.x,y:e.y,vx:0,vy:0,damage:1000,friendly:true});
   b.step(WORLD.step,idle);
  }
  assert.equal(b.status,'won');assert.equal(b.kills,stage.waves*stage.count);assert.equal(b.earned,stage.waves*stage.count*stage.reward);
 }
});
