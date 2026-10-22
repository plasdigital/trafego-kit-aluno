// Junta tudo que a busca por palavra trouxe (dados-busca/), tira as cópias e agrupa por anunciante, para a IA
// decidir quem é concorrente de verdade (vende o mesmo, para o mesmo cliente). Só conta anúncio no ar há --min-dias
// (padrão: minDias do estudo.json, ou 30): anúncio novo pode ser teste que morre amanhã.
// Uso: node 1-estudo-de-mercado/scripts/triagem.mjs --estudo <slug> [--min-dias 30]  → grava triagem.json
import fs from 'node:fs';
import path from 'node:path';
import { ESTUDO, CONFIG } from './estudo.mjs';

const DADOS = path.join(ESTUDO, 'dados-busca');
const i = process.argv.indexOf('--min-dias');
const minDias = i > 0 ? Number(process.argv[i + 1]) : (CONFIG.minDias ?? 30);

const porId = new Map();
for (const f of fs.readdirSync(DADOS)) {
  const { termo, anuncios } = JSON.parse(fs.readFileSync(path.join(DADOS, f), 'utf8'));
  for (const a of anuncios) {
    const x = porId.get(a.ad_id) ?? { ...a, termos: [] };
    x.termos.push(termo);
    porId.set(a.ad_id, x);
  }
}
const chave = (a) => [a.formato, (a.titulo || '').trim().toLowerCase(), (a.texto || '').replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 160)].join('|');
const paginas = new Map();
for (const a of porId.values()) {
  const p = paginas.get(a.page_id) ?? { page_id: a.page_id, pagina: a.pagina, ativos: 0, grupos: new Map(), termos: new Set() };
  p.ativos++;
  a.termos.forEach((t) => p.termos.add(t));
  const k = chave(a);
  const g = p.grupos.get(k);
  if (!g) p.grupos.set(k, { a, copias: 1 });
  else { g.copias++; if (a.dias_no_ar > g.a.dias_no_ar) g.a = a; }
  paginas.set(a.page_id, p);
}
const saida = [...paginas.values()]
  .map((p) => {
    const velhos = [...p.grupos.values()].filter((g) => g.a.dias_no_ar >= minDias).sort((x, y) => y.a.dias_no_ar - x.a.dias_no_ar);
    return {
      page_id: p.page_id, pagina: p.pagina, ativos: p.ativos, distintos: p.grupos.size, velhos: velhos.length,
      max_dias: velhos[0]?.a.dias_no_ar ?? 0, termos: [...p.termos],
      anuncios: velhos.map((g) => ({ ad_id: g.a.ad_id, dias: g.a.dias_no_ar, formato: g.a.formato, copias: g.copias, variacoes: g.a.variacoes,
        titulo: g.a.titulo, cta: g.a.cta, destino: g.a.destino, texto: (g.a.texto || '').replace(/\s+/g, ' ').slice(0, 260) })),
    };
  })
  .filter((p) => p.velhos > 0)
  .sort((a, b) => b.velhos - a.velhos || b.max_dias - a.max_dias);
fs.writeFileSync(path.join(ESTUDO, 'triagem.json'), JSON.stringify({ minDias, gerado_em: new Date().toISOString(), coletados: porId.size, paginas: saida }, null, 2));
console.log(`${porId.size} anúncios coletados; ${saida.length} páginas com anúncio de ${minDias}+ dias; ${saida.reduce((s, p) => s + p.velhos, 0)} anúncios distintos`);
