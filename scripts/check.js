#!/usr/bin/env node
// Sanity checks on the built site in _site/.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', '_site');
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src/catalog.json'), 'utf8'));
let fail = 0;
const bad = (m) => { console.error('FAIL: ' + m); fail++; };

const mdFiles = fs.readdirSync(path.join(__dirname, '..', 'entries')).filter((f) => f.endsWith('.md'));
if (mdFiles.length !== catalog.entries.length) bad(`entries/ has ${mdFiles.length} files but catalog lists ${catalog.entries.length}`);
const cats = new Set(catalog.categories.map((c) => c.id));
const index = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');

for (const e of catalog.entries) {
  if (!cats.has(e.category)) bad(`${e.slug}: unknown category ${e.category}`);
  if (!e.summary) bad(`${e.slug}: missing summary`);
  if (e.status && !e.statusNote) bad(`${e.slug}: status without statusNote`);
  const f = path.join(OUT, `${e.slug}.html`);
  if (!fs.existsSync(f)) { bad(`${e.slug}.html not built`); continue; }
  const html = fs.readFileSync(f, 'utf8');
  if (!/href="https:\/\/grok\.com\/c\/[0-9a-f-]{36}"/.test(html)) bad(`${e.slug}: no grok.com chat link`);
  if (html.includes('math-error')) bad(`${e.slug}: KaTeX render error`);
  const text = html.replace(/<pre>[\s\S]*?<\/pre>/g, '').replace(/<code>[\s\S]*?<\/code>/g, '').replace(/<annotation[\s\S]*?<\/annotation>/g, '');
  const leftover = text.match(/\$(?=\S)[^$\n<]*?\S\$(?!\d)/);
  if (leftover) bad(`${e.slug}: unrendered math ${leftover[0]}`);
  // raw capture math count vs rendered KaTeX count (outside code blocks)
  const rawMd = fs.readFileSync(path.join(__dirname, '..', 'entries', `${e.slug}.md`), 'utf8').replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  if (/\$\$/.test(rawMd) && !html.includes('katex-display')) bad(`${e.slug}: display math not rendered`);
  if (!html.includes('Joshua&#39;s messages (verbatim)') && !html.includes("Joshua's messages (verbatim)")) bad(`${e.slug}: missing user messages section`);
  if (!index.includes(`href="${e.slug}.html"`)) bad(`index does not link ${e.slug}`);
  if (!fs.existsSync(path.join(OUT, 'entries', `${e.slug}.md`))) bad(`${e.slug}: raw capture not published`);
}
const METRIC = ['metric-for-all-computing', 'metric-dark-matter', 'metric-x-equation', 'metric-fmc-1d', 'metric-fibonacci-diode', 'half-integer-program'];
for (const s of METRIC) {
  const e = catalog.entries.find((x) => x.slug === s);
  if (!e) { bad(`metric entry ${s} missing from catalog`); continue; }
  if (e.category !== 'metric' || e.status !== 'speculative') bad(`${s}: must be in 'metric' group with speculative status`);
  const html = fs.readFileSync(path.join(OUT, `${s}.html`), 'utf8');
  if (!html.includes('callout-speculative')) bad(`${s}: missing speculative callout`);
}
const metricSection = (index.match(/<section id="metric">[\s\S]*?<\/section>/) || [''])[0];
if (!metricSection.includes('personal construction')) bad('index: metric section missing personal-construction heading');
if ((metricSection.match(/badge-spec/g) || []).length < METRIC.length) bad('index: metric entries not all labeled speculative');
const countMatch = index.match(/(\d+) entries taken from/);
if (!countMatch || Number(countMatch[1]) !== catalog.entries.length) bad(`index entry count ${countMatch && countMatch[1]} != ${catalog.entries.length}`);
const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
if (!readme.includes(`All ${catalog.entries.length} entries`)) bad(`README entry count is not ${catalog.entries.length}`);
for (const s of ['fold-calculus', 'upi-ternary', ...METRIC]) {
  const html = fs.readFileSync(path.join(OUT, `${s}.html`), 'utf8');
  if (!html.includes('Speculative / personal construction')) bad(`${s}: missing speculative label`);
}
if (fail) { console.error(`${fail} check(s) failed`); process.exit(1); }
console.log(`OK: ${catalog.entries.length} entries checked`);
