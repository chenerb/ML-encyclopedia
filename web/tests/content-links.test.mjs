import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const options = { base: '/ML-encyclopedia', repoRoot };
const cnnSource = path.join(repoRoot, 'docs/05-deep-learning/01-cnn/01-introduction.md');
const rootSource = path.join(repoRoot, 'README.md');

async function links() {
  try {
    return await import('../src/utils/content-links.mjs');
  } catch (error) {
    assert.fail(`Content-link implementation must be available: ${error.message}`);
  }
}

// Catches resolving relative to the browser route instead of the Markdown source.
test('resolves nested fifth-chapter siblings and cross-chapter articles', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('02-convolution-layer.md', cnnSource, options),
    '/ML-encyclopedia/docs/05-deep-learning/01-cnn/02-convolution-layer/');
  assert.equal(resolveContentLink('../../06-milestone-models/01-alexnet.md', cnnSource, options),
    '/ML-encyclopedia/docs/06-milestone-models/01-alexnet/');
});

test('resolves flat exam filenames from nested fifth-chapter source', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('../../../exams/05-deep-learning/01-cnn-01-introduction-题目.md', cnnSource, options),
    '/ML-encyclopedia/exams/05-deep-learning/01-cnn-01-introduction-%E9%A2%98%E7%9B%AE/');
});

test('decodes Chinese filenames once and preserves query and fragment verbatim', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('01-introduction/%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C-%E9%A2%98%E7%9B%AE.md?mode=review#%E9%80%89%E6%8B%A9%E9%A2%98', path.join(repoRoot, 'exams/README.md'), options),
    '/ML-encyclopedia/exams/01-introduction/%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C-%E9%A2%98%E7%9B%AE/?mode=review#%E9%80%89%E6%8B%A9%E9%A2%98');
});

test('maps the exam README to its directory landing page', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('exams/README.md#目录', rootSource, options), '/ML-encyclopedia/exams/#目录');
});

test('retains external URLs, page anchors and query-only references', async () => {
  const { resolveContentLink } = await links();
  for (const href of ['https://example.org/paper.md?q=1#x', '//example.org/a.md', 'mailto:hello@example.org', 'tel:+1234', '#核心原理', '?mode=review#核心原理']) {
    assert.equal(resolveContentLink(href, cnnSource, options), href);
  }
});

test('adds the deployment base once to root-relative site routes', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('/docs/01-introduction/01-what-is-ml/', cnnSource, options),
    '/ML-encyclopedia/docs/01-introduction/01-what-is-ml/');
  assert.equal(resolveContentLink('/ML-encyclopedia/exams/01-introduction/章节测验-题目/?mode=review#题目', cnnSource, options),
    '/ML-encyclopedia/exams/01-introduction/章节测验-题目/?mode=review#题目');
});

test('supports a root deployment and a trailing-slash deployment base', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('02-convolution-layer.md', cnnSource, { ...options, base: '/' }),
    '/docs/05-deep-learning/01-cnn/02-convolution-layer/');
  assert.equal(resolveContentLink('02-convolution-layer.md', cnnSource, { ...options, base: '/ML-encyclopedia/' }),
    '/ML-encyclopedia/docs/05-deep-learning/01-cnn/02-convolution-layer/');
});

test('sends unsupported local Markdown and code files to their GitHub blob', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('glossary/index.md#数学基础', rootSource, options),
    'https://github.com/chenerb/ML-encyclopedia/blob/main/glossary/index.md#数学基础');
  assert.equal(resolveContentLink('examples/python/linear_regression.py', rootSource, options),
    'https://github.com/chenerb/ML-encyclopedia/blob/main/examples/python/linear_regression.py');
  assert.equal(resolveContentLink('docs/superpowers/specs/design.md', rootSource, options),
    'https://github.com/chenerb/ML-encyclopedia/blob/main/docs/superpowers/specs/design.md');
});

test('sends local directories without web pages to their GitHub tree', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('glossary/', rootSource, options),
    'https://github.com/chenerb/ML-encyclopedia/tree/main/glossary/');
});

test('refuses repository traversal even when dot segments are percent encoded', async () => {
  const { resolveContentLink } = await links();
  for (const href of ['../outside.md', '%2e%2e/outside.md', '%00broken.md']) {
    assert.equal(resolveContentLink(href, rootSource, options), undefined);
  }
  assert.equal(resolveContentLink('article.md', path.join(repoRoot, '../outside.md'), options), undefined);
});

test('leaves relative links untouched when no Markdown source is available', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('article.md', undefined, options), 'article.md');
});

test('maps regular and flattened deep-learning exams back to their exact lesson', async () => {
  const { examToArticleId } = await links();
  assert.equal(examToArticleId('03-traditional-ml/01-linear-regression-题目'), '03-traditional-ml/01-linear-regression');
  assert.equal(examToArticleId('05-deep-learning/01-cnn-01-introduction-答案解析.md'), '05-deep-learning/01-cnn/01-introduction');
  assert.equal(examToArticleId('05-deep-learning/03-transformer-02-attention-mechanism-题目'), '05-deep-learning/03-transformer/02-attention-mechanism');
  assert.equal(examToArticleId('05-deep-learning/05-autoencoders-02-variational-autoencoders-题目'), '05-deep-learning/05-autoencoders/02-variational-autoencoders');
  assert.equal(examToArticleId('05-deep-learning/章节测验-题目'), undefined);
  assert.equal(examToArticleId('03-traditional-ml/压力面-答案解析'), undefined);
});

test('builds safe encoded exam routes from a collection ID', async () => {
  const { examPath } = await links();
  assert.equal(examPath('01-introduction/章节测验-题目.md', '/ML-encyclopedia/'),
    '/ML-encyclopedia/exams/01-introduction/%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C-%E9%A2%98%E7%9B%AE/');
  assert.equal(examPath('01-introduction/01-what-is-ml-题目', '/'),
    '/exams/01-introduction/01-what-is-ml-%E9%A2%98%E7%9B%AE/');
  assert.equal(examPath('../README', '/'), undefined);
});

test('rehype uses the original history path and visits nested anchor nodes only', async () => {
  const { default: rehypeContentLinks } = await import('../src/plugins/rehype-content-links.mjs');
  const link = { type: 'element', tagName: 'a', properties: { href: '02-convolution-layer.md' }, children: [] };
  const image = { type: 'element', tagName: 'img', properties: { src: 'diagram.png' }, children: [] };
  const tree = { type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children: [link, image] }] };
  rehypeContentLinks(options)(tree, { history: [cnnSource], path: rootSource });
  assert.equal(link.properties.href, '/ML-encyclopedia/docs/05-deep-learning/01-cnn/02-convolution-layer/');
  assert.equal(image.properties.src, 'diagram.png');
});

test('rehype falls back to file.path and removes escaped href targets', async () => {
  const { default: rehypeContentLinks } = await import('../src/plugins/rehype-content-links.mjs');
  const unsafe = { type: 'element', tagName: 'a', properties: { href: '../outside.md' }, children: [] };
  const exam = { type: 'element', tagName: 'a', properties: { href: 'exams/README.md' }, children: [] };
  const tree = { type: 'root', children: [unsafe, exam] };
  rehypeContentLinks(options)(tree, { path: rootSource });
  assert.equal(Object.hasOwn(unsafe.properties, 'href'), false);
  assert.equal(exam.properties.href, '/ML-encyclopedia/exams/');
});

test('a second rewrite preserves already encoded exam routes exactly', async () => {
  const { resolveContentLink } = await links();
  const first = resolveContentLink('../../../exams/05-deep-learning/01-cnn-01-introduction-题目.md', cnnSource, options);
  assert.equal(resolveContentLink(first, cnnSource, options), first);
});

test('normalizes dot segments before applying the base to web routes', async () => {
  const { resolveContentLink } = await links();
  assert.equal(resolveContentLink('/ML-encyclopedia/docs/../../docs/01-introduction/', cnnSource, options),
    '/ML-encyclopedia/docs/01-introduction/');
});
