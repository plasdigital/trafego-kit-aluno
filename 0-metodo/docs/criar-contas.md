# Criar as contas e montar o rastreamento (a parte fixa do método)

O gestor, 26/11/2026: *"o que eu queria que fosse fixo era traqueamento, criação das contas, Tag Manager, Microsoft,
Google Analytics"*. Estrutura de campanha e otimização mudam de cliente para cliente; **isto aqui não muda**: sem conta
certa e sem rastreamento, nenhuma decisão de verba se justifica.

> ⚠️ **As plataformas mudam o painel e as regras o tempo todo.** Esta página diz **o que** precisa existir e **como deve
> ficar configurado**. O clique a clique de cada tela, confira na documentação oficial (links abaixo) **na data em que
> for fazer**. Se a tela não bater com o que está escrito aqui, vale a documentação oficial; anote a diferença.

## As regras que valem para todas

1. **Toda conta sai do e-mail do cliente** (um Gmail do projeto), nunca do gestor. O gestor entra como administrador
   ou parceiro. Na saída do contrato, tudo já é dele.
2. **Uma instalação de cada coisa.** Um Tag Manager por site; o GA4, o Pixel e as conversões entram **pelo Tag
   Manager**, nunca colados de novo no código (conta em dobro).
3. **Tag nasce pausada e se publica depois do teste** no modo de visualização.
4. **Teste não suja a métrica:** os números e aparelhos de teste ficam fora do CRM, da API de Conversões, do e-mail e do
   funil.
5. **Prova no dia seguinte:** um lead de teste passou por todas as pontas e só os lugares certos o receberam.

## A ordem

| # | Conta | Para quê | Como deve ficar | Documentação oficial |
|---|---|---|---|---|
| 1 | **Gmail do projeto** | é o dono de todas as outras | 2FA ligado; recuperação com o cliente | — |
| 2 | **Google Tag Manager** (conta + container Web) | instala tudo no site sem mexer no código de novo | um container por site; instalado uma vez (no `<head>` e o `noscript` no `<body>`) | [tagmanager.google.com](https://tagmanager.google.com) · [ajuda](https://support.google.com/tagmanager) · [API](https://developers.google.com/tag-platform/tag-manager/api/v2) |
| 3 | **Google Analytics 4** (conta + propriedade + fluxo de dados Web) | mede o site inteiro e o funil | fuso de São Paulo, moeda BRL, retenção de 14 meses, tráfego interno filtrado; eventos-chave `generate_lead` e `clique_whatsapp`; instalado pelo Tag Manager | [analytics.google.com](https://analytics.google.com) · [ajuda](https://support.google.com/analytics) |
| 4 | **Microsoft Clarity** (projeto do site) | mapa de calor e gravação de sessão: onde a pessoa rolou, clicou e desistiu | instalado pelo Tag Manager; ligado ao GA4 (integração do próprio Clarity) | [clarity.microsoft.com](https://clarity.microsoft.com) · [documentação](https://learn.microsoft.com/clarity/) |
| 5 | **Google Search Console** (propriedade do domínio) | o que as pessoas buscam até chegar no site | verificada pelo DNS; sitemap enviado; ligada ao GA4 | [search.google.com/search-console](https://search.google.com/search-console) · [ajuda](https://support.google.com/webmasters) |
| 6 | **Google Ads** (conta do cliente) | anúncio na busca | no nome do cliente, com o pagamento dele; ligada à MCC da agência; ligada ao GA4; conversão de lead pelo Tag Manager, só o lead como **principal** | [ads.google.com](https://ads.google.com) · [ajuda](https://support.google.com/google-ads) · [MCC](https://ads.google.com/home/tools/manager-accounts/) · [API](https://developers.google.com/google-ads/api/docs/start) |
| 7 | **Meta: Business Manager (Portfólio empresarial)** | dono da página, do Instagram, da conta de anúncio e do Pixel | do cliente; a BM da agência entra como **parceira** com controle total dos ativos; domínio verificado | [business.facebook.com](https://business.facebook.com) · [ajuda](https://www.facebook.com/business/help) |
| 8 | **Meta: conta de anúncio** | anúncio no Facebook e no Instagram | dentro da BM do cliente, com o pagamento dele; atribuída ao usuário do sistema da automação | (mesma ajuda) · [Marketing API](https://developers.facebook.com/docs/marketing-apis) |
| 9 | **Meta: Pixel (conjunto de dados) + API de Conversões** | o anúncio aprende com quem vira lead | evento `Lead` com `eventID` no navegador **e** na API de Conversões com o mesmo `event_id`; fora do perfil e teste não vão para a API | [API de Conversões](https://developers.facebook.com/docs/marketing-api/conversions-api) |
| 10 | **Banco do lead** (Supabase ou o que o cliente usar) | o lead gravado com a origem antes de ir para o WhatsApp | página, UTMs, gclid/gbraid/wbraid, fbclid, `fbp`/`fbc` e as respostas do formulário | [supabase.com/docs](https://supabase.com/docs) |

O passo a passo do Tag Manager (com os scripts que montam as tags pela API): [instalar-rastreamento-gtm.md](instalar-rastreamento-gtm.md).
O que pedir ao cliente e o checklist do rastreamento mínimo: [onboarding-e-rastreamento.md](onboarding-e-rastreamento.md).
A conferência da medição numa conta que já roda: [google-ads-parecer.md](google-ads-parecer.md), seção 2.

## Antes de dizer "pronto"

- [ ] O Tag Manager aparece **uma vez** no HTML do site (procure `GTM-`), e o GA4 não está colado também no código.
- [ ] No modo de visualização do Tag Manager, o envio do formulário dispara a conversão do Google, o `Lead` da Meta e o
      `generate_lead` do GA4, uma vez cada.
- [ ] No Gerenciador de Eventos da Meta, o `Lead` chega pelo navegador e pelo servidor, **deduplicado**.
- [ ] No Google Ads, a conversão de lead é a única **principal**; o resto é secundária.
- [ ] O Clarity grava sessões e o Search Console tem o sitemap lido.
- [ ] No dia seguinte, o lead de teste está no banco, e não está no CRM, na API de Conversões nem no funil.
