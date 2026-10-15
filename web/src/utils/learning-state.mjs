const STORAGE_KEY = 'ml-encyclopedia:learning:v1';
const validId = value => typeof value === 'string' && /^\d{2}-[a-z0-9-]+\/(?:[a-z0-9-]+\/)?[a-z0-9-]+$/.test(value);
const clamp = value => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

export function parseLearningState(serialized) {
  const empty = { version: 1, lastArticleId: null, articles: {} };
  try {
    const value = JSON.parse(serialized);
    if (value?.version !== 1 || !value.articles || typeof value.articles !== 'object' || Array.isArray(value.articles)) return empty;
    for (const [id, record] of Object.entries(value.articles)) {
      if (!validId(id) || !record || typeof record !== 'object') continue;
      empty.articles[id] = {
        progress: clamp(record.progress),
        completed: record.completed === true,
        updatedAt: Number.isFinite(record.updatedAt) ? record.updatedAt : 0,
      };
    }
    if (Object.hasOwn(empty.articles, value.lastArticleId)) empty.lastArticleId = value.lastArticleId;
  } catch { /* A damaged or unavailable record must never prevent reading. */ }
  return empty;
}

export function updateArticle(state, id, patch, now = Date.now()) {
  if (!validId(id)) return state;
  const previous = state.articles[id] ?? { progress: 0, completed: false };
  const record = {
    progress: patch.progress === undefined ? previous.progress : clamp(patch.progress),
    completed: typeof patch.completed === 'boolean' ? patch.completed : previous.completed,
    updatedAt: now,
  };
  return { version: 1, lastArticleId: id, articles: { ...state.articles, [id]: record } };
}

export function getReadingProgress(scrollY, articleTop, articleHeight, viewportHeight, topOffset = 96) {
  return clamp((scrollY + topOffset - articleTop) / Math.max(1, articleHeight - viewportHeight + topOffset));
}

export function createLearningStore(storage) {
  let state = parseLearningState(null);
  let persistent = true;
  try {
    storage ??= window.localStorage;
    state = parseLearningState(storage.getItem(STORAGE_KEY));
  } catch { persistent = false; }
  return {
    get persistent() { return persistent; },
    get: () => state,
    update(id, patch) {
      // Merge from the latest persisted record: another tab may have just finished a lesson.
      if (persistent) {
        try { state = parseLearningState(storage.getItem(STORAGE_KEY)); }
        catch { persistent = false; }
      }
      state = updateArticle(state, id, patch);
      try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch { persistent = false; }
      return state;
    },
  };
}
