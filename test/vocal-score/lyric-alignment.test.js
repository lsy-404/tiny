import assert from 'node:assert/strict';
import test from 'node:test';
import {applyHanziMatch, applyLocatedLyrics, locatePastedLyrics, matchHanziLyrics, matchLevel, normalizePinyin} from '../../apps/vocal-score/src/lib/lyric-alignment.js';

const note = lyrics => ({lyrics, onset: 0, duration: 100, pitch: 60});

test('normalizes tone marks, tone digits, ü, and v spellings', () => {
  assert.equal(normalizePinyin('lǚ3'), 'lv');
  assert.equal(normalizePinyin('lü4'), 'lv');
  assert.equal(normalizePinyin('NǏ3'), 'ni');
  assert.equal(normalizePinyin('ni2'), 'ni');
});

test('uses contextual pronunciation and matches a partial Chinese phrase', () => {
  const notes = ['lead', 'chong2', '-', '', 'qing4', 'song1'].map(note);
  const result = matchHanziLyrics('重庆', notes);
  assert.deepEqual(result.matches.map(match => match.noteIndices), [[1, 4]]);
  assert.deepEqual(result.matches[0].characters, ['重', '庆']);
});

test('handles a standalone polyphonic character against either valid reading', () => {
  const result = matchHanziLyrics('重', [note('chong'), note('zhong')]);
  assert.deepEqual(result.matches.map(match => match.noteIndices), [[0], [1]]);
});

test('surfaces repeated phrase positions rather than selecting one silently', () => {
  const result = matchHanziLyrics('你好', ['ni', 'hao', 'other', 'ni3', 'hǎo'].map(note));
  assert.deepEqual(result.matches.map(match => match.noteIndices), [[0, 1], [3, 4]]);
});

test('matches existing Chinese and mixed Chinese/pinyin source lyrics', () => {
  const chinese = matchHanziLyrics('重庆', [note('重'), note('庆'), note('song')]);
  const mixed = matchHanziLyrics('你好', [note('ni'), note('好')]);
  assert.deepEqual(chinese.matches.map(match => match.noteIndices), [[0, 1]]);
  assert.deepEqual(mixed.matches.map(match => match.noteIndices), [[0, 1]]);
});

test('does not match lone markers or empty labels and leaves notes unchanged on zero match', () => {
  const notes = ['-', '+', '', 'wrong'].map(note);
  const before = structuredClone(notes);
  const result = matchHanziLyrics('你好', notes);
  assert.equal(result.matches.length, 0);
  assert.equal(applyHanziMatch(notes, result.matches[0]), false);
  assert.deepEqual(notes, before);
});

test('replaces only matched lyric notes and preserves their timing and pitch', () => {
  const notes = [note('ni3'), note('-'), note('hao4'), note('')];
  const beforeTiming = notes.map(({onset, duration, pitch}) => ({onset, duration, pitch}));
  const match = matchHanziLyrics('你好', notes).matches[0];
  assert.equal(applyHanziMatch(notes, match), true);
  assert.deepEqual(notes.map(item => item.lyrics), ['你', '-', '好', '']);
  assert.deepEqual(notes.map(({onset, duration, pitch}) => ({onset, duration, pitch})), beforeTiming);
});

test('locates a pasted phrase in the existing lyrics instead of replacing from the first note', () => {
  const notes = ['你', '总', '是', '不', '肯', '承', '认', '-', '沉', '溺'].map(note);
  const phrases = locatePastedLyrics('不肯承认', notes, {write: 'pinyin'});
  assert.deepEqual(phrases.map(phrase => [phrase.candidates[phrase.chosen], phrase.tokens.map(token => token.value)]), [[[3, 4, 5, 6], ['bu', 'ken', 'cheng', 'ren']]]);
  assert.equal(applyLocatedLyrics(notes, phrases), 4);
  assert.deepEqual(notes.map(item => item.lyrics), ['你', '总', '是', 'bu', 'ken', 'cheng', 'ren', '-', '沉', '溺']);
});

test('follows the pasted order through repeated phrases and honours a chosen occurrence', () => {
  const notes = ['ni', 'zong', 'shi', 'chen', 'ni', 'zai', 'ni', 'zong', 'shi'].map(note);
  const ordered = locatePastedLyrics('你总是\n沉溺在，你总是', notes, {write: 'hanzi'});
  assert.deepEqual(ordered.map(phrase => phrase.candidates[phrase.chosen]), [[0, 1, 2], [3, 4, 5], [6, 7, 8]]);
  const chosen = locatePastedLyrics('你总是', notes, {write: 'hanzi', choices: {0: 1}});
  assert.deepEqual(chosen[0].candidates, [[0, 1, 2], [6, 7, 8]]);
  assert.deepEqual(chosen[0].candidates[chosen[0].chosen], [6, 7, 8]);
});

test('keeps typed words, falls back to other polyphonic readings, and reports phrases it cannot find', () => {
  const notes = ['la', 'zhong', 'qing'].map(note);
  const typed = locatePastedLyrics('zhong qing', notes);
  assert.deepEqual(typed.map(phrase => [phrase.candidates[phrase.chosen], phrase.tokens.map(token => token.value)]), [[[1, 2], ['zhong', 'qing']]]);
  assert.deepEqual(locatePastedLyrics('重庆', notes, {write: 'hanzi'})[0].candidates, [[1, 2]], 'chong qing in context, zhong as another reading of 重');
  const missing = locatePastedLyrics('火星', notes, {write: 'hanzi'});
  assert.equal(missing[0].chosen, -1);
  assert.equal(applyLocatedLyrics(notes, missing), 0);
});

test('looks past breaths, re-sung vowels and phoneme notes, and accepts spelling variants', () => {
  const notes = ['la', 'zou', 'ou', 'br', 'dao', 'tian', 'ya', '.l y E', 'lue'].map(note);
  const phrases = locatePastedLyrics('走到天涯掠', notes, {write: 'hanzi'});
  assert.deepEqual(phrases[0].candidates[phrases[0].chosen], [1, 4, 5, 6, 7]);
  assert.equal(phrases[0].mismatches[phrases[0].chosen], 0);
  assert.deepEqual(locatePastedLyrics('略', [note('lve')], {write: 'hanzi'})[0].candidates, [[0]], 'lüe, lve and lue are one syllable');
});

test('finds a phrase with a typo or a missing syllable as a labelled near match', () => {
  const notes = ['wo', 'liao', 'jie', 'mei', 'ge', 'ren', 'de', 'mi', 'mi'].map(note);
  const typo = locatePastedLyrics('我了改每个人', notes, {write: 'hanzi'});
  assert.deepEqual(typo[0].candidates[typo[0].chosen], [0, 1, 2, 3, 4, 5]);
  assert.equal(typo[0].mismatches[typo[0].chosen], 1);
  const missing = locatePastedLyrics('我解每个人的', notes, {write: 'pinyin'});
  assert.deepEqual(missing[0].candidates[missing[0].chosen], [0, 2, 3, 4, 5, 6], 'the note sung without a pasted syllable keeps its lyric');
  applyLocatedLyrics(notes, missing);
  assert.deepEqual(notes.map(item => item.lyrics).slice(0, 7), ['wo', 'liao', 'jie', 'mei', 'ge', 'ren', 'de']);
  assert.equal(locatePastedLyrics('火星', notes, {write: 'hanzi'})[0].chosen, -1, 'short phrases are never matched approximately');
});

test('records where each pasted syllable was typed and how each phrase was found', () => {
  const notes = ['ni', 'hao', 'shi', 'jie', 'wo', 'men', 'zai', 'yi', 'qi'].map(note);
  const text = '你好，  世界 我们在一起吗';
  const phrases = locatePastedLyrics(text, notes, {write: 'hanzi'});
  assert.deepEqual(phrases.map(phrase => [phrase.text, phrase.start, phrase.end]), [['你好', 0, 2], ['世界', 5, 7], ['我们在一起吗', 8, 14]]);
  assert.deepEqual(phrases[2].tokens.map(token => text.slice(token.start, token.end)).join(''), '我们在一起吗');
  assert.deepEqual(phrases.map(phrase => phrase.via), ['reading', 'reading', 'approximate'], 'a phrase with one extra syllable is a near match');
  assert.deepEqual(locatePastedLyrics('火星', notes).map(phrase => phrase.via), [null]);
  assert.deepEqual(locatePastedLyrics('ni hao  shi', notes)[0].tokens.map(token => [token.start, token.end]), [[0, 2], [3, 6], [8, 11]]);
});

test('rates located phrases as exact, high or low confidence, and missing phrases as none', () => {
  const notes = ['a', 'ni', 'hao', 'shi', 'jie', 'wo', 'men', 'zai', 'yi', 'qi', 'a'].map(note);
  const levels = text => locatePastedLyrics(text, notes, {write: 'hanzi'}).map(matchLevel);
  assert.deepEqual(levels('你好 世界'), ['exact', 'exact'], 'unique phrases on their usual readings');
  assert.deepEqual(levels('啊'), ['high'], 'a short phrase found in several places may be misplaced');
  assert.deepEqual(levels('我们在一起吗'), ['low'], 'one syllable in six differs');
  assert.deepEqual(levels('你好世界我们在二起'), ['high'], 'one typo in nine syllables');
  assert.deepEqual(levels('火星'), ['none']);
  assert.equal(matchLevel({via: 'polyphonic', candidates: [[0, 1]], mismatches: [0], chosen: 0}), 'high', 'another reading of a polyphonic character');
});
