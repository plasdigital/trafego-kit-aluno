// Varredura por PALAVRA na Biblioteca do Meta (Chrome via Playwright, sem chave de API), em vez de por página.
// Serve para achar anunciante que ainda não conhecemos. Por padrão traz só anúncio de IMAGEM (estático).
// Uso: node 1-estudo-de-mercado/scripts/coletar.mjs "<termo>" --estudo <slug> [--midia image|video|all] [--rolagens 40]
//      → grava estudos/<slug>/dados-busca/<termo>.json. Todos os termos do estudo.json de uma vez: coletar-todos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { ESTUDO, CONFIG } from './estudo.mjs';

const SAIDA = path.join(ESTUDO, 'dados-busca');
fs.mkdirSync(SAIDA, { recursive: true });
const termo = process.argv[2];
if (!termo) { console.error('uso: node 1-estudo-de-mercado/scripts/coletar.mjs "<termo>" --estudo <slug> [--midia image] [--rolagens 40]'); process.exit(1); }
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const midia = arg('--midia', 'image');
const rolagens = Number(arg('--rolagens', 40));
const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${CONFIG.pais ?? 'BR'}&is_targeted_country=false&media_type=${midia}&q=${encodeURIComponent(termo)}&search_type=keyword_unordered`;

function achar(no, saida) {
  if (!no || typeof no !== 'object') return;
  if (no.ad_archive_id && no.snapshot) { saida.set(String(no.ad_archive_id), no); return; }
  for (const v of Array.isArray(no) ? no : Object.values(no)) achar(v, saida);
}
function normalizar(a) {
  const s = a.snapshot;
  return {
    ad_id: String(a.ad_archive_id), page_id: String(s.page_id || a.page_id), pagina: s.page_name,
    formato: s.display_format, ativo: a.is_active,
    inicio: a.start_date ? new Date(a.start_date * 1000).toISOString().slice(0, 10) : null,
    dias_no_ar: a.start_date ? Math.round((Date.now() / 1000 - a.start_date) / 86400) : null,
    variacoes: a.collation_count ?? null, plataformas: a.publisher_platform || [],
    texto: s.body?.text || null, titulo: s.title || null, cta: s.cta_text || null, cta_tipo: s.cta_type || null,
    destino: s.link_url || null,
    videos: (s.videos || []).map((v) => ({ video: v.video_hd_url || v.video_sd_url, capa: v.video_preview_image_url })),
    imagens: (s.images || []).map((i) => i.original_image_url || i.resized_image_url),
    cards: (s.cards || []).map((c) => ({ texto: c.body || null, titulo: c.title || null, imagem: c.original_image_url || c.resized_image_url || null, video: c.video_hd_url || c.video_sd_url || null, capa: c.video_preview_image_url || null })),
    link: `https://www.facebook.com/ads/library/?id=${a.ad_archive_id}`,
  };
}

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, locale: 'pt-BR' });
const p = await ctx.newPage();
const achados = new Map();
p.on('response', async (r) => {
  if (!r.url().includes('/api/graphql')) return;
  try { for (const linha of (await r.text()).split('\n')) { if (linha.trim()) achar(JSON.parse(linha), achados); } } catch {}
});
await p.goto(url, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(6000);
let parado = 0, antes = 0;
for (let i = 0; i < rolagens && parado < 4; i++) {
  await p.mouse.wheel(0, 5000); await p.waitForTimeout(1800);
  parado = achados.size === antes ? parado + 1 : 0; antes = achados.size;
}
for (const txt of await p.$$eval('script[type="application/json"]', (els) => els.map((e) => e.textContent))) {
  try { achar(JSON.parse(txt), achados); } catch {}
}
await b.close();
const anuncios = [...achados.values()].map(normalizar);
const nome = termo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
fs.writeFileSync(path.join(SAIDA, `${nome}.json`), JSON.stringify({ termo, midia, coletado_em: new Date().toISOString(), anuncios }, null, 2));
const paginas = new Set(anuncios.map((a) => a.page_id));
console.log(`${termo}: ${anuncios.length} anúncios de ${paginas.size} páginas`);
