# Estudo de mercado: instruções para o agente

**O que esta pasta faz:** lê os anúncios que os concorrentes de um nicho mantêm no ar há 30+ dias (Biblioteca de
Anúncios da Meta) e as páginas para onde eles mandam, a IA analisa cada um, e sai um painel de padrões
(`estudos/<slug>/painel/index.html`) que vira o planejamento de Google e Meta.

Rode todo comando da **raiz do kit** (a pasta acima desta), com `--estudo <slug>`.
O porquê de cada passo está em [docs/01-o-metodo.md](docs/01-o-metodo.md).

## As possibilidades

| O dono pede | Você faz |
|---|---|
| "faz um estudo de mercado de X" / "quero ver o que os concorrentes anunciam" | A esteira inteira, abaixo, a partir do passo 0 |
| "atualiza o estudo" (um mês depois) | Passos 1 a 10 de novo no mesmo slug. Análise já feita é mantida; só o novo entra em lote |
| "mostra o painel" | Abrir `1-estudo-de-mercado/estudos/<slug>/painel/index.html` no navegador |
| "quais as palavras mais concorridas no Google?" | Passo 11 |
| "transforma isso em planejamento" | [docs/01-o-metodo.md](docs/01-o-metodo.md) §5: dos padrões ao plano |
| "quero mostrar para o cliente" / "publica o painel" | [docs/02-mostrar-ao-cliente.md](docs/02-mostrar-ao-cliente.md): hospedagem de site, pasta com senha. **Subir para a hospedagem muda o mundo: só com o "sim" do dono** |

**Só lê, pode rodar sem perguntar:** todos os scripts desta pasta. Nenhum deles publica, envia ou gasta.
O passo 1 abre o Chrome em segundo plano e leva de 1 a 3 minutos por termo; avise o dono antes de começar.

## A esteira

| # | Passo | Comando / o que você faz | Sai em `estudos/<slug>/` |
|---|---|---|---|
| 0 | Montar o estudo **com o dono** | Copie `estudo.exemplo.json` para `estudos/<slug>/estudo.json` e preencha com ele: `sobre` (o que vende, para quem, as regras da casa), `termos` (8 a 20 buscas, inclusive com a cidade), `regiao`, `grupos` e `beneficios` do nicho | `estudo.json` |
| 1 | Coletar | `node 1-estudo-de-mercado/scripts/coletar-todos.mjs --estudo <slug>` | `dados-busca/` |
| 2 | Triagem | `node 1-estudo-de-mercado/scripts/triagem.mjs --estudo <slug>` | `triagem.json` |
| 3 | Escolher os concorrentes | **Você** lê `triagem.json` e escreve `selecao-paginas.json` (abaixo). Depois: `node 1-estudo-de-mercado/scripts/selecionar.mjs --estudo <slug>` | `estudo-ids.txt` |
| 4 | Baixar a mídia | `node 1-estudo-de-mercado/scripts/baixar.mjs --estudo <slug>` **logo depois do passo 1** (os links vencem em poucos dias) | `midia/<ad_id>/` |
| 5 | Transcrever (opcional) | `python -I 1-estudo-de-mercado/scripts/transcrever.py <slug>` | `midia/<id>/transcricao.txt` |
| 6 | Ler as páginas | `node 1-estudo-de-mercado/scripts/paginas.mjs --estudo <slug>` | `paginas/<página>/` |
| 7 | Quadros | `node 1-estudo-de-mercado/scripts/quadros.mjs --estudo <slug>` | `folha.jpg` de cada vídeo e página |
| 8 | Analisar os anúncios | `node 1-estudo-de-mercado/scripts/lotes.mjs anuncios --estudo <slug>`; para cada `lote-N.txt`, siga [REGUA-ANUNCIOS.md](REGUA-ANUNCIOS.md) e grave `analise-lote-N.json`. Rode o `montar.mjs` uma vez no fim (ele dá os códigos M-001…) | `analise-lote-N.json` |
| 9 | Analisar as páginas | `node 1-estudo-de-mercado/scripts/lotes.mjs paginas --estudo <slug>`; para cada `lote-pag-N.json`, siga [REGUA-PAGINAS.md](REGUA-PAGINAS.md) e grave `analise-paginas-N.json` | `analise-paginas-N.json` |
| 10 | Conclusões e painel | Escreva `estrategias.json` e `beneficios-voce.json` (abaixo). Depois: `node 1-estudo-de-mercado/scripts/montar.mjs --estudo <slug>` | `painel/index.html` |
| 11 | Google (opcional) | `node 1-estudo-de-mercado/scripts/google-palavras.mjs --estudo <slug> <csv ou json>` e rode o `montar.mjs` de novo | `google-palavras.json` |

Passos 8 e 9 com muitos lotes: se você tem subagentes, dê um lote para cada, com a régua e a pasta do estudo.
Cada análise é pesada (imagem + fala + texto); 20 anúncios ou 12 páginas por lote é o tamanho que cabe.

### Os arquivos que VOCÊ escreve

`selecao-paginas.json` (passo 3): um item por anunciante que é concorrente de verdade, pelo `page_id` da triagem.
Concorrente = vende o mesmo que quem pediu o estudo, para o mesmo cliente. Fora: vaga de emprego, curso para
leigo, fornecedor do nicho, produto sem relação. Na dúvida, leia os textos da amostra.

```json
{ "<page_id>": { "nicho": "<id de grupos do estudo.json>", "pagina": "<nome da página>" } }
```

`estrategias.json` (passo 10): de 5 a 10 conclusões, cada uma com os códigos que provam, e o que fazer.

```json
{ "aprendizados": [ { "titulo": "frase curta", "texto": "3 a 5 frases, com os números do painel", "prova": ["M-004", "M-031"] } ],
  "voce": { "igual": ["o que copiar, concreto"], "diferente": ["onde se diferenciar, concreto"] } }
```

`beneficios-voce.json` (passo 10): para cada id de `beneficios`, se quem pediu o estudo tem aquilo. Pergunte ao
dono; não invente.

```json
{ "<id>": { "voce": "tem | nao_tem | na_frente | decidir", "nota": "1 frase" } }
```

## O que precisa estar instalado

**Antes do passo 1, rode `node verificar.mjs`** (da raiz do kit). Faltou algo do básico: diga ao dono o que ele
perde e pergunte se instala, **antes** de começar a coleta. Não descubra no passo 10 que o painel não sai.

| Para | Precisa | Sem isso |
|---|---|---|
| passos 1 e 6 | Node 20+, `npm install` na raiz do kit, Google Chrome | não existe estudo |
| passos 7 e 10 | ffmpeg (com o ffprobe) | a IA não vê os vídeos e o `montar.mjs` para: **o painel não sai** |
| passo 5 | Python 3 e `pip install faster-whisper` | o vídeo é avaliado só pela imagem e pela legenda |
| passo 11 | o CSV do Planejador de palavras-chave, ou o `google-ads/` configurado com acesso Basic | sem a aba do Google no painel |

## Travas

- **Nunca preencha nem envie formulário de concorrente.** Vira lead falso na conta dele. O `paginas.mjs` só lê.
- **Não invente número.** Todo número das conclusões sai do painel ou do `triagem.json`.
- O passo 0 é **com o dono**: `sobre`, `termos` e `beneficios` decidem o estudo inteiro. Mostre o rascunho antes de coletar.
- Anúncio de distribuição (clique para o perfil do Instagram, ou sem botão) **não capta lead**. Não diga que capta.
- Mídia baixada e prints são de terceiros: ficam no PC do dono, para estudo. Não publique.

## Armadilhas

| O que aparece | O que é |
|---|---|
| `Executable doesn't exist` / `chrome` não encontrado | O Google Chrome não está instalado. O kit usa o Chrome do PC, não baixa navegador |
| Um termo volta com 0 anúncios | Termo largo demais ou raro demais na Biblioteca. Troque e rode de novo só ele (`coletar.mjs "<termo>"`) |
| `baixar.mjs` com `ERRO 403` | O link da mídia venceu. Rode o passo 1 de novo e baixe logo em seguida |
| Transcrição lenta | Sem placa NVIDIA, o Whisper roda na CPU. Pule o passo 5: a análise usa a imagem e o texto |
| `pagina.json` com `erro` | A página não abriu (fora do ar, bloqueio). Siga sem ela |
| Página de destino é `fb.me/...` | É o formulário instantâneo da Meta: a Biblioteca não mostra as perguntas |
| O painel abre sem imagem | Abriu o `index.html` fora da pasta `painel/`. As imagens estão em `painel/midia/` |
