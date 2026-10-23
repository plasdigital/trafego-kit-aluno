// Confere o que este PC tem e diz, para cada funcionalidade do kit, se ela está liberada ou o que falta.
// Só lê: não instala nada, não abre navegador, não chama API. Leva poucos segundos.
// Uso (da raiz do kit): node verificar.mjs        ·  npm run verificar
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const SO = process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'mac' : 'linux';

const roda = (cmd, args) => {
  try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 20000 }).trim() || 'ok'; }
  catch { return null; }
};

// O "python" do Windows pode ser o atalho da Microsoft Store, que não é Python: só vale quem responde a versão.
const PYTHON = ['python', 'python3', 'py'].find((c) => /^Python 3/.test(roda(c, ['--version']) || ''));
const temModulo = (mod) => !!PYTHON && roda(PYTHON, ['-c', `import ${mod}`]) !== null;

function chrome() {
  const caminhos = {
    win: [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
      .filter(Boolean).map((p) => path.join(p, 'Google', 'Chrome', 'Application', 'chrome.exe')),
    mac: ['/Applications/Google Chrome.app'],
    linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/opt/google/chrome/chrome'],
  }[SO];
  return caminhos.some((c) => fs.existsSync(c));
}

const versaoNode = process.versions.node.split('.').map(Number);

// Cada item: o que é, como confere, como instala em cada sistema.
const ITENS = {
  node: {
    nome: 'Node 20.11 ou mais novo',
    ok: versaoNode[0] > 20 || (versaoNode[0] === 20 && versaoNode[1] >= 11),
    achado: `v${process.versions.node}`,
    instalar: { win: 'winget install OpenJS.NodeJS.LTS', mac: 'brew install node', linux: 'https://nodejs.org (versão LTS)' },
  },
  playwright: {
    nome: 'dependências do kit (npm install)',
    ok: fs.existsSync(path.join(RAIZ, 'node_modules', 'playwright')),
    instalar: { win: 'npm install   (na raiz do kit)', mac: 'npm install   (na raiz do kit)', linux: 'npm install   (na raiz do kit)' },
  },
  chrome: {
    nome: 'Google Chrome',
    ok: chrome(),
    instalar: { win: 'winget install Google.Chrome', mac: 'https://www.google.com/chrome', linux: 'https://www.google.com/chrome' },
  },
  ffmpeg: {
    nome: 'ffmpeg (com o ffprobe)',
    ok: !!roda('ffmpeg', ['-version']) && !!roda('ffprobe', ['-version']),
    instalar: { win: 'winget install Gyan.FFmpeg   (depois feche e abra o terminal)', mac: 'brew install ffmpeg', linux: 'sudo apt install ffmpeg' },
  },
  python: {
    nome: 'Python 3',
    ok: !!PYTHON,
    achado: PYTHON ? roda(PYTHON, ['--version']) : null,
    instalar: { win: 'winget install Python.Python.3.12   (depois feche e abra o terminal)', mac: 'brew install python', linux: 'sudo apt install python3 python3-pip' },
  },
  whisper: {
    nome: 'faster-whisper (Python)',
    ok: temModulo('faster_whisper'),
    instalar: { win: 'pip install faster-whisper', mac: 'pip3 install faster-whisper', linux: 'pip3 install faster-whisper' },
  },
  meta_sdk: {
    nome: 'SDK da Meta (Python)',
    ok: temModulo('facebook_business'),
    instalar: { win: 'cd meta-ads && pip install -r requirements.txt', mac: 'cd meta-ads && pip3 install -r requirements.txt', linux: 'cd meta-ads && pip3 install -r requirements.txt' },
  },
  meta_env: {
    nome: 'meta-ads/.env com o token',
    ok: fs.existsSync(path.join(RAIZ, 'meta-ads', '.env')),
    instalar: { win: 'siga meta-ads/COMECE-AQUI.md', mac: 'siga meta-ads/COMECE-AQUI.md', linux: 'siga meta-ads/COMECE-AQUI.md' },
  },
  google_sdk: {
    nome: 'SDK do Google Ads (Python)',
    ok: temModulo('google.ads.googleads'),
    instalar: { win: 'cd google-ads && pip install -r requirements.txt', mac: 'cd google-ads && pip3 install -r requirements.txt', linux: 'cd google-ads && pip3 install -r requirements.txt' },
  },
  google_env: {
    nome: 'google-ads/.env com o token',
    ok: fs.existsSync(path.join(RAIZ, 'google-ads', '.env')),
    instalar: { win: 'siga google-ads/COMECE-AQUI.md', mac: 'siga google-ads/COMECE-AQUI.md', linux: 'siga google-ads/COMECE-AQUI.md' },
  },
};

const gpu = !!roda('nvidia-smi', ['-L']);

// O mapa: o que o dono consegue fazer, em três galhos, e o que precisa para cada coisa.
const MAPA = [
  {
    galho: 'O BÁSICO: o estudo de mercado e o painel',
    funcoes: [
      {
        nome: 'Buscar os anúncios dos concorrentes e abrir as landing pages',
        precisa: ['node', 'playwright', 'chrome'],
        sem: 'não existe estudo de mercado: é o primeiro passo de tudo',
      },
      {
        nome: 'A IA ver os vídeos dos anúncios e montar o painel',
        precisa: ['ffmpeg'],
        sem: 'a busca roda, mas a IA não enxerga os vídeos (só a imagem estática e o texto) e o painel não é montado',
      },
    ],
  },
  {
    galho: 'PARA IR MAIS LONGE',
    funcoes: [
      {
        nome: 'A IA ouvir o que é falado nos vídeos',
        precisa: ['ffmpeg', 'python', 'whisper'],
        sem: 'a análise fica sem a fala: anúncio em vídeo é avaliado só pela imagem e pela legenda',
        nota: gpu ? 'placa NVIDIA encontrada: a transcrição é rápida' : 'sem placa NVIDIA: transcreve na CPU, funciona, mas leva bem mais tempo',
      },
      {
        nome: 'Operar a conta do Meta Ads (relatório, campanha, anúncio)',
        precisa: ['python', 'meta_sdk', 'meta_env'],
        sem: 'o estudo funciona igual; você só não lê nem mexe na conta de anúncio pela IA',
      },
      {
        nome: 'Operar a conta do Google Ads e tirar as palavras direto da API',
        precisa: ['python', 'google_sdk', 'google_env'],
        sem: 'as palavras do Google ainda entram pelo CSV do Planejador, baixado à mão (grátis)',
      },
    ],
  },
];

// Onde o painel mora não se confere no PC: é escolha do dono, e a do cliente custa dinheiro.
const ONDE_O_PAINEL_MORA = [
  ['só para você', 'abre no seu PC, dois cliques no index.html. Nada a instalar nem a pagar'],
  ['o cliente ver por um link', 'hospedagem de site + domínio, numa pasta com senha. Não precisa de VPS: o painel é um site estático'],
  ['rodar sozinho todo mês', 'VPS, com o kit agendado lá. Só se você não quiser depender do seu PC ligado'],
];
const HOSTINGER = 'Hostinger: hospedagem https://www.hostg.xyz/aff_c?offer_id=6&aff_id=214984&url_id=3648 · VPS https://www.hostg.xyz/aff_c?offer_id=6&aff_id=214984&url_id=5038 · cupom PEDROALMEIDA';

const ramo = (ultimo) => (ultimo ? '└─' : '├─');
const tronco = (ultimo) => (ultimo ? '   ' : '│  ');

console.log(`\nMapa do que você precisa (${SO === 'win' ? 'Windows' : SO === 'mac' ? 'Mac' : 'Linux'})\n`);
let liberadas = 0, total = 0;
for (const { galho, funcoes } of MAPA) {
  console.log(` ${galho}`);
  funcoes.forEach((f, i) => {
    const ult = i === funcoes.length - 1;
    const faltam = f.precisa.filter((id) => !ITENS[id].ok);
    total++;
    if (!faltam.length) liberadas++;
    console.log(` ${ramo(ult)} ${faltam.length ? '❌' : '✅'} ${f.nome}`);
    const usa = f.precisa.map((id) => `${ITENS[id].ok ? '✅' : '❌'} ${ITENS[id].nome}${ITENS[id].ok && ITENS[id].achado ? ` (${ITENS[id].achado})` : ''}`);
    console.log(` ${tronco(ult)}   precisa: ${usa.join(' · ')}`);
    if (faltam.length) {
      console.log(` ${tronco(ult)}   sem isso: ${f.sem}`);
      for (const id of faltam) console.log(` ${tronco(ult)}   instalar: ${ITENS[id].instalar[SO]}`);
    } else if (f.nota) console.log(` ${tronco(ult)}   ${f.nota}`);
  });
  console.log('');
}

console.log(' ONDE O PAINEL VAI MORAR (escolha sua, não se instala)');
ONDE_O_PAINEL_MORA.forEach(([quem, oque], i) => console.log(` ${ramo(i === ONDE_O_PAINEL_MORA.length - 1)} ${quem}: ${oque}`));
console.log(`    ${HOSTINGER}`);
console.log('    passo a passo: 1-estudo-de-mercado/docs/02-mostrar-ao-cliente.md\n');

console.log(`${liberadas} de ${total} funcionalidades liberadas.`);
console.log('Instalou algo? Feche e abra o terminal (e o agente) e rode de novo: o PATH só atualiza num terminal novo.\n');
