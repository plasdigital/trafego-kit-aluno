# Rastreamento: instruções para o agente

Esta pasta monta o rastreamento do site do cliente pelo Tag Manager: Google Ads, Pixel da Meta e GA4 avisados a
cada lead, sem mexer no código do site de novo.

## Regras que não se pulam

1. **Leia antes** [../0-metodo/docs/onboarding-e-rastreamento.md](../0-metodo/docs/onboarding-e-rastreamento.md) (o
   checklist) e [../0-metodo/docs/instalar-rastreamento-gtm.md](../0-metodo/docs/instalar-rastreamento-gtm.md) (os
   10 passos). Este arquivo só diz o comando.
2. **`--publicar` põe as tags no ar para todo visitante:** só com o "sim" escrito do dono, depois do teste no modo
   de visualização.
3. **Nada de dado pessoal na camada de dados** (nome, telefone, e-mail em texto): ver §3.5 do guia.
4. **Campanha só liga depois da prova do dia seguinte:** um lead de teste passou por todas as pontas.

## As possibilidades

Rode de dentro de `scripts/` (`cd 3-rastreamento/scripts`).

| O dono pede | Comando | Muda o mundo? |
|---|---|---|
| ligar a automação ao Tag Manager (uma vez) | `python auth.py` | não (grava o token no `.env`) |
| ver o que já existe no container | `python montar.py --config <json> --listar` | não |
| criar as tags, gatilhos e variáveis | `python montar.py --config <json>` | cria no espaço de trabalho, **fora do ar** |
| pôr no ar | `python montar.py --config <json> --publicar` | **sim: só com o "sim"** |

## O que precisa estar configurado

- `scripts/.env` copiado de `scripts/.env.exemplo`, com `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (passo 1 do
  guia) e a Tag Manager API ativada no projeto do Google Cloud.
- Python 3 (os scripts só usam a biblioteca padrão; o `verificar.mjs` da raiz confere o Python).
- O JSON de configuração com os IDs (passo 5 do guia): container, conta, Google Ads, Pixel, GA4 e os eventos.

## As armadilhas

| O erro diz | O que é |
|---|---|
| `403` com a API ativada | ativou em outro projeto do Google Cloud: confira pelo número do projeto |
| tag no ar e nenhuma conversão | o container foi colado no layout errado ou o build subiu sem ele; abra o HTML do site e procure o `GTM-` |
| conversão em dobro | o GA4 está no Tag Manager **e** colado no código: deixe só um |
| Pixel dispara e o anúncio não vê | o Pixel não está atribuído à conta de anúncio no Gerenciador de Eventos |
