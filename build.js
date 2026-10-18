#!/usr/bin/env node
// Notebook static site generator: entries/*.md + src/catalog.json -> _site/
'use strict';
const fs = require('fs');
const path = require('path');
const { Marked } = require('marked');
const katex = require('katex');

const ROOT = __dirname;
const OUT = path.join(ROOT, process.env.OUT_DIR || '_site');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/catalog.json'), 'utf8'));
const REPO_URL = 'https://github.com/fitzyracing1/notebook';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let mathErrors = 0;
function tex(src, displayMode) {
  try {
    return katex.renderToString(src, { displayMode, throwOnError: true, strict: 'ignore' });
  } catch (e) {
    mathErrors++;
    console.error(`KaTeX error: ${e.message}\n  in: ${src}`);
    return `<code class="math-error">${esc(src)}</code>`;
  }
}

const marked = new Marked({ gfm: true });
marked.use({
  extensions: [
    {
      name: 'blockMath', level: 'block',
      start(src) { const i = src.indexOf('$$'); return i < 0 ? undefined : i; },
      tokenizer(src) {
        const m = /^ {0,3}\$\$([\s\S]+?)\$\$[ \t]*(?:\n|$)/.exec(src);
        if (m) return { type: 'blockMath', raw: m[0], text: m[1].trim() };
      },
      renderer(t) { return `<div class="math-display">${tex(t.text, true)}</div>\n`; },
    },
    {
      name: 'inlineMath', level: 'inline',
      start(src) { const i = src.indexOf('$'); return i < 0 ? undefined : i; },
      tokenizer(src) {
        let m = /^\$\$([\s\S]+?)\$\$/.exec(src);
        if (m) return { type: 'inlineMath', raw: m[0], text: m[1].trim(), display: true };
        // Pandoc-style rule so currency like "$4,433.96" or "$4.4k" stays literal:
        // opening $ must be followed by non-space, closing $ preceded by non-space
        // and not followed by a digit; no newline or bare $ inside.
        m = /^\$(?=\S)((?:\\\$|[^$\n])*?\S)\$(?!\d)/.exec(src);
        if (m && !/^(\d{1,3}(,\d{3})+(\.\d+)?|\d+(\.\d+)?k)(\s|$)/.test(m[1])) return { type: 'inlineMath', raw: m[0], text: m[1], display: false };
      },
      renderer(t) { return tex(t.text, t.display); },
    },
  ],
});

function parseEntry(slug) {
  const raw = fs.readFileSync(path.join(ROOT, 'entries', `${slug}.md`), 'utf8');
  const lines = raw.split('\n');
  const title = lines[0].replace(/^#\s+/, '').trim();
  const meta = {};
  let i = 1;
  for (; i < lines.length; i++) {
    const l = lines[i];
    const m = /^- \*\*(.+?):\*\*\s*(.*)$/.exec(l);
    if (m) { meta[m[1].toLowerCase()] = m[2].trim(); continue; }
    if (l.trim() === '') continue;
    break;
  }
  let body = lines.slice(i).join('\n');
  body = body
    .replace(/^## User messages \(verbatim\)/m, '## Joshua\'s messages (verbatim)')
    .replace(/^## Grok\s*$/m, '## Grok\'s response (as captured)')
    .replace(/\*Reviewer note:\*/g, '*Note:*');
  // Capture notes come from the curation pass; drop reviewer-workflow sentences.
  let note = meta['curation note'] || meta['capture note'] || '';
  note = note.replace(/\s*Reviewer (may|might)[^.]*\./g, '').replace(/^Kept[^.]*?(\.|:)\s*/,'').trim();
  note = note.charAt(0).toUpperCase() + note.slice(1);
  const date = (meta.date || '').replace(/\s*\(as listed in (the candidate CSV|math-physics\.csv)\)/, '');
  return { slug, title, url: meta.url, date, note, raw, body };
}

const entries = catalog.entries.map((e) => ({ ...e, ...parseEntry(e.slug) }));
const catTitle = Object.fromEntries(catalog.categories.map((c) => [c.id, c.title]));

const BADGES = {
  speculative: ['badge-spec', 'Speculative / personal construction'],
  exploratory: ['badge-expl', 'Exploratory'],
};
const badge = (e) => (e.status ? `<span class="badge ${BADGES[e.status][0]}">${BADGES[e.status][1]}</span>` : '') +
  (e.short ? '<span class="badge badge-short">Short capture</span>' : '');

function layout({ title, body, description }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || '')}">
<link rel="stylesheet" href="assets/katex/katex.min.css">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="site"><a class="brand" href="index.html">Notebook</a><span class="tag">Joshua Almeida's math &amp; physics explorations</span></header>
<main>
${body}
</main>
<footer class="site">
<p>Personal notes and explorations from Joshua Almeida's chats on grok.com. They are not peer reviewed, and the speculative pieces are labeled. <a href="${REPO_URL}">Source on GitHub</a> · MIT License</p>
</footer>
</body>
</html>
`;
}

function entryPage(e, idx) {
  const prev = entries[idx - 1], next = entries[idx + 1];
  const statusBox = e.statusNote ? `<aside class="callout callout-${e.status}"><strong>${BADGES[e.status][1]}.</strong> ${esc(e.statusNote.replace(/^[^.]*\.\s*/, ''))}</aside>` : '';
  const noteBox = e.note ? `<aside class="callout callout-note"><strong>Capture note.</strong> ${marked.parseInline(e.note)}</aside>` : '';
  const body = `
<nav class="crumbs"><a href="index.html">Notebook</a> › <a href="index.html#${e.category}">${esc(catTitle[e.category])}</a></nav>
<article>
<h1>${esc(e.title)}</h1>
<p class="meta">${e.date ? `Chat date: ${esc(e.date)} · ` : ''}<a href="${esc(e.url)}" rel="noopener">Original chat on grok.com ↗</a> · <a href="entries/${e.slug}.md">Raw capture (.md)</a></p>
<p class="badges">${badge(e)}</p>
${statusBox}
${noteBox}
${marked.parse(e.body)}
</article>
<nav class="pager">${prev ? `<a href="${prev.slug}.html">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="${next.slug}.html">${esc(next.title)} →</a>` : '<span></span>'}</nav>`;
  return layout({ title: `${e.title} · Notebook`, body, description: e.summary });
}

function indexPage() {
  const groups = catalog.categories.map((c) => {
    const items = entries.filter((e) => e.category === c.id);
    if (!items.length) return '';
    return `<section id="${c.id}"><h2>${esc(c.title)}</h2>${c.intro ? `<p class="cat-intro${items.every((e) => e.status === 'speculative') ? ' callout callout-speculative' : ''}">${esc(c.intro)}</p>` : ''}<ul class="entries">
${items.map((e) => `<li><a href="${e.slug}.html">${esc(e.title)}</a> ${badge(e)}<p>${esc(e.summary)}</p></li>`).join('\n')}
</ul></section>`;
  }).join('\n');
  const body = `
<section class="intro">
<h1>Notebook</h1>
<p>This is a collection of Joshua Almeida's math and physics explorations: ${entries.length} entries taken from his chats on <a href="https://grok.com">grok.com</a>. Each page shows his questions word for word, followed by the formulas, derivations and code from the reply. Every page links back to the original chat.</p>
<p>These are personal working notes, not a textbook. The replies are partly excerpted and condensed. Entries marked <span class="badge badge-spec">Speculative / personal construction</span> are invented frameworks or notations, including the whole <a href="#metric">2xc − d metric</a> section. Entries marked <span class="badge badge-expl">Exploratory</span> start from Joshua's own equations. Neither kind is established theory.</p>
</section>
${groups}`;
  return layout({ title: 'Notebook · Math & physics explorations', body, description: "Joshua Almeida's math & physics explorations from his Grok chats" });
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, f.name), d = path.join(dst, f.name);
    f.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets/katex'), { recursive: true });
const kd = path.dirname(require.resolve('katex/dist/katex.min.css'));
fs.copyFileSync(path.join(kd, 'katex.min.css'), path.join(OUT, 'assets/katex/katex.min.css'));
copyDir(path.join(kd, 'fonts'), path.join(OUT, 'assets/katex/fonts'));
fs.copyFileSync(path.join(ROOT, 'src/style.css'), path.join(OUT, 'assets/style.css'));
copyDir(path.join(ROOT, 'entries'), path.join(OUT, 'entries'));
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
entries.forEach((e, i) => fs.writeFileSync(path.join(OUT, `${e.slug}.html`), entryPage(e, i)));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log(`Built ${entries.length} entries + index into ${path.relative(ROOT, OUT)}/`);
if (mathErrors) { console.error(`${mathErrors} math rendering error(s)`); process.exit(1); }
