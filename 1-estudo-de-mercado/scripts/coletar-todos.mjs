// Roda o coletar.mjs para cada termo do estudo.json (campo "termos"), um depois do outro.
// Termo que já tem arquivo em dados-busca/ é pulado; --refazer coleta de novo.
// Uso: node scripts/coletar-todos.mjs --estudo <slug> [--refazer]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ESTUDO, SLUG, CONFIG } from './estudo.mjs';

const refazer = process.argv.includes('--refazer');
const nomeDe = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const termos = CONFIG.termos ?? [];
if (!termos.length) { console.error('O estudo.json não tem "termos".'); process.exit(1); }

for (const termo of termos) {
  if (!refazer && fs.existsSync(path.join(ESTUDO, 'dados-busca', `${nomeDe(termo)}.json`))) { console.log(`${termo}: já coletado`); continue; }
  try {
    execFileSync(process.execPath, [path.join(import.meta.dirname, 'coletar.mjs'), termo, '--midia', CONFIG.midia ?? 'all', '--rolagens', String(CONFIG.rolagens ?? 25), '--estudo', SLUG], { stdio: 'inherit' });
  } catch { console.log(`${termo}: FALHOU (siga para o próximo e tente de novo depois)`); }
}
