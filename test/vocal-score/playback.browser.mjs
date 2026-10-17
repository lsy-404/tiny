import assert from 'node:assert/strict';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4190/projects/vocal-score/';
const q=705600000;
// Three bars of quarters at 120 bpm: six seconds of score.
const notes=Array.from({length:12},(_,index)=>({onset:q*index,duration:q,pitch:[60,62,64,65,67,69][index%6],lyrics:['do','re','mi','fa','so','la'][index%6]}));
const project={version:153,projectName:'Playback',time:{tempo:[{position:0,bpm:120}],meter:[{index:0,numerator:4,denominator:4}]},tracks:[{name:'Lead',mainGroup:{uuid:'lead',notes},groups:[]}]};
// Seven seconds of a quiet tone, as a synthesizer's exported audio would be.
function wav(seconds,rate=8000){
  const samples=Math.round(seconds*rate),data=Buffer.alloc(44+samples*2);
  data.write('RIFF',0);data.writeUInt32LE(36+samples*2,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(1,22);data.writeUInt32LE(rate,24);data.writeUInt32LE(rate*2,28);data.writeUInt16LE(2,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(samples*2,40);
  for(let i=0;i<samples;i++)data.writeInt16LE(Math.round(Math.sin(i/rate*2*Math.PI*220)*3000),44+i*2);
  return data;
}
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
  const context=await browser.newContext({locale:'zh-CN',viewport:{width:1440,height:900},acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);await page.waitForFunction(()=>!document.querySelector('#file-input')?.disabled);
  await page.locator('#file-input').setInputFiles({name:'playback.svp',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
  await page.locator('.score-viewer__sheet[data-rendered=true]').first().waitFor({timeout:60000});
  const time=()=>page.locator('#playback-time').textContent();
  const playhead=()=>page.locator('.playhead').evaluate(node=>({left:parseFloat(node.style.left),top:parseFloat(node.style.top),height:parseFloat(node.style.height)}));
  assert.equal(await page.locator('#playback-duration').textContent(),'0:06','three bars of 4/4 at 120 bpm');
  assert.equal(await page.locator('#score .playback-mark').count(),3,'one playback mark per bar on the staff');
  assert.equal(await page.locator('.playhead').count(),0,'no playhead before playback is used');
  assert.equal(await page.locator('#audio-open').textContent(),'打开音频（推荐）','opening the exported audio is recommended');
  assert.equal(await page.locator('#piano-toggle').getAttribute('aria-pressed'),'true','the piano plays by default');

  await page.locator('#play-button').click();
  await page.waitForFunction(()=>document.querySelector('#play-button')?.getAttribute('aria-label')==='暂停');
  await page.waitForTimeout(700);
  const early=await playhead();
  await page.waitForTimeout(900);
  const later=await playhead();
  assert.ok(later.left>early.left,`the playhead moves along the bar (${early.left} → ${later.left})`);
  assert.ok(early.height>2,'the playhead spans the staff');
  await page.locator('#play-button').click();
  await page.waitForFunction(()=>document.querySelector('#play-button')?.getAttribute('aria-label')==='播放');
  const paused=await time(),pausedAt=await playhead();
  await page.waitForTimeout(400);
  assert.equal(await time(),paused,'pausing holds the time');
  assert.deepEqual(await playhead(),pausedAt,'and the playhead');

  // A click on the third bar moves the playhead there.
  const bar=await page.locator('.score-viewer__sheet .playback-mark').nth(2).boundingBox();
  await page.mouse.click(bar.x+bar.width*0.5,bar.y+bar.height*0.5);
  await page.waitForTimeout(100);
  assert.match(await time(),/^0:0[45]$/,'the third bar starts at four seconds');
  assert.ok(Math.abs((await playhead()).left-(await page.locator('.score-viewer__page').first().evaluate((page,box)=>{const bounds=page.getBoundingClientRect();return (box.x+box.width*0.5-bounds.left)/bounds.width*100;},bar)))<3,'the playhead stands where the score was clicked');

  // Space plays and pauses when no field has focus.
  await page.locator('#document-title').click();
  await page.keyboard.press('Space');
  await page.waitForFunction(()=>document.querySelector('#play-button')?.getAttribute('aria-label')==='暂停');
  await page.keyboard.press('Space');
  await page.waitForFunction(()=>document.querySelector('#play-button')?.getAttribute('aria-label')==='播放');

  // Playback runs to the end and comes back to the start.
  await page.locator('#rewind-button').click();
  assert.equal(await time(),'0:00');
  await page.locator('#playback-seek').evaluate(node=>{node.value='5.5';node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));});
  assert.equal(await time(),'0:05');
  await page.locator('#play-button').click();
  await page.waitForFunction(()=>document.querySelector('#play-button')?.getAttribute('aria-label')==='播放'&&document.querySelector('#playback-time')?.textContent==='0:00',null,{timeout:5000});

  // Numbered notation carries the same marks.
  await page.locator('#jianpu-view').click();
  await page.waitForFunction(()=>document.querySelector('#score .jianpu-page')&&document.querySelectorAll('#score .playback-mark').length===3,null,{timeout:30000});
  await page.locator('#playback-seek').evaluate(node=>{node.value='2';node.dispatchEvent(new Event('change',{bubbles:true}));});
  const numbered=await playhead();
  const second=await page.locator('.score-viewer__sheet .playback-mark').nth(1).boundingBox(),pageBox=await page.locator('.score-viewer__page').first().boundingBox();
  assert.ok(numbered.left>=(second.x-pageBox.x)/pageBox.width*100-0.5&&numbered.left<=(second.x+second.width-pageBox.x)/pageBox.width*100,'at two seconds the numbered playhead is in the second bar');

  // The exported audio plays along; it is kept for the document, with its offset.
  await page.locator('.playback-bar__file').setInputFiles({name:'render.wav',mimeType:'audio/wav',buffer:wav(7)});
  await page.locator('#audio-name').waitFor();
  assert.equal(await page.locator('#audio-name').textContent(),'render.wav');
  assert.equal(await page.locator('#piano-toggle').getAttribute('aria-pressed'),'false','the recording replaces the piano');
  await page.waitForFunction(()=>document.querySelector('#playback-duration')?.textContent==='0:07',null,{timeout:10000});
  await page.locator('#audio-offset').fill('1');await page.locator('#audio-offset').press('Enter');
  await page.waitForFunction(()=>document.querySelector('#playback-duration')?.textContent==='0:08');
  await page.locator('#play-button').click();
  await page.waitForFunction(()=>document.querySelector('#play-button')?.getAttribute('aria-label')==='暂停');
  await page.waitForTimeout(500);
  await page.locator('#play-button').click();
  await page.waitForFunction(()=>document.querySelector('#storage-status')?.textContent?.includes('已保存在此浏览器'),null,{timeout:15000});
  await page.reload();
  await page.locator('#audio-name').waitFor({timeout:60000});
  assert.equal(await page.locator('#audio-name').textContent(),'render.wav','the audio is kept in this browser');
  assert.equal(await page.locator('#audio-offset').inputValue(),'1','with its offset');
  assert.equal(await page.locator('#piano-toggle').getAttribute('aria-pressed'),'false');
  await page.locator('#piano-toggle').click();
  assert.equal(await page.locator('#piano-toggle').getAttribute('aria-pressed'),'true','the piano can join the recording');
  await page.locator('#play-button').click();
  await page.waitForFunction(()=>document.querySelector('#play-button')?.getAttribute('aria-label')==='暂停',null,{timeout:10000});
  await page.locator('#play-button').click();

  // The exported SVG has no playback marks.
  await page.locator('.score-viewer__sheet[data-rendered=true]').first().waitFor({timeout:60000});
  const download=page.waitForEvent('download');await page.locator('#svg-button').click();
  const svg=await (await download).createReadStream().then(stream=>new Promise(resolve=>{let text='';stream.on('data',chunk=>{text+=chunk;});stream.on('end',()=>resolve(text));}));
  assert.ok(svg.includes('<svg')&&!svg.includes('playback-mark'),'exports leave the marks out');

  await page.locator('#audio-remove').click();
  await page.locator('#audio-open').waitFor();
  await page.reload();
  await page.locator('#audio-open').waitFor({timeout:60000});
  assert.equal(await page.locator('#audio-name').count(),0,'removed audio stays removed');

  // A phone keeps the transport on the screen.
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
  const bar390=await page.locator('.playback-bar').boundingBox();
  assert.ok(bar390.x>=0&&bar390.x+bar390.width<=391&&bar390.y+bar390.height<=845,'the transport fits a phone screen');
  assert.deepEqual(errors,[]);
  console.log('PASS: piano playback with a moving playhead, pause, click to seek, space key, end of score, numbered notation, play-along audio kept with its offset, exports without marks, and the phone layout.');
}finally{await browser.close();}
