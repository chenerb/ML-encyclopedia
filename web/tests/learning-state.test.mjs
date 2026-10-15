import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLearningState, updateArticle, getReadingProgress, createLearningStore } from '../src/utils/learning-state.mjs';

const id = '01-introduction/01-what-is-ml';

test('corrupt or unsupported stored data falls back to an empty learning record', () => {
  for (const value of ['{', 'null', '[]', '{"version":2,"articles":{}}']) {
    assert.deepEqual(parseLearningState(value).articles, {});
  }
});

test('restores only validated article records and clamps their positions', () => {
  const state = parseLearningState(JSON.stringify({ version: 1, lastArticleId: id, articles: {
    [id]: { progress: 1.8, completed: true, updatedAt: 20 },
    'bad-id': { progress: 0.5, completed: true },
  } }));
  assert.deepEqual(Object.keys(state.articles), [id]);
  assert.equal(state.articles[id].progress, 1);
  assert.equal(state.lastArticleId, id);
});

test('reaching the end does not mark an article as learned', () => {
  const state = updateArticle(parseLearningState(null), id, { progress: 1 }, 10);
  assert.equal(state.articles[id].completed, false);
  assert.equal(state.lastArticleId, id);
});

test('explicit completion can be undone without losing the reading position', () => {
  const initial = updateArticle(parseLearningState(null), id, { progress: 0.45 }, 10);
  const learned = updateArticle(initial, id, { completed: true }, 20);
  const undone = updateArticle(learned, id, { completed: false }, 30);
  assert.equal(learned.articles[id].completed, true);
  assert.equal(undone.articles[id].completed, false);
  assert.equal(undone.articles[id].progress, 0.45);
  assert.equal(initial.articles[id].completed, false);
});

test('reading position follows the article bounds instead of footer height', () => {
  assert.equal(getReadingProgress(0, 300, 2000, 800), 0);
  assert.equal(getReadingProgress(1500, 300, 2000, 800), 1);
  assert.equal(getReadingProgress(-500, 300, 2000, 800), 0);
});

test('unavailable storage preserves state in memory for the current page', () => {
  const store = createLearningStore({ getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } });
  assert.doesNotThrow(() => store.update(id, { completed: true }));
  assert.equal(store.get().articles[id].completed, true);
  assert.equal(store.persistent, false);
});

test('saves and reloads a record from the actual storage adapter boundary', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  createLearningStore(storage).update(id, { progress: 0.6 });
  assert.equal(createLearningStore(storage).get().articles[id].progress, 0.6);
});

test('another open article cannot overwrite a newer completion record', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const firstTab = createLearningStore(storage);
  const secondTab = createLearningStore(storage);
  firstTab.update(id, { completed: true });
  secondTab.update('01-introduction/02-ml-vs-dl', { progress: 0.4 });
  assert.equal(createLearningStore(storage).get().articles[id].completed, true);
  assert.equal(createLearningStore(storage).get().articles['01-introduction/02-ml-vs-dl'].progress, 0.4);
});

test('a full storage quota keeps subsequent updates in memory', () => {
  const store = createLearningStore({ getItem: () => null, setItem() { throw Error('QuotaExceededError'); } });
  store.update(id, { completed: true });
  store.update(id, { progress: 0.5 });
  assert.equal(store.get().articles[id].completed, true);
  assert.equal(store.get().articles[id].progress, 0.5);
  assert.equal(store.persistent, false);
});
