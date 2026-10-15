import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { QUARTER, createScore, parseSvp } from '../../apps/vocal-score/src/lib/converter.js';

function makeProject(overrides = {}) {
  return {
    version: 153,
    time: { tempo: [{ position: 0, bpm: 120 }], meter: [{ index: 0, numerator: 4, denominator: 4 }] },
    library: [{ uuid: 'lib-1', name: 'Library', notes: [{ onset: 0, duration: QUARTER, pitch: 60, lyrics: 'la' }] }],
    tracks: [{ name: 'Voice', mainGroup: { uuid: 'main-1', notes: [] }, groups: [{ groupID: 'lib-1', blickOffset: QUARTER, pitchOffset: 2, isInstrumental: false }] }],
    ...overrides
  };
}

function emptyTuning() {
  return {
    detuneCents: 0,
    curvePointCount: 0,
    curveMode: null,
    curveRepresentativeCents: 0,
    curveApproximate: false,
    pitchControlCurveCount: 0,
    expression: {},
    systemExpression: {},
    referenceExpression: {},
    referenceTranspose: { cents: null, semitones: null }
  };
}

function emptyModelTuning() {
  return { ...emptyTuning(), representativeCents: 0, adjustmentSemitones: 0, residualCents: 0 };
}

test('parses BOM and trailing NUL safely and resolves reference offsets without mutating source', () => {
  const source = makeProject();
  const before = structuredClone(source);
  const parsed = parseSvp(`\uFEFF${JSON.stringify(source)}\0`);
  assert.deepEqual(parsed.tracks[0].notes[0], { onset: QUARTER, duration: QUARTER, pitch: 62, lyrics: 'la', tuning: emptyTuning() });
  assert.deepEqual(source, before);
  assert.equal(parsed.tracks[0].name, 'Voice');
  assert.throws(() => parseSvp(JSON.stringify(source).replace('"Voice"', '"Vo\0ice"')), /Invalid SVP JSON/);
});

test('uses mainRef offsets and trims for mainGroup notes exactly once', () => {
  const source = makeProject({ library: [{ uuid: 'main', notes: [
    { onset: 0, duration: QUARTER, pitch: 50, lyrics: 'duplicate' }
  ] }], tracks: [{ name: 'Main', mainGroup: { uuid: 'main', notes: [
    { onset: 0, duration: QUARTER, pitch: 60, lyrics: 'la' }
  ] }, mainRef: { groupID: 'main', blickOffset: QUARTER, pitchOffset: 3, blickAbsoluteBegin: QUARTER + QUARTER / 4, blickAbsoluteEnd: QUARTER + QUARTER * 3 / 4, isInstrumental: false }, groups: [] }] });
  const parsed = parseSvp(JSON.stringify(source));
  assert.deepEqual(parsed.tracks[0].notes[0], { onset: QUARTER + QUARTER / 4, duration: QUARTER / 2, pitch: 63, lyrics: 'la', tuning: emptyTuning() });
  assert.equal(parsed.warnings.length, 0);
  assert.equal(parsed.tracks[0].notes.length, 1);
  source.tracks[0].mainRef.isInstrumental = true;
  assert.equal(parseSvp(JSON.stringify(source)).tracks.length, 0);
});

test('ignores instrumental refs, preserves reference trims, and warns for missing groups', () => {
  const source = makeProject({ tracks: [{ name: 'Mixed', mainGroup: { uuid: 'm', notes: [] }, groups: [
    { groupID: 'lib-1', blickOffset: QUARTER, pitchOffset: 0, blickAbsoluteBegin: QUARTER + QUARTER / 4, blickAbsoluteEnd: QUARTER + QUARTER * 3 / 4 },
    { groupID: 'instrument', isInstrumental: true },
    { groupID: 'missing' }
  ] }] });
  const parsed = parseSvp(JSON.stringify(source));
  assert.equal(parsed.tracks[0].notes.length, 1);
  assert.equal(parsed.tracks[0].notes[0].onset, QUARTER + QUARTER / 4);
  assert.equal(parsed.tracks[0].notes[0].duration, QUARTER / 2);
  assert.equal(parsed.tracks[0].notes[0].pitch, 60);
  assert.equal(parsed.warnings.length, 1);
});

test('creates MusicXML 4.0 with measure rests, ties across bars, and corrected octave', () => {
  const project = { title: 'A', tracks: [{ id: 'v', name: 'V', notes: [{ onset: 0, duration: QUARTER * 5, pitch: 60, lyrics: 'hello' }] }], meters: [{ index: 0, numerator: 4, denominator: 4 }], tempos: [{ position: 0, bpm: 100 }], warnings: [] };
  const result = createScore(project, { grid: 16 });
  assert.match(result.xml, /version="4\.0"/);
  assert.equal(result.stats.measureCount, 2);
  assert.equal((result.xml.match(/<tie type="start"\/>/g) || []).length, 1);
  assert.equal((result.xml.match(/<tie type="stop"\/>/g) || []).length, 1);
  assert.match(result.xml, /<step>C<\/step><octave>4<\/octave>/);
  assert.match(result.xml, /<rest\/><duration>48<\/duration>/);
  assert.match(result.xml, /<divisions>16<\/divisions><key><fifths>0<\/fifths><\/key><time><beats>4<\/beats><beat-type>4<\/beat-type><\/time><clef>/);
  assert.match(result.xml, /<duration>64<\/duration><tie type="start"\/><voice>1<\/voice>/);
});

test('writes meter changes and tempo marks inside a measure', () => {
  const project = { tracks: [{ id: 'v', name: 'V', notes: [{ onset: 0, duration: QUARTER * 7, pitch: 69, lyrics: 'a' }] }], meters: [{ index: 0, numerator: 4, denominator: 4 }, { index: 1, numerator: 3, denominator: 4 }], tempos: [{ position: 0, bpm: 90 }, { position: QUARTER * 2, bpm: 110 }], warnings: [] };
  const { xml: output, stats } = createScore(project);
  assert.equal(stats.measureCount, 2);
  assert.match(output, /<beats>3<\/beats><beat-type>4<\/beat-type>/);
  assert.match(output, /<offset>32<\/offset><sound tempo="110"\/>/);
  assert.match(output, /<per-minute>110<\/per-minute>/);
});

test('escapes XML labels and lyrics and handles continuation lyric markers', () => {
  const project = { title: 'A&B', tracks: [{ id: 'v', name: '<Lead>', notes: [
    { onset: 0, duration: QUARTER, pitch: 60, lyrics: 'A&B <c>' },
    { onset: QUARTER, duration: QUARTER, pitch: 62, lyrics: '+' },
    { onset: QUARTER * 2, duration: QUARTER, pitch: 64, lyrics: '+' },
    { onset: QUARTER * 3, duration: QUARTER, pitch: 65, lyrics: 'br' }
  ] }], meters: [{ index: 0, numerator: 4, denominator: 4 }], tempos: [], warnings: [] };
  const { xml: output } = createScore(project);
  assert.match(output, /A&amp;B/);
  assert.match(output, /&lt;Lead&gt;/);
  assert.match(output, /A&amp;B &lt;c&gt;/);
  assert.match(output, /<extend type="continue"\/>/);
  assert.match(output, /<extend type="start"\/>/);
  assert.match(output, /<extend type="stop"\/>/);
  assert.doesNotMatch(output, /<text>br<\/text>/);
  assert.match(output, /<duration>16<\/duration><voice>1<\/voice><type>quarter<\/type>/);
  const escapedNul = parseSvp(JSON.stringify({ ...makeProject(), library: [{ uuid: 'lib-1', notes: [{ onset: 0, duration: QUARTER, pitch: 60, lyrics: 'A\0&B' }] } ] }));
  const escapedNulXml = createScore(escapedNul).xml;
  assert.match(escapedNulXml, /<text>A&amp;B<\/text>/);
  assert.doesNotMatch(escapedNulXml, /\0/);
});

test('treats lone hyphens as multi-note lyric extenders and ends them before rests', () => {
  const project = { tracks: [{ id: 'v', name: 'Voice', notes: [
    { onset: QUARTER * 3, duration: QUARTER, pitch: 60, lyrics: 'ma' },
    { onset: QUARTER * 4, duration: QUARTER, pitch: 62, lyrics: '-' },
    { onset: QUARTER * 5, duration: QUARTER, pitch: 64, lyrics: '-' },
    { onset: QUARTER * 6, duration: QUARTER, pitch: 65, lyrics: 'br' },
    { onset: QUARTER * 7, duration: QUARTER, pitch: 67, lyrics: '-' }
  ] }], meters: [{ index: 0, numerator: 4, denominator: 4 }], tempos: [], warnings: [] };
  const output = createScore(project).xml;
  assert.match(output, /<text>ma<\/text><extend type="start"\/>/);
  assert.match(output, /<extend type="continue"\/>/);
  assert.match(output, /<extend type="stop"\/>/);
  assert.doesNotMatch(output, /<text>-<\/text>/);
  assert.doesNotMatch(output, /<text>br<\/text>/);
  const afterGap = createScore({ ...project, tracks: [{ ...project.tracks[0], notes: [
    { onset: 0, duration: QUARTER, pitch: 60, lyrics: 'la' },
    { onset: QUARTER, duration: QUARTER, pitch: 62, lyrics: '-' },
    { onset: QUARTER * 3, duration: QUARTER, pitch: 64, lyrics: '-' },
    { onset: QUARTER * 4, duration: QUARTER, pitch: 65, lyrics: 'br' }
  ] }] }).xml;
  assert.equal((afterGap.match(/<extend type="continue"\/>/g) || []).length, 0);
  assert.equal((afterGap.match(/<extend type="stop"\/>/g) || []).length, 2);
});

test('preserves detune, pitch curves, and explicit versus inherited pitch expression', () => {
  const source = makeProject({
    library: [{ uuid: 'lib-1', pitchControls: [{ position: 0, pitch: 60, points: [] }], parameters: { pitchDelta: { mode: 'linear', points: [[0, 25], [QUARTER * 2, 75]] } }, notes: [
      { onset: 0, duration: QUARTER, pitch: 60, lyrics: 'la', detune: 20,
        attributes: { dF0Left: 0.25, dF0Vbr: 0.4, dF0Right: null },
        systemAttributes: { dF0Left: 0.5, dF0Right: -0.2, fF0Vbr: 'not-finite' } }
    ] }],
    tracks: [{ name: 'Voice', mainGroup: { uuid: 'main-1', notes: [] }, groups: [
      { groupID: 'lib-1', blickOffset: 0, pitchOffset: 0, isInstrumental: false,
        voice: { dF0Right: 0.3, transposeCents: 15, transposeSemitones: 1 } }
    ] }]
  });
  const before = structuredClone(source);
  const parsed = parseSvp(JSON.stringify(source));
  assert.equal(parsed.tracks[0].notes[0].pitch, 60);
  assert.equal(parsed.tracks[0].notes[0].tuning.detuneCents, 20);
  assert.equal(parsed.tracks[0].notes[0].tuning.curvePointCount, 2);
  assert.equal(parsed.tracks[0].notes[0].tuning.curveMode, 'linear');
  assert.ok(parsed.tracks[0].notes[0].tuning.curveRepresentativeCents > 25);
  assert.deepEqual(parsed.tracks[0].notes[0].tuning.expression, { dF0Left: 0.25, dF0Vbr: 0.4 });
  assert.deepEqual(parsed.tracks[0].notes[0].tuning.systemExpression, { dF0Left: 0.5, dF0Right: -0.2 });
  assert.deepEqual(parsed.tracks[0].notes[0].tuning.referenceExpression, { dF0Right: 0.3 });
  assert.deepEqual(parsed.tracks[0].notes[0].tuning.referenceTranspose, { cents: 15, semitones: 1 });
  assert.equal(parsed.tuningSummary.pitchDeltaCurves, 1);
  assert.equal(parsed.tuningSummary.pitchDeltaPoints, 2);
  assert.equal(parsed.tuningSummary.pitchControlCurves, 1);
  assert.equal(parsed.tracks[0].notes[0].tuning.pitchControlCurveCount, 1);
  assert.ok(parsed.warnings.some(warning => warning.includes('pitch curves are not represented')));
  const score = createScore(parsed);
  assert.equal(score.model.tracks[0].notes[0].pitch, 61);
  assert.ok(score.model.tracks[0].notes[0].tuning.representativeCents > 50);
  score.model.tracks[0].notes[0].tuning.expression.dF0Left = 9;
  assert.deepEqual(source, before);
});

test('applies thresholded detune symmetrically and retains residual tuning without mutating notes', () => {
  const notes = [49, 50, 51, -49, -50, -51, 160, 'not-finite'].map((detune, index) => ({
    onset: QUARTER * index,
    duration: QUARTER,
    pitch: 60,
    lyrics: `n${index}`,
    ...(detune === 'not-finite' ? { detune: null } : { detune })
  }));
  const source = makeProject({
    library: [{ uuid: 'lib-1', notes }],
    tracks: [{ name: 'V', mainGroup: { uuid: 'main-1', notes: [] }, groups: [{ groupID: 'lib-1', blickOffset: 0, pitchOffset: 0, isInstrumental: false }] }]
  });
  const before = structuredClone(source);
  const parsed = parseSvp(JSON.stringify(source));
  const result = createScore(parsed);
  assert.deepEqual(result.model.tracks[0].notes.map(note => note.pitch), [60, 61, 61, 60, 59, 59, 62, 60]);
  assert.deepEqual(result.model.tracks[0].notes.map(note => note.tuning.residualCents), [49, -50, -49, -49, 50, 49, -40, 0]);
  assert.equal(result.pitchAdjustments.adjustedNoteCount, 5);
  assert.equal(result.model.tracks[0].notes[7].tuning.detuneCents, null);
  assert.deepEqual(result.model.tracks[0].notes.map(note => [note.start, note.end]), notes.map((note, index) => [16 * index, 16 * (index + 1)]));
  assert.equal(result.stats.noteCount, notes.length);
  assert.ok(parsed.warnings.some(warning => warning.includes('non-finite note detune')));
  assert.deepEqual(source, before);
  const higherThreshold = createScore(parsed, { pitchAdjustment: { enabled: true, thresholdCents: 75 } });
  assert.equal(higherThreshold.model.tracks[0].notes[2].pitch, 60);
  const disabled = createScore(parsed, { pitchAdjustment: { enabled: false, thresholdCents: 50 } });
  assert.equal(disabled.model.tracks[0].notes[2].pitch, 60);
});

test('uses a robust curve representative and reports cubic interpolation approximation', () => {
  const source = makeProject({
    library: [{ uuid: 'lib-1', parameters: { pitchDelta: { mode: 'cubic', points: [[0, -60], [QUARTER, 0], [QUARTER * 2, 60]] } },
      notes: [{ onset: 0, duration: QUARTER * 2, pitch: 60, lyrics: 'la', detune: 0 }] }],
    tracks: [{ name: 'Voice', mainGroup: { uuid: 'main-1', notes: [] }, groups: [{ groupID: 'lib-1', isInstrumental: false }] }]
  });
  const parsed = parseSvp(JSON.stringify(source));
  assert.ok(Math.abs(parsed.tracks[0].notes[0].tuning.curveRepresentativeCents) < 5);
  const result = createScore(parsed);
  assert.equal(result.model.tracks[0].notes[0].pitch, 60);
  assert.equal(result.pitchAdjustments.approximateNoteCount, 1);
  assert.ok(result.warnings.some(warning => warning.includes('linear sampling approximation')));
});

test('samples pitch deviation on the clipped reference note range only', () => {
  const source = makeProject({
    library: [{ uuid: 'lib-1', parameters: { pitchDelta: { mode: 'linear', points: [[0, 0], [QUARTER * 4, 200]] } },
      notes: [{ onset: 0, duration: QUARTER * 4, pitch: 60, lyrics: 'la', detune: 0 }] }],
    tracks: [{ name: 'Voice', mainGroup: { uuid: 'main-1', notes: [] }, groups: [{
      groupID: 'lib-1', blickOffset: QUARTER, pitchOffset: 0, blickAbsoluteBegin: QUARTER * 2,
      blickAbsoluteEnd: QUARTER * 4, isInstrumental: false
    }] }]
  });
  const before = structuredClone(source);
  const parsed = parseSvp(JSON.stringify(source));
  const score = createScore(parsed);
  assert.equal(parsed.tracks[0].notes[0].onset, QUARTER * 2);
  assert.equal(parsed.tracks[0].notes[0].duration, QUARTER * 2);
  assert.ok(Math.abs(parsed.tracks[0].notes[0].tuning.curveRepresentativeCents - 100) < 1);
  assert.equal(score.model.tracks[0].notes[0].pitch, 61);
  assert.equal(score.model.tracks[0].notes[0].start, 32);
  assert.equal(score.model.tracks[0].notes[0].end, 64);
  assert.deepEqual(source, before);
});

test('quantizes notes, accounts for transposition, and keeps overlapping notes as voices', () => {
  const project = { tracks: [{ id: 'v', name: 'V', notes: [
    { onset: 1, duration: QUARTER, pitch: 60, lyrics: 'a' },
    { onset: QUARTER / 2, duration: QUARTER, pitch: 64, lyrics: 'b' }
  ] }], meters: [{ index: 0, numerator: 4, denominator: 4 }], tempos: [], warnings: [] };
  const result = createScore(project, { transpose: 1 });
  assert.equal(result.stats.noteCount, 2);
  assert.ok(result.warnings.some(warning => warning.includes('overlapping')));
  assert.match(result.xml, /<backup><duration>64<\/duration><\/backup>/);
  assert.match(result.xml, /<step>C<\/step><alter>1<\/alter>/);
});

test('rejects malformed project input, invalid grid, and empty track selections', () => {
  assert.throws(() => parseSvp('{broken'), /Invalid SVP JSON/);
  assert.throws(() => parseSvp('{"time":{}}'), /tracks array/);
  assert.throws(() => parseSvp(`${JSON.stringify(makeProject())}unexpected`), /Invalid SVP JSON/);
  const project = { tracks: [], meters: [], tempos: [], warnings: [] };
  assert.throws(() => createScore(project), /Select at least one/);
  assert.throws(() => createScore({ ...project, tracks: [{ id: 'v', notes: [] }] }, { trackIds: [] }), /Select at least one/);
  assert.throws(() => createScore({ ...project, tracks: [{ id: 'v', notes: [] }] }, { grid: 12 }), /Grid must/);
  assert.throws(() => createScore({ ...project, tracks: [{ id: 'v', name: 'V', notes: [{ onset: 0, duration: QUARTER, pitch: 127, lyrics: '' }] }] }, { transpose: 1 }), /MIDI range/);
  assert.throws(() => createScore({ ...project, meters: [{ index: 0, numerator: 4, denominator: 4 }], tracks: [{ id: 'v', name: 'V', notes: [{ onset: 0, duration: QUARTER, pitch: 127, lyrics: '', tuning: { detuneCents: 100 } }] }] }), /MIDI range/);
  assert.throws(() => createScore({ ...project, tracks: [{ id: 'v', name: 'V', notes: [] }] }, { pitchAdjustment: { enabled: true, thresholdCents: 0 } }), /threshold/);
});

test('warns when grid quantization shifts source note boundaries', () => {
  const project = { tracks: [{ id: 'v', name: 'V', notes: [{ onset: 1, duration: QUARTER - 2, pitch: 60, lyrics: 'a' }] }], meters: [{ index: 0, numerator: 4, denominator: 4 }], tempos: [], warnings: [] };
  const result = createScore(project, { grid: 16 });
  assert.ok(result.warnings.some(warning => warning.includes('shifted by grid quantization')));
});

test('returns a fresh canonical model aligned to quantized MusicXML timing', () => {
  const source = {
    tracks: [
      { id: 'voice', name: 'Lead', notes: [
        { onset: QUARTER / 2, duration: QUARTER, pitch: 60, lyrics: 'a' },
        { onset: QUARTER / 2, duration: QUARTER / 2, pitch: 67, lyrics: 'b' }
      ] },
      { id: 'other', name: 'Other', notes: [{ onset: 0, duration: QUARTER, pitch: 48, lyrics: 'x' }] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [{ position: QUARTER * 2, bpm: 110 }],
    warnings: []
  };
  const before = structuredClone(source);
  const result = createScore(source, { trackIds: ['voice'], transpose: 2 });
  const { tuning: firstTuning, ...firstNote } = result.model.tracks[0].notes[0];
  const { tuning: secondTuning, ...secondNote } = result.model.tracks[0].notes[1];
  assert.deepEqual(result.model, {
    divisions: 16,
    measures: [{ index: 0, start: 0, end: 64, meter: { numerator: 4, denominator: 4 } }],
    tracks: [{ id: 'voice', name: 'Lead', notes: [
      { ...firstNote, tuning: emptyModelTuning() },
      { ...secondNote, tuning: emptyModelTuning() }
    ] }],
    tempos: [{ position: 32, bpm: 110 }]
  });
  assert.equal(firstTuning.representativeCents, 0);
  assert.equal(secondTuning.adjustmentSemitones, 0);
  assert.match(result.xml, /<rest\/><duration>8<\/duration>/);
  assert.match(result.xml, /<duration>16<\/duration>/);
  assert.match(result.xml, /<backup><duration>64<\/duration><\/backup>/);
  assert.deepEqual(source, before);
  result.model.measures[0].meter.numerator = 9;
  assert.equal(source.meters[0].numerator, 4);
});

test('merges disjoint lower-track notes upward and retains their provenance', () => {
  const source = {
    tracks: [
      { id: 'upper', name: 'Voice A', notes: [{ onset: 0, duration: QUARTER, pitch: 60, lyrics: 'first' }] },
      { id: 'lower', name: 'Voice B', notes: [{ onset: QUARTER, duration: QUARTER, pitch: 60, lyrics: 'second' }] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [],
    warnings: []
  };
  const before = structuredClone(source);
  const result = createScore(source, { mergeContinuations: true });
  assert.equal(result.stats.noteCount, 2);
  assert.equal(result.stats.partCount, 1);
  assert.deepEqual(result.merging, {
    enabled: true,
    movedNoteCount: 1,
    sourcePartCount: 2,
    outputPartCount: 1,
    moves: [{ fromId: 'lower', fromName: 'Voice B', toId: 'upper', toName: 'Voice A', count: 1 }],
    roles: [{ id: 'upper', name: 'Voice A', role: 'mixed', overlapRatio: 0 }]
  });
  assert.deepEqual(result.model.tracks[0].notes.map(note => [note.start, note.end, note.sourceTrackId]), [
    [0, 16, 'upper'], [16, 32, 'lower']
  ]);
  assert.deepEqual(source, before);
});

test('moves a lyric extender chain as a single disjoint unit', () => {
  const project = {
    tracks: [
      { id: 'lead', name: 'Lead', notes: [{ onset: 0, duration: QUARTER, pitch: 60, lyrics: 'lead' }] },
      { id: 'back', name: 'Back', notes: [
        { onset: QUARTER, duration: QUARTER, pitch: 48, lyrics: 'back' },
        { onset: QUARTER * 2, duration: QUARTER, pitch: 48, lyrics: '-' }
      ] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [],
    warnings: []
  };
  const result = createScore(project, { mergeContinuations: true });
  assert.equal(result.merging.movedNoteCount, 2);
  assert.equal(result.merging.moves[0].count, 2);
  assert.equal(result.stats.noteCount, 3);
  assert.equal(result.stats.partCount, 1);
  assert.match(result.xml, /<text>back<\/text><extend type="start"\/>/);
  assert.match(result.xml, /<extend type="stop"\/>/);
});

test('keeps an entire lyric extender chain when any part overlaps the target', () => {
  const project = {
    tracks: [
      { id: 'lead', name: 'Lead', notes: [{ onset: QUARTER * 2, duration: QUARTER, pitch: 60, lyrics: 'lead' }] },
      { id: 'back', name: 'Back', notes: [
        { onset: QUARTER, duration: QUARTER, pitch: 48, lyrics: 'back' },
        { onset: QUARTER * 2, duration: QUARTER, pitch: 48, lyrics: '-' }
      ] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [],
    warnings: []
  };
  const result = createScore(project, { mergeContinuations: true });
  assert.equal(result.merging.movedNoteCount, 0);
  assert.equal(result.stats.noteCount, 3);
  assert.equal(result.stats.partCount, 2);
  assert.deepEqual(result.model.tracks.map(track => track.notes.map(note => note.sourceTrackId)), [['lead'], ['back', 'back']]);
});

test('does not move an orphan extender across a rest in its source lane', () => {
  const project = {
    tracks: [
      { id: 'lead', name: 'Lead', notes: [{ onset: 0, duration: QUARTER, pitch: 60, lyrics: 'lead' }] },
      { id: 'back', name: 'Back', notes: [
        { onset: QUARTER, duration: QUARTER, pitch: 48, lyrics: 'back' },
        { onset: QUARTER * 3, duration: QUARTER, pitch: 48, lyrics: '-' }
      ] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [],
    warnings: []
  };
  const result = createScore(project, { mergeContinuations: true });
  assert.equal(result.merging.movedNoteCount, 1);
  assert.equal(result.stats.noteCount, 3);
  assert.equal(result.stats.partCount, 2);
  assert.deepEqual(result.model.tracks.map(track => track.notes.map(note => note.sourceTrackId)), [['lead', 'back'], ['back']]);
  assert.doesNotMatch(result.xml, /<text>back<\/text><extend type="start"\/>/);
});

test('sorts moved early and late fragments before assigning voices', () => {
  const project = {
    tracks: [
      { id: 'upper', name: 'Upper', notes: [
        { onset: 0, duration: QUARTER, pitch: 60, lyrics: 'a' },
        { onset: QUARTER * 2, duration: QUARTER, pitch: 62, lyrics: 'c' }
      ] },
      { id: 'lower', name: 'Lower', notes: [
        { onset: QUARTER, duration: QUARTER, pitch: 61, lyrics: 'b' },
        { onset: QUARTER * 3, duration: QUARTER, pitch: 63, lyrics: 'd' }
      ] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [],
    warnings: []
  };
  const before = structuredClone(project);
  const merged = createScore(project, { mergeContinuations: true });
  assert.equal(merged.stats.partCount, 1);
  assert.equal(merged.stats.noteCount, 4);
  assert.deepEqual(merged.model.tracks[0].notes.map(note => [note.start, note.voice]), [
    [0, 1], [16, 1], [32, 1], [48, 1]
  ]);
  assert.equal(merged.warnings.some(warning => warning.includes('overlapping notes')), false);
  assert.deepEqual(project, before);
});

test('keeps any note with partial or simultaneous overlap whole in its original part', () => {
  const project = {
    tracks: [
      { id: 'one', name: 'One', notes: [{ onset: 0, duration: QUARTER * 2, pitch: 60, lyrics: 'x' }] },
      { id: 'two', name: 'Two', notes: [{ onset: QUARTER, duration: QUARTER * 2, pitch: 60, lyrics: 'y' }] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [],
    warnings: []
  };
  const result = createScore(project, { mergeContinuations: true });
  assert.equal(result.merging.movedNoteCount, 0);
  assert.equal(result.stats.partCount, 2);
  assert.equal(result.stats.noteCount, 2);
  assert.deepEqual(result.model.tracks.map(track => track.notes.map(note => [note.start, note.end, note.pitch])), [
    [[0, 32, 60]], [[16, 48, 60]]
  ]);
  assert.equal(result.merging.roles[1].role, 'harmony');
  assert.equal(result.merging.roles[1].overlapRatio, 0.5);
});

test('skips empty upper tracks, respects selection order, and preserves simultaneous notes', () => {
  const project = {
    tracks: [
      { id: 'empty', name: 'Empty', notes: [] },
      { id: 'solo', name: 'Solo', notes: [{ onset: 0, duration: QUARTER, pitch: 60, lyrics: 'a' }] },
      { id: 'split', name: 'Split', notes: [
        { onset: QUARTER * 2, duration: QUARTER, pitch: 62, lyrics: 'b' },
        { onset: QUARTER * 2, duration: QUARTER, pitch: 67, lyrics: 'c' }
      ] },
      { id: 'unselected', name: 'Ignored', notes: [{ onset: 0, duration: QUARTER, pitch: 48, lyrics: 'z' }] }
    ],
    meters: [{ index: 0, numerator: 4, denominator: 4 }],
    tempos: [],
    warnings: []
  };
  const result = createScore(project, { trackIds: ['split', 'solo', 'empty'], mergeContinuations: true });
  assert.deepEqual(result.model.tracks.map(track => track.id), ['solo', 'split']);
  assert.equal(result.merging.sourcePartCount, 3);
  assert.equal(result.merging.outputPartCount, 2);
  assert.equal(result.merging.movedNoteCount, 1);
  assert.deepEqual(result.model.tracks.flatMap(track => track.notes).map(note => note.pitch).sort((a, b) => a - b), [60, 62, 67]);
  assert.equal(result.stats.noteCount, 3);
});

const sampleFiles = (process.env.SVP_SAMPLE_FILES || '').split(';').filter(Boolean);
if (!sampleFiles.length) {
  test('converts configured local SVP files when present', t => t.skip('Set SVP_SAMPLE_FILES to semicolon-separated local input paths.'));
}
for (const file of sampleFiles) {
  test(`converts local ${file.split('\\').at(-1)} when present`, async t => {
    let text;
    try { text = await readFile(file, 'utf8'); } catch { t.skip('Local source file is unavailable.'); return; }
    const project = parseSvp(text, file);
    assert.ok(project.tracks.length > 0);
    const output = createScore(project, { trackIds: [project.tracks[0].id] });
    assert.ok(output.stats.noteCount > 0);
    assert.match(output.xml, /score-partwise/);
    const original = createScore(project);
    const merged = createScore(project, { mergeContinuations: true });
    const signatures = score => score.model.tracks.flatMap(track => track.notes.map(note => `${note.start}:${note.end}:${note.pitch}:${note.lyrics}:${note.sourceTrackId}`)).sort();
    assert.equal(merged.stats.noteCount, original.stats.noteCount);
    assert.equal(merged.stats.measureCount, original.stats.measureCount);
    assert.deepEqual(signatures(merged), signatures(original));
    assert.ok(merged.model.tracks.every(track => track.notes.every(note => note.voice === 1)));
    assert.equal(merged.warnings.some(warning => warning.includes('overlapping notes')), false);
  });
}
