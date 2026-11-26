/** Original paper showcase and persistent menu navigation. */
export type MenuTab = 'home'|'fly'|'workshop'|'hangar';
const tabs: readonly {id:MenuTab;label:string;icon:string}[] = [
  {id:'home',label:'Home',icon:'<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z"/>'},
  {id:'fly',label:'Fly',icon:'<path d="M3 11 22 3l-6 19-4-7-9-4Zm9 4L22 3"/>'},
  {id:'workshop',label:'Workshop',icon:'<path d="m14 6 4-3 3 3-3 4-3-1-8 12-4-4L15 9z"/>'},
  {id:'hangar',label:'Hangar',icon:'<path d="M3 21V9l9-6 9 6v12H3Zm5 0v-8h8v8M8 17h8"/>'}
];
function node<K extends keyof HTMLElementTagNameMap>(tag:K, cls:string, text=''){
  const n=document.createElement(tag);n.className=cls;n.textContent=text;return n;
}
export function renderTabs(nav:HTMLElement, active:MenuTab, select:(tab:MenuTab)=>void){
  nav.replaceChildren();
  for(const tab of tabs){
    const button=node('button','tab-button'+(active===tab.id?' selected':''));
    button.type='button';
    if(active===tab.id)button.setAttribute('aria-current','page');
    const icon=node('span','tab-icon');
    icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+tab.icon+'</svg>';
    button.append(icon,node('span','tab-label',tab.label));
    button.onclick=()=>select(tab.id);
    nav.append(button);
  }
  nav.hidden=false;
}
/** Same silhouette and colors as the current starter plane in PaperRenderer. */
export function aircraftShowcase(){
  const view=node('div','aircraft-showcase');
  view.innerHTML=`<svg viewBox="0 0 300 225" class="showcase-art" role="img" aria-label="The Original paper airplane">
    <g fill="none" stroke="#718c7d" opacity=".34">
      <circle cx="150" cy="111" r="85" stroke-dasharray="3 7"/><circle cx="150" cy="111" r="65"/>
      <path d="M150 14v20m0 154v20M53 111h20m154 0h20M82 43l14 14m108 108 14 14"/>
    </g>
    <path d="M15 177Q55 146 84 171T142 175" fill="none" stroke="#9cad9d" stroke-width="1.5" stroke-dasharray="4 6"/>
    <g fill="#e1e7d6" stroke="#bccbbb"><path d="M0 191q20-25 43-9 20-23 45 9z"/><path d="M219 45q19-22 39-9 24-19 42 9z"/></g>
    <ellipse class="plane-shadow" cx="153" cy="174" rx="50" ry="12" fill="#65725d" opacity=".16"/>
    <g class="plane-idle">
      <g transform="translate(150 110) scale(3.35)">
        <path d="M0-24 -17 18 0 9 17 18Z" fill="#776d52" opacity=".17" transform="translate(1.7 2.7)"/>
        <path d="M0-24 -17 18 0 9Z" fill="#fffdf4" stroke="#9f9e90" stroke-width=".35"/>
        <path d="M0-24 17 18 0 9Z" fill="#a9bfc4" stroke="#839d9e" stroke-width=".35"/>
        <path d="M0-24 -4 10 0 15Z" fill="#d7e2df" stroke="#a2aaa0" stroke-width=".28"/>
        <path d="M-12 12-5-5M9 10 4-4" stroke="#a6b0a7" stroke-width=".28" stroke-dasharray=".9 .9" fill="none"/>
      </g>
    </g>
    <g fill="#718477" font-size="8" font-family="system-ui"><text x="12" y="16">FOLD 01</text><text x="248" y="216">1:1</text></g>
  </svg>`;
  return view;
}
export function renderMainMenu(panel:HTMLElement,unlocked:number,warning:string,actions:{fly:()=>void;help:()=>void}){
  panel.replaceChildren();
  panel.className='paper home-page with-tabs';
  panel.hidden=false;
  const title=node('div','home-title');
  title.append(node('p','eyebrow','THE PAPER FLIGHT CLUB'),node('h1','home-logo','SEKAFOLD'),node('p','home-tagline','Fold. Fly. Fight again.'));
  const showcase=aircraftShowcase();
  const identity=node('div','aircraft-identity');
  identity.append(node('span','equipped-label','EQUIPPED AIRCRAFT'),node('h2','aircraft-name','The Original'),node('p','aircraft-detail','Notebook paper · Paper darts'));
  const launch=node('button','take-flight','Take flight  ›');launch.onclick=actions.fly;
  const info=node('p','home-stage','The Notebook · Stage '+unlocked+' unlocked');
  const help=node('button','home-help','How to play');help.onclick=actions.help;
  panel.append(title,showcase,identity,launch,info,help);
  if(warning)panel.append(node('p','notice',warning));
}
