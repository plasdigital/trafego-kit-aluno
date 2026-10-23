# Tráfego para geração de leads, operado por IA

O caminho inteiro de uma campanha de captação, no Google e no Meta, numa pasta só. Você abre o Claude Code (ou
Codex, ou Antigravity) aqui dentro e conversa em português: a pasta sabe se explicar para ele.

```bash
git clone https://github.com/plasdigital/trafego-kit-aluno.git
cd trafego-kit-aluno
npm install
claude
```

E aí, na conversa: **"oi"**.

## As etapas

| | Etapa | O que sai | |
|---|---|---|---|
| 1 | **[Estudo de mercado](1-estudo-de-mercado/README.md)** | Um painel com o que os concorrentes anunciam há 30+ dias: destino, estilo, anúncios mais rodados, landing pages, perguntas do formulário, palavras mais concorridas | ✅ |
| 2 | Landing page de captação | A página com formulário de uma pergunta por vez, que filtra o lead sem perder ninguém | em breve |
| 3 | Rastreamento | Tag Manager, GA4, Pixel com API de Conversões, mapa de calor, lead no banco com a origem, e o que pedir ao cliente | em breve |
| 4 | Painel dos leads | O funil do anúncio à venda, com o custo de cada etapa | em breve |

E as duas ferramentas que operam as contas pela API oficial:

| Pasta | O que faz |
|---|---|
| [meta-ads/](meta-ads/README.md) | relatório, campanha, público, anúncio e edição em massa no Facebook e no Instagram |
| [google-ads/](google-ads/README.md) | relatório, planejador de palavras, campanha de pesquisa e negativas no Google |

## O que você precisa ter

Não precisa decorar esta tabela: no primeiro "oi", o agente roda o `verificar.mjs`, confere o seu PC e te mostra o
mapa do que está liberado, o que falta e o comando para instalar.

| Programa | Para que serve | Sem ele |
|---|---|---|
| um agente de IA de terminal | Claude Code, Codex ou Antigravity: é quem opera a pasta | nada roda |
| **Node 20+** e `npm install` | rodam os scripts e controlam o seu Chrome | não existe estudo |
| **Google Chrome** | lê a Biblioteca de Anúncios e abre as landing pages | não existe estudo |
| **ffmpeg** | a IA "vê" os vídeos em 12 quadros e o painel é montado | a busca roda, mas a IA não vê os vídeos e **o painel não sai** |
| **Python 3** + `faster-whisper` | a IA ouve o que é falado nos vídeos | o vídeo é avaliado só pela imagem e pela legenda |
| **Python 3** + o SDK de cada um | `meta-ads/` e `google-ads/` operam as contas | você não lê nem mexe na conta pela IA; as palavras do Google entram por CSV |

E onde o painel vai morar:

| Você quer | Precisa de |
|---|---|
| estudar sozinho | nada: o painel abre no seu PC, dois cliques |
| o cliente ver por um link | hospedagem de site + domínio, numa pasta com senha (não precisa de VPS) |
| o estudo rodar sozinho todo mês | uma VPS |

Recomendação: [hospedagem de site](https://www.hostg.xyz/aff_c?offer_id=6&aff_id=214984&url_id=3648) ou
[VPS](https://www.hostg.xyz/aff_c?offer_id=6&aff_id=214984&url_id=5038) da Hostinger, com o cupom `PEDROALMEIDA`
(10% de desconto).

O passo a passo da instalação está no [COMECE-AQUI.md](COMECE-AQUI.md).

## Uma regra antes de começar

**Comece lendo, não gastando.** O estudo de mercado só lê. Nas contas de anúncio, passe os primeiros dias só
puxando relatório. Tudo que a IA cria numa conta nasce pausado, e ativar é sempre uma decisão sua, dita no chat.
