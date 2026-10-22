// Qual estudo está em uso. Todo script da esteira importa daqui a pasta do estudo e o estudo.json dele.
// Cada estudo mora em estudos/<slug>/ (um por nicho ou por cliente), com o estudo.json na raiz.
// O estudo sai de --estudo <slug>, da variável ESTUDO ou, se só existir um, dele mesmo.
// O --estudo é tirado do process.argv aqui, antes do script ler os próprios argumentos.
import fs from 'node:fs';
import path from 'node:path';

export const RAIZ = path.resolve(import.meta.dirname, '..');
export const ESTUDOS = path.join(RAIZ, 'estudos');

function escolher() {
  const i = process.argv.indexOf('--estudo');
  if (i > 0) { const s = process.argv[i + 1]; process.argv.splice(i, 2); return s; }
  if (process.env.ESTUDO) return process.env.ESTUDO;
  const existentes = fs.existsSync(ESTUDOS) ? fs.readdirSync(ESTUDOS).filter((d) => fs.existsSync(path.join(ESTUDOS, d, 'estudo.json'))) : [];
  if (existentes.length === 1) return existentes[0];
  console.error(existentes.length
    ? `Diga qual estudo: --estudo <slug>. Existem: ${existentes.join(', ')}`
    : 'Nenhum estudo criado. Copie estudo.exemplo.json para estudos/<slug>/estudo.json e preencha.');
  process.exit(1);
}

export const SLUG = escolher();
export const ESTUDO = path.join(ESTUDOS, SLUG);
const arquivo = path.join(ESTUDO, 'estudo.json');
if (!fs.existsSync(arquivo)) {
  console.error(`Não achei ${arquivo}. Copie estudo.exemplo.json para lá e preencha.`);
  process.exit(1);
}
export const CONFIG = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
