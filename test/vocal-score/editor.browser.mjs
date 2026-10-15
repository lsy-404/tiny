import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {openSection} from './workspace.browser.mjs';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:4190/projects/vocal-score/';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const quarter=705600000;
const makeNotes=lyrics=>lyrics.map((text,index)=>({onset:index*quarter,duration:quarter,pitch:[60,62,64,65,67,69][index],lyrics:text}));
const project={
  version:'1.0',projectName:'Lyric Editor Fixture',
  time:{tempo:[{position:0,bpm:120}],meter:[{index:0,numerator:4,denominator:4}]},
  tracks:[
    {name:'Lead',mainGroup:{uuid:'lead-voice',notes:makeNotes(['alpha','-','+','','beta','gamma'])},groups:[]},
    {name:'Backing',mainGroup:{uuid:'backing-voice',notes:makeNotes(['back-one','back-two']).map((note,index)=>({...note,pitch:48+index*2}))},groups:[]}
  ]
};

try {
  const context=await browser.newContext({locale:'zh-CN',viewport:{width:1440,height:1000},acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);
  await page.locator('#file-input').waitFor({state:'attached'});
  await page.waitForFunction(()=>document.querySelector('#file-input')&&!document.querySelector('#file-input').disabled,{timeout:30000});
  assert.equal(await page.locator('#demo-button').count(),0,'built-in demo control should be removed');
  await page.locator('#file-input').setInputFiles({name:'lyrics-fixture.svp',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project),'utf8')});
  const exportButton=page.locator('#export-button');
  await page.locator('#export-button:enabled').waitFor({timeout:30000});
  assert.equal(await page.locator('#message.error:visible').count(),0,'synthetic project should import without error');
  await page.locator('.sidebar-nav-item').filter({hasText:'歌词与声部文字'}).click();
  const panel=page.locator('#lyrics-panel');
  await openSection(page,'lyrics');
  if(!(await panel.evaluate(node=>node.open))) await panel.locator('summary').click();
  const editor=page.locator('.lyric-editor');
  await editor.waitFor({state:'visible'});
  const voices=editor.locator('[aria-label="选择声部"]');
  const lyricInputs=editor.locator('.lyric-editor__note input');
  const lyricInput=index=>editor.locator('.lyric-editor__note input').nth(index);
  const waitForExport=()=>page.locator('#export-button:enabled').waitFor({timeout:30000});
  const assertExportBlocked=async message=>assert.equal(await exportButton.isDisabled(),true,message);
  const exportXml=async()=>{
    await waitForExport();
    const downloadEvent=page.waitForEvent('download');
    await exportButton.click();
    const download=await downloadEvent;
    return readFile(await download.path(),'utf8');
  };

  assert.equal(await lyricInputs.count(),6,'lead voice should show all six fixture notes');
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['alpha','-','+','','beta','gamma']);
  await lyricInput(0).fill('updated');
  await assertExportBlocked('lyric edits should synchronously disable export until score refresh');
  await waitForExport();
  assert.match(await exportXml(page),/<text>updated<\/text>/,'MusicXML should include edited lyric');

  await editor.locator('[aria-label="清除第 1 个音符歌词"]').click();
  await assertExportBlocked('single-note clear should invalidate export immediately');
  assert.equal(await lyricInput(0).inputValue(),'');
  await waitForExport();
  await editor.locator('[aria-label="还原第 1 个音符歌词"]').click();
  await waitForExport();
  assert.equal(await lyricInput(0).inputValue(),'updated','single-note restore should recover the previous lyric');

  await editor.locator('.lyric-editor__tools button').nth(0).click();
  await assertExportBlocked('bulk clear should invalidate export immediately');
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['','','','','','']);
  await editor.locator('.lyric-editor__tools button').nth(1).click();
  await waitForExport();
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['updated','-','+','','beta','gamma'],'bulk restore should recover lyrics, extension markers, and empty slots');

  const trackName=editor.locator('[aria-label="声部名称"]');
  await trackName.fill('Lead <Renamed&>');
  await assertExportBlocked('track rename should synchronously invalidate export');
  await waitForExport();
  const renamedXml=await exportXml(page);
  assert.match(renamedXml,/<part-name>Lead &lt;Renamed&amp;&gt;<\/part-name>/,'MusicXML should escape the renamed part label');

  const paste=editor.locator('[aria-label="粘贴歌词文本"]');
  const mode=editor.locator('[aria-label="粘贴文本处理方式"]');
  const apply=editor.locator('.lyric-editor__batch-tools .fluent-button--primary');
  const undo=editor.locator('.lyric-editor__batch-tools button').nth(1);
  await paste.fill('too few');
  assert.equal(await apply.isDisabled(),true,'paste count mismatch must block replacement');
  assert.match(await editor.locator('.lyric-editor__counts').textContent(),/3.*2/,'preview should report required and pasted token counts');
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['updated','-','+','','beta','gamma'],'a mismatch must not partially replace lyrics');
  await paste.fill('paste-one paste-two paste-three');
  assert.equal(await apply.isDisabled(),false,'exact pinyin token count should enable replacement');
  await apply.click();
  await assertExportBlocked('batch replacement should invalidate export immediately');
  await waitForExport();
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['paste-one','-','+','','paste-two','paste-three'],'default alignment should preserve extension and empty slots');
  await undo.click();
  await waitForExport();
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['updated','-','+','','beta','gamma'],'batch undo should restore the complete prior voice snapshot');

  await mode.selectOption('hanzi');
  await paste.fill('中国，歌！');
  assert.equal(await apply.isDisabled(),false,'Hanzi punctuation should be removed before exact-count validation');
  assert.match(await editor.locator('.lyric-editor__preview').textContent(),/zhong.*guo.*ge/,'Hanzi preview should display contextual pinyin');
  await apply.click();
  await waitForExport();
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['zhong','-','+','','guo','ge']);
  await paste.fill('English text');
  assert.equal(await apply.isDisabled(),true,'English must be rejected in Hanzi mode');
  assert.match(await editor.locator('.lyric-editor__counts').textContent(),/不接受英文/);
  await mode.selectOption('pinyin');
  assert.equal(await apply.isDisabled(),true,'switching to literal pinyin must expose the count mismatch instead of transliterating English');
  assert.match(await editor.locator('.lyric-editor__preview').textContent(),/English/);
  await undo.click();
  await waitForExport();
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['updated','-','+','','beta','gamma']);

  await voices.selectOption('lead-voice');
  await lyricInput(0).fill('rapid-lead');
  await assertExportBlocked('rapid lyric edit should disable export before rerender');
  await voices.selectOption('backing-voice');
  assert.equal(await lyricInputs.count(),2,'voice switch should render the selected track immediately');
  await lyricInput(0).fill('rapid-backing');
  await voices.selectOption('lead-voice');
  assert.equal(await lyricInput(0).inputValue(),'rapid-lead','rapid voice switches should keep edits attached to the lead track');
  await voices.selectOption('backing-voice');
  assert.equal(await lyricInput(0).inputValue(),'rapid-backing','rapid voice switches should keep edits attached to the backing track');
  await voices.selectOption('lead-voice');
  const finalXml=await exportXml(page);
  assert.match(finalXml,/<part-name>Lead &lt;Renamed&amp;&gt;<\/part-name>/);
  assert.match(finalXml,/<text>rapid-lead<\/text>/);
  assert.match(finalXml,/<text>rapid-backing<\/text>/);
  await lyricInput(0).fill('chong2');
  await lyricInput(4).fill('qing4');
  await waitForExport();
  await mode.selectOption('hanzi-text');
  await paste.fill('重庆');
  assert.match(await editor.locator('.lyric-editor__counts').textContent(),/已定位 1\/1 句/,'a Chinese phrase should be located in a partial pinyin span');
  assert.equal(await apply.isDisabled(),false,'a located phrase should enable replacement');
  await apply.click();
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['重','-','+','','庆','gamma'],'located replacement should skip marker and empty note slots');
  await undo.click();
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['chong2','-','+','','qing4','gamma'],'undo should restore all prior pinyin lyrics');
  await paste.fill('火星');
  assert.equal(await apply.isDisabled(),true,'unmatched Hanzi must not be applied');
  assert.deepEqual(await lyricInputs.evaluateAll(inputs=>inputs.map(input=>input.value)),['chong2','-','+','','qing4','gamma'],'zero match must leave lyrics unchanged');
  assert.deepEqual(errors,[],'production app should not report uncaught browser errors');
  process.stdout.write('PASS: production Vue import, synchronous export invalidation, XML lyric/name export, per-note and bulk restore, exact-count paste, extension/empty-slot preservation, batch undo, Chinese pinyin conversion, English rejection, and rapid voice switching.\n');
  await context.close();
} finally {
  await browser.close();
}
