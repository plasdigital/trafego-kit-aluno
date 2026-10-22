// A parte do Google no estudo: as palavras mais procuradas e mais concorridas do nicho, com o lance da parte de cima
// da página. Lê um ou mais arquivos e grava estudos/<slug>/google-palavras.json, que o montar.mjs põe no painel.
// Aceita os dois jeitos de tirar esse dado, os dois sem custo:
//   · a saída do kit do Google: python3 google-ads/scripts/keyword_planner.py ideas ... > ideias.json
//     (exige acesso Basic na API; o Explorer não libera pesquisa de palavra-chave)
//   · o CSV que a tela do Planejador de palavras-chave baixa (Google Ads › Ferramentas › Planejador › Baixar ideias)
// Uso: node scripts/google-palavras.mjs --estudo <slug> <arquivo.json|arquivo.csv> [...]
import fs from 'node:fs';
import path from 'node:path';
import { ESTUDO } from './estudo.mjs';

const entradas = process.argv.slice(2);
if (!entradas.length) { console.error('uso: node scripts/google-palavras.mjs --estudo <slug> <arquivo.json|arquivo.csv> [...]'); process.exit(1); }

const NIVEL = { HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa', UNSPECIFIED: null, UNKNOWN: null };
const numero = (s) => {
  if (s == null || s === '') return null;
  const t = String(s).replace(/[^\d,.\-]/g, '');
  // "3,12" é decimal; "10.000" e "10,000" são milhar
  const v = Number(/,\d{1,2}$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : /^\d{1,3}(\.\d{3})+$/.test(t) ? t.replace(/\./g, '') : t.replace(/,/g, ''));
  return Number.isFinite(v) ? v : null;
};

function lerTexto(arq) {
  const b = fs.readFileSync(arq);
  if (b[0] === 0xff && b[1] === 0xfe) return b.toString('utf16le').slice(1);   // o CSV do Google vem em UTF-16
  return b.toString('utf8').replace(/^﻿/, '');
}

function doJson(texto) {
  const j = JSON.parse(texto);
  return (j.ideas ?? j.results ?? []).map((x) => ({
    palavra: x.keyword, buscas: x.avg_monthly_searches ?? null, concorrencia: NIVEL[x.competition] ?? null,
    indice: x.competition_index ?? null, lanceMin: x.low_top_of_page_bid ?? null, lanceMax: x.high_top_of_page_bid ?? null,
  }));
}

function doCsv(texto) {
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim());
  const sep = linhas.find((l) => l.includes('\t')) ? '\t' : linhas[0].includes(';') ? ';' : ',';
  const partir = (l) => l.split(sep).map((c) => c.replace(/^"|"$/g, '').trim());
  // a 1ª linha do arquivo é um título ("Keyword Stats ..."): o cabeçalho é a linha cuja 1ª coluna é só o nome
  const iCab = linhas.findIndex((l) => /^(keyword|palavra-chave)$/i.test(partir(l)[0]));
  if (iCab < 0) throw new Error('não achei a linha de cabeçalho (Keyword / Palavra-chave)');
  const cab = partir(linhas[iCab]);
  const col = (re) => cab.findIndex((c) => re.test(c));
  const c = {
    palavra: 0, buscas: col(/avg\.? monthly|m[eé]dia de pesquisas/i), concorrencia: col(/^(competition|concorr[eê]ncia)$/i),
    indice: col(/indexed|indexad/i), lanceMin: col(/low range|intervalo (menor|inferior)|m[ií]nim/i), lanceMax: col(/high range|intervalo (maior|superior)|m[aá]xim/i),
  };
  return linhas.slice(iCab + 1).map(partir).filter((x) => x[0]).map((x) => ({
    palavra: x[c.palavra], buscas: numero(x[c.buscas]), concorrencia: c.concorrencia >= 0 ? (NIVEL[x[c.concorrencia]?.toUpperCase()] ?? x[c.concorrencia] ?? null) : null,
    indice: numero(x[c.indice]), lanceMin: numero(x[c.lanceMin]), lanceMax: numero(x[c.lanceMax]),
  }));
}

const porPalavra = new Map();
for (const arq of entradas) {
  const texto = lerTexto(arq);
  const lidas = texto.trimStart().startsWith('{') ? doJson(texto) : doCsv(texto);
  for (const p of lidas) if (p.palavra && !porPalavra.has(p.palavra.toLowerCase())) porPalavra.set(p.palavra.toLowerCase(), p);
  console.log(`${path.basename(arq)}: ${lidas.length} palavras`);
}
const palavras = [...porPalavra.values()].sort((a, b) => (b.indice ?? -1) - (a.indice ?? -1) || (b.buscas ?? 0) - (a.buscas ?? 0));
fs.writeFileSync(path.join(ESTUDO, 'google-palavras.json'), JSON.stringify({ geradoEm: new Date().toISOString(), fontes: entradas.map((a) => path.basename(a)), palavras }, null, 1));
console.log(`${palavras.length} palavras → ${path.join(ESTUDO, 'google-palavras.json')}`);
