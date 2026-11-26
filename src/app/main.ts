import {WORLD,STAGES,UPGRADES,LABELS,LIMITS,cost} from '../content/balance.js';
import {Battle} from '../game/combat/battle.js';
import {Controls} from '../input/controls.js';
import {PaperRenderer} from '../render/paper.js';
import {buy,settle} from '../progression/profile.js';
import {load,save} from '../persistence/storage.js';
import {renderMainMenu,renderTabs,aircraftShowcase,type MenuTab} from '../ui/main-menu.js';
import {deathPose} from '../render/death-sequence.js';

function el<T extends HTMLElement>(id:string):T {
  const x=document.getElementById(id);
  if(!x)throw Error('Missing '+id);
  return x as T;
}
const canvas=el<HTMLCanvasElement>('field'), panel=el('panel'), hud=el('hud'), sticks=el('sticks');
const nav=el('menu-tabs'),deathLabel=el('death-label');
const pauseBtn=el<HTMLButtonElement>('pause'),wallet=el('wallet'),stageText=el('stage');
const paperValue=el('paper-value'),tapeValue=el('tape-value');
const paperBar=el<HTMLProgressElement>('paper-bar'),tapeBar=el<HTMLProgressElement>('tape-bar');
const controls=new Controls(canvas,el('move'),el('aim')),renderer=new PaperRenderer(canvas),loaded=load(),profile=loaded.profile;
let warning=loaded.warning,writable=loaded.writable,battle:Battle|null=null,runId=0,paused=false,acc=0,last=0;
let death:{elapsed:number;reduced:boolean}|null=null;
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
function showTabs(tab:MenuTab){panel.classList.add('with-tabs');panel.scrollTop=0;renderTabs(nav,tab,selectTab)}
function selectTab(tab:MenuTab){
  if(tab==='home')home();else if(tab==='fly')campaign();else if(tab==='workshop')workshop();else hangar();
}
function home(){
  battle=null;death=null;deathLabel.hidden=true;paused=false;controls.clear();setCombat(false);renderer.draw(null);
  persist();
  renderMainMenu(panel,profile.unlocked,warning,{launch:()=>launch(profile.unlocked),help});showTabs('home');
}
function campaign(){
  show('The Notebook','Clear the squadrons. Replay unlocked stages for scraps.','CAMPAIGN / CHAPTER 01');
  panel.classList.add('campaign-page');
  for(const s of STAGES){
    const locked=s.id>profile.unlocked;
    const b=button('',()=>launch(s.id),locked);b.className='stage-card';
    line('span',String(s.id).padStart(2,'0'),b).className='stage-index';
    const copy=line('span',s.name,b);copy.className='stage-copy';
    line('small',s.waves+' waves · '+s.count+' aircraft per wave',copy);
    line('span',locked?'Locked':'Fly ›',b);
    panel.append(b);
  }
  const endless=button('Endless Survival · Coming soon',()=>{},true);endless.className='endless-note';panel.append(endless);
  showTabs('fly');
}
function workshop(){
  show('Workshop','Improve your plane before the next flight.','FOLDING BENCH');
  panel.classList.add('workshop-page');
  const descriptions={damage:'More damage per dart',durability:'More paper durability',reinforcement:'More regenerating tape',rate:'Faster dart firing'};
  for(const k of UPGRADES){
    const row=line('div','');row.className='upgrade';
    const copy=line('div','',row);copy.className='upgrade-copy';
    line('strong',LABELS[k],copy);
    line('small','Lv. '+profile.upgrades[k]+' · '+descriptions[k],copy);
    row.append(button(profile.upgrades[k]>=LIMITS[k]?'Max':'Buy · '+cost(profile.upgrades[k]),()=>{if(buy(profile,k)){persist();workshop()}},profile.scraps<cost(profile.upgrades[k])||profile.upgrades[k]>=LIMITS[k]));
  }
  showTabs('workshop');
}
function hangar(){
  show('Hangar','Your folded aircraft collection.','AIRCRAFT 01 / 01');
  panel.classList.add('hangar-page');
  panel.append(aircraftShowcase());
  line('h2','The Original');line('p','Equipped · Notebook paper · Paper darts');
  line('p','Your first balanced aircraft. More folds and equipment will arrive in future patches.');
  showTabs('hangar');
}
function help(){
  show('Flight school','Move and aim independently. Defeat every squadron to advance.','HOW TO PLAY');
  line('h2','Touch');line('p','Left joystick moves your plane. Right joystick aims and fires. Release either stick to stop its input.');
  line('h2','Keyboard & mouse');line('p','WASD or arrow keys move. Aim with the mouse, hold left click or Space to fire. Escape pauses.');
  line('h2','Keep your scraps');line('p','Tape reinforcement regenerates after avoiding damage. Paper durability does not regenerate. Spend earned scraps in the Workshop, even after defeat.');
  showTabs('home');
}
function launch(stage:number){
  if(stage>profile.unlocked)return;
  runId=profile.nextRun++;persist();battle=new Battle(stage,profile);paused=false;acc=0;controls.clear();
  death=null;deathLabel.hidden=true;nav.hidden=true;panel.hidden=true;setCombat(true);
}
function settleFlight(b:Battle){if(settle(profile,runId,b.stage.id,b.earned,b.status==='won'))persist()}
function report(b:Battle,voluntary=false){
  settleFlight(b);death=null;deathLabel.hidden=true;nav.hidden=true;setCombat(false);controls.clear();
  show(b.status==='won'?'Flight complete!':voluntary?'Flight ended':'Plane crumpled!','Flight report','FLIGHT REPORT');
  panel.classList.add('report-page');
  const results=line('div','');results.className='flight-results';
  line('strong','+'+b.earned+' scraps',results);
  line('span',b.kills+' enemies down · '+Math.floor(b.time)+'s flown',results);
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
    row.append(button('Resume',toggle),button('End flight',()=>{if(battle){battle.status='lost';report(battle,true)}}));
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
function beginDeath(b:Battle){
  settleFlight(b);controls.clear();setCombat(false);nav.hidden=true;panel.hidden=true;
  death={elapsed:0,reduced:window.matchMedia('(prefers-reduced-motion: reduce)').matches};
  deathLabel.hidden=false;renderer.draw(b,death);
}
function finishStep(b:Battle){
  if(b.status==='lost')beginDeath(b);
  else if(b.status==='won')report(b);
}
function frame(now:number){
  const dt=Math.min(.1,(now-(last||now))/1000);last=now;
  if(battle&&battle.status==='active'&&!paused){
    acc+=dt;
    while(acc>=WORLD.step&&battle.status==='active'){battle.step(WORLD.step,controls.read(battle.player));acc-=WORLD.step}
    renderer.draw(battle);updateHud(battle);
    finishStep(battle);
  }else if(battle&&death){
    death.elapsed+=document.hidden?0:dt;
    renderer.draw(battle,death);
    if(deathPose(death.elapsed,death.reduced).finished)report(battle);
  }
  requestAnimationFrame(frame);
}
home();requestAnimationFrame(frame);
