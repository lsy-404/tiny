import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const base=process.env.RELEASE_URL||'https://tiny.leisiyu.dev/';
const root=fileURLToPath(new URL('../../dist/',import.meta.url));
const existing=[
  'index.html','app.js','styles.css','portal-logo.svg','projects.json',
  'games/cassandri-legend/index.html','games/cassandri-legend/game.js','games/cassandri-legend/styles.css','games/cassandri-legend/favicon.svg','games/cassandri-legend/assets/cover.png','games/cassandri-legend/fonts/fusion-pixel-12px-proportional-zh_hans.otf.woff2',
  'games/ten-light-years/index.html','games/ten-light-years/main.js','games/ten-light-years/icon.svg','games/ten-light-years/assets/preview.png','games/ten-light-years/vendor/three.module.js',
  ...['sizes.json','tracks.json','stars.bin','edges.bin','edge_weights.bin'].map(file=>`games/ten-light-years/data/${file}`),
];
const tool='projects/vocal-score/';
const html=await readFile(path.join(root,tool,'index.html'),'utf8');
const toolAssets=[...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)].map(match=>tool+match[1]);
const workers=(await readdir(path.join(root,tool,'assets'))).filter(file=>/^pdf\.worker[.-]/.test(file)).map(file=>`${tool}assets/${file}`);
assert.equal(workers.length,2,'Both local PDF generation and PDF.js workers must be bundled.');
const cassie='projects/cassie/';
const cassieHtml=await readFile(path.join(root,cassie,'index.html'),'utf8');
const cassieAssets=[...cassieHtml.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map(match=>match[1])
  .filter(asset=>asset.startsWith('./')||asset.startsWith('/projects/cassie/'))
  .map(asset=>cassie+asset.replace(/^\.\//,'').replace(/^\/projects\/cassie\//,''));
assert(cassieAssets.some(file=>/\.m?js$/.test(file)),'CASSIE must emit an app bundle under its subpath.');
assert(cassieAssets.some(file=>/\.css$/.test(file)),'CASSIE must emit its stylesheet under its subpath.');
assert(cassieAssets.some(file=>/-[A-Za-z0-9_-]{8}\./.test(file)),'CASSIE must emit an asset using Vite’s eight-character content hash.');
const cassieRequired=[
  'bank.json','phonemes.json','audio/cassie.opus','ffmpeg/manifest.json','licenses.html',
].map(file=>cassie+file);
const cassieAssetRoot=path.join(root,cassie,'assets');
const cassieAssetEntries=await readdir(cassieAssetRoot,{recursive:true,withFileTypes:true});
const cassieWorkerAssets=cassieAssetEntries
  .filter(entry=>entry.isFile()&&/\.(?:m?js|wasm)$/i.test(entry.name))
  .map(entry=>cassie+'assets/'+path.relative(cassieAssetRoot,entry.parentPath).split(path.sep).filter(Boolean).join('/')+(entry.parentPath===cassieAssetRoot?'':'/')+entry.name);
assert(cassieWorkerAssets.some(file=>/worker/i.test(file)&&/\.m?js$/i.test(file)),'CASSIE must emit its JavaScript workers.');
assert(cassieWorkerAssets.some(file=>/\.wasm$/i.test(file)),'CASSIE must emit its WebAssembly worker runtime.');
const files=[...new Set([...existing,tool+'index.html',...toolAssets,...workers,cassie+'index.html',...cassieAssets,...cassieRequired,...cassieWorkerAssets])];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
let normalizedEdgeHtml=0;
for(let offset=0;offset<files.length;offset+=4){
  await Promise.all(files.slice(offset,offset+4).map(async file=>{
    const response=await fetch(new URL(file,base));assert.equal(response.status,200,file);
    const mime=response.headers.get('content-type')||'';
    if(/\.html$/i.test(file))assert.match(mime,/text\/html/,`${file} MIME`);
    if(/\.m?js$/i.test(file))assert.match(mime,/javascript/,`${file} MIME`);
    if(/\.wasm$/i.test(file))assert.match(mime,/application\/wasm/,`${file} MIME`);
    if(/\.json$/i.test(file))assert.match(mime,/application\/json/,`${file} MIME`);
    if(/\.opus$/i.test(file))assert.match(mime,/audio\//,`${file} MIME`);
    if(/\.css$/i.test(file))assert.match(mime,/text\/css/,`${file} MIME`);
    let actual=Buffer.from(await response.arrayBuffer()),expected=await readFile(path.join(root,file));
    if(file.endsWith('.html')){
      const html=actual.toString('utf8');
      const stripped=html.replace(/<script\b[^>]*\bsrc="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:\/[^"<>]*)?"[^>]*><\/script>/g,'');
      if(stripped!==html){actual=Buffer.from(stripped.replace(/>\s+</g,'><'));expected=Buffer.from(expected.toString('utf8').replace(/>\s+</g,'><'));normalizedEdgeHtml++;}
    }
    assert.equal(digest(actual),digest(expected),`${file} differs from verified build`);
  }));
}
for(const route of ['games/cassandri-legend','games/ten-light-years','projects/vocal-score','projects/cassie']){
  const response=await fetch(new URL(route,base),{redirect:'manual'});assert.equal(response.status,307,route);assert(new URL(response.headers.get('location'),base).pathname.endsWith(route+'/'));
}
for(const name of ['star-wish','star-lalala']){
  const response=await fetch(new URL(`games/ten-light-years/audio/${name}.m4a`,base),{method:'HEAD'});assert.equal(response.status,200);assert.match(response.headers.get('content-type')||'',/audio/);
}
const catalog=await(await fetch(new URL('projects.json',base))).json();
assert.equal(catalog.length,4);assert(catalog.some(project=>project.path===tool.slice(0,-1)&&project.kind==='tool'));
assert(catalog.some(project=>project.slug==='cassie'&&project.path===cassie.slice(0,-1)&&project.kind==='tool'));
console.log(JSON.stringify({status:'passed',verifiedFileHashes:files.length,normalizedEdgeHtml,canonicalRoutes:4,audioHeadChecks:2,projects:catalog.length}));
