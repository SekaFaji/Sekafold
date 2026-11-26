import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, sep, extname, join} from 'node:path';
import {chromium} from 'playwright-core';

const root=resolve('dist/site');
const version=JSON.parse(await readFile('package.json','utf8')).version;
const builtHtml=await readFile(join(root,'index.html'),'utf8');
const release=builtHtml.match(/src="\.\/(releases\/v[^/]+)\/src\/app\/main\.js"/)?.[1];
assert.ok(release?.startsWith('releases/v'+version+'-'));
assert.ok(builtHtml.includes('href="./'+release+'/style.css"'));
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript'};
const sizes=[
  {name:'large desktop',width:1920,height:1080},
  {name:'laptop',width:1366,height:768},
  {name:'short desktop',width:1280,height:600},
  {name:'portrait phone',width:390,height:844,mobile:true},
  {name:'small phone',width:320,height:568,mobile:true}
];

test('actual Chromium portrait layout, menu navigation and combat',async t=>{
  const server=createServer(async(req,res)=>{
    const pathname=new URL(req.url,'http://localhost').pathname;
    // Simulate cached files from the old unversioned deployment.
    const legacy={
      '/legacy-cache':'<script type="module" src="/src/app/main.js"></script><link rel="stylesheet" href="/style.css?v=0.0.10">',
      '/src/app/main.js':'import "/src/ui/main-menu.js"; window.legacyMain=true;',
      '/src/ui/main-menu.js':'window.legacyMenu=true;',
      '/style.css':'body{color:red}'
    };
    if(Object.hasOwn(legacy,pathname)){
      const type=pathname==='/legacy-cache'?'text/html':types[extname(pathname)];
      res.writeHead(200,{'Content-Type':type,'Cache-Control':'public,max-age=86400,immutable'}).end(legacy[pathname]);return;
    }
    const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!path.startsWith(root+sep)){res.writeHead(403).end();return}
    try{
      const data=await readFile(path);
      res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream'}).end(data);
    }catch{res.writeHead(404).end()}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try{
    browser=await chromium.launch({channel:'chrome',headless:true});
    const url='http://127.0.0.1:'+server.address().port;
    for(const size of sizes){
      await t.test(size.name,async()=>{
        const context=await browser.newContext({viewport:{width:size.width,height:size.height},isMobile:!!size.mobile,hasTouch:!!size.mobile});
        const page=await context.newPage();
        const errors=[];page.on('pageerror',err=>errors.push(err.message));
        try{
          if(size.name==='large desktop'){
            await page.goto(url+'/legacy-cache');
            await page.waitForFunction(()=>window.legacyMain&&window.legacyMenu);
            await page.evaluate(()=>localStorage.setItem('sekafold.profile.v1',JSON.stringify({schemaVersion:1,scraps:280,unlocked:3,upgrades:{damage:0,durability:0,reinforcement:0,rate:0},nextRun:1,settledRun:0})));
          }
          const requests=[];
          page.on('request',req=>{if(['script','stylesheet'].includes(req.resourceType()))requests.push(new URL(req.url()).pathname)});
          await page.goto(url);
          await page.getByRole('button',{name:'Fly',exact:true}).waitFor();
          await page.locator('.plane-idle').waitFor({state:'visible'});
          assert.ok(requests.length>5,JSON.stringify(requests));
          assert.ok(requests.every(path=>path.startsWith('/'+release+'/')),JSON.stringify(requests));
          assert.ok(requests.includes('/'+release+'/src/ui/main-menu.js'));
          assert.equal(await page.locator('.menu-card').count(),0);
          assert.equal(await page.locator('#menu-tabs button').count(),4);
          if(size.name==='large desktop'){
            assert.equal(await page.locator('#wallet').textContent(),'280 scraps');
            assert.ok((await page.locator('.home-stage').textContent()).includes('03'));
          }
          async function checkLayout(){
            const m=await page.evaluate(()=>{
              const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
              return {shell:rect('shell'),arena:rect('arena'),canvas:rect('field'),vw:innerWidth,vh:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight};
            });
            assert.ok(m.shell.w<=360.1,JSON.stringify(m));
            assert.ok(m.shell.x>=0&&m.shell.y>=0&&m.shell.right<=m.vw+.1&&m.shell.bottom<=m.vh+.1,JSON.stringify(m));
            assert.ok(Math.abs(m.arena.w/m.arena.h-9/16)<.002,JSON.stringify(m));
            assert.ok(Math.abs(m.canvas.w-m.arena.w)<.1&&Math.abs(m.canvas.h-m.arena.h)<.1,JSON.stringify(m));
            assert.ok(m.scrollWidth<=m.vw&&m.scrollHeight<=m.vh,JSON.stringify(m));
          }
          await checkLayout();
          async function checkHome(){
            const m=await page.evaluate(()=>{
              const panel=document.getElementById('panel'), nav=document.getElementById('menu-tabs');
              const p=panel.getBoundingClientRect(), n=nav.getBoundingClientRect();
              const boxes=['.home-title','.aircraft-showcase','.aircraft-identity','.take-flight','.home-help'].map(selector=>{
                const el=panel.querySelector(selector),r=el.getBoundingClientRect();
                const target=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
                return {selector,top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height,hit:el===target||el.contains(target)};
              });
              return {top:p.top,bottom:p.bottom,left:p.left,right:p.right,navTop:n.top,navBottom:n.bottom,scroll:panel.scrollHeight-panel.clientHeight,boxes};
            });
            assert.ok(m.scroll<=1,JSON.stringify(m));
            assert.ok(m.bottom<=m.navTop+.1,JSON.stringify(m));
            for(const b of m.boxes)assert.ok(b.top>=m.top-.1&&b.bottom<=m.bottom+.1&&b.left>=m.left-.1&&b.right<=m.right+.1&&b.height>0,JSON.stringify(m));
            assert.ok(m.boxes.find(b=>b.selector==='.aircraft-showcase').height>=70,JSON.stringify(m));
            assert.ok(m.boxes.find(b=>b.selector==='.take-flight').hit,JSON.stringify(m));
            assert.ok(m.boxes.find(b=>b.selector==='.home-help').hit,JSON.stringify(m));
          }
          await checkHome();
          await page.getByRole('button',{name:'How to play'}).click();
          await page.getByRole('heading',{name:'Flight school'}).waitFor();
          await page.getByRole('button',{name:'Home',exact:true}).click();
          await checkHome();
          await page.getByRole('button',{name:/Workshop/}).click();
          await page.getByRole('heading',{name:'Workshop'}).waitFor();
          await checkLayout();
          assert.equal(await page.locator('.bench-card').count(),7);
          const damage=page.locator('[data-upgrade="damage"]');
          assert.match(await damage.locator('.bench-change').textContent(),/1 → 1\.25/);
          if(size.name==='large desktop'){
            await damage.getByRole('button').click();
            assert.equal(await page.locator('#wallet').textContent(),'260 scraps');
            assert.equal(await damage.locator('.bench-level').textContent(),'Lv. 1');
            assert.match(await damage.locator('.bench-change').textContent(),/1\.25 → 1\.5/);
            const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('sekafold.profile.v1')));
            assert.equal(stored.schemaVersion,2);assert.equal(stored.upgrades.damage,1);assert.equal(stored.scraps,260);assert.equal(stored.upgrades.speed,0);
          }else assert.equal(await damage.getByRole('button').isDisabled(),true);
          for(const card of await page.locator('.bench-card').all()){
            await card.locator('button').scrollIntoViewIfNeeded();
            const r=await card.locator('button').boundingBox(), nav=await page.locator('#menu-tabs').boundingBox();
            assert.ok(r.y+r.height<=nav.y+1&&r.width>0);
          }
          assert.equal(await page.locator('#menu-tabs [aria-current="page"]').textContent(),'Workshop');
          await page.getByRole('button',{name:'Hangar',exact:true}).click();
          await page.getByRole('heading',{name:'Hangar'}).waitFor();
          assert.equal(await page.locator('.bench-card').count(),7);
          if(size.name==='large desktop'){
            assert.equal(await page.locator('[data-upgrade="damage"] .bench-level').textContent(),'Lv. 1');
            await page.locator('[data-upgrade="speed"] button').click();
            assert.equal(await page.locator('[data-upgrade="speed"] .bench-level').textContent(),'Lv. 1');
            assert.equal(await page.locator('#wallet').textContent(),'240 scraps');
          }
          assert.equal(await page.locator('#menu-tabs [aria-current="page"]').textContent(),'Hangar');
          await checkLayout();
          await page.getByRole('button',{name:'Home',exact:true}).click();
          await checkHome();
          await page.getByRole('button',{name:'Fly',exact:true}).click();
          assert.equal(await page.locator('.mission-ticket').count(),3);
          assert.equal(await page.locator('.mission-ticket.current').count(),1);
          assert.equal(await page.locator('.mission-ticket.locked').count(),size.name==='large desktop'?0:2);
          assert.match(await page.locator('[data-stage="1"] .mission-reward').textContent(),/48 scraps/);
          assert.equal(await page.locator('.endless-ticket').isDisabled(),true);
          await page.locator('.endless-ticket').scrollIntoViewIfNeeded();
          const endless=await page.locator('.endless-ticket').boundingBox(),nav=await page.locator('#menu-tabs').boundingBox();
          assert.ok(endless.y+endless.height<=nav.y+1);
          await page.getByRole('button',{name:/First Flight/}).click();
          await page.locator('#hud').waitFor({state:'visible'});
          assert.match(await page.locator('#tape-value').textContent(),/^Tape 0 \/ /);
          assert.equal(await page.locator('#menu-tabs').isVisible(),false);
          await checkLayout();
          if(size.mobile)await page.locator('#move').waitFor({state:'visible'});
          await page.getByRole('button',{name:'Pause',exact:true}).click();
          await page.getByRole('heading',{name:'Flight paused'}).waitFor();
          await checkLayout();
          await page.getByRole('button',{name:'End flight'}).click();
          await page.getByRole('heading',{name:'Flight ended'}).waitFor();
          await checkLayout();
          await page.getByRole('button',{name:'Main menu'}).click();
          await checkHome();
          await page.getByRole('button',{name:'TAKE FLIGHT',exact:true}).click();
          await page.locator('#hud').waitFor({state:'visible'});
          if(size.name==='large desktop'){
            // The unpiloted craft eventually takes fatal hits from the real enemy wave.
            await page.clock.install();
            for(let i=0;i<80&&!(await page.locator('#death-label').isVisible());i++){
              await page.clock.runFor(500);
              if(await page.getByRole('heading',{name:'Plane crumpled!'}).isVisible())break;
            }
            if(await page.locator('#death-label').isVisible()){
              assert.equal(await page.locator('#panel').isVisible(),false);
              assert.equal(await page.locator('#pause').isVisible(),false);
              const before=await page.locator('#wallet').textContent();
              await page.clock.runFor(1100);
              await page.getByRole('heading',{name:'Plane crumpled!'}).waitFor();
              assert.equal(await page.locator('#wallet').textContent(),before);
            }else{
              assert.fail('Expected to observe the crumple animation before the report');
            }
            await checkLayout();
          }
          assert.deepEqual(errors,[]);
          console.log(size.name+': portrait frame and all home controls fit; menu, campaign, direct launch, battle, pause and report checked');
        }finally{await context.close()}
      });
    }
  }finally{
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
});
