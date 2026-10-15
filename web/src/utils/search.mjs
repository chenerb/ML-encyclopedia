/**
 * @typedef {{ title: string, description: string, content: string, chapter: string, href: string }} SearchArticle
 */

/** @param {string} text */
function normalize(text) {
  return text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** @param {string} text @param {string[]} terms */
function excerpt(text, terms) {
  const readable = text.normalize('NFKC').replace(/\s+/g, ' ').trim();
  const positions = terms.map((term) => readable.toLowerCase().indexOf(term)).filter((position) => position >= 0);
  const firstHit = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, firstHit - 45);
  const end = Math.min(readable.length, start + 160);
  return `${start ? '…' : ''}${readable.slice(start, end).trim()}${end < readable.length ? '…' : ''}`;
}

/**
 * Every whitespace-separated term must occur in the title, description, or body.
 * Title matches rank first, followed by description matches and source order.
 * @param {ReadonlyArray<SearchArticle>} index
 * @param {string} query
 * @param {number} [limit=20]
 * @returns {(SearchArticle & { snippet: string })[]}
 */
export function searchArticles(index, query, limit = 20) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery || limit <= 0) return [];
  const terms = [...new Set(normalizedQuery.split(' '))];
  const size = Number.isFinite(limit) ? Math.floor(limit) : 20;

  return index
    .map((article, position) => {
      const title = normalize(article.title);
      const description = normalize(article.description);
      const content = normalize(article.content);
      if (!terms.every((term) => title.includes(term) || description.includes(term) || content.includes(term))) return null;
      return {
        article,
        position,
        phraseInTitle: Number(title.includes(normalizedQuery)),
        titleMatches: terms.filter((term) => title.includes(term)).length,
        descriptionMatches: terms.filter((term) => description.includes(term)).length,
        snippet: excerpt(
          terms.some((term) => content.includes(term)) ? article.content : article.description || article.content,
          terms,
        ),
      };
    })
    .filter((match) => match !== null)
    .sort((a, b) => b.phraseInTitle - a.phraseInTitle || b.titleMatches - a.titleMatches || b.descriptionMatches - a.descriptionMatches || a.position - b.position)
    .slice(0, size)
    .map(({ article, snippet }) => ({ ...article, snippet }));
}

/** Keep readable prose and code while dropping Markdown and HTML structure.
 * @param {string} markdown
 */
export function markdownToSearchText(markdown) {
  return markdown
    .replace(/^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*(?:`{3,}|~{3,}).*$/gm, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/^\s*\[[^\]]+\]:\s*.*$/gm, ' ')
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, ' ')
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s*|[-+*]\s+|\d+[.)]\s+)/gm, '')
    .replace(/`+/g, '')
    .replace(/\*{1,3}|~{2}/g, '')
    .replace(/(?<!\w)_+|_+(?!\w)/g, '')
    .replace(/\|/g, ' ')
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, (entity) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ' })[entity] ?? entity)
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => {
      const value = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : parseInt(code, 10);
      return value <= 0x10ffff ? String.fromCodePoint(value) : ' ';
    })
    .replace(/\s+/g, ' ')
    .trim();
}
