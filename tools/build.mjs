import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

// Clean compiled modules before building so deleted code cannot leak into a release.
await rm('dist',{recursive:true,force:true});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc'],{stdio:'inherit'});
const {version}=JSON.parse(await readFile('package.json','utf8'));
if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error('Invalid release version');
const html=await readFile('index.html','utf8');
const css=await readFile('style.css');
const hash=createHash('sha256');
hash.update(version+'\0'+html+'\0');
hash.update(css);
async function hashTree(dir,relative=''){
  for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
    const path=join(dir,entry.name), name=relative+entry.name;
    if(entry.isDirectory())await hashTree(path,name+'/');
    else if(entry.isFile()){
      const data=await readFile(path);
      hash.update('\0'+name+'\0'+data.length+'\0');
      hash.update(data);
    }
  }
}
await hashTree('dist/src');
const release='releases/v'+version+'-'+hash.digest('hex').slice(0,16);
const site='dist/site';
await mkdir(join(site,release),{recursive:true});
// Unit tests use dist/src; only site/ is deployed. Every runtime import is
// relative to the versioned entry point, so nested modules cannot mix releases.
await cp('dist/src',join(site,release,'src'),{recursive:true});
await writeFile(join(site,release,'style.css'),css);
const output=html.replaceAll('__RELEASE__',release).replaceAll('__VERSION__',version);
if(output.includes('__RELEASE__')||output.includes('__VERSION__'))throw new Error('Unresolved release template');
await writeFile(join(site,'index.html'),output);
console.log('Built site: '+release);
