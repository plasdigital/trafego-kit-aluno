# Análise profunda do funil: o que olhar em cada etapa

o gestor, 22/out/2026: *"quero uma análise profunda... o lead chegou dentro do site, 10 pessoas que viram,
quem rolou até o final, quem começou o formulário, onde que ele parou, quem preencheu... e depois o
WhatsApp: qual é o perfil de quem preencheu e mandou mensagem, quem não mandou, o pessoal está
respondendo, em que etapa está, por que foi arquivado."*

A análise é **só leitura**. Ela nunca pausa, liga, muda verba, público ou palavra e não mexe no CRM.
Tudo vira recomendação numerada no fim, e o gestor decide.

Nasceu de dois clientes, e cada regra aqui foi aprendida num deles:
- farmácia, anúncio que vai direto para o WhatsApp:
  `/analise`;
- empresa de proteção veicular, LP com formulário, CRM e WhatsApp:
  raio-x da LP e
  aprendizados.

---

## As 6 etapas

```
1 ANÚNCIO → 2 PÁGINA → 3 FORMULÁRIO → 4 WHATSAPP → 5 ATENDIMENTO/CRM → 6 VENDA (com valor)
```

Cliente sem LP, com o anúncio indo direto para o WhatsApp (caso da farmácia), pula as etapas 2 e 3, e o
degrau do meio vira "a plataforma diz × chegou no WhatsApp".

Para cada etapa, abaixo: **a pergunta**, **de onde vem o número** e **a armadilha**.

### 1. Anúncio: a plataforma diz

| Pergunta | Fonte | Armadilha |
|---|---|---|
| A campanha está rodando? **Primeiro o status, depois a conclusão** | Status ao vivo da conta (pagamento, `account_status`), da campanha, do conjunto e do anúncio | "Não trouxe lead" com a campanha parada, sem pagamento ou reprovada é outro diagnóstico. Se não der para ler, o relatório abre com **"⚠️ Status NÃO verificado"** |
| Quanto gastou, com quantas impressões, cliques no link, CTR, CPM e CPC? | Meta: Graph API ou MCP (`ads_get_ad_entities`). Google: `analise.py` / GAQL | Comparar sempre com o **período anterior do mesmo tamanho**. Hoje fica de fora (dia não fechado). **Gasto da Meta sempre com imposto** (o gestor, 26/10/2026): a Meta retém **12,15%** de cada recarga (PIS, COFINS e ISS) e o `spend` vem sem isso. Custo real = `spend ÷ 0,8785` (+13,83%), e é com ele que se calcula o custo por lead e se aplica a régua. Prova na empresa de proteção veicular: o Pix de R$ 300 subiu o teto em R$ 263,55. Google: imposto ainda não conferido, dizer isso no relatório |
| Qual anúncio, conjunto, palavra ou termo trouxe o quê? | Por anúncio (Meta) e por grupo, palavra e termo de busca (Google) | Ler por canal; nunca somar Meta e Google num número só |
| O anúncio está atraindo o público certo? | Segmentação lida pela API | Lead de fora da área **não é lead** (regra universal §6). Conferir "Pessoas que moram neste local" e a expansão de local desligada na Meta, e "Presença" no Google |
| O que mudou no período? | Log de atividade da Meta, `change_event` do Google (guarda só 30 dias), commits, tarefas | Toda mudança vai para a **linha do tempo**, com o antes × depois e o tamanho da amostra |

### 2. Página: clicou → abriu → rolou

| Pergunta | Fonte | Armadilha |
|---|---|---|
| Dos que clicaram, quantos abriram a página (connect rate)? | Cliques no link × visitas na tabela de visitas da LP | O `landing_page_view` da Meta dá ~70% dos cliques (o Pixel carrega depois). **Contar pela visita**, não por ele. **Métrica fixa do gestor (27/10/2026):** sempre os três por anúncio. Clique → visita = perda no carregamento (alerta < 90%). Clique → page view = quem fecha antes do Pixel (alerta < 60%) |
| Quanto tempo ficou e até onde rolou quem **não** tocou no formulário? | `medidas.saida1_s` (desde 29/10/2026; antes, `atualizado_em − criado_em` da visita com `medidas.saidas` ≥ 1), `medidas.rolagem`, `medidas.secao`; Clarity (mapa de calor, gravação, "voltar rápido", clique morto) | **Nunca usar o `medidas.tempo_s`**: ele só conta com a página "visível", e o navegador do Instagram/Facebook não avisa isso, então fica em 0 até para quem enviou a cotação 60 s depois (empresa de proteção veicular, 29/10/2026). Separar em faixas: **saiu em até 3 s** (curioso, clique sem querer, página lenta), **olhou de 3 a 30 s sem tocar** (leu e não se convenceu) e **30 s ou mais** (pode ser página aberta em segundo plano). O GA4 também perde o tempo nesse navegador |
| Quantos **esperaram a página carregar**? | `medidas.carga` presente (sai no evento `load`); `medidas.js_ms` = do clique até a página aparecer | **Métrica fixa do gestor (29/10/2026):** cliques → chegaram → esperaram carregar → página vista pela Meta, por anúncio. A "visualização da página" da Meta só conta quando o Pixel carrega e fica bem abaixo das visitas (empresa de proteção veicular: 9 contra 17); ela não prova visita inflada. Antes de contar, tirar os verificadores: tela 2000×2000, visita da Meta sem `posicionamento` e rajada de 3 ou mais visitas do mesmo anúncio em 20 s, de aparelhos diferentes |
| A página demorou para carregar para quem saiu rápido? | `medidas.carga`, `js_ms`; teste em 4G simulado | Página lenta derruba a etapa 2 inteira, e a culpa não é do anúncio |
| Quem saiu, que tela e que navegador tinha? | `tela` e `user_agent` (FBAN/FBAV = navegador do Instagram/Facebook) | Perda concentrada no celular pequeno é **diagramação** (o formulário ficou abaixo da 1ª tela), não falta de interesse |
| A página respondeu o que o anúncio prometeu? | Abrir a página no ar ao lado do criativo | Anúncio promete preço/prova e a página não mostra → hipótese forte para "vê e não toca" |

### 3. Formulário: viu → começou → em que pergunta parou → enviou

| Pergunta | Fonte | Armadilha |
|---|---|---|
| Quantos **viram** o formulário? | `viu_form_em` | — |
| Quantos **começaram** a preencher? | `comecou_em` (contar também quem tem `whatsapp_em` sem `comecou_em`: foi preenchimento automático) | Quanto tempo entre chegar e tocar, para quem envia e para quem larga: mostra se a decisão é no 1º olhar |
| **Em que pergunta cada um parou?** | `ultimo_campo` contra a ordem do formulário; `medidas.etapa`, `medidas.tempos` | Olhar **o que a pessoa digitou** antes de parar: placa recusada, CEP vazio, campo confuso |
| Qual **erro** barrou o envio? | `medidas.erros`, `medidas.ultimo_erro` (`placa:formato`, `cep:vazio`…), `voltou`, `falhas` (não salvou: rede) | Erro de validação parece desinteresse no número total |
| Quantos **enviaram**? Quantos estão **fora do perfil**? | Tabela de leads; coluna `fora_perfil` | Fora do perfil (categoria não atendida, fora da área) **não conta como lead**, mas é contado à parte: mostra se esse público está chegando |
| Quem largou **deixando o WhatsApp**? | `desistencias` (só na tela) | É lead perdido: vai para o comercial (cotação incompleta). Nunca vai para arquivo nem relatório com nome |
| A taxa "viu → tocou → enviou" muda por anúncio e por horário? | Visitas cortadas por `utm_content` e hora | Anúncio que traz quem olha e sai × anúncio que traz quem tenta cotar |

### 4. WhatsApp: chegou? quem chamou e quem não chamou?

| Pergunta | Fonte | Armadilha |
|---|---|---|
| Quantos dos que enviaram **chegaram** no WhatsApp? | Chatwoot (conversa por telefone, 8 ou 9 últimos dígitos) ou o casamento da farmácia (`ctwa_clid` da Meta; código na mensagem ou janela de horário no Google) | A Meta conta conversas "fantasma": na farmácia, 29% nunca chegaram. **A métrica que manda é a que chegou**, não a da plataforma |
| **Perfil de quem chamou × de quem não chamou** | Respostas do formulário (veículo, região, proteção hoje…) cruzadas com a conversa | Se um perfil inteiro não chama, o problema é a etapa entre o formulário e o WhatsApp, não o anúncio |
| O que marcou no formulário **bate** com o que respondeu no WhatsApp? | Formulário × conversa | Divergência aponta formulário confuso ou anúncio atraindo o público errado (o caso do "carro pessoal" que era aplicativo) |
| A empresa **respondeu**? Em quanto tempo? A pessoa **respondeu de volta**? | Chatwoot: 1ª resposta, última mensagem de cada lado | Conversa sem resposta no Chatwoot não prova que ninguém atendeu: pode ter sido por ligação. Dizer quando o cliente atende por fora |

### 5. Atendimento / CRM: em que etapa está e por que parou

| Pergunta | Fonte | Armadilha |
|---|---|---|
| Em que etapa está cada lead (em negociação, proposta, vistoria, vendido, arquivado)? | CRM do cliente (Power CRM na empresa de proteção veicular, Hub na farmácia), só leitura | O CRM costuma estar desatualizado: **"0 venda no CRM" não prova nada**. Confirmar com o cliente antes de concluir |
| **Por que foi arquivado / por que não comprou?** | Motivo do CRM + leitura da conversa, **um motivo principal por lead**, numa lista fechada (seção abaixo) | Contar os motivos, nunca listar pessoas |
| Quantos nunca responderam nada? Quantos responderam e pararam? Quantos receberam proposta? | Conversa + CRM | É a pergunta que o gestor mais repete: trazer sempre em número |
| Teve card duplicado (o vendedor criou outro à mão)? | Busca por placa ou telefone | O card "gêmeo" tira o crédito do tráfego |

### 6. Venda: quantos e **quanto**

| Pergunta | Fonte | Armadilha |
|---|---|---|
| Quantos compraram e **qual o valor**? | CRM, marcação do cliente ou leitura da conversa (total informado) | **O valor é obrigatório** (o gestor, 19/out/2026). Venda sem valor aparece como "valor —" e se conta à parte |
| Qual o **retorno**? | Vendido ÷ gasto | Retorno é faturamento, não lucro: dizer isso uma vez |
| O custo de **cada degrau** | Gasto ÷ clique, visita, início de formulário, lead, conversa, proposta, venda | Mostrar o custo de cada degrau mostra onde o dinheiro vaza |

---

## Motivos de perda (lista fechada, um por lead)

Começar por esta lista e adaptar na ficha do cliente. Contar, nunca nomear.

1. Não respondeu nada depois do 1º contato
2. Respondeu e parou (sumiu no meio)
3. Fora do perfil (categoria que o cliente não atende, carro velho, fora da área)
4. Preço / achou caro
5. Falta de produto ou condição que o cliente não oferece
6. Empresa demorou ou não respondeu
7. Prometeu voltar
8. Já tem o serviço com outro
9. Outro (uma palavra)

---

## Regras de leitura (valem para todo cliente)

1. **A métrica que manda é a que chegou** (no WhatsApp ou como lead válido no banco), não a da plataforma.
2. **Análise é da campanha ativa.** O histórico entra só como comparação.
3. **Período anterior do mesmo tamanho**, sempre. Hoje fica de fora ou aparece como parcial.
4. **"—" nunca vira zero.** O que não dá para medir aparece como "—", com o motivo (rastreio que ainda não existia, por exemplo).
5. **Amostra pequena se diz.** Menos de ~30 pessoas na etapa: recomendar esperar. Cada achado diz se **prova** ou se é **hipótese**, e a hipótese vem com o teste que a prova.
6. **Volume pesa tanto quanto custo.** Não tirar verba de quem traz volume para dar a quem está barato numa amostra pequena.
7. **Primeiro o status, depois a conclusão** (etapa 1).
8. **Tirar o que não é gente** antes de contar: a prévia do Gerenciador, os testes do gestor (números de teste da ficha, nome "teste", `origem = lp-teste`), robôs (tela 360×800 sem aparelho) e lixo (nome embaralhado, telefone fixo, placa inválida).
9. **Separar por canal sempre**; dentro dele, por anúncio, conjunto ou palavra; e cortar por horário, posicionamento, tela e região.
10. **Fora da área não é lead.** Fora do perfil se conta à parte.
10a. **Lead é quem deixou o telefone, não só quem enviou** (o gestor, 26/out/2026: *"a Meta marcou 32, 33, sei lá. Só
    que no final das contas foram gerados 39"*). O total de leads da campanha é **completos (enviaram) + incompletos
    (deixaram o WhatsApp e pararam)**, todos no perfil, contados por número único. Os dois aparecem sempre **separados e
    somados**: o incompleto é lead de qualidade menor, mas foi para o comercial. O "Lead" da plataforma só conta quem
    enviou, e ainda depende da janela de atribuição; ele entra como referência ("a Meta marcou X"), nunca como o total.
    O **custo por lead** usa o total; o custo por cotação completa vem ao lado.
11. **O valor vendido** aparece em toda tabela que tem "compraram", com o retorno.
12. **Toda mudança vai para a linha do tempo**, com o antes × depois.
13. 🔒 **LGPD:** a conversa é lida para classificar e **nunca** vai para o relatório, arquivo ou commit. Só contagens. Script com dado pessoal imprime só na tela. Lead com contato só se mostra na tela, quando o gestor pede para repassar ao comercial.
14. **Régua de custo é do cliente** (fica na ficha): farmácia, R$ 7–8 por conversa; empresa de proteção veicular, R$ 15 por lead com placa e teto de R$ 20. Regra geral de corte: anúncio que gastou 2× a meta sem nenhum lead desliga; não julgar abaixo de ~R$ 30 gastos nem as últimas 48 h; não mexer nos 7 primeiros dias; verba sobe no máximo 20% a cada 3 ou 4 dias. A tabela completa por anúncio (inclusive o caso de 1 lead caro) e o porquê estão em [otimizacao-criativo.md](otimizacao-criativo.md).

---

## O relatório (formato fixo)

Grava em `clientes/<cliente>/ads/analises/AAAA-MM-DD-<canal>-<de>-a-<ate>.md` e mostra na conversa uma
versão mais curta. As seções vêm nesta ordem e com estes nomes:

1. **Resumo em 3 linhas:** o placar com o valor vendido e o retorno, o que mudou e a principal recomendação.
2. **Status:** campanha, conjunto e anúncio ativos? Pagamento ok? Segmentação dentro da área?
3. **Placar do funil:** uma linha por etapa (gasto → cliques → visitas → viram o formulário → começaram → deixaram o WhatsApp → enviaram (completos) + pararam (incompletos) = **total de leads** (regra 10a) → fora do perfil → chegaram no WhatsApp → responderam → proposta → venda → valor), com a **taxa de passagem** e o **custo de cada degrau**. Período × anterior.
4. **Onde o funil fura:** a etapa com a maior queda, o que prova e o que é hipótese.
5. **Página e formulário:** rolagem, tempo, em que pergunta pararam, erros, tela e navegador.
6. **WhatsApp e atendimento:** quem chamou × quem não chamou (perfil), quem respondeu, etapa no CRM e motivos de perda em contagem.
7. **Por anúncio, conjunto ou palavra:** gasto, leads, vendas, valor, custo por lead, com a régua aplicada.
8. **O que mudou no período:** a linha do tempo, com o efeito de cada mudança.
9. **Medição:** o que está parado, quebrado ou faltando para a próxima análise ser melhor.
10. **Recomendações:** numeradas, cada uma com o número que a sustenta e quem decide (o gestor, cliente ou IA com OK).

Depois do relatório, a **mensagem para o grupo do cliente** sai no formato de
[relatorio-cliente.md](relatorio-cliente.md), primeiro para o gestor.
