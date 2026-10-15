import test from 'node:test';
import assert from 'node:assert/strict';
import { markdownToSearchText, searchArticles } from '../src/utils/search.mjs';

const article = (title, content, description = '', href = '/article') => ({
  title, content, description, href, chapter: '机器学习',
});

test('finds a Chinese keyword that appears only in the article body', () => {
  const results = searchArticles([article('神经网络', '通过反向传播更新参数。')], '反向传播');
  assert.equal(results.length, 1);
  assert.match(results[0].snippet, /反向传播/);
});

test('matches English case and full-width characters consistently', () => {
  assert.equal(searchArticles([article('Transformer', 'Attention models')], 'ＡＴＴＥＮＴＩＯＮ').length, 1);
  assert.equal(searchArticles([article('Transformer', 'Attention models')], 'tRaNsFoRmEr').length, 1);
});

test('requires every query term, including terms distributed across fields', () => {
  const index = [article('注意力', '机制使用 softmax 计算权重。'), article('注意力', '卷积核。')];
  assert.deepEqual(searchArticles(index, '注意力  SOFTMAX').map((item) => item.content), ['机制使用 softmax 计算权重。']);
  assert.deepEqual(searchArticles(index, '注意力 不存在'), []);
});

test('ranks a title hit ahead of description and body hits', () => {
  const index = [
    article('卷积', 'Attention Attention Attention'),
    article('循环网络', '', 'Attention'),
    article('Attention 机制', '归一化权重。'),
  ];
  assert.deepEqual(searchArticles(index, 'attention').map((item) => item.title), ['Attention 机制', '循环网络', '卷积']);
});

test('returns a bounded body excerpt around a late keyword', () => {
  const content = `${'前言内容。'.repeat(80)}关键梯度用于参数更新。${'后续说明。'.repeat(80)}`;
  const [result] = searchArticles([article('优化方法', content)], '关键梯度');
  assert.match(result.snippet, /关键梯度用于参数更新/);
  assert.ok(result.snippet.startsWith('…'));
  assert.ok(result.snippet.endsWith('…'));
  assert.ok(result.snippet.length <= 162);
});

test('uses the description when a title-only match has no body keyword', () => {
  const [result] = searchArticles([article('决策树', '正文解释分裂方法。', '用树结构进行预测。')], '决策树');
  assert.equal(result.snippet, '用树结构进行预测。');
});

test('returns no results for an empty query or a nonpositive limit', () => {
  const index = [article('机器学习', '学习算法')];
  assert.deepEqual(searchArticles(index, '  \n '), []);
  assert.deepEqual(searchArticles(index, '学习', 0), []);
  assert.deepEqual(searchArticles(index, '学习', -1), []);
});

test('limits results after ranking without mutating index entries', () => {
  const index = Array.from({ length: 25 }, (_, i) => Object.freeze(article(`学习 ${i}`, '学习算法')));
  const frozenIndex = Object.freeze(index);
  assert.equal(searchArticles(frozenIndex, '学习').length, 20);
  assert.equal(searchArticles(frozenIndex, '学习', 3).length, 3);
  assert.equal(index[0].snippet, undefined);
  assert.equal(index[0].title, '学习 0');
});

test('treats punctuation as literal search text without constructing a regex', () => {
  assert.equal(searchArticles([article('C++', 'array[index]')], 'C++ [index]').length, 1);
});

test('extracts readable text without indexing Markdown destinations or HTML', () => {
  const source = `---\ntitle: hidden frontmatter\n---\n# 神经网络\n\n**学习** [梯度](https://hidden.example) 与 ![网络图](hidden.png)。\n\n> 引用说明\n\n\`\`\`python\nlearning_rate = 0.1\n\`\`\`\n\n<table><tr><td>参数 &amp; 权重</td></tr></table>\n<script>hiddenScript()</script>\n<!-- hidden comment -->`;
  const text = markdownToSearchText(source);
  assert.match(text, /神经网络 学习 梯度 与 网络图。/);
  assert.match(text, /learning_rate = 0.1/);
  assert.match(text, /参数 & 权重/);
  assert.doesNotMatch(text, /hidden|https:|<|```|\*\*/);
});
