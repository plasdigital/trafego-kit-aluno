// Visita a página de destino (LP ou formulário externo) de cada anúncio do estudo, no Chrome local (Playwright, grátis),
// como o celular vê: tira o print da página inteira e lê título, seções, botões, para onde a página leva
// (WhatsApp, agenda, formulário) e as perguntas do formulário. Grava em estudos/<slug>/paginas/<página>/:
// mobile.jpg (página inteira), topo.jpg (a primeira tela) e pagina.json (o que foi lido).
// Uso: node 1-estudo-de-mercado/scripts/paginas.mjs --estudo <slug> [--refazer] [--so <regex do endereço>] [--urls <arquivo com uma URL por linha>]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { canalDe, enderecoLimpo } from './canal.mjs';
import { ESTUDO } from './estudo.mjs';

const AQUI = ESTUDO;
const SAIDA = path.join(AQUI, 'paginas');
const refazer = process.argv.includes('--refazer');
export const slugDe = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80).toLowerCase();

const ids = new Set(fs.readFileSync(path.join(AQUI, 'estudo-ids.txt'), 'utf8').split(/\s+/).filter(Boolean));
const urls = new Set();
// --urls <arquivo>: uma URL por linha (as LPs dos anúncios do Google, que vêm de google/montar-google.mjs)
const listaUrls = process.argv.includes('--urls') ? process.argv[process.argv.indexOf('--urls') + 1] : null;
if (listaUrls) for (const u of fs.readFileSync(listaUrls, 'utf8').split(/\s+/).filter(Boolean)) urls.add(u);
else for (const f of fs.readdirSync(path.join(AQUI, 'dados-busca'))) {
  for (const a of JSON.parse(fs.readFileSync(path.join(AQUI, 'dados-busca', f), 'utf8')).anuncios) {
    if (ids.has(a.ad_id) && ['Site/LP', 'Formulário externo'].includes(canalDe(a))) urls.add(enderecoLimpo(a.destino));
  }
}

// Lido dentro da página: tudo que diz o que a LP promete e para onde ela leva
function ler() {
  const txt = (el) => (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
  const visivel = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const titulos = [...document.querySelectorAll('h1,h2,h3')].filter(visivel).map((h) => ({ n: h.tagName, t: txt(h) })).filter((h) => h.t).slice(0, 40);
  const links = [...document.querySelectorAll('a[href]')].map((a) => ({ t: txt(a).slice(0, 80), href: a.href }));
  const botoes = [...document.querySelectorAll('a,button,input[type=submit]')].filter(visivel)
    .map((b) => txt(b) || b.value || '').filter((t) => t && t.length < 60);
  const zap = links.filter((l) => /wa\.me|whatsapp\.com/.test(l.href)).map((l) => {
    try { const u = new URL(l.href); return { botao: l.t, mensagem: u.searchParams.get('text') || null }; } catch { return { botao: l.t, mensagem: null }; }
  });
  const agenda = links.filter((l) => /calendly|cal\.com|agendor|meetings\.hubspot|tidycal|zcal|google\.com\/calendar/.test(l.href)).map((l) => l.href);
  const campos = [...document.querySelectorAll('input,select,textarea')].filter((c) => visivel(c) && !['hidden', 'submit', 'button'].includes(c.type)).map((c) => {
    const rotulo = (c.id && txt(document.querySelector(`label[for="${CSS.escape(c.id)}"]`))) || txt(c.closest('label')) || c.placeholder || c.getAttribute('aria-label') || c.name || '';
    return { tipo: c.tagName === 'SELECT' ? 'escolha' : c.type || c.tagName.toLowerCase(), rotulo: rotulo.slice(0, 120), opcoes: c.tagName === 'SELECT' ? [...c.options].map((o) => txt(o)).filter(Boolean).slice(0, 15) : undefined };
  });
  const iframes = [...document.querySelectorAll('iframe')].map((f) => f.src).filter(Boolean);
  const videos = iframes.filter((s) => /youtube|vimeo|pandavideo|vturb|wistia|player/.test(s)).length + document.querySelectorAll('video').length;
  const corpo = txt(document.body);
  return {
    titulo: document.title, descricao: document.querySelector('meta[name=description]')?.content || null,
    titulos, botoes: [...new Set(botoes)].slice(0, 40), whatsapp: zap, agenda: [...new Set(agenda)], campos, iframes: iframes.slice(0, 10), videos,
    precos: [...new Set(corpo.match(/R\$\s?[\d.,]+(\s?(mil|\/m[eê]s|por m[eê]s))?/gi) || [])].slice(0, 10),
    texto: corpo.slice(0, 12000), altura: document.documentElement.scrollHeight,
  };
}

// Formulário de várias telas (Typeform, Respondi, Yay, Advforms): só a 1ª pergunta aparece na tela, mas todas
// vêm no código da página. Lemos de lá, sem preencher nem enviar nada (enviar viraria um lead falso no concorrente).
function perguntasDoHtml(html) {
  const limpo = html.replace(/\u002F/g, '/').replace(/\u003C/g, '<').replace(/\\"/g, "'");
  const achadas = [];
  const pegar = (t) => {
    t = t.replace(/<[^>]+>/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
    if (t.length > 6 && t.length < 220 && /[a-zà-ú]{3}/i.test(t) && !/https?:|[{}]|function|\.png|\.jpg/.test(t) && !achadas.includes(t)) achadas.push(t);
  };
  for (const m of limpo.matchAll(/"(?:title|question|label)"\s*:\s*"([^"]{4,200})"/g)) pegar(m[1]);
  for (const m of limpo.matchAll(/[A-ZÀ-ÚÉ¿][^"<>{}\\]{8,200}\?/g)) pegar(m[0]);
  // as faixas de resposta (faturamento, verba) dizem quem o concorrente quer filtrar
  for (const m of limpo.matchAll(/(?:Até|Acima de|Mais de|Entre|De|Menos de)\s?R?\$?\s?\d[\d.,]*\s?(?:mil|k|milh[õo]es)?[^"<>{}\\]{0,40}/gi)) pegar(m[0]);
  return achadas.slice(0, 60);
}
const so = process.argv.includes('--so') ? new RegExp(process.argv[process.argv.indexOf('--so') + 1]) : null;

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'pt-BR',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
});
let feitas = 0;
for (const url of urls) {
  const dir = path.join(SAIDA, slugDe(url));
  if (so && !so.test(url)) continue;
  if (!refazer && !so && fs.existsSync(path.join(dir, 'pagina.json'))) continue;
  fs.mkdirSync(dir, { recursive: true });
  const p = await ctx.newPage();
  try {
    const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(dir, 'topo.jpg'), type: 'jpeg', quality: 70 });
    // rola até o fim para carregar imagem preguiçosa e animação de entrada
    for (let y = 0, h = 1; y < h && y < 30000; y += 700) { h = await p.evaluate((yy) => { scrollTo(0, yy); return document.documentElement.scrollHeight; }, y); await p.waitForTimeout(250); }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
    const lido = await p.evaluate(ler);
    const html = await p.content();
    const perguntas = lido.altura < 1200 || /typeform|respondi|yayforms|advforms|form/.test(url) ? perguntasDoHtml(html) : [];
    await p.screenshot({ path: path.join(dir, 'mobile.jpg'), type: 'jpeg', quality: 60, fullPage: true, clip: { x: 0, y: 0, width: 390, height: Math.min(lido.altura, 16000) } }).catch(() => p.screenshot({ path: path.join(dir, 'mobile.jpg'), type: 'jpeg', quality: 60, fullPage: true }));
    fs.writeFileSync(path.join(dir, 'pagina.json'), JSON.stringify({ url, final: p.url(), status: r?.status() ?? null, lidoEm: new Date().toISOString(), ...lido, perguntas }, null, 1));
    console.log('ok', r?.status(), url);
  } catch (e) {
    fs.writeFileSync(path.join(dir, 'pagina.json'), JSON.stringify({ url, erro: String(e.message).slice(0, 300), lidoEm: new Date().toISOString() }, null, 1));
    console.log('ERRO', url, String(e.message).slice(0, 120));
  }
  await p.close();
  feitas++;
}
await b.close();
console.log(`${feitas} páginas lidas de ${urls.size} → ${SAIDA}`);
