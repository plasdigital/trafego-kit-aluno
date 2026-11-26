# Ficha de contas e funil do cliente (`clientes/<cliente>/ads/contas.yaml`)

Uma ficha por cliente, sempre no mesmo formato. É dela que a análise, o relatório e os alertas leem, e
é o que deixa a este método genérica. Hoje cada cliente tem um formato (empresa de proteção veicular e Help num, MA em
`clientes.json`, Google numa lista central); cliente novo já nasce neste, e os antigos migram quando forem
mexidos.

**Nunca segredo aqui:** token e senha ficam no `.env.local`; a ficha guarda o **caminho** da variável.

```yaml
slug: <UM CLIENTE>
nome: empresa de proteção veicular Benefícios
ativo: true
responsavel_cliente: "<nome do comercial que recebe o lead>"

meta:
  business_manager: "<id>"
  conta_anuncio: "act_<id>"
  contas_fora_de_uso: []            # a antiga, para nunca ler a errada
  pagina: "<id>"
  instagram_id: "<id>"
  pixel: "<id>"
  pagamento: cartao                 # cartao | pre_pago | boleto
  acesso: system_user_cliente       # agencia | system_user_cliente | usuario_60d
  token_env: "clientes/<cliente>/ferramentas/meta/.env.local::META_ADS_TOKEN"
  token_vence: 2026-12-02           # ou "nunca" (usuário do sistema)

google:
  customer_id: "<id>"
  mcc: "8686957431"
  pagamento: cartao                 # cartao | pre_pago_budget
  conversao_principal: "Lead/Orçamento enviado"

rastreamento: {gtm: "GTM-XXXX", ga4: "<id>", clarity: "<id>", search_console: true, capi: true}

funil:
  destino: lp_formulario            # lp_formulario | whatsapp_direto
  lp: "https://lp.exemplo.com.br/"
  banco: {supabase_ref: "<ref>", visitas: public.visitas, leads: public.leads}
  whatsapp: {chatwoot_conta: 2, chatwoot_caixa: 7, atende_pelo_chatwoot: false}
  casamento: telefone_8_digitos     # telefone_8_digitos | ctwa_clid | codigo_na_mensagem | event_id
  crm: {sistema: powercrm, so_leitura: true, etapas: [negociacao, proposta, vistoria, vendido, arquivado]}
  lead_valido: "nome + WhatsApp + placa válida, dentro do perfil"
  fora_do_perfil: ["van/utilitário", "caminhão", "fora do RJ"]
  venda: {fonte: crm_e_confirmacao_cliente, valor: "mensalidade do plano"}
  area: "estado do Rio de Janeiro"
  horario_atendimento: "08-20"
  rastreio_desde: {lp: 2026-10-13, medidas: 2026-10-19}   # antes disso, "—"
  numeros_teste_env: "integracao.config.numeros_teste"

regua:
  custo_alvo: 15                    # por lead (ou por conversa, se destino = whatsapp_direto)
  custo_teto: 20
  corte: "2x a meta sem lead"
  nao_julgar_dias: 7

alertas:
  destinos: [dono]                  # dono | grupo | email
  saldo_dias_aviso: 5
  saldo_minimo: 50
  sem_conversao_horas: 24

regras_proprias:
  - "Setor regulado (SUSEP): proteção veicular não é seguro."
  - "O CRM não é atualizado pela equipe: venda se confirma com o cliente."
```

Campos que **variam de verdade** entre clientes (por isso estão aqui e não na skill): destino do anúncio,
como se casa cada etapa, o que conta como lead e como venda, a régua de custo, a área e o horário, as
datas em que cada rastreio começou e as regras do setor do cliente.
