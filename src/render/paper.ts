import {WORLD,CONTACT} from '../content/balance.js';
import type {Battle,Vec} from '../game/combat/battle.js';
import {drawCrumple} from './crumple.js';
export class PaperRenderer {
 private ctx:CanvasRenderingContext2D;private background:HTMLCanvasElement;
 constructor(canvas:HTMLCanvasElement){
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');this.ctx=ctx;
 this.background=document.createElement('canvas');this.background.width=WORLD.width;this.background.height=WORLD.height;
 const g=this.background.getContext('2d')!;const paper=g.createLinearGradient(0,0,WORLD.width,WORLD.height);paper.addColorStop(0,'#fbf2da');paper.addColorStop(1,'#eee2c3');
 g.fillStyle=paper;g.fillRect(0,0,WORLD.width,WORLD.height);
 g.strokeStyle='#b8cbd0';g.lineWidth=.6;for(let y=18;y<WORLD.height;y+=24){g.beginPath();g.moveTo(0,y);g.lineTo(WORLD.width,y);g.stroke()}
 g.strokeStyle='#dca79e';g.beginPath();g.moveTo(65,0);g.lineTo(65,WORLD.height);g.stroke();
 g.fillStyle='#d5c6a4';for(let y=50;y<WORLD.height;y+=85){g.beginPath();g.arc(22,y,8,0,Math.PI*2);g.fill()}
 // Deterministic paper fibres, baked once and never part of gameplay state.
 g.fillStyle='#806f4722';for(let i=0;i<1400;i++){const x=(i*173.37)%WORLD.width,y=(i*91.71)%WORLD.height;g.fillRect(x,y,1.3,.65)}
 }
 private poly(points:number[][],color:string){const c=this.ctx;c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
 private plane(p:Vec,angle:number,enemy:boolean,damage:number){const c=this.ctx;c.save();c.translate(p.x,p.y);c.rotate(angle+Math.PI/2);
 c.save();c.translate(4,5);this.poly([[0,-24],[-17,18],[0,9],[17,18]],'#695e452b');c.restore();
 this.poly([[0,-24],[-17,18],[0,9]],enemy?'#d98d7e':'#fffdf4');
 this.poly([[0,-24],[17,18],[0,9]],enemy?'#a85e50':'#a9bfc4');
 this.poly([[0,-24],[-4,10],[0,15]],enemy?'#b66b59':'#d7e2df');
 c.strokeStyle=enemy?'#934b42':'#6d8b87';c.lineWidth=1;c.beginPath();c.moveTo(0,-24);c.lineTo(-17,18);c.lineTo(0,9);c.lineTo(17,18);c.closePath();c.stroke();
 if(damage>.45){c.strokeStyle='#776c5e';c.lineWidth=1.5;c.beginPath();c.moveTo(-9,6);c.lineTo(-3,9);c.lineTo(-7,15);c.stroke()}
 c.restore()}
 draw(b:Battle|null, death?:{elapsed:number;reduced:boolean}){const c=this.ctx;c.drawImage(this.background,0,0);if(!b){this.plane({x:WORLD.width/2,y:WORLD.height/2},-.7,false,0);return}
 for(const s of b.shots){c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(s.vy,s.vx));this.poly([[12,0],[-9,-4],[-3,0],[-9,4]],s.friendly?'#426f8b':'#aa4238');this.poly([[9,0],[-6,-2],[-2,0]],s.friendly?'#c9e6e5':'#ffd5ac');c.restore()}
 for(const e of b.enemies)this.plane(e,e.angle,true,1-e.hp/e.maxHp);
 for(const s of b.scraps){
  c.save();
  // Fatal contact continues its burst during the existing visual-only death sequence.
  const remaining=Math.max(0,s.life-(death?.elapsed??0));
  const progress=1-remaining/CONTACT.burstDuration;
  c.globalAlpha=remaining/CONTACT.burstDuration;
  if(s.kind==='ram'){
   c.strokeStyle='#bc704b';c.lineWidth=2.5;
   c.beginPath();c.arc(s.x,s.y,12+progress*48,0,Math.PI*2);c.stroke();
   for(let i=0;i<12;i++){
    const a=i*2.399963,r=12+progress*(38+(i%4)*9);
    c.save();c.translate(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r);
    c.rotate(a+progress*3);this.poly([[-4,-3],[6,-2],[1,5]],i%3===0?'#fff5d8':i%3===1?'#d78b79':'#a85e50');c.restore();
   }
   c.fillStyle='#98463a';c.font='bold 20px system-ui';c.textAlign='center';
   c.fillText('-20% HP',Math.max(45,Math.min(WORLD.width-45,s.x)),Math.max(25,s.y-27-progress*20));
  }else{
   for(let i=0;i<5;i++){const a=i*1.257,r=progress*CONTACT.burstDuration*65;c.fillStyle=i%2?'#d78b79':'#9e6652';c.fillRect(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r,5,4)}
  }
  c.restore();
 }
 if(!death&&b.player.shield>0){c.strokeStyle='#78a8a9';c.globalAlpha=.4;c.lineWidth=2;c.beginPath();c.arc(b.player.x,b.player.y,26,0,Math.PI*2);c.stroke();c.globalAlpha=1}
 if(death)drawCrumple(c,b.player,b.player.angle,death.elapsed,death.reduced);
 else this.plane(b.player,b.player.angle,false,1-b.player.hp/b.maxHp);
 }
}
