// Baixa a mídia (vídeo, imagem, peças do carrossel) dos anúncios escolhidos para estudos/<slug>/midia/<ad_id>/.
// Os links do fbcdn são assinados e vencem em poucos dias: baixar logo depois de coletar.
// Uso: node 1-estudo-de-mercado/scripts/baixar.mjs --estudo <slug> [<ad_id> ...]   (sem ids: todos de estudo-ids.txt)
import fs from 'node:fs';
import path from 'node:path';
import { ESTUDO } from './estudo.mjs';
const DADOS = path.join(ESTUDO, 'dados-busca');
const MIDIA = path.join(ESTUDO, 'midia');
const todos = new Map(fs.readdirSync(DADOS).flatMap((f) => JSON.parse(fs.readFileSync(path.join(DADOS, f))).anuncios).map((a) => [a.ad_id, a]));

async function baixar(url, destino) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`${r.status} ${url.slice(0, 80)}`);
  fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
  return fs.statSync(destino).size;
}
const pedidos = process.argv.length > 2 ? process.argv.slice(2) : fs.readFileSync(path.join(ESTUDO, 'estudo-ids.txt'), 'utf8').split(/\s+/).filter(Boolean);
for (const id of pedidos) {
  const a = todos.get(id);
  if (!a) { console.log(id, 'não está nos dados coletados'); continue; }
  const dir = path.join(MIDIA, id); fs.mkdirSync(dir, { recursive: true });
  const itens = [];
  a.videos.forEach((v, i) => { if (v.video) itens.push([v.video, `video-${i + 1}.mp4`]); if (v.capa) itens.push([v.capa, `capa-${i + 1}.jpg`]); });
  a.imagens.forEach((u, i) => u && itens.push([u, `imagem-${i + 1}.jpg`]));
  a.cards.forEach((c, i) => { if (c.video) itens.push([c.video, `peca-${i + 1}.mp4`]); else if (c.imagem) itens.push([c.imagem, `peca-${i + 1}.jpg`]); });
  const ok = [];
  for (const [u, nome] of itens) { try { ok.push(`${nome} ${Math.round((await baixar(u, path.join(dir, nome))) / 1024)}KB`); } catch (e) { ok.push(`${nome} ERRO ${e.message}`); } }
  fs.writeFileSync(path.join(dir, 'anuncio.json'), JSON.stringify(a, null, 2));
  console.log(id, a.pagina, a.formato, '→', ok.join(', ') || 'sem mídia');
}
