import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle} from '../../dist/src/game/combat/battle.js';
import {createEnemy} from '../../dist/src/game/entities/aircraft.js';
import {fresh} from '../../dist/src/progression/profile.js';
import {WORLD,FLIGHT,CONTACT} from '../../dist/src/content/balance.js';
const idle={move:{x:0,y:0},aim:{x:0,y:0},fire:false};
function enemyAt(b,dx=0,hp=100){
 const {x,y}=b.player;
 return createEnemy(x+dx,y,hp,0,10);
}
function ram(b){
 b.enemies.push(enemyAt(b));
 b.step(WORLD.step,idle);
}
test('contact destroys even a high-HP enemy, bypasses tape and rewards once',()=>{
 const b=new Battle(1,fresh());b.enemies=[enemyAt(b)];b.step(WORLD.step,idle);
 assert.equal(b.player.hp,48);assert.equal(b.player.shield,25);
 assert.equal(b.enemies.length,0);assert.equal(b.kills,1);assert.equal(b.earned,4);
 assert.equal(b.scraps[0].kind,'ram');
 b.step(WORLD.step,idle);
 assert.equal(b.player.hp,48);assert.equal(b.kills,1);assert.equal(b.earned,4);
});
test('contact uses maximum upgraded HP, not remaining HP',()=>{
 const p=fresh();p.upgrades.durability=1;
 const b=new Battle(1,p);
 for(let i=0;i<4;i++){ram(b);assert.ok(Math.abs(b.player.hp-b.maxHp*(1-(i+1)*.2))<1e-9);assert.equal(b.status,'active')}
 ram(b);assert.equal(b.player.hp,0);assert.equal(b.status,'lost');assert.equal(b.kills,5);
 const before=b.time;b.step(WORLD.step,idle);assert.equal(b.time,before);
});
test('near miss does not destroy or damage',()=>{
 const b=new Battle(1,fresh());b.enemies=[enemyAt(b,FLIGHT.radius+CONTACT.enemyRadius+5)];
 b.step(WORLD.step,idle);assert.equal(b.player.hp,b.maxHp);assert.equal(b.enemies.length,1);assert.equal(b.kills,0);
});
test('multiple overlapping enemies each cost 20% and award once',()=>{
 const b=new Battle(1,fresh());b.enemies=[enemyAt(b),enemyAt(b)];
 b.step(WORLD.step,idle);assert.equal(b.player.hp,36);assert.equal(b.kills,2);assert.equal(b.earned,8);
});
test('ram and projectile cannot reward the same enemy twice',()=>{
 const b=new Battle(1,fresh());const e=enemyAt(b);b.enemies=[e];
 b.shots.push({x:e.x,y:e.y,vx:0,vy:0,friendly:true,damage:1000});
 b.step(WORLD.step,idle);assert.equal(b.kills,1);assert.equal(b.earned,4);
});
test('fatal contact wins no stage and grants the destroyed enemy reward',()=>{
 const b=new Battle(1,fresh());b.wave=b.stage.waves;b.hit(48,true);
 b.enemies=[enemyAt(b)];b.step(WORLD.step,idle);
 assert.equal(b.status,'lost');assert.equal(b.kills,1);assert.equal(b.earned,4);
});
