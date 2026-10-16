import test from 'node:test';
import assert from 'node:assert/strict';
import {upgradeSettings} from '../../apps/vocal-score/src/lib/storage.js';

test('moves projects saved with the old default merge level to automatic merging', () => {
  assert.deepEqual(upgradeSettings({noteMerge: 'low', grid: 16}), {noteMerge: 'auto', grid: 16});
  assert.equal(upgradeSettings({noteMerge: 'low', glides: 'line'}).noteMerge, 'low', 'a level chosen once notation styles exist stays');
  assert.equal(upgradeSettings({noteMerge: 'high'}).noteMerge, 'high', 'other levels were chosen on purpose');
  assert.deepEqual(upgradeSettings(undefined), {});
});
