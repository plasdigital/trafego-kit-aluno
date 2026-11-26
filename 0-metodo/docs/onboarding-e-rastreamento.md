# Onboarding do cliente e rastreamento mínimo

A ordem dos acessos e o checklist do rastreamento, antes de ligar qualquer campanha. O passo a passo do Tag Manager está em [instalar-rastreamento-gtm.md](instalar-rastreamento-gtm.md).

## A ordem

1. **A pasta do cliente:** uma por cliente (`clientes/<cliente>/`), com a ficha da empresa (CNPJ, responsável, quem
   aprova), o grupo do WhatsApp com ele e a logo. É dela que a IA lê para não perguntar de novo.
2. **Raspar antes de perguntar:** site, Instagram, Google Maps, biblioteca de anúncios. O estudo de mercado vira o painel do cliente pela pasta `1-estudo-de-mercado/` (a mídia é baixada na hora: o link da Meta vence em dias). O `onboarding/perguntas.md` leva só o que falta, em blocos.
3. **Pedido de acessos** (no grupo, em ordem de prioridade):
   - Gmail do projeto;
   - **Meta:** você admin da BM do cliente e **a BM da sua agência como parceira**, com controle total de conta de anúncio, página, Pixel e WABA. Depois, atribuir os ativos ao usuário do sistema e **testar o token pela API na hora**. Parceria que falha: app ou usuário do sistema dentro da BM do cliente, que foi o que funcionou nos casos em que a parceria travou;
   - **Google Ads** no nome do cliente, ligado à MCC da agência, com o pagamento do cliente;
   - Hostinger/domínio/DNS, WordPress (Application Password), Google Business Profile **desde o dia 1** (a verificação demora);
   - Supabase do cliente (região São Paulo) quando houver LP com formulário.
4. **A foto do antes** (bloco 1 da coleta): leads, vendas, ticket e meta, com data. Sem ela não se prova resultado.
5. **Rastreamento mínimo** (abaixo), antes de ligar qualquer campanha.
6. **Ficha de contas** do cliente em `clientes/<cliente>/ads/contas.yaml` ([modelo](ficha-cliente.md)), com a data em que o token vence. É dela que a análise e os alertas leem.
7. **Diário de bordo nº 1** no fim da 1ª semana.

## Rastreamento mínimo de um cliente de leads

- [ ] **GTM** instalado uma vez só (sem gtag do GA4 colado junto, que conta em dobro); tags nascem paradas.
- [ ] **GA4:** fuso de SP, BRL, retenção de 14 meses, tráfego interno filtrado; eventos-chave `generate_lead` e `clique_whatsapp`.
- [ ] **Google Ads:** conversão de lead pelo GTM; vínculos GA4 ↔ Ads, Search Console ↔ GA4, Clarity ↔ GA4.
- [ ] **Meta:** Pixel `Lead` com `eventID` + **CAPI com o mesmo `event_id`**; domínio verificado na BM.
- [ ] **Lead gravado no Supabase do cliente** antes do redirecionamento ao WhatsApp, com página, UTMs, gclid/fbclid e as respostas do formulário.
- [ ] **E-mail de cada lead** para a agência e o comercial em até 1 min, e **envio ao CRM** do cliente.
- [ ] **Etiqueta de canal no Chatwoot** (`meta-ads`, `google-ads`).
- [ ] **Números de teste do gestor** cadastrados (fora do CRM, da CAPI, do e-mail e do funil).
- [ ] **Clarity** + **Search Console** com sitemap.
- [ ] **Segmentação dentro da área** (público por "pessoas que moram neste local", expansão desligada: fora da área não é lead).
- [ ] **Prova no dia seguinte:** um lead de teste passou por todas as pontas e só os lugares certos o receberam.