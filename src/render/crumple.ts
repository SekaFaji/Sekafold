import type {Vec} from '../game/combat/battle.js';
import {deathPose} from './death-sequence.js';
type Point = readonly [number,number];
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
function polygon(c:CanvasRenderingContext2D,points:readonly Point[],color:string){
  c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=color;c.fill();
}
function morph(c:CanvasRenderingContext2D,a:readonly Point[],b:readonly Point[],t:number,color:string){
  polygon(c,a.map(([x,y],i):Point=>[lerp(x,b[i][0],t),lerp(y,b[i][1],t)]),color);
}
/** Fold the actual starter-plane silhouette into a faceted paper ball. */
export function drawCrumple(c:CanvasRenderingContext2D,p:Vec,angle:number,elapsed:number,reduced:boolean){
  const pose=deathPose(elapsed,reduced);
  const t=pose.fold*pose.fold*(3-2*pose.fold);
  const drop=pose.settle*10+(reduced?0:Math.sin(pose.settle*Math.PI)*-5);
  c.save();c.translate(p.x,p.y+drop);
  if(!reduced&&pose.burst>0&&pose.burst<1){
    const v=pose.burst;
    c.globalAlpha=(1-v)*.65;c.strokeStyle='#bc8b60';c.lineWidth=2;
    c.beginPath();c.arc(0,0,9+v*53,0,Math.PI*2);c.stroke();
    for(let i=0;i<12;i++){
      const a=i*2.399963, r=(12+55*v)*(0.72+(i%4)*.1);
      c.save();c.translate(Math.cos(a)*r,Math.sin(a)*r+v*v*14);c.rotate(a+v*4);
      polygon(c,[[-3,-2],[4,-3],[2,4]],i%3===0?'#a9bfc4':i%3===1?'#e4d7b8':'#fffdf4');c.restore();
    }
    c.globalAlpha=1;
  }
  c.rotate(angle+Math.PI/2+t*.9);
  c.save();c.translate(3,5);c.globalAlpha=.16;
  c.beginPath();c.ellipse(0,0,lerp(17,12,t),lerp(22,10,t),0,0,Math.PI*2);c.fillStyle='#645642';c.fill();c.restore();
  morph(c,[[0,-24],[-17,18],[0,9]],[[0,-12],[-12,5],[0,3]],t,'#fffdf4');
  morph(c,[[0,-24],[17,18],[0,9]],[[0,-12],[12,3],[0,3]],t,'#a9bfc4');
  morph(c,[[0,-24],[-4,10],[0,15]],[[0,-12],[-5,7],[3,12]],t,'#d7e2df');
  if(t>.12){
    c.globalAlpha=t;polygon(c,[[-12,5],[-8,-7],[0,-12],[5,-5],[0,3]],'#f5edda');
    polygon(c,[[0,3],[12,3],[8,11],[3,12],[-5,7]],'#d6cbb6');
    polygon(c,[[0,-12],[10,-7],[12,3],[5,-5]],'#b8b9ab');
    c.strokeStyle='#a89d88';c.lineWidth=.8;
    c.beginPath();c.moveTo(-8,-7);c.lineTo(0,3);c.lineTo(8,11);c.moveTo(5,-5);c.lineTo(-5,7);c.stroke();
  }
  c.restore();
}
