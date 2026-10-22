// Monta o painel do estudo: junta a coleta (dados-busca/), a mídia (midia/<ad_id>/), a análise da IA
// (analise-lote-*.json, analise-paginas-*.json, estrategias.json, beneficios-voce.json) e o Google
// (google-palavras.json) em estudos/<slug>/painel/dados.json, e grava o painel/index.html, que abre no navegador.
// Capa e imagens viram .webp pequenos e o vídeo vira um .mp4 de 480 px, em painel/midia/.
// Uso: node 1-estudo-de-mercado/scripts/montar.mjs --estudo <slug>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ESTUDO, CONFIG } from './estudo.mjs';
// os benefícios que a expressão procura no texto e na fala vêm do estudo.json; sem expressão, só a marcação da IA
const BENEFICIOS = (CONFIG.beneficios ?? []).map((b) => ({ ...b, re: b.re ? new RegExp(b.re, 'i') : /(?!)/ }));
import { canalDe, objetivoDe, enderecoLimpo } from './canal.mjs';

const AQUI = ESTUDO;
const MIDIA = path.join(AQUI, 'midia');
const PAINEL = path.join(AQUI, 'painel');
const PUBLICO = path.join(PAINEL, 'midia', 'anuncios');
const SAIDA = path.join(PAINEL, 'dados.json');

// A análise vem em lotes (analise-lote-N.json, um por agente) e as conclusões em estrategias.json
const lotes = fs.readdirSync(AQUI).filter((f) => /^analise-lote-\d+\.json$/.test(f));
const analise = {
  ...(fs.existsSync(path.join(AQUI, 'estrategias.json')) ? JSON.parse(fs.readFileSync(path.join(AQUI, 'estrategias.json'), 'utf8')) : {}),
  anuncios: lotes.flatMap((f) => JSON.parse(fs.readFileSync(path.join(AQUI, f), 'utf8')).anuncios).filter((x) => !x.fora),
};
const triagem = JSON.parse(fs.readFileSync(path.join(AQUI, 'triagem.json'), 'utf8'));
const codigos = fs.existsSync(path.join(AQUI, 'codigos.json')) ? JSON.parse(fs.readFileSync(path.join(AQUI, 'codigos.json'), 'utf8')) : {};
const coletados = new Map();
for (const f of fs.readdirSync(path.join(AQUI, 'dados-busca'))) {
  for (const a of JSON.parse(fs.readFileSync(path.join(AQUI, 'dados-busca', f), 'utf8')).anuncios) coletados.set(a.ad_id, a);
}

const ff = (...args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args]);
function leve(origem, destino, largura) {
  if (!fs.existsSync(destino)) ff('-i', origem, '-vf', `scale='min(${largura},iw)':-2`, '-quality', '72', destino);
  return destino;
}
function videoLeve(origem, destino) {
  if (!fs.existsSync(destino)) ff('-i', origem, '-vf', "scale='min(480,iw)':-2", '-c:v', 'libx264', '-crf', '30', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', destino);
  return destino;
}
const web = (p) => path.relative(PAINEL, p).replace(/\\/g, '/');

// Para onde vai o tráfego: o canal (WhatsApp, formulário da Meta, LP...) vem de canal.mjs, que também diz se o
// anúncio capta lead ou só distribui conteúdo (perfil do Instagram e sem botão criam base, não trazem lead)
const slugDe = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80).toLowerCase();
const PAGINAS = path.join(AQUI, 'paginas');
const PUB_PAG = path.join(PAINEL, 'midia', 'paginas');
const analisePaginas = new Map(fs.readdirSync(AQUI).filter((f) => /^analise-paginas-\d+\.json$/.test(f))
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(AQUI, f), 'utf8')).paginas).map((x) => [x.slug, x]));
const destinos = new Map();

let proximo = Math.max(0, ...Object.values(codigos).map((c) => Number(c.slice(2)))) + 1;
const anuncios = [];
for (const x of analise.anuncios) {
  const a = coletados.get(x.ad_id);
  if (!a) { console.log('fora da coleta:', x.ad_id); continue; }
  codigos[x.ad_id] ??= `M-${String(proximo++).padStart(3, '0')}`;
  const dir = path.join(MIDIA, x.ad_id);
  const pub = path.join(PUBLICO, x.ad_id);
  fs.mkdirSync(pub, { recursive: true });
  const arq = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const capaOrig = arq.find((f) => /^capa-1\.jpg$/.test(f));
  const videoOrig = arq.find((f) => /^(video|peca)-1\.mp4$/.test(f));
  const imagensOrig = arq.filter((f) => /^(imagem|peca)-\d+\.jpg$/.test(f)).sort();
  // anúncio dinâmico às vezes vem só com o vídeo: a capa sai do quadro de 1 s
  const capaPub = path.join(pub, 'capa.webp');
  if (!capaOrig && videoOrig && !fs.existsSync(capaPub)) ff('-ss', '1', '-i', path.join(dir, videoOrig), '-frames:v', '1', '-vf', "scale='min(480,iw)':-2", '-quality', '72', capaPub);
  const capa = capaOrig ? web(leve(path.join(dir, capaOrig), capaPub, 480)) : fs.existsSync(capaPub) ? web(capaPub) : null;
  const imagens = imagensOrig.slice(0, 6).map((f, i) => web(leve(path.join(dir, f), path.join(pub, `img-${i + 1}.webp`), 720)));
  const video = videoOrig ? web(videoLeve(path.join(dir, videoOrig), path.join(pub, 'video.mp4'))) : null;
  const tr = fs.existsSync(path.join(dir, 'transcricao.txt')) ? fs.readFileSync(path.join(dir, 'transcricao.txt'), 'utf8').replace(/^\[[\d.]+s\] /gm, '').trim() : null;
  const formato = x.formato ?? (video ? 'video' : imagens.length > 1 ? 'carrossel' : 'imagem');
  const canal = canalDe(a);
  const endereco = ['Site/LP', 'Formulário externo'].includes(canal) ? enderecoLimpo(a.destino) : null;
  const slug = endereco && fs.existsSync(path.join(PAGINAS, slugDe(endereco), 'pagina.json')) ? slugDe(endereco) : null;
  if (slug) (destinos.get(slug) ?? destinos.set(slug, { slug, endereco, anuncios: [] }).get(slug)).anuncios.push({ codigo: codigos[x.ad_id], pagina: a.pagina, local: Boolean(x.local), nicho: x.nicho });
  anuncios.push({
    codigo: codigos[x.ad_id], adId: x.ad_id, pagina: a.pagina, pageId: a.page_id, regiao: x.regiao, local: Boolean(x.local), nicho: x.nicho,
    formato, inicio: a.inicio, diasNoAr: a.dias_no_ar, variacoes: a.variacoes, texto: a.texto, titulo: a.titulo, cta: a.cta,
    canal, objetivo: objetivoDe(canal), dominio: endereco ? new URL(endereco).hostname.replace(/^www\./, '') : null, paginaDestino: slug, transcricao: tr && !/^\(/.test(tr) ? tr : null, link: a.link,
    capa: capa ?? imagens[0] ?? null, imagens, video,
    oferta: x.oferta, publico: x.publico ?? null, categoria: x.categoria, categoria2: x.categoria2 ?? null, gancho: x.gancho,
    beneficios: x.beneficios ?? [], notas: x.notas, nota: Object.values(x.notas).reduce((s, n) => s + n, 0),
    selo: null, funciona: x.funciona, naoFunciona: x.nao_funciona, comoUsar: x.como_usar ?? null,
  });
}
for (const a of anuncios) a.selo = a.nota >= 8 ? 'referencia_forte' : a.nota >= 5 ? 'aproveitavel' : 'evitar';
fs.writeFileSync(path.join(AQUI, 'codigos.json'), JSON.stringify(codigos, null, 2));

// Benefícios: o que a IA marcou em cada anúncio + o que as expressões acham no texto e na fala
const beneficiosVoce = fs.existsSync(path.join(AQUI, 'beneficios-voce.json')) ? JSON.parse(fs.readFileSync(path.join(AQUI, 'beneficios-voce.json'), 'utf8')) : {};
const textoDe = (a) => `${a.titulo ?? ''}\n${a.texto ?? ''}\n${a.transcricao ?? ''}`;
const beneficios = BENEFICIOS.map((b) => {
  const quem = new Map();
  for (const a of anuncios) {
    if (a.beneficios.includes(b.id) || b.re.test(textoDe(a))) {
      if (!a.beneficios.includes(b.id)) a.beneficios.push(b.id);
      if (!quem.has(a.pagina)) quem.set(a.pagina, { pagina: a.pagina, codigo: a.codigo, local: a.local });
    }
  }
  const voce = beneficiosVoce[b.id] ?? { voce: 'decidir', nota: '' };
  return { id: b.id, rotulo: b.rotulo, anunciantes: [...quem.values()].sort((x, y) => Number(y.local) - Number(x.local)), voce: voce.voce, nota: voce.nota };
}).filter((b) => b.anunciantes.length).sort((x, y) => y.anunciantes.length - x.anunciantes.length);

// Padrões: barras contadas sobre os anúncios do painel (um anúncio = um voto)
const barras = (f, rotulos = {}) => {
  const m = new Map();
  for (const a of anuncios) for (const v of [].concat(f(a)).filter(Boolean)) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8).map(([k, n]) => ({ rotulo: rotulos[k] ?? k, n, total: anuncios.length }));
};
// as estratégias de comunicação da régua (REGUA-ANUNCIOS.md › Categorias)
const CAT = {
  'prova-resultado': 'Prova com resultado', 'dor-do-dono': 'Dor do dono', 'oferta-entrada': 'Oferta de entrada (grátis)',
  autoridade: 'Autoridade', educativo: 'Educativo', demonstracao: 'Demonstração', comparacao: 'Comparação',
  nicho: 'Nicho', institucional: 'Institucional', 'evento-curso': 'Evento ou curso',
};
const padroes = [
  { titulo: 'Captação ou distribuição', nota: 'Captação: o clique vira contato (WhatsApp, formulário, site). Distribuição: o clique vai para o Instagram ou não há botão; cria base, não traz lead.', barras: barras((a) => ({ captacao: 'Captação de lead', distribuicao: 'Distribuição de conteúdo (cria base)' })[a.objetivo]) },
  { titulo: 'A estratégia de comunicação', nota: 'A abordagem principal e a de apoio de cada anúncio.', barras: barras((a) => [a.categoria, a.categoria2], CAT) },
  { titulo: 'Para onde vai o clique', nota: 'O canal que recebe o tráfego. "Formulário da Meta" abre dentro do Facebook/Instagram; "Formulário externo" é Typeform, Respondi e afins.', barras: barras((a) => ({ 'Perfil do Instagram': 'Perfil do Instagram (distribuição)', 'Sem botão': 'Sem botão (distribuição)' })[a.canal] ?? a.canal) },
  { titulo: 'O formato', nota: 'Vídeo, imagem ou carrossel.', barras: barras((a) => ({ video: 'Vídeo', imagem: 'Imagem', carrossel: 'Carrossel' })[a.formato]) },
  { titulo: 'Para quem falam', nota: 'O público que o anúncio chama.', barras: barras((a) => a.publico ?? 'Qualquer empresa') },
];


// Páginas de destino: o print (1ª tela e página inteira, como o celular vê) + o que foi lido + a análise da IA
const LEVA = { 'formulario-na-pagina': 'Formulário na página', 'formulario-externo': 'Formulário externo', whatsapp: 'WhatsApp', agenda: 'Agenda', checkout: 'Checkout (compra)', ligacao: 'Ligação', nenhum: 'Nenhum' };
const FILTRO = { faturamento: 'Faturamento', 'verba-anuncio': 'Verba mínima de anúncio', nicho: 'Nicho', cargo: 'Cargo', 'tamanho-equipe': 'Tamanho da equipe', 'ja-investe-trafego': 'Já investe em tráfego', instagram: 'Instagram da empresa', prazo: 'Prazo para começar', cidade: 'Cidade' };
const listaPaginas = [...destinos.values()].map((d) => {
  const lido = JSON.parse(fs.readFileSync(path.join(PAGINAS, d.slug, 'pagina.json'), 'utf8'));
  const x = analisePaginas.get(d.slug) ?? {};
  const pub = path.join(PUB_PAG, d.slug);
  fs.mkdirSync(pub, { recursive: true });
  const topo = fs.existsSync(path.join(PAGINAS, d.slug, 'topo.jpg')) ? web(leve(path.join(PAGINAS, d.slug, 'topo.jpg'), path.join(pub, 'topo.webp'), 390)) : null;
  const inteira = fs.existsSync(path.join(PAGINAS, d.slug, 'mobile.jpg')) ? web(leve(path.join(PAGINAS, d.slug, 'mobile.jpg'), path.join(pub, 'inteira.webp'), 390)) : null;
  const notas = x.notas ?? null;
  return {
    slug: d.slug, endereco: d.endereco, dominio: new URL(d.endereco).hostname.replace(/^www\./, ''), anuncios: d.anuncios,
    anunciante: d.anuncios[0].pagina, nicho: d.anuncios[0].nicho, local: d.anuncios.some((a) => a.local),
    topo, inteira, erro: lido.erro ?? null, titulo: lido.titulo ?? null,
    whatsapp: (lido.whatsapp ?? []).map((w) => w.mensagem).filter(Boolean)[0] ?? x.mensagem_whatsapp ?? null,
    tipo: x.tipo ?? null, promessa: x.promessa ?? null, oferta: x.oferta ?? null, levaPara: x.leva_para ?? [], perguntas: x.perguntas ?? [],
    filtros: x.filtros ?? [], faixas: x.faixas_faturamento ?? [], estrutura: x.estrutura ?? [], provas: x.provas ?? [], atrito: x.atrito ?? null,
    notas, nota: notas ? Object.values(notas).reduce((s, n) => s + n, 0) : null,
    valeCopiar: x.vale_copiar ?? null, fraco: x.fraco ?? null, comoUsar: x.como_usar ?? null,
  };
}).sort((a, b) => (b.nota ?? -1) - (a.nota ?? -1));
const sobre = (f, rotulos = {}) => {
  const m = new Map();
  for (const p of listaPaginas) for (const v of [].concat(f(p)).filter(Boolean)) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((x, y) => y[1] - x[1]).slice(0, 9).map(([k, n]) => ({ rotulo: rotulos[k] ?? k, n, total: listaPaginas.length }));
};
const padroesPaginas = [
  { titulo: 'Para onde a página leva', nota: 'O passo seguinte que a página pede (uma página pode ter mais de um).', barras: sobre((p) => p.levaPara, LEVA) },
  { titulo: 'O que o formulário usa para filtrar', nota: 'A pergunta que separa o cliente bom do curioso. Nome, e-mail e WhatsApp não contam.', barras: sobre((p) => p.filtros, FILTRO) },
  { titulo: 'Quanto custa virar contato', nota: 'Atrito: quantos passos e campos até a pessoa virar lead.', barras: sobre((p) => p.atrito, { baixo: 'Baixo', medio: 'Médio', alto: 'Alto' }) },
  { titulo: 'O tipo de página', nota: 'LP feita para o anúncio, formulário puro ou o site institucional.', barras: sobre((p) => p.tipo, { lp: 'Landing page', formulario: 'Formulário puro', site: 'Site institucional', blog: 'Blog', outro: 'Outro' }) },
];

const paginas = new Set(anuncios.map((a) => a.pageId));
const estudo = {
  plataforma: 'meta', nome: CONFIG.nome ?? path.basename(ESTUDO), grupos: CONFIG.grupos ?? {}, atualizadoEm: new Date().toISOString(),
  resumo: { coletados: triagem.coletados, anunciantes: paginas.size, noPainel: anuncios.length, termos: CONFIG.termos ?? [], minDias: triagem.minDias },
  anuncios, padroes, aprendizados: analise.aprendizados ?? [], voce: analise.voce ?? { igual: [], diferente: [] }, beneficios,
  paginas: listaPaginas, padroesPaginas,
  google: fs.existsSync(path.join(AQUI, 'google-palavras.json')) ? JSON.parse(fs.readFileSync(path.join(AQUI, 'google-palavras.json'), 'utf8')) : null,
};
fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, JSON.stringify(estudo, null, 1));
// o painel: o molde com os dados dentro, para abrir com dois cliques, sem servidor
const molde = fs.readFileSync(path.join(import.meta.dirname, 'painel.html'), 'utf8');
fs.writeFileSync(path.join(PAINEL, 'index.html'), molde.replace('/*__DADOS__*/null', () => JSON.stringify(estudo).replace(/</g, '\\u003c')));
console.log(`${anuncios.length} anúncios de ${paginas.size} anunciantes · ${beneficios.length} benefícios · ${listaPaginas.length} páginas de destino (${analisePaginas.size} analisadas) → ${path.join(PAINEL, 'index.html')}`);
