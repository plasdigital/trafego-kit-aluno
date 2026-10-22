// Escolhe os anúncios do estudo: das páginas em selecao-paginas.json (os concorrentes que a IA separou na
// triagem), os anúncios distintos no ar há 30+ dias, do mais antigo para o mais novo, até N por anunciante
// (limitePorGrupo do estudo.json, pelo grupo que a IA deu a cada página; senão limitePorAnunciante).
// Vaga de emprego fica de fora.
// Uso: node 1-estudo-de-mercado/scripts/selecionar.mjs --estudo <slug>  → grava estudo-ids.txt
import fs from 'node:fs';
import path from 'node:path';
import { ESTUDO, CONFIG } from './estudo.mjs';

const AQUI = ESTUDO;
const triagem = JSON.parse(fs.readFileSync(path.join(AQUI, 'triagem.json'), 'utf8'));
const sel = JSON.parse(fs.readFileSync(path.join(AQUI, 'selecao-paginas.json'), 'utf8'));
const LIMITE = CONFIG.limitePorGrupo ?? {};
const VAGA = /\bvaga(s)? (aberta|de emprego|para)|estamos contratando|trabalhe conosco|vaga coordenador/i;

const ids = [];
for (const p of triagem.paginas) {
  const s = sel[p.page_id];
  if (!s) continue;
  const bons = p.anuncios.filter((a) => !VAGA.test(`${a.titulo} ${a.texto}`) && !/\{\{product/.test(`${a.titulo} ${a.texto}`));
  ids.push(...bons.slice(0, LIMITE[s.nicho] ?? CONFIG.limitePorAnunciante ?? 2).map((a) => a.ad_id));
}
fs.writeFileSync(path.join(AQUI, 'estudo-ids.txt'), ids.join('\n'));
console.error(`${ids.length} anúncios de ${Object.keys(sel).length} páginas`);
