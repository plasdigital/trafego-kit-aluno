# O método: instruções para o agente

Esta pasta é o **como se faz** do tráfego para geração de leads, escrito a partir de campanhas reais (proteção
veicular, farmácia, drywall e planejados, rastreamento veicular). Não tem script: é a régua que você usa antes de
planejar, criar, subir, analisar e relatar. **Leia o documento da linha antes de responder ou agir.**

## Regras que não se pulam

1. **Nada que gasta, publica ou envia roda sem o "sim" escrito do dono no chat.** Campanha nasce pausada.
2. **Fora da área de atendimento não é lead.** Cidade só da área, expansão de local desligada.
3. **Primeiro o status, depois a conclusão.** Antes de dizer "não trouxe lead", confira se a campanha estava ativa,
   com saldo e entregando.
4. **Não invente número.** Tudo sai de dado lido na hora, com período e fonte; amostra pequena se diz.
5. **Número de teste do dono não entra** em métrica, CRM, API de Conversões nem e-mail.
6. **Pesquise antes de configurar ou recomendar.** Meta, Google e as ferramentas mudam o painel, as regras e a API o
   tempo todo. Antes de mexer numa conta ou afirmar como uma configuração funciona, confira a **documentação oficial**
   (tabela abaixo) e, para código, o **repositório oficial** da biblioteca, na data de hoje. Se o que está escrito
   aqui não bater com a fonte oficial, vale a fonte oficial: diga ao dono o que mudou.

## O que é fixo e o que é aprendizado

| Fixo (faça assim) | Aprendizado (ponto de partida: pergunte ao dono) |
|---|---|
| Criar as contas certas, no nome do cliente: [docs/criar-contas.md](docs/criar-contas.md) | Estrutura da campanha (um conjunto só × vencedor protegido; uma campanha por perfil) |
| O rastreamento ponta a ponta: Tag Manager, Google Analytics, Microsoft Clarity, Google Ads, Pixel + API de Conversões, Search Console, lead no banco | Quantos criativos testar por vez, de quanto em quanto tempo trocar |
| As travas acima (pausado, dentro da área, teste fora da métrica) | Quantos dias deixar aprender antes de mexer; otimizar todo dia ou por semana |
| Os parâmetros gerais de otimização: a régua de quando pausar, o que é custo bom e ruim ([docs/otimizacao-criativo.md](docs/otimizacao-criativo.md)) | Como aplicar a régua no dia a dia daquela conta |

As seções **"Aprendizados de …"** dos documentos vêm de campanhas reais de negócio local. Use como ponto de partida e
**pergunte ao dono antes de montar ou otimizar**: *"Como você quer estruturar? Quer que eu otimize todo dia pela régua
ou prefere revisar comigo uma vez por semana? Quer começar com quantos criativos?"* A decisão é dele; registre a
escolha e o resultado, para virar aprendizado também.

## Documentação oficial (confira na hora)

| Plataforma | Ajuda | Para código |
|---|---|---|
| Meta Ads | [facebook.com/business/help](https://www.facebook.com/business/help) | [Marketing API](https://developers.facebook.com/docs/marketing-apis) · [API de Conversões](https://developers.facebook.com/docs/marketing-api/conversions-api) · [SDK Python](https://github.com/facebook/facebook-python-business-sdk) |
| Google Ads | [support.google.com/google-ads](https://support.google.com/google-ads) | [Google Ads API](https://developers.google.com/google-ads/api/docs/start) · [biblioteca Python](https://github.com/googleads/google-ads-python) |
| Tag Manager | [support.google.com/tagmanager](https://support.google.com/tagmanager) | [Tag Manager API](https://developers.google.com/tag-platform/tag-manager/api/v2) |
| Google Analytics 4 | [support.google.com/analytics](https://support.google.com/analytics) | [Admin API](https://developers.google.com/analytics/devguides/config/admin/v1) |
| Microsoft Clarity | [learn.microsoft.com/clarity](https://learn.microsoft.com/clarity/) | — |
| Search Console | [support.google.com/webmasters](https://support.google.com/webmasters) | — |

## O dono pede → você lê

| O dono pede | Leia | Entrega |
|---|---|---|
| "como funciona o trabalho?", "explica o que a gente faz", proposta, as etapas | [docs/metodo.md](docs/metodo.md) | as 10 etapas e o pitch |
| criar as contas: Tag Manager, Google Analytics, Microsoft Clarity, Search Console, Google Ads, BM, conta de anúncio e Pixel da Meta | [docs/criar-contas.md](docs/criar-contas.md) | as contas criadas e conferidas, uma a uma |
| cliente novo, "o que pedir ao cliente", acessos, BM, rastreamento mínimo | [docs/onboarding-e-rastreamento.md](docs/onboarding-e-rastreamento.md) · [docs/instalar-rastreamento-gtm.md](docs/instalar-rastreamento-gtm.md) · [docs/ficha-cliente.md](docs/ficha-cliente.md) | a lista do que falta, por dono, e o checklist |
| estudo de mercado, concorrentes, referências de criativo | [docs/concorrentes.md](docs/concorrentes.md) e a pasta [../1-estudo-de-mercado/](../1-estudo-de-mercado/AGENTS.md) | o painel do estudo |
| "faz o planejamento do Google/Meta", estrutura de campanha, verba | [docs/planejamento.md](docs/planejamento.md) | o plano, para o cliente ver antes de gastar |
| criar, revisar ou aprovar anúncio com o cliente (copy, oferta, o que pode e não pode) | [docs/anuncios.md](docs/anuncios.md) | anúncio no checklist, aprovado antes de subir |
| "que criativo eu faço?", roteiro, ganchos | [docs/criativos.md](docs/criativos.md) · [docs/acervo-criativos.md](docs/acervo-criativos.md) | 4 a 6 conceitos de famílias diferentes, com roteiro e ganchos |
| landing page, formulário que filtra o lead | [docs/formulario-inteligente.md](docs/formulario-inteligente.md) | as 10 peças do formulário |
| "analisa as métricas / a campanha / os leads" | [docs/analise-funil.md](docs/analise-funil.md) | o funil do anúncio à venda, degrau por degrau |
| "por que esse criativo funcionou?", lead a lead, quem compra | [docs/diagnostico-criativo.md](docs/diagnostico-criativo.md) | o mapa dos criativos |
| assumir uma conta de Google Ads que já roda (ou parou), parecer do mês, "por que o Google gasta e não traz lead?" | [docs/google-ads-parecer.md](docs/google-ads-parecer.md) | o parecer no formato fixo; otimização só a pedido |
| "pausa ou espera esse anúncio?" | [docs/otimizacao-criativo.md](docs/otimizacao-criativo.md) | a ação por anúncio, pela régua de gasto × leads |
| "gera a mensagem pro cliente", relatório da semana | [docs/relatorio-cliente.md](docs/relatorio-cliente.md) | a mensagem de WhatsApp, primeiro para o dono aprovar |
| consultoria: ensinar o dono de uma empresa a operar o próprio tráfego | [docs/consultoria.md](docs/consultoria.md) | a ordem das sessões e o que fica com ele |

## Para operar as contas

Ler e mexer na conta de anúncio é com as pastas irmãs, pela API oficial: [../meta-ads/](../meta-ads/AGENTS.md) e
[../google-ads/](../google-ads/AGENTS.md). Este método diz **o que** fazer; elas dizem **o comando**.

## Onde o método melhora

Aprendeu algo num cliente (o que deu certo, o que deu errado)? Anote no documento da etapa, com a data e o porquê.
É assim que a régua fica melhor a cada campanha.
