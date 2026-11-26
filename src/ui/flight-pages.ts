import {STAGES,LABELS,LIMITS,cost,aircraftStats,type Upgrade} from '../content/balance.js';
import type {Profile} from '../progression/profile.js';

function node<K extends keyof HTMLElementTagNameMap>(tag:K,cls:string,content=''){
 const e=document.createElement(tag);e.className=cls;e.textContent=content;return e;
}
const art={
 speed:'<path d="M7 39 40 7 28 40 20 29Z" fill="#d5e5d7" stroke="#52776a" stroke-width="2"/><path d="M40 7 20 29 28 40Z" fill="#8eb9a8"/><path d="m4 24 11-9m-8 22 9-7" stroke="#52776a" stroke-width="2"/>',
 repairRate:'<circle cx="24" cy="24" r="16" fill="#d8e6d5" stroke="#608a77" stroke-width="2"/><path d="M24 13v22m-11-11h22" stroke="#527a68" stroke-width="5"/><path d="m35 7 7 7-10 2" fill="#e6c286" stroke="#93784c"/>',
 repairDelay:'<circle cx="24" cy="26" r="15" fill="#f2e4be" stroke="#7a8b72" stroke-width="2"/><path d="M24 13v13l8 5M19 5h10M24 5v6" fill="none" stroke="#52776a" stroke-width="2.5" stroke-linecap="round"/>',
 damage:'<path d="M5 38 39 5 31 37 22 30Z" fill="#faf2db" stroke="#7b6849" stroke-width="2"/><path d="M39 5 22 30 31 37Z" fill="#d8ae68"/><path d="M5 38 22 30 39 5" fill="none" stroke="#8f744c" stroke-width="1.5"/><path d="m8 24-4 4m15-19-4 4" stroke="#a56d46" stroke-width="2"/>',
 rate:'<g stroke="#7d725b" stroke-width="1.2"><path d="m5 17 20-10-6 21-4-10Z" fill="#faf2db"/><path d="m16 25 21-10-7 22-4-11Z" fill="#e1c48b"/><path d="m24 33 18-9-5 19-4-10Z" fill="#faf2db"/></g><path d="m5 32 6-4m-3 13 8-6" stroke="#a56d46" stroke-width="2" stroke-linecap="round"/>',
 durability:'<path d="M8 16 31 10l12 6-23 8Z" fill="#d2ad71" stroke="#856d48"/><path d="m8 16 12 8 23-8v6l-23 8-12-8Z" fill="#ba925a" stroke="#856d48"/><path d="m8 22 12 8 23-8v6l-23 8-12-8Z" fill="#e7c992" stroke="#856d48"/><path d="m8 28 12 8 23-8v6l-23 8-12-8Z" fill="#ba925a" stroke="#856d48"/><path d="m20 24 0 18" stroke="#856d48"/>',
 reinforcement:'<ellipse cx="22" cy="22" rx="16" ry="15" fill="#d5aa62" stroke="#806c4b" stroke-width="2"/><path d="M17 7c-8 7-8 21 0 30" fill="none" stroke="#f6e2b0" stroke-width="4"/><ellipse cx="25" cy="22" rx="8" ry="9" fill="#657f78" stroke="#806c4b" stroke-width="2"/><path d="m35 23 10 5-7 14-13-6Z" fill="#ead39b" fill-opacity=".85" stroke="#9e8657"/>',
 endless:'<path d="M24 24C15 9 4 12 5 24s13 15 19 0 19-14 19 0-13 15-19 0Z" fill="none" stroke="#d4e1d5" stroke-width="3"/><path d="m24 5 0 4m0 30v4" stroke="#a8c0b1" stroke-width="2"/>',
 mission:'<path d="m24 4-19 34 19-10 19 10Z" fill="#fff5db" stroke="#7e8d76" stroke-width="1.4"/><path d="M24 4v24l19 10Z" fill="#91b4a6" stroke="#6b9488" stroke-width="1.4"/><path d="m24 4-3 26 3 4 3-6Z" fill="#d4dcd0"/>'
};
function icon(key:keyof typeof art,cls='paper-icon'){
 const e=node('span',cls);
 e.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">'+art[key]+'</svg>';
 return e;
}
function header(panel:HTMLElement,cls:string,kicker:string,title:string,detail:string){
 panel.replaceChildren();panel.className='paper page '+cls;panel.hidden=false;
 const head=node('header','field-heading');
 const copy=node('div','field-heading-copy');
 copy.append(node('span','field-kicker',kicker),node('h1','field-title',title),node('p','field-detail',detail));
 head.append(copy);panel.append(head);return head;
}
function notice(panel:HTMLElement,warning:string){if(warning)panel.append(node('p','notice',warning))}
export function renderCampaign(panel:HTMLElement,profile:Readonly<Profile>,warning:string,launch:(stage:number)=>void){
 const head=header(panel,'campaign-page','CAMPAIGN / 01','The Notebook','Destroy the paper squadrons.');
 head.append(icon('mission','chapter-emblem'));
 const progress=node('div','chapter-progress');
 const track=node('div','chapter-track');
 track.setAttribute('aria-hidden','true');
 for(const s of STAGES){track.append(node('span',s.id<=profile.unlocked?'unlocked':''))}
 progress.append(node('span','chapter-count',profile.unlocked+' / '+STAGES.length+' unlocked'),track);panel.append(progress);
 notice(panel,warning);
 const board=node('div','mission-board');
 for(const s of STAGES){
  const locked=s.id>profile.unlocked, current=s.id===profile.unlocked;
  const card=node('button','mission-ticket '+(locked?'locked':current?'current':'replay'));
  card.type='button';card.disabled=locked;card.onclick=()=>launch(s.id);
  card.dataset.stage=String(s.id);
  const number=node('span','mission-number',String(s.id).padStart(2,'0'));
  const details=node('span','mission-copy');
  details.append(node('span','mission-status',locked?'LOCKED':current?'CURRENT MISSION':'CLEARED / REPLAY'),node('strong','mission-name',s.name),
    node('span','mission-meta',s.waves+' waves · '+s.waves*s.count+' enemies'));
  const action=node('span','mission-action');
  action.append(node('span','mission-reward','+'+(s.waves*s.count*s.reward)+' scraps'),node('span','mission-launch',locked?'Locked':current?'Launch ›':'Replay ›'));
  action.firstElementChild?.setAttribute('title','Maximum base reward if all enemies are destroyed');
  card.append(number,details,action);board.append(card);
 }
 panel.append(board);
 const endless=node('button','endless-ticket');endless.type='button';endless.disabled=true;
 const copy=node('span','endless-copy');
 copy.append(node('strong','endless-title','Endless Survival'),node('small','endless-caption','COMING SOON'));
 endless.append(icon('endless'),copy,node('span','endless-lock','LOCKED'));
 panel.append(endless);
}
const titles:Record<Upgrade,string>={damage:'Damage',rate:'Darts/s',durability:'Paper HP',reinforcement:'Tape cap.',speed:'Speed',repairRate:'Tape/s',repairDelay:'Delay (s)'};
const statKeys={damage:'damage',durability:'maxHp',reinforcement:'maxShield',speed:'speed',repairRate:'repairRate',repairDelay:'repairDelay'} as const;
export function upgradeStat(levels:Readonly<Record<Upgrade,number>>,key:Upgrade):number{
 const stats=aircraftStats(levels);
 return key==='rate'?1/stats.fireDelay:stats[statKeys[key]];
}
const fmt=(n:number)=>Number(n.toFixed(2)).toString();
const ordered:readonly Upgrade[]=['damage','rate','speed','durability','reinforcement','repairRate','repairDelay'];
export function renderUpgradeGrid(panel:HTMLElement,profile:Readonly<Profile>,purchase:(key:Upgrade)=>void){
 const grid=node('div','bench-grid compact-grid');
 for(const key of ordered){
   const level=profile.upgrades[key],max=level>=LIMITS[key],price=cost(level),affordable=profile.scraps>=price;
   const card=node('article','bench-card '+(['damage','rate'].includes(key)?'attack':key==='speed'?'mobility':'defence'));card.dataset.upgrade=key;
   const top=node('div','bench-card-top');
   top.append(icon(key),node('span','bench-level','Lv. '+level));
   const name=node('h3','bench-name',LABELS[key]);
   const values=node('div','bench-stats');
   values.append(node('span','bench-stat-label',titles[key]));
   const change=node('strong','bench-change',fmt(upgradeStat(profile.upgrades,key)));
   if(!max)change.append(node('span','bench-next',' → '+fmt(upgradeStat({...profile.upgrades,[key]:level+1},key))));
   values.append(change);
   const button=node('button','bench-buy'+(!max&&affordable?' affordable':''));
   button.type='button';button.disabled=max||!affordable;button.onclick=()=>purchase(key);
   button.append(node('strong','bench-buy-label',max?'MAXED':affordable?'UPGRADE':'NEED SCRAPS'));
   if(!max)button.append(node('span','bench-price',price.toLocaleString('en-US')));
   button.setAttribute('aria-label',max?LABELS[key]+' maxed':'Upgrade '+LABELS[key]+' for '+price+' scraps');
   card.append(top,name,values,button);grid.append(card);
 }
 panel.append(grid);
}
export function renderWorkshop(panel:HTMLElement,profile:Readonly<Profile>,warning:string,purchase:(key:Upgrade)=>void){
 const head=header(panel,'workshop-page','FOLDING BENCH','Workshop','Permanent aircraft upgrades.');
 head.append(node('span','bench-balance',profile.scraps.toLocaleString('en-US')+' scraps'));
 notice(panel,warning);
 renderUpgradeGrid(panel,profile,purchase);
}
