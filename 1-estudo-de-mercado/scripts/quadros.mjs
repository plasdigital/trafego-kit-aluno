// Prepara o que a IA vai OLHAR na análise, porque ela lê imagem e não assiste vídeo:
//   · vídeo do anúncio  → midia/<ad_id>/folha.jpg: 12 quadros em ordem (4 por linha, 3 linhas)
//   · página de destino → paginas/<página>/folha.jpg: o print da página inteira cortado em colunas
// Precisa do ffmpeg instalado. Pula o que já tem folha.jpg (--refazer gera de novo).
// Uso: node scripts/quadros.mjs --estudo <slug> [--refazer]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ESTUDO } from './estudo.mjs';

const refazer = process.argv.includes('--refazer');
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a]);
const sonda = (arq, campo) => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', campo, '-of', 'csv=p=0', arq], { encoding: 'utf8' }).trim().split(/\r?\n/)[0];

let videos = 0, paginas = 0;
const MIDIA = path.join(ESTUDO, 'midia');
for (const id of fs.existsSync(MIDIA) ? fs.readdirSync(MIDIA) : []) {
  const dir = path.join(MIDIA, id);
  const v = ['video-1.mp4', 'peca-1.mp4'].map((n) => path.join(dir, n)).find((f) => fs.existsSync(f));
  const folha = path.join(dir, 'folha.jpg');
  if (!v || (!refazer && fs.existsSync(folha))) continue;
  try {
    const dur = Math.max(1, Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v], { encoding: 'utf8' }).trim()) || 1);
    ff('-i', v, '-vf', `fps=12/${dur.toFixed(2)},scale=320:-2,tile=4x3`, '-frames:v', '1', '-q:v', '4', folha);
    videos++;
  } catch (e) { console.log(id, 'ERRO', String(e.message).slice(0, 120)); }
}

const PAGINAS = path.join(ESTUDO, 'paginas');
const ALTURA = 1400;
for (const slug of fs.existsSync(PAGINAS) ? fs.readdirSync(PAGINAS) : []) {
  const dir = path.join(PAGINAS, slug);
  const inteira = path.join(dir, 'mobile.jpg');
  const folha = path.join(dir, 'folha.jpg');
  if (!fs.existsSync(inteira) || (!refazer && fs.existsSync(folha))) continue;
  try {
    const [w, h] = sonda(inteira, 'stream=width,height').split(',').map(Number);
    const n = Math.min(12, Math.ceil(h / ALTURA));
    if (n <= 1) { fs.copyFileSync(inteira, folha); paginas++; continue; }
    const cortes = Array.from({ length: n }, (_, i) => {
      const y = i * ALTURA, alt = Math.min(ALTURA, h - y);
      return `[0]crop=${w}:${alt}:0:${y},pad=${w}:${ALTURA}:0:0:white[c${i}]`;
    });
    const filtro = `${cortes.join(';')};${Array.from({ length: n }, (_, i) => `[c${i}]`).join('')}hstack=inputs=${n}`;
    ff('-i', inteira, '-filter_complex', filtro, '-q:v', '4', folha);
    paginas++;
  } catch (e) { console.log(slug, 'ERRO', String(e.message).slice(0, 120)); }
}
console.log(`${videos} folhas de vídeo e ${paginas} folhas de página prontas`);
