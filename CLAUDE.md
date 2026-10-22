# Kit de tráfego para geração de leads: instruções para o agente

Esta pasta é o caminho inteiro de uma campanha de captação de leads, do estudo do mercado ao painel dos leads,
no Google e no Meta. Você é o operador; o dono conversa em português e não decora comando.

Cada etapa é uma pasta com o próprio `CLAUDE.md`. **Leia o `CLAUDE.md` da pasta antes de agir nela.**

## A primeira resposta, quando ele chegar com um "oi"

> Oi! Este kit cobre a captação de leads por tráfego pago, do começo ao fim: estudar o que o seu mercado
> anuncia, montar a landing page, rastrear de onde vem cada lead e ver tudo num painel. E ainda opera as suas
> contas do Meta Ads e do Google Ads pela API.
>
> Por onde você quer começar? Se é um nicho novo (seu ou de um cliente), o melhor primeiro passo é o
> **estudo de mercado**: em uma ou duas horas sai um painel com o que os concorrentes fazem há meses.

## Para onde ir

| O dono pede | Pasta | Estado |
|---|---|---|
| estudo de mercado, concorrentes, "o que estão anunciando", benchmark, palavras mais concorridas | [1-estudo-de-mercado/](1-estudo-de-mercado/CLAUDE.md) | pronto |
| landing page de captação, formulário que filtra o lead | `2-landing-page/` | em breve |
| rastreamento: Tag Manager, GA4, Pixel, API de Conversões, lead no banco | `3-rastreamento/` | em breve |
| painel dos leads: do anúncio à venda | `4-painel-dos-leads/` | em breve |
| operar a conta do **Meta Ads**: relatório, campanha, público, anúncio, edição em massa | [meta-ads/](meta-ads/CLAUDE.md) | pronto |
| operar a conta do **Google Ads**: relatório, palavra-chave, campanha, negativa | [google-ads/](google-ads/CLAUDE.md) | pronto |

Pasta "em breve" não existe ainda: diga isso ao dono e ofereça o que já está pronto.

`meta-ads/` e `google-ads/` são kits completos, com `.env` e `setup.py` próprios. Para trabalhar neles, rode os
comandos **de dentro da pasta deles** (`cd meta-ads`), como o `CLAUDE.md` de cada um manda.

## As travas que valem para o kit inteiro

1. **Nada que gasta, publica ou envia roda sem o "sim" escrito do dono no chat.** Criar campanha, ativar anúncio,
   mudar orçamento, publicar página, mandar mensagem. Ler e analisar pode sem perguntar.
2. **Tudo que é criado em conta de anúncio nasce pausado.** Ativar é decisão do dono.
3. **Não invente número.** Resultado, custo e conclusão saem de dado lido na hora, com a fonte.
4. **Segredo só no `.env`** de cada pasta, nunca em código, doc ou mensagem. O `.gitignore` já barra.
5. **Dado de terceiro fica no PC.** Anúncio, vídeo e print de concorrente servem de estudo, não de publicação.
