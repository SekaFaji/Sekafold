/** Original, layered paper cover illustration. No external artwork or fonts. */
const cover = `<svg class="cover-art" viewBox="0 0 340 156" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="wing-light" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffdf3"/><stop offset="1" stop-color="#e6decb"/></linearGradient>
    <linearGradient id="wing-dark" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9e7e2"/><stop offset="1" stop-color="#88a8a2"/></linearGradient>
    <pattern id="cover-lines" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 19.5H20" stroke="#7ea2a0" opacity=".18"/></pattern>
  </defs>
  <path d="M0 83 Q32 61 67 83T130 80T200 85T270 75T340 83V156H0Z" fill="#b9d1c5" opacity=".8"/>
  <path d="M0 113 Q33 92 70 114T150 112T237 105T340 112V156H0Z" fill="#e9e9d5"/>
  <path d="M0 128 Q30 115 79 135T167 131T255 128T340 132V156H0Z" fill="#f6f0df"/>
  <path d="M0 132 Q30 119 79 139T167 135T255 132T340 136V156H0Z" fill="url(#cover-lines)"/>
  <g fill="#f9f5e8" stroke="#a9beb1" stroke-width=".8">
    <path d="M13 44q13-19 27-9 12-24 34-7 13-7 27 16z"/>
    <path d="M251 35q12-19 25-8 13-22 32-6 15-2 22 14z"/>
  </g>
  <path d="M43 125 Q16 104 44 87T112 89 Q142 94 156 78" fill="none" stroke="#6b8f82" stroke-width="1.5" stroke-dasharray="4 5" stroke-linecap="round"/>
  <g transform="translate(168 75) rotate(21)">
    <path d="M-89 53L3-57 95 43 12 27-8 45-12 29Z" fill="#536e5e" opacity=".18" transform="translate(6 7)"/>
    <path d="M-89 53L3-57-12 29Z" fill="url(#wing-light)" stroke="#9d9a85" stroke-width="1.1"/>
    <path d="M3-57L95 43 12 27Z" fill="url(#wing-dark)" stroke="#7f9b93" stroke-width="1.1"/>
    <path d="M3-57L-12 29-8 45 12 27Z" fill="#d1d9cb" stroke="#a2a795" stroke-width="1"/>
    <path d="M3-57L-8 45" stroke="#879d92" stroke-width="1"/>
    <path d="M-72 38L-34 25M49 18L76 32" stroke="#b2b9a5" stroke-width="1" stroke-dasharray="3 3"/>
    <path d="M-52 15l11-12 6 6-10 12z" fill="#b9614b" opacity=".9"/>
  </g>
  <g transform="translate(286 103) rotate(-17)"><path d="M0-12L-14 14 0 8 14 14Z" fill="#ca806c" stroke="#a66b5b"/><path d="M0-12L0 8 14 14Z" fill="#a65e50"/></g>
  <g transform="translate(71 25) rotate(48)"><path d="M0-9L-10 10 0 5 10 10Z" fill="#eee7d6" stroke="#9cac9f"/><path d="M0-9V5L10 10Z" fill="#b3c8bd"/></g>
  <g transform="translate(20 128)"><rect width="47" height="19" rx="3" fill="#f5ecda" stroke="#bcb193" transform="rotate(-5)"/><text x="23" y="12" font-size="8" text-anchor="middle" fill="#6a6d58" font-family="system-ui" font-weight="700" transform="rotate(-5)">FOLD 01</text></g>
</svg>`;
const icons = {
  campaign:'<path d="M3 11 22 3l-6 19-4-7-9-4Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m12 15 10-12" stroke="currentColor" stroke-width="1.7"/>',
  workshop:'<path d="M5 5h14v14H5zM8 5V3m8 2V3M5 8H3m2 8H3m16-8h2m-2 8h2M8 19v2m8-2v2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8 12 3 3 5-6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  endless:'<path d="M12 12c-3-5-7-6-9-2s2 8 6 5l3-3 3-3c4-3 8 1 6 5s-6 3-9-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
};
interface MenuActions {campaign:()=>void;workshop:()=>void;help:()=>void}
function node<K extends keyof HTMLElementTagNameMap>(tag:K, className:string, content='') {
  const element=document.createElement(tag); element.className=className; element.textContent=content; return element;
}
function card(title:string, detail:string, icon:keyof typeof icons, action:(()=>void)|null, primary=false) {
  const b=node('button','menu-card'+(primary?' primary':''));
  b.type='button';
  const picture=node('span','menu-icon');
  picture.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[icon]+'</svg>';
  const copy=node('span','menu-copy');
  copy.append(node('span','menu-title',title),node('span','menu-detail',detail));
  b.append(picture,copy,node('span','menu-arrow',action?'›':'·'));
  if(action)b.onclick=action;else b.disabled=true;
  return b;
}
export function renderMainMenu(panel:HTMLElement, unlocked:number, scraps:number, warning:string, actions:MenuActions) {
  panel.replaceChildren();
  panel.className='paper menu';
  panel.hidden=false;
  const hero=node('div','menu-hero');
  hero.append(node('div','eyebrow','THE PAPER FLIGHT CLUB'),node('h1','menu-title','Sekafold'),node('p','tagline','Fold. Fly. Fight again.'));
  const art=node('div','cover');art.innerHTML=cover;hero.append(art);
  const nav=node('div','menu-nav');
  nav.append(node('div','menu-label','FLIGHT LOG'),
    card('Campaign','The Notebook · Stage '+unlocked,'campaign',actions.campaign,true),
    card('Workshop',scraps+' scraps · Permanent upgrades','workshop',actions.workshop),
    card('Endless Survival','Coming in a future patch','endless',null));
  const bottom=node('div','menu-bottom');
  const help=node('button','help-button','How to play');help.type='button';help.onclick=actions.help;
  bottom.append(help,node('p','menu-credit','An original paper adventure by SekaFaji Games'));
  if(warning)nav.append(node('p','notice',warning));
  panel.append(hero,nav,bottom);
}
