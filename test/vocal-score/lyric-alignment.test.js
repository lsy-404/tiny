import assert from 'node:assert/strict';
import test from 'node:test';
import {applyHanziMatch, matchHanziLyrics, normalizePinyin} from '../../apps/vocal-score/src/lib/lyric-alignment.js';

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
