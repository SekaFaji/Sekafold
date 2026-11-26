import type {Enemy} from '../game/entities/aircraft.js';
import type {Pickup} from '../game/combat/pickups.js';
import {PICKUPS} from '../content/pickups.js';
type Point=readonly [number,number];
function poly(c:CanvasRenderingContext2D,points:readonly Point[],fill:string,stroke?:string){
 c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();
 if(stroke){c.strokeStyle=stroke;c.lineWidth=1.2;c.stroke()}
}
export function drawEnemyVariant(c:CanvasRenderingContext2D,e:Enemy){
 if(e.divePhase==='warning'&&e.diveTarget){
  c.save();c.strokeStyle='#b35b38';c.lineWidth=2;c.setLineDash([6,6]);c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.diveTarget.x,e.diveTarget.y);c.stroke();
  c.setLineDash([]);c.beginPath();c.arc(e.diveTarget.x,e.diveTarget.y,18,0,Math.PI*2);c.stroke();c.restore();
 }
 c.save();c.translate(e.x,e.y);c.rotate(e.angle+Math.PI/2);
 if(e.kind==='scout'){
  poly(c,[[0,-23],[-11,14],[0,7],[11,14]],'#e4b85c','#94703e');
  poly(c,[[0,-23],[11,14],[0,7]],'#bc803f');
  poly(c,[[0,-23],[-3,9],[0,13]],'#fbe5a0');
 }else if(e.kind==='heavy'){
  poly(c,[[0,-25],[-25,12],[-20,22],[0,13],[20,22],[25,12]],'#b38b63','#75563e');
  poly(c,[[0,-25],[25,12],[20,22],[0,13]],'#8f674d');
  poly(c,[[0,-25],[-5,13],[0,19],[5,13]],'#e2bb8a');
  c.strokeStyle='#79563c';c.lineWidth=2;c.beginPath();c.moveTo(-20,12);c.lineTo(-7,4);c.moveTo(20,12);c.lineTo(7,4);c.stroke();
 }else{
  poly(c,[[0,-27],[-19,15],[-7,10],[0,19],[7,10],[19,15]],'#ba98c4','#775982');
  poly(c,[[0,-27],[19,15],[7,10],[0,19]],'#89669e');
  poly(c,[[0,-27],[-4,10],[0,19]],'#ead9e4');
  if(e.divePhase==='diving'){c.strokeStyle='#ae7046';c.lineWidth=2;c.beginPath();c.moveTo(-7,23);c.lineTo(-7,39);c.moveTo(7,23);c.lineTo(7,39);c.stroke()}
 }
 if(e.hp<e.maxHp){c.strokeStyle='#73534a';c.beginPath();c.moveTo(-8,4);c.lineTo(-2,8);c.lineTo(-7,13);c.stroke()}
 c.restore();
 if(e.kind==='heavy'||e.hp<e.maxHp){
  c.save();c.fillStyle='#75594a80';c.fillRect(e.x-16,e.y-e.radius-10,32,4);c.fillStyle='#ac6149';c.fillRect(e.x-16,e.y-e.radius-10,32*e.hp/e.maxHp,4);c.restore();
 }
}
const colors={rapid:'#dcb24b',repair:'#6b9b75',power:'#9c79b6'};
export function drawPickup(c:CanvasRenderingContext2D,item:Pickup){
 c.save();c.translate(item.x,item.y);
 c.globalAlpha=item.remaining<2?.55+.45*Math.sin(item.remaining*10)**2:1;
 c.fillStyle='#675e4540';c.beginPath();c.ellipse(2,7,17,14,0,0,Math.PI*2);c.fill();
 poly(c,[[0,-19],[16,-9],[16,9],[0,19],[-16,9],[-16,-9]],'#fff8e6',colors[item.kind]);
 c.strokeStyle=colors[item.kind];c.lineWidth=2;c.beginPath();c.arc(0,0,13,0,Math.PI*2);c.stroke();
 if(item.kind==='repair'){c.fillStyle=colors.repair;c.fillRect(-3,-9,6,18);c.fillRect(-9,-3,18,6)}
 else if(item.kind==='rapid')poly(c,[[-1,-10],[8,-10],[2,-1],[8,-1],[-5,11],[-1,2],[-8,2]],colors.rapid);
 else poly(c,[[0,-10],[3,-3],[10,0],[3,3],[0,10],[-3,3],[-10,0],[-3,-3]],colors.power);
 c.strokeStyle=colors[item.kind];c.lineWidth=2;c.beginPath();c.arc(0,0,22,-Math.PI/2,-Math.PI/2+2*Math.PI*item.remaining/PICKUPS.lifetime);c.stroke();
 c.restore();
}
