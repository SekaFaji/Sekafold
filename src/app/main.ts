import {WORLD,STAGES,UPGRADES,LABELS,LIMITS,cost} from '../content/balance.js';
import {Battle} from '../game/combat/battle.js';
import {Controls} from '../input/controls.js';
import {PaperRenderer} from '../render/paper.js';
import {buy,settle} from '../progression/profile.js';
import {load,save} from '../persistence/storage.js';
import {renderMainMenu} from '../ui/main-menu.js';

function el<T extends HTMLElement>(id:string):T {
  const x=document.getElementById(id);
  if(!x)throw Error('Missing '+id);
  return x as T;
}
const canvas=el<HTMLCanvasElement>('field'), panel=el('panel'), hud=el('hud'), sticks=el('sticks');
const pauseBtn=el<HTMLButtonElement>('pause'),wallet=el('wallet'),stageText=el('stage');
const paperValue=el('paper-value'),tapeValue=el('tape-value');
const paperBar=el<HTMLProgressElement>('paper-bar'),tapeBar=el<HTMLProgressElement>('tape-bar');
const controls=new Controls(canvas,el('move'),el('aim')),renderer=new PaperRenderer(canvas),loaded=load(),profile=loaded.profile;
let warning=loaded.warning,writable=loaded.writable,battle:Battle|null=null,runId=0,paused=false,acc=0,last=0;
function persist() {
  if(writable&&!save(profile)){writable=false;warning='Saving failed. Progress lasts this session only.'}
  wallet.textContent=profile.scraps+' scraps';
}
function button(label:string,fn:()=>void,disabled=false) {
  const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;b.onclick=fn;return b;
}
function line(tag:string,text:string,parent:HTMLElement=panel) {
  const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;
}
function show(title:string,description:string,eyebrow='FLIGHT NOTEBOOK') {
  panel.replaceChildren();panel.className='paper page';panel.hidden=false;
  const heading=line('div','');heading.className='page-heading';
  line('div',eyebrow,heading).className='eyebrow';line('h1',title,heading);line('p',description,heading);
  if(warning)line('p',warning).className='notice';
}
function back(label='Main menu',fn=home) {const b=button(label,fn);b.className='back-button';panel.append(b)}
function setCombat(active:boolean){hud.hidden=!active;sticks.hidden=!active;pauseBtn.hidden=!active}
function home(){
  battle=null;paused=false;controls.clear();setCombat(false);renderer.draw(null);
  persist();
  renderMainMenu(panel,profile.unlocked,profile.scraps,warning,{campaign,workshop,help});
}
function campaign(){
  show('The Notebook','Choose a stage. Replay any unlocked flight to earn more scraps.','CHAPTER 01');
  for(const s of STAGES){
    const locked=s.id>profile.unlocked;
    const b=button('',()=>launch(s.id),locked);b.className='stage-card';
    line('span',String(s.id).padStart(2,'0'),b).className='stage-index';
    const copy=line('span',s.name,b);copy.className='stage-copy';
    line('small',s.waves+' waves · '+s.count+' aircraft per wave',copy);
    line('span',locked?'Locked':'Fly ›',b);
    panel.append(b);
  }
  back();
}
function workshop(){
  show('Workshop','Permanent upgrades · '+profile.scraps+' scraps','FOLDING BENCH');
  for(const k of UPGRADES){
    const row=line('div','');row.className='upgrade';
    line('span',LABELS[k]+' · Lv. '+profile.upgrades[k],row);
    row.append(button(profile.upgrades[k]>=LIMITS[k]?'Max':'Buy · '+cost(profile.upgrades[k]),()=>{if(buy(profile,k)){persist();workshop()}},profile.scraps<cost(profile.upgrades[k])||profile.upgrades[k]>=LIMITS[k]));
  }
  back();
}
function help(){
  show('Flight school','Move and aim independently. Defeat every squadron to advance.','HOW TO PLAY');
  line('h2','Touch');line('p','Left joystick moves your plane. Right joystick aims and fires. Release either stick to stop its input.');
  line('h2','Keyboard & mouse');line('p','WASD or arrow keys move. Aim with the mouse, hold left click or Space to fire. Escape pauses.');
  line('h2','Keep your scraps');line('p','Tape reinforcement regenerates after avoiding damage. Paper durability does not regenerate. Spend earned scraps in the Workshop, even after defeat.');
  back();
}
function launch(stage:number){
  if(stage>profile.unlocked)return;
  runId=profile.nextRun++;persist();battle=new Battle(stage,profile);paused=false;acc=0;controls.clear();
  panel.hidden=true;setCombat(true);
}
function report(b:Battle){
  settle(profile,runId,b.stage.id,b.earned,b.status==='won');persist();setCombat(false);controls.clear();
  show(b.status==='won'?'Flight complete!':'Plane crumpled!',b.kills+' enemies down · '+Math.floor(b.time)+'s flown · +'+b.earned+' scraps','FLIGHT REPORT');
  const row=line('div','');row.className='buttons';
  if(b.status==='won'&&b.stage.id<STAGES.length)row.append(button('Next stage',()=>launch(b.stage.id+1)));
  row.append(button('Retry',()=>launch(b.stage.id)),button('Workshop',()=>{battle=null;workshop()}),button('Campaign',()=>{battle=null;campaign()}));
  back();
}
function toggle(){
  if(!battle||battle.status!=='active')return;
  paused=!paused;controls.clear();acc=0;
  if(paused){
    sticks.hidden=true;show('Flight paused','Your flight time is frozen.');
    const row=line('div','');row.className='buttons';
    row.append(button('Resume',toggle),button('End flight',()=>{if(battle){battle.status='lost';report(battle)}}));
  }else{panel.hidden=true;sticks.hidden=false}
}
pauseBtn.onclick=toggle;
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!e.repeat)toggle()});
function interrupt(){controls.clear();if(battle?.status==='active'&&!paused)toggle()}
window.addEventListener('blur',interrupt);
document.addEventListener('visibilitychange',()=>{if(document.hidden)interrupt()});
function updateHud(b:Battle){
  stageText.textContent='Stage '+b.stage.id+' · Wave '+b.wave+'/'+b.stage.waves+'\n+'+b.earned+' scraps';
  paperValue.textContent='Paper '+Math.ceil(b.player.hp)+' / '+b.maxHp;
  paperBar.max=b.maxHp;paperBar.value=b.player.hp;
  tapeValue.textContent='Tape '+Math.ceil(b.player.shield)+' / '+b.maxShield;
  tapeBar.max=b.maxShield;tapeBar.value=b.player.shield;
}
function frame(now:number){
  const dt=Math.min(.1,(now-(last||now))/1000);last=now;
  if(battle&&battle.status==='active'&&!paused){
    acc+=dt;
    while(acc>=WORLD.step&&battle.status==='active'){battle.step(WORLD.step,controls.read(battle.player));acc-=WORLD.step}
    renderer.draw(battle);updateHud(battle);
    if(battle.status!=='active')report(battle);
  }
  requestAnimationFrame(frame);
}
home();requestAnimationFrame(frame);
