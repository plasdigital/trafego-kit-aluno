# 1 · Estudo de mercado

Antes de gastar o primeiro real em anúncio, veja o que o seu mercado faz há meses. Esta pasta lê os anúncios que
os concorrentes mantêm no ar há 30+ dias na Biblioteca de Anúncios da Meta, abre as páginas para onde eles mandam,
e a IA analisa tudo. O resultado é um **painel de padrões** que abre no navegador:

- para onde vai o clique (WhatsApp, formulário, landing page) e quanto do mercado capta contato de verdade;
- o estilo dos anúncios: a estratégia, o formato, o público que chamam;
- os anúncios mais rodados, com vídeo, texto e o que se fala;
- o formato das landing pages e **o que elas perguntam no formulário**;
- os benefícios que todo mundo promete, e os que você tem e ninguém fala;
- no Google: as palavras mais procuradas e mais concorridas, com o lance do topo da página.

## Como usar

Abra o Claude Code na raiz do kit e peça:

> *"faz um estudo de mercado de clínicas de estética em Curitiba"*

Ele monta o `estudo.json` com você (o que você vende, as buscas, a região), roda a coleta e a análise, e abre o
painel. Leva de 1 a 3 horas no total, a maior parte rodando sozinho.

## O que precisa

| | Para | Sem ele |
|---|---|---|
| Node 20+ e Google Chrome | ler a Biblioteca e as páginas (de graça, pelo seu navegador) | não existe estudo |
| ffmpeg | a IA "ver" os vídeos em quadros e montar o painel | a IA não vê os vídeos e o painel não sai |
| Python + `faster-whisper` | a IA ouvir a fala dos vídeos, no seu PC | o vídeo é avaliado só pela imagem e pela legenda |
| Nenhuma chave de API | nada aqui é pago | |

O agente confere tudo isso sozinho (`node verificar.mjs`) e te diz o que falta.

## Para entender antes de rodar

[docs/01-o-metodo.md](docs/01-o-metodo.md): a regra dos 30 dias, captação × distribuição, o que cada bloco do
painel responde e como ele vira o plano do Google e do Meta.
