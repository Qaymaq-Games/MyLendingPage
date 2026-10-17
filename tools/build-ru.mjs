// Builds ru/index.html from index.html and the EN/RU dictionary in js/site.js,
// so search engines get real Russian text at /ru without running JavaScript.
// Run after changing index.html or the T dictionary:  node tools/build-ru.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const js = readFileSync(join(root, "js", "site.js"), "utf8");

const start = js.indexOf("const T = {");
const end = js.indexOf("\n  };", start);
if (start < 0 || end < 0) throw new Error("T dictionary not found in js/site.js");
const T = new Function(js.slice(start, end + 5) + "\nreturn T;")();
const ru = (key) => (T[key] ? T[key][1] : null);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let out = html;
let missing = [];
// plain-text elements
out = out.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, key, inner, close) => {
  const v = ru(key);
  if (v == null) { missing.push(key); return m; }
  return open + esc(v) + close;
});
// elements whose value is markup
out = out.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, key, inner, close) => {
  const v = ru(key);
  return v == null ? m : open + v + close;
});

const site = "https://www.qaymaqgames.com";
const title = "Qaymaq Games | Инди-студия из Самарканда";
const desc = "Qaymaq Games — инди-студия из Самаркандской области, Узбекистан. Играйте в The Knight and the Hamster в Google Play, следите за Doom's Day и попробуйте сломать печать на нашей следующей игре.";
const ogDesc = "Маленькие идеи, большие миры. Инди-игры для смартфонов и ПК из Самаркандской области, Узбекистан.";
const swap = (re, to) => { if (!re.test(out)) throw new Error("head pattern not found: " + re); out = out.replace(re, to); };
swap(/<html lang="en">/, '<html lang="ru">');
swap(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
swap(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);
swap(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${site}/ru">`);
swap(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${site}/ru">`);
swap(/<meta property="og:locale" content="en_US">\s*<meta property="og:locale:alternate" content="ru_RU">/, '<meta property="og:locale" content="ru_RU">\n  <meta property="og:locale:alternate" content="en_US">');
swap(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
swap(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(ogDesc)}">`);
swap(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title}">`);
swap(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(ogDesc)}">`);
swap(/<button type="button" data-lang="en" aria-pressed="true">/, '<button type="button" data-lang="en" aria-pressed="false">');
swap(/<button type="button" data-lang="ru" aria-pressed="false">/, '<button type="button" data-lang="ru" aria-pressed="true">');

mkdirSync(join(root, "ru"), { recursive: true });
writeFileSync(join(root, "ru", "index.html"), out);
missing = [...new Set(missing)];
console.log("ru/index.html written" + (missing.length ? "; keys without RU text: " + missing.join(", ") : ""));
