import {WORLD,STAGES,UPGRADES,LABELS,LIMITS,cost} from '../content/balance.js';
import {Battle} from '../game/combat/battle.js';
import {Controls} from '../input/controls.js';
import {PaperRenderer} from '../render/paper.js';
import {buy,settle} from '../progression/profile.js';
import {load,save} from '../persistence/storage.js';
function el<T extends HTMLElement>(id:string):T{const x=document.getElementById(id);if(!x)throw Error('Missing '+id);return x as T}
const canvas=el<HTMLCanvasElement>('field'),panel=el('panel'),hud=el('hud'),sticks=el('sticks'),pauseBtn=el<HTMLButtonElement>('pause'),wallet=el('wallet'),stageText=el('stage'),bars=el('bars');
const controls=new Controls(canvas,el('move'),el('aim')),renderer=new PaperRenderer(canvas),loaded=load(),profile=loaded.profile;
let warning=loaded.warning,writable=loaded.writable,battle:Battle|null=null,runId=0,paused=false,acc=0,last=0;
function persist(){if(writable&&!save(profile)){writable=false;warning='Saving failed. Progress lasts this session only.'}wallet.textContent=profile.scraps+' scraps'}
function button(label:string,fn:()=>void,disabled=false){const b=document.createElement('button');b.textContent=label;b.disabled=disabled;b.onclick=fn;return b}
function line(tag:string,text:string){const n=document.createElement(tag);n.textContent=text;panel.append(n);return n}
function show(title:string,description:string){panel.replaceChildren();panel.hidden=false;line('h1',title);line('p',description);if(warning)line('p',warning)}
function setCombat(active:boolean){hud.hidden=!active;sticks.hidden=!active;pauseBtn.hidden=!active}
function home(){battle=null;paused=false;controls.clear();setCombat(false);renderer.draw(null);show('Take flight.','Chapter 1 / The Notebook');const row=line('div','');row.className='buttons';for(const s of STAGES)row.append(button(s.id+'. '+s.name,()=>launch(s.id),s.id>profile.unlocked));row.append(button('Workshop',workshop),button('Endless - coming later',()=>{},true));line('p','Fly freely, aim and fire. Earn scraps even if your plane is destroyed.');persist()}
function workshop(){show('Workshop','Permanent upgrades • '+profile.scraps+' scraps');for(const k of UPGRADES){const row=line('div','');row.className='upgrade';const name=document.createElement('span');name.textContent=LABELS[k]+' · Lv. '+profile.upgrades[k];row.append(name,button('Buy · '+cost(profile.upgrades[k]),()=>{if(buy(profile,k)){persist();workshop()}},profile.scraps<cost(profile.upgrades[k])||profile.upgrades[k]>=LIMITS[k]))}panel.append(button('Back to notebook',home))}
function launch(stage:number){if(stage>profile.unlocked)return;runId=profile.nextRun++;persist();battle=new Battle(stage,profile);paused=false;acc=0;controls.clear();panel.hidden=true;setCombat(true)}
function report(b:Battle){settle(profile,runId,b.stage.id,b.earned,b.status==='won');persist();setCombat(false);controls.clear();show(b.status==='won'?'Flight complete!':'Plane crumpled!',b.kills+' enemies down · '+Math.floor(b.time)+'s flown · +'+b.earned+' scraps');const row=line('div','');row.className='buttons';row.append(button('Retry',()=>launch(b.stage.id)),button('Workshop',()=>{battle=null;workshop()}),button('Notebook',home));if(b.status==='won'&&b.stage.id<STAGES.length)row.append(button('Next stage',()=>launch(b.stage.id+1)))}
function toggle(){if(!battle||battle.status!=='active')return;paused=!paused;controls.clear();acc=0;if(paused){sticks.hidden=true;show('Flight paused','Your flight time is frozen.');panel.append(button('Resume',toggle),button('End flight',()=>{if(battle){battle.status='lost';report(battle)}}))}else{panel.hidden=true;sticks.hidden=false}}
pauseBtn.onclick=toggle;window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!e.repeat)toggle()});
function interrupt(){controls.clear();if(battle?.status==='active'&&!paused)toggle()}
window.addEventListener('blur',interrupt);document.addEventListener('visibilitychange',()=>{if(document.hidden)interrupt()});
function frame(now:number){const dt=Math.min(.1,(now-(last||now))/1000);last=now;
 if(battle&&battle.status==='active'&&!paused){acc+=dt;while(acc>=WORLD.step&&battle.status==='active'){battle.step(WORLD.step,controls.read(battle.player));acc-=WORLD.step}
 renderer.draw(battle);stageText.textContent='Stage '+battle.stage.id+' · Wave '+battle.wave+'/'+battle.stage.waves+' · +'+battle.earned+' scraps';
 bars.innerHTML='<span>Paper '+Math.ceil(battle.player.hp)+' / '+battle.maxHp+'</span><progress max="'+battle.maxHp+'" value="'+battle.player.hp+'"></progress><span>Tape '+Math.ceil(battle.player.shield)+' / '+battle.maxShield+'</span><progress max="'+battle.maxShield+'" value="'+battle.player.shield+'"></progress>';
 if(battle.status!=='active')report(battle)}
 requestAnimationFrame(frame)}
home();requestAnimationFrame(frame);
