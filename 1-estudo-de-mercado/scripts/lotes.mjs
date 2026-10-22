// Divide o trabalho de análise em lotes, um por agente (ou por rodada da conversa), para a IA não ler 150 anúncios
// de uma vez. Só entra no lote o que ainda não tem análise, então dá para rodar de novo depois de uma coleta nova.
//   anuncios → lote-N.txt      (ids de estudo-ids.txt sem análise em analise-lote-*.json)
//   paginas  → lote-pag-N.json (páginas lidas pelo paginas.mjs sem análise em analise-paginas-*.json, com os
//                               anúncios que levam a cada uma; precisa do montar.mjs ter rodado, que dá os códigos)
// Uso: node scripts/lotes.mjs anuncios|paginas --estudo <slug> [--tamanho 20]
import fs from 'node:fs';
import path from 'node:path';
import { ESTUDO } from './estudo.mjs';
import { canalDe, enderecoLimpo } from './canal.mjs';

const modo = process.argv[2];
const i = process.argv.indexOf('--tamanho');
const tamanho = i > 0 ? Number(process.argv[i + 1]) : modo === 'paginas' ? 12 : 20;
const ler = (f) => JSON.parse(fs.readFileSync(path.join(ESTUDO, f), 'utf8'));
const arquivos = (re) => fs.readdirSync(ESTUDO).filter((f) => re.test(f));
const proximoNumero = (re) => Math.max(0, ...arquivos(re).map((f) => Number(f.match(/(\d+)\./)[1]))) + 1;
const fatiar = (lista) => Array.from({ length: Math.ceil(lista.length / tamanho) }, (_, k) => lista.slice(k * tamanho, (k + 1) * tamanho));

if (modo === 'anuncios') {
  const feitos = new Set(arquivos(/^analise-lote-\d+\.json$/).flatMap((f) => ler(f).anuncios.map((a) => a.ad_id)));
  const ja = new Set(arquivos(/^lote-\d+\.txt$/).flatMap((f) => fs.readFileSync(path.join(ESTUDO, f), 'utf8').split(/\s+/)));
  const faltam = fs.readFileSync(path.join(ESTUDO, 'estudo-ids.txt'), 'utf8').split(/\s+/).filter((id) => id && !feitos.has(id) && !ja.has(id));
  let n = proximoNumero(/^lote-\d+\.txt$/);
  for (const lote of fatiar(faltam)) { fs.writeFileSync(path.join(ESTUDO, `lote-${n}.txt`), lote.join('\n')); console.log(`lote-${n}.txt: ${lote.length} anúncios`); n++; }
  if (!faltam.length) console.log('Nenhum anúncio novo sem análise ou sem lote.');
} else if (modo === 'paginas') {
  if (!fs.existsSync(path.join(ESTUDO, 'codigos.json'))) { console.error('Rode o montar.mjs antes: é ele que dá o código (M-001…) de cada anúncio.'); process.exit(1); }
  const codigos = ler('codigos.json');
  const slugDe = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80).toLowerCase();
  const coletados = new Map(fs.readdirSync(path.join(ESTUDO, 'dados-busca')).flatMap((f) => ler(path.join('dados-busca', f)).anuncios).map((a) => [a.ad_id, a]));
  const feitas = new Set(arquivos(/^analise-paginas-\d+\.json$/).flatMap((f) => ler(f).paginas.map((p) => p.slug)));
  const ja = new Set(arquivos(/^lote-pag-\d+\.json$/).flatMap((f) => ler(f).map((p) => p.slug)));
  const porPagina = new Map();
  for (const x of arquivos(/^analise-lote-\d+\.json$/).flatMap((f) => ler(f).anuncios).filter((x) => !x.fora)) {
    const a = coletados.get(x.ad_id);
    if (!a || !['Site/LP', 'Formulário externo'].includes(canalDe(a))) continue;
    const endereco = enderecoLimpo(a.destino);
    const slug = endereco && slugDe(endereco);
    if (!slug || feitas.has(slug) || ja.has(slug) || !fs.existsSync(path.join(ESTUDO, 'paginas', slug, 'pagina.json'))) continue;
    (porPagina.get(slug) ?? porPagina.set(slug, { slug, anuncios: [] }).get(slug)).anuncios.push({ codigo: codigos[x.ad_id], pagina: a.pagina, nicho: x.nicho, oferta: x.oferta });
  }
  let n = proximoNumero(/^lote-pag-\d+\.json$/);
  for (const lote of fatiar([...porPagina.values()])) { fs.writeFileSync(path.join(ESTUDO, `lote-pag-${n}.json`), JSON.stringify(lote, null, 1)); console.log(`lote-pag-${n}.json: ${lote.length} páginas`); n++; }
  if (!porPagina.size) console.log('Nenhuma página nova sem análise ou sem lote.');
} else {
  console.error('uso: node scripts/lotes.mjs anuncios|paginas --estudo <slug> [--tamanho 20]');
  process.exit(1);
}
