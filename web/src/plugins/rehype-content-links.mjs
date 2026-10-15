import { resolveContentLink } from '../utils/content-links.mjs';

/** Rewrite repository links using the original Markdown location provided by VFile. */
export default function rehypeContentLinks(options = {}) {
  return function transform(tree, file) {
    const sourcePath = file?.history?.[0] ?? file?.path;
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
        const href = resolveContentLink(node.properties.href, sourcePath, options);
        if (href === undefined) delete node.properties.href;
        else node.properties.href = href;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
