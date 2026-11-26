import {WORLD} from '../content/balance.js';
import type {Battle,Vec} from '../game/combat/battle.js';
export class PaperRenderer {
 private ctx:CanvasRenderingContext2D;private background:HTMLCanvasElement;
 constructor(canvas:HTMLCanvasElement){
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');this.ctx=ctx;
 this.background=document.createElement('canvas');this.background.width=WORLD.width;this.background.height=WORLD.height;
 const g=this.background.getContext('2d')!;g.fillStyle='#f7f0de';g.fillRect(0,0,WORLD.width,WORLD.height);
 g.strokeStyle='#b8cbd0';g.lineWidth=.6;for(let y=18;y<WORLD.height;y+=24){g.beginPath();g.moveTo(0,y);g.lineTo(WORLD.width,y);g.stroke()}
 g.strokeStyle='#dca79e';g.beginPath();g.moveTo(65,0);g.lineTo(65,WORLD.height);g.stroke();
 g.fillStyle='#e3dac4';for(let y=50;y<WORLD.height;y+=85){g.beginPath();g.arc(22,y,8,0,Math.PI*2);g.fill()}
 }
 private poly(points:number[][],color:string){const c=this.ctx;c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
 private plane(p:Vec,angle:number,enemy:boolean,damage:number){const c=this.ctx;c.save();c.translate(p.x,p.y);c.rotate(angle+Math.PI/2);
 c.save();c.translate(4,5);this.poly([[0,-24],[-17,18],[0,9],[17,18]],'#695e452b');c.restore();
 this.poly([[0,-24],[-17,18],[0,9]],enemy?'#d98d7e':'#fffdf4');
 this.poly([[0,-24],[17,18],[0,9]],enemy?'#a85e50':'#a9bfc4');
 this.poly([[0,-24],[-4,10],[0,15]],enemy?'#b66b59':'#d7e2df');
 if(damage>.45){c.strokeStyle='#776c5e';c.lineWidth=1.5;c.beginPath();c.moveTo(-9,6);c.lineTo(-3,9);c.lineTo(-7,15);c.stroke()}
 c.restore()}
 draw(b:Battle|null){const c=this.ctx;c.drawImage(this.background,0,0);if(!b){this.plane({x:WORLD.width/2,y:WORLD.height/2},-.7,false,0);return}
 for(const s of b.shots){c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(s.vy,s.vx));this.poly([[9,0],[-5,-3],[-2,0],[-5,3]],s.friendly?'#426f8b':'#aa4238');c.restore()}
 for(const e of b.enemies)this.plane(e,e.angle,true,1-e.hp/e.maxHp);
 for(const s of b.scraps){c.save();c.globalAlpha=s.life/.45;for(let i=0;i<5;i++){const a=i*1.257,r=(.45-s.life)*65;c.fillStyle=i%2?'#d78b79':'#9e6652';c.fillRect(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r,5,4)}c.restore()}
 if(b.player.shield>0){c.strokeStyle='#78a8a9';c.globalAlpha=.4;c.lineWidth=2;c.beginPath();c.arc(b.player.x,b.player.y,26,0,Math.PI*2);c.stroke();c.globalAlpha=1}
 this.plane(b.player,b.player.angle,false,1-b.player.hp/b.maxHp);
 }
}
