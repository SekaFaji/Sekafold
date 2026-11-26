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
/** Layered cut-paper stage using the starter aircraft's combat silhouette. */
export function aircraftShowcase(){
  const view=node('div','aircraft-showcase');
  view.innerHTML=`<svg viewBox="0 0 300 260" class="showcase-art" role="img" aria-label="The Original paper airplane">
    <defs>
      <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#b9d8d1"/><stop offset="1" stop-color="#eae8cf"/></linearGradient>
      <linearGradient id="wing" x2=".8" y2="1"><stop stop-color="#fffdf4"/><stop offset="1" stop-color="#e7dfca"/></linearGradient>
      <pattern id="paper-grain" width="13" height="13" patternUnits="userSpaceOnUse"><path d="M1 3h2m5 7h3m-6 2h1" stroke="#506c63" stroke-width=".45" opacity=".22"/></pattern>
    </defs>
    <rect x="4" y="4" width="292" height="252" rx="8" fill="url(#sky)"/>
    <rect x="4" y="4" width="292" height="252" rx="8" fill="url(#paper-grain)"/>
    <g fill="#d5ddbc" stroke="#a8bdad" stroke-width="1">
      <path d="M5 169 62 121 103 154 164 112 231 167 295 130V254H5Z"/>
      <path d="M5 188 63 156 112 185 183 150 239 174 295 153V254H5Z" fill="#9ebcaa"/>
    </g>
    <path d="M5 214 66 191 123 217 201 189 295 210V254H5Z" fill="#749b8a"/>
    <path d="M5 226 76 212 144 232 219 211 295 224V254H5Z" fill="#557d70"/>
    <g fill="#f3edda" stroke="#9bb5a7" stroke-width=".8">
      <path d="M14 54q11-19 27-9 12-19 32-9 16-1 24 18z" transform="translate(2 3)" fill="#86aa9c" opacity=".32"/>
      <path d="M14 54q11-19 27-9 12-19 32-9 16-1 24 18z"/>
      <path d="M218 84q12-20 27-9 11-18 25-8 12-1 19 17z"/>
      <path d="M14 128q8-11 20-6 8-11 23-5 8 0 12 11z"/>
    </g>
    <path d="M48 211Q14 166 53 143T129 130" fill="none" stroke="#f8f2de" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 7"/>
    <circle cx="150" cy="122" r="87" stroke="#f5f0d9" stroke-width="1.2" stroke-dasharray="3 8" fill="none" opacity=".65"/>
    <ellipse class="plane-shadow" cx="153" cy="203" rx="52" ry="11" fill="#315247" opacity=".23"/>
    <g class="plane-idle">
      <g transform="translate(150 121) scale(4.05)">
        <path d="M0-24 -17 18 0 9 17 18Z" fill="#284c42" opacity=".21" transform="translate(1.7 2.7)"/>
        <path d="M0-24 -17 18 0 9Z" fill="url(#wing)" stroke="#868c7c" stroke-width=".35"/>
        <path d="M0-24 17 18 0 9Z" fill="#a9bfc4" stroke="#6e9194" stroke-width=".35"/>
        <path d="M0-24 -4 10 0 15Z" fill="#d7e2df" stroke="#8c9f96" stroke-width=".28"/>
        <path d="M-12 12-5-5M9 10 4-4" stroke="#859a8e" stroke-width=".3" stroke-dasharray=".9 .9" fill="none"/>
      </g>
    </g>
    <g fill="#f6f0dc" font-size="9" font-family="system-ui" font-weight="800" letter-spacing="1.1"><text x="17" y="243">FOLD 01</text><text x="283" y="243" text-anchor="end">ORIGINAL</text></g>
  </svg>`;
  return view;
}
export function renderMainMenu(panel:HTMLElement,unlocked:number,warning:string,actions:{launch:()=>void;help:()=>void}){
  panel.replaceChildren();
  panel.className='paper home-page with-tabs'+(warning?' has-warning':'');
  panel.hidden=false;
  const title=node('div','home-title');
  const help=node('button','home-help','?');help.type='button';help.setAttribute('aria-label','How to play');help.onclick=actions.help;
  title.append(node('p','eyebrow','PAPER AIR COMBAT'),node('h1','home-logo','SEKAFOLD'),help);
  const identity=node('div','aircraft-identity');
  identity.append(node('span','equipped-label','01 / EQUIPPED'),node('h2','aircraft-name','The Original'),node('p','aircraft-detail','Notebook paper · Paper darts'));
  const launchArea=node('div','launch-area');
  const launch=node('button','take-flight','TAKE FLIGHT');launch.type='button';launch.onclick=actions.launch;
  launchArea.append(node('p','home-stage','CHAPTER 01  /  STAGE '+String(unlocked).padStart(2,'0')),launch);
  panel.append(title,aircraftShowcase(),identity,launchArea);
  if(warning)panel.append(node('p','notice',warning));
}
