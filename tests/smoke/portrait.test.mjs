import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, sep, extname} from 'node:path';
import {chromium} from 'playwright-core';

const root=resolve('dist');
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
          await page.goto(url);
          await page.getByRole('button',{name:'Fly',exact:true}).waitFor();
          await page.locator('.plane-idle').waitFor({state:'visible'});
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
          await page.getByRole('button',{name:/Workshop/}).click();
          await page.getByRole('heading',{name:'Workshop'}).waitFor();
          await checkLayout();
          await page.getByRole('button',{name:'Hangar',exact:true}).click();
          await page.getByRole('heading',{name:'Hangar'}).waitFor();
          await checkLayout();
          await page.getByRole('button',{name:'Home',exact:true}).click();
          await page.getByRole('button',{name:'Fly',exact:true}).click();
          await page.getByRole('button',{name:/First Flight/}).click();
          await page.locator('#hud').waitFor({state:'visible'});
          assert.equal(await page.locator('#menu-tabs').isVisible(),false);
          await checkLayout();
          if(size.mobile)await page.locator('#move').waitFor({state:'visible'});
          await page.getByRole('button',{name:'Pause',exact:true}).click();
          await page.getByRole('heading',{name:'Flight paused'}).waitFor();
          await checkLayout();
          await page.getByRole('button',{name:'End flight'}).click();
          await page.getByRole('heading',{name:'Flight ended'}).waitFor();
          await checkLayout();
          if(size.name==='large desktop'){
            await page.getByRole('button',{name:'Retry'}).click();
            // The unpiloted craft eventually takes fatal hits from the real enemy wave.
            await page.clock.install();
            for(let i=0;i<12&&!(await page.locator('#death-label').isVisible());i++){
              await page.clock.runFor(2500);
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
              assert.ok(await page.getByRole('heading',{name:'Plane crumpled!'}).isVisible(),'real combat defeat reached');
            }
            await checkLayout();
          }
          assert.deepEqual(errors,[]);
          console.log(size.name+': portrait frame fits; menu, campaign, battle, pause and report checked');
        }finally{await context.close()}
      });
    }
  }finally{
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
});
