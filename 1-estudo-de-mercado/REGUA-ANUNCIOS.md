# Régua da análise dos anúncios

A régua que o agente segue para analisar cada anúncio do estudo. Antes de começar, leia o `estudo.json`:

- `sobre`: quem pediu o estudo, o que vende, para quem, e as regras da casa (o que nunca promete). É contra
  isso que se medem o critério **aproveitável** e o campo **como_usar**.
- `grupos`: os grupos de concorrente. O campo `nicho` de cada análise é um desses ids.
- `regiao`: o que conta como "da região" (campo `local`).
- `beneficios`: os benefícios do nicho (campo `beneficios`).

O objetivo: ver o que os concorrentes anunciam para captar cliente, com os criativos no ar há 30+ dias, o que
oferecem, as estratégias e os benefícios em destaque.

**Entrada:** um `lote-N.txt` (um `ad_id` por linha). **Saída:** `analise-lote-N.json`, no formato
`{ "anuncios": [ { ...um objeto por anúncio, campos abaixo } ] }`, na pasta do estudo.

## ⚠️ Instagram é distribuição, não captação

Anúncio cujo clique vai para o **perfil do Instagram** (ou que não tem botão) é **distribuição de conteúdo**: cria base
de seguidores, não capta lead. Não analise como se trouxesse cliente, e não diga que "capta" ou "gera lead".
**Captação** é só o clique que vira contato: WhatsApp, Direct, Messenger, formulário (da Meta ou externo), site/LP.
O `canal.mjs` marca isso sozinho nos campos `canal` e `objetivo` (`captacao` | `distribuicao`). Quando o anúncio
leva para uma LP, a análise da página segue a [REGUA-PAGINAS.md](REGUA-PAGINAS.md): anúncio e página se leem juntos. No `como_usar` de uma peça de
distribuição, diga como ela serviria para **crescer a base** de quem pediu o estudo, não para fechar cliente.

## Como analisar cada anúncio

Pasta: `midia/<ad_id>/`. Leia `anuncio.json` (texto, título, botão, destino, dias no ar, variações), a
`transcricao.txt` (a fala, se houver) e **olhe a imagem**: `folha.jpg` (12 quadros do vídeo, em ordem, da esquerda
para a direita e de cima para baixo) ou `imagem-1.jpg`/`peca-N.jpg` (estático e carrossel). O Whisper erra nomes de
marca: corrija pelo nome da página.

## Cinco critérios de 0 a 2 (total 0 a 10)

| Critério | O que mede |
|---|---|
| gancho | Para o dedo nos 2 primeiros segundos. Conta a fala e a imagem. Abrir com "oi, tudo bem?", apresentação da empresa ou frase genérica tira ponto. Chamar o público pelo nome ("Dentista,", "Dono de restaurante,") com a dor na mesma frase é forte |
| clareza | Dá para entender o que vendem, para quem, e o que fazer |
| prova | Evidência real: cliente com nome, número verificável, print de resultado, depoimento, o sistema funcionando na tela |
| diferenciacao | Foge do padrão do nicho: do que quase todo anúncio do estudo faz igual |
| aproveitavel | Quem pediu o estudo adapta sem quebrar as regras da casa (`sobre` do estudo.json). Promessa garantida, "ou não paga" e número inventado tiram ponto |

## Campos (um objeto por anúncio)

```json
{
  "ad_id": "…",
  "nicho": "<id de grupos>",            // um dos grupos do estudo.json
  "regiao": "Brasil | <cidade-UF>",     // a cidade que o anúncio cita; sem cidade, "Brasil"
  "local": false,                       // true só se o anúncio fala da região do estudo (estudo.json › regiao)
  "formato": "video | imagem | carrossel",// "video" quando é vídeo mesmo; vídeo parado sem fala conta como imagem
  "oferta": "uma frase: o que vende e o que oferece para o clique (ex.: 'Assessoria de tráfego para dentistas; diagnóstico grátis pelo WhatsApp')",
  "publico": "quem o anúncio chama, em 2 a 4 palavras e sempre do mesmo jeito no estudo (ex.: Donos de clínica | Mulheres 40+ | Quem perdeu dente | Qualquer pessoa)",
  "categoria": "prova-resultado | dor-do-dono | oferta-entrada | autoridade | educativo | demonstracao | comparacao | nicho | institucional | evento-curso",
  "categoria2": "outra da lista ou null",
  "gancho": "o que se vê e se fala nos 0–3 s, entre aspas quando for fala",
  "beneficios": ["ids da lista beneficios do estudo.json que o anúncio põe em destaque"],
  "notas": { "gancho": 0, "clareza": 0, "prova": 0, "diferenciacao": 0, "aproveitavel": 0 },
  "funciona": "2–3 frases: por que esse anúncio para o dedo e por que deve estar durando (o que sustenta os dias no ar)",
  "nao_funciona": "1–2 frases",
  "como_usar": "2–3 frases concretas: como quem pediu o estudo faria uma versão sua (com que caso real, para que público, com que gancho), respeitando as regras da casa",
  "fora": false,                         // true se NÃO é anúncio de concorrente (vaga de emprego, curso para leigo, produto sem relação). Aí só ad_id, fora e motivo
  "motivo": null
}
```

**Categorias:** prova-resultado (case, número, depoimento) · dor-do-dono (sem cliente, agenda vazia, depender de
indicação, perder lead no WhatsApp) · oferta-entrada (diagnóstico, análise, teste ou demonstração grátis como isca) ·
autoridade (quem é, há quanto tempo, quantos clientes) · educativo (dica, erro comum, mito) · demonstracao (a
ferramenta funcionando na tela) · comparacao (antes × depois, nós × o comum do mercado) · nicho (fala com um setor só e o
setor é a mensagem) · institucional (marca, evento da empresa) · evento-curso (evento, curso ou imersão).

**Benefícios:** use só os ids da lista `beneficios` do estudo.json. O `montar.mjs` também acha sozinho, pela
expressão de cada um, os que aparecem no texto e na fala. Se um benefício se repete nos anúncios e não está na
lista, avise o dono e proponha incluir.

Escreva em português do Brasil, com acento, frases curtas e concretas. Nada de "estratégia robusta" ou "alavancar".
