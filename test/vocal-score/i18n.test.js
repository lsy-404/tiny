import test from 'node:test';
import assert from 'node:assert/strict';
import {getLanguage, i18n, setLanguage, t} from '../../apps/vocal-score/src/i18n.js';

test('i18n exposes four locales, named interpolation, and Chinese fallback', tcase => {
  const previous = getLanguage();
  tcase.after(() => setLanguage(previous));

  assert.equal(setLanguage('en-US'), 'en');
  assert.equal(t('lyricEditor.correctCount', {count: 3}), 'Correct 3 notes');
  assert.equal(t('声部'), 'Part');

  setLanguage('ja');
  assert.equal(t('界面语言'), '表示言語');
  setLanguage('ko-KR');
  assert.equal(t('界面语言'), '인터페이스 언어');
  setLanguage('zh-CN');
  assert.equal(t('界面语言'), '界面语言');
  assert.equal(i18n.global.locale.value, 'zh-CN');
  assert.equal(t('not.in.catalog'), 'not.in.catalog');
  assert.equal(t('missing {value}', {value: 'filled'}), 'missing filled');
});

test('setLanguage rejects unsupported locales', () => {
  assert.throws(() => setLanguage('fr'), RangeError);
});

test('setLanguage persists the preference, updates document language, and dispatches a change event', tcase => {
  const previous = getLanguage();
  const keys = ['localStorage', 'document', 'window'];
  const descriptors = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const writes = [];
  const events = [];
  Object.defineProperty(globalThis, 'localStorage', {configurable: true, value: {setItem: (...args) => writes.push(args)}});
  Object.defineProperty(globalThis, 'document', {configurable: true, value: {documentElement: {lang: ''}}});
  Object.defineProperty(globalThis, 'window', {configurable: true, value: {dispatchEvent: event => events.push(event)}});
  tcase.after(() => {
    setLanguage(previous);
    for (const key of keys) {
      const descriptor = descriptors.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });

  setLanguage('ja');
  assert.deepEqual(writes.at(-1), ['svp-vocal-score.language', 'ja']);
  assert.equal(globalThis.document.documentElement.lang, 'ja');
  assert.equal(events.at(-1).type, 'scorelanguagechange');
  assert.deepEqual(events.at(-1).detail, {language: 'ja'});
});

test('App and lyric editor messages exist in all locales and resolve their placeholders', tcase => {
  const previous = getLanguage();
  tcase.after(() => setLanguage(previous));
  const keys = [
    '织音机', '织音机首页', 'by 署名', '标记重复乐段', '谱面显示推测和弦', '调号', '大调', '小调', '考虑调校参数', '拖动排序', '上移', '下移', 'svp.warning.snapped', '偏移阈值',
    '当前所选声部没有触发半音修正。', '{parts} 声部 · {count} 音符', '{count} 音分',
    '音域 {range} · {shift} 半音。', '{length} 小节 × {count}',
    '{name}：存在重叠发声，可能为和声或叠唱', '匹配 {percent}%', '推测和弦', '工程文件列表',
    '无升降号', '移除文件 {name}', '文件和设置保存在当前浏览器',
    '选择或拖入 SVP', '文件仅在本机处理', '导出 SVG', '单独的 - 表示延长前一个字。', '识别转调', '第 {measure} 小节转为 {key}', '页边距 (mm)', '选择或拖入工程', '不支持此文件类型。', '工程中没有可转换的音符。', '{format} · {count} 个声部', 'import.error.unsupported', 'import.error.invalid', '感谢奥莉安多提供的样本数据和改善建议', '转换提示', '{count} 条', '整体', '{count} 条提示', '在分析页查看转换提示', '请至少选择一个人声声部。',
    '文件不是有效的 SVP JSON，请检查文件是否完整。', '这个 JSON 文件不是 Synthesizer V 工程。',
    '调号为手动设置。', '调号已随整体移调更新。',
    '保存失败；请保留原文件并检查浏览器存储空间。', '移除失败，请重试。',
    '无法读取浏览器存储；请检查浏览器的数据权限。', '（异词）', '和弦为自动推测（?）',
    'lyricEditor.notes', 'lyricEditor.correctTitle', 'lyricEditor.correctPlaceholder', 'lyricEditor.writeAs', 'lyricEditor.writeText', 'lyricEditor.writeReading', 'lyricEditor.markChange', 'lyricEditor.markSame', 'lyricEditor.markLow', 'lyricEditor.markNone', 'lyricEditor.caretNone', 'lyricEditor.caretHint', 'lyricEditor.voiceSummary', 'lyricEditor.uncovered', 'lyricEditor.correctCount', 'lyricEditor.noChange', 'lyricEditor.editNotes', 'lyricEditor.beats', 'lyricEditor.position',
    '文件超过 {size} MB，请缩小工程后再导入。', '记谱风格', '风格预设', '流行旋律谱', '合唱谱（标准记谱）', '简洁', '原样（不合并）', '自定义', '自动 · 逐音识别', '；识别出 {glides} 处滑音、{ornaments} 处装饰音', '滑音与装饰音', '滑音线', '倚音', '并入前一音', '保留音符', '花腔记法', '延长线', '连线', '连线 + 延长线', '三连音标记', '括号与数字', '只写数字', '重复时省略', '摇摆记法（Swing）', '{count} 拍按摇摆记法写成平直八分音符', '摇摆记法把 ♩♪ 三连音写成平直八分音符，并在谱首标注 Swing。', 'svp.warning.swingStraight', '允许合并不同声库', '允许重叠', '不允许', '同时发声 ≤ {percent}%', '显示演唱者（声库）', '{part}（{singer}）', '自动音高',
    '主菜单', '加载制谱引擎', '准备字体', '加载歌词编辑器', '准备歌词匹配 Worker', '准备 PDF 导出 Worker', '仍在准备，可先进入', '此浏览器不支持 Worker，歌词匹配在主线程运行', '五线谱暂不可用，简谱仍可使用', '此浏览器无法在后台生成 PDF', '准备就绪', '正在启动', '合并连续音符', '不合并', '低 · 同音延长', '中 · 含元音续唱', '高 · 含短装饰音', '{count} 个续唱音符并入前一字',
    '乐谱预览', '上一页', '下一页', '适合页面', '第 {page} 页，共 {total} 页',
    '下载 PDF', '方向', '横向', '纵向', '纸张', '缩放', '适合页宽',
    '正在恢复文件…', '正在保存…', '已保存在此浏览器', '已移除'
  ];
  const params = {track: 'Lead', title: 'Song', located: 1, phrases: 2, notes: 4, format: 'MIDI', detail: '', name: 'a.txt', measure: 9, key: 'E♭ / c', parts: 2, count: 3, range: 'C3–C5', shift: '+1', length: 4, name: 'Voice', percent: 88, bar: 2, beat: 3, difference: 1, index: 5, glides: 2, ornaments: 1, size: 512, part: 'Lead', singer: 'Mai'};

  setLanguage('zh-CN');
  assert.equal(t('lyricEditor.notes'), '音符歌词');
  for (const locale of ['zh-CN', 'en', 'ja', 'ko']) {
    setLanguage(locale);
    for (const key of keys) {
      const text = t(key, params);
      assert.doesNotMatch(text, /\{[\w]+\}/u, `${locale}: ${key}`);
      if (key.startsWith('lyricEditor.')) assert.notEqual(text, key, `${locale}: missing Chinese lyric label for ${key}`);
      if (locale !== 'zh-CN') assert.notEqual(text, key, `${locale}: missing translation for ${key}`);
    }
  }
});

test('fit-width zoom label is translated in every locale', () => {
  const expected = {
    'zh-CN': '适合页宽',
    en: 'Fit width',
    ja: '幅に合わせる',
    ko: '너비에 맞춤'
  };

  for (const [locale, label] of Object.entries(expected)) {
    setLanguage(locale);
    assert.equal(t('适合页宽'), label);
  }
});
