import {screenToWorld} from '../core/viewport.js';
import type {Command,Vec} from '../game/combat/battle.js';
const zero=():Vec=>({x:0,y:0});
export class Controls {
 private keys=new Set<string>();private mouse:Vec|null=null;private firing=false;
 private move=zero();private aim=zero();private aiming=false;private resets:(()=>void)[]=[];
 constructor(canvas:HTMLCanvasElement,move:HTMLElement,aim:HTMLElement){
 window.addEventListener('keydown',e=>{if(e.target instanceof HTMLElement && e.target.closest('button,input,select,textarea,a'))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();this.keys.add(e.code)});
 window.addEventListener('keyup',e=>this.keys.delete(e.code));
 const point=(e:PointerEvent)=>{this.mouse=screenToWorld(e.clientX,e.clientY,canvas.getBoundingClientRect())};
 canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')point(e)});
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){point(e);this.firing=true;canvas.setPointerCapture(e.pointerId)}});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>{this.firing=false});
 this.stick(move,v=>this.move=v);this.stick(aim,v=>{this.aim=v;this.aiming=Math.hypot(v.x,v.y)>.1});
 }
 private stick(el:HTMLElement,set:(v:Vec)=>void){
 let id:number|null=null;const knob=el.querySelector('i')!;
 const reset=()=>{id=null;set(zero());knob.style.transform='';};this.resets.push(reset);
 const update=(e:PointerEvent)=>{const r=el.getBoundingClientRect(),radius=r.width*.36;let x=(e.clientX-r.left-r.width/2)/radius,y=(e.clientY-r.top-r.height/2)/radius;const n=Math.max(1,Math.hypot(x,y));x/=n;y/=n;set({x,y});knob.style.transform='translate('+x*radius+'px,'+y*radius+'px)'};
 el.addEventListener('pointerdown',e=>{if(id!==null)return;id=e.pointerId;el.setPointerCapture(id);update(e)});
 el.addEventListener('pointermove',e=>{if(e.pointerId===id)update(e)});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(name,e=>{if((e as PointerEvent).pointerId===id)reset()});
 }
 clear(){this.keys.clear();this.firing=false;this.mouse=null;this.resets.forEach(f=>f())}
 read(player:Vec):Command{
 const k=(...codes:string[])=>codes.some(c=>this.keys.has(c))?1:0;
 const keyboard={x:k('KeyD','ArrowRight')-k('KeyA','ArrowLeft'),y:k('KeyS','ArrowDown')-k('KeyW','ArrowUp')};
 const move=Math.hypot(this.move.x,this.move.y)>.05?this.move:keyboard;
 const aim=this.aiming?this.aim:this.mouse?{x:this.mouse.x-player.x,y:this.mouse.y-player.y}:zero();
 return {move,aim,fire:this.aiming||this.firing||this.keys.has('Space')};
 }
}
