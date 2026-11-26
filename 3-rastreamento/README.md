# 3 · Rastreamento

Faz o site do cliente avisar o Google Ads, o Meta e o GA4 toda vez que chega um lead, pelo Tag Manager, e deixa
pronto o caminho para a próxima tag sem tocar no código.

1. **O checklist** do que precisa estar de pé antes de ligar qualquer campanha (e o que pedir ao cliente):
   [onboarding-e-rastreamento.md](../0-metodo/docs/onboarding-e-rastreamento.md).
2. **O passo a passo**, do Google Cloud à prova no dia seguinte:
   [instalar-rastreamento-gtm.md](../0-metodo/docs/instalar-rastreamento-gtm.md).
3. **Os scripts** que montam as tags pela API: `scripts/auth.py` (uma vez) e `scripts/montar.py`.

Pixel com API de Conversões na Meta: [../meta-ads/docs/referencia/campanha-conversao-site.md](../meta-ads/docs/referencia/campanha-conversao-site.md).
Conversão e público de remarketing no Google: [../google-ads/docs/estrategia/rastreamento-de-conversao.md](../google-ads/docs/estrategia/rastreamento-de-conversao.md).
