import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle} from '../../dist/src/game/combat/battle.js';
import {fresh,decode,buy,settle} from '../../dist/src/progression/profile.js';
import {WORLD} from '../../dist/src/content/balance.js';
const idle={move:{x:0,y:0},aim:{x:0,y:0},fire:false};
test('gliding acceleration and release',()=>{const b=new Battle(1,fresh());b.step(WORLD.step,{...idle,move:{x:1,y:0}});assert.ok(b.player.vx>0&&b.player.vx<245);const v=b.player.vx;b.step(WORLD.step,idle);assert.ok(b.player.vx<v&&b.player.vx>0)});
test('reinforcement absorbs damage then regenerates',()=>{const b=new Battle(1,fresh());b.player.abilities.restoreTape(b.maxShield);b.hit(30);assert.equal(b.player.hp,55);assert.equal(b.player.shield,0);for(let i=0;i<174;i++){b.shots=[];b.step(WORLD.step,idle)}assert.equal(b.player.shield,0);for(let i=0;i<24;i++){b.shots=[];b.step(WORLD.step,idle)}assert.ok(b.player.shield>0);b.hit(1);const afterHit=b.player.shield;for(let i=0;i<120;i++){b.shots=[];b.step(WORLD.step,idle)}assert.equal(b.player.shield,afterHit)});
test('defeat stops time',()=>{const b=new Battle(1,fresh());b.hit(999);b.step(1,idle);assert.equal(b.status,'lost');assert.equal(b.time,0)});
test('purchase, serialization, invalid save',()=>{const p=fresh();assert.equal(buy(p,'damage'),false);p.scraps=20;assert.equal(buy(p,'damage'),true);assert.equal(p.scraps,0);assert.deepEqual(decode(JSON.stringify(p)),p);assert.throws(()=>decode('{"schemaVersion":2}'))});
test('settlement once, stage unlock only on victory',()=>{const p=fresh();const id=p.nextRun++;assert.equal(settle(p,id,1,12,false),true);assert.equal(settle(p,id,1,12,true),false);assert.equal(p.unlocked,1);assert.equal(p.scraps,12);assert.equal(settle(p,p.nextRun++,1,8,true),true);assert.equal(p.unlocked,2);assert.equal(p.scraps,20)});
test('formation spawn and real projectile kill',()=>{const b=new Battle(1,fresh());for(let i=0;i<60;i++)b.step(WORLD.step,idle);assert.equal(b.enemies.length,4);const e=b.enemies[0];b.shots.push({x:e.x,y:e.y,vx:0,vy:0,friendly:true,damage:100});b.step(WORLD.step,idle);assert.equal(b.kills,1);assert.equal(b.earned,4)});

test('all three waves clear before campaign victory',()=>{const b=new Battle(1,fresh());for(let i=0;i<600&&b.status==='active';i++){for(const e of b.enemies)b.shots.push({x:e.x,y:e.y,vx:0,vy:0,friendly:true,damage:100});b.step(WORLD.step,idle)}assert.equal(b.status,'won');assert.equal(b.kills,12);assert.equal(b.earned,48)});

test('portrait battlefield and stage-three formation bounds',()=>{
  assert.equal(WORLD.width/WORLD.height,9/16);
  const b=new Battle(3,fresh());
  for(let i=0;i<600;i++){
    b.shots=[];
    b.step(WORLD.step,idle);
    assert.ok(b.enemies.every(e=>e.x>=18&&e.x<=WORLD.width-18&&e.y>=18&&e.y<=WORLD.height-18));
  }
  assert.equal(b.enemies.length,6);
});
