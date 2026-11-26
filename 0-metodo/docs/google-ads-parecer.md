# Parecer e otimização de Google Ads (Rede de Pesquisa)

Saiu dos pareceres e otimizações da consultoria de Google Ads de uma agência de tráfego parceira (contas de clínicas e de advocacia,
15 a 24/nov/2026), somados ao que se aprendeu na empresa de proteção veicular e na empresa de drywall e planejados. Serve para **assumir uma conta que já roda** (ou
que ficou parada) e para o parecer mensal. Planejamento de conta nova: [planejamento.md](planejamento.md). Copy de
anúncio de serviço: [anuncios.md](anuncios.md).

**Só leitura até o dono pedir.** O parecer lê; aplicar é outra etapa, com pedido explícito (seção 8).

---

## 1. Antes de tudo: saldo e pagamento

Pré-pago sem recarga automática apaga a campanha no meio do mês, e os buracos no gráfico de gasto denunciam isso. A
campanha "boa" pode estar só sem saldo. No pré-pago, o "limite de gasto" é o saldo: faz-se recarga, não se aumenta
limite. Alerta de saldo diz em quantos dias acaba (gasto médio de 7 dias) e sugere a recarga para 15 dias.

## 2. A medição: conferir antes de julgar o custo por conversão

- **Qual conversão é a principal?** O lance otimiza para o que estiver marcado como principal. Principal é só o lead
  (envio válido do formulário, com conversões otimizadas). Ligação conta "Uma". Perfil da empresa, remarketing e visita
  à página ficam como **secundárias**. Documente qual conversão é lead e qual não usar (duas com nome parecido enganam).
- **Sinais de medição quebrada:** formulário antigo com "Configuração incorreta", clique no WhatsApp sem medição,
  ligação contando "Todas".
- **Consentimento de cookies negado por padrão**, sem banner de aceite, faz a conversão sumir ou virar estimativa.
- **Guarde gclid, gbraid, wbraid e as UTMs por 90 dias** e mande junto com o lead: é assim que se sabe a palavra de
  cada lead.
- **Não teste com lead falso** na conta do cliente: confira no ar que a tag carrega e envia (resposta 200) e espere o
  status mudar. Conversão falsa suja a otimização.
- **Sem conversão medindo, o lance é "Maximizar cliques" com teto de CPC.** Só vira "Maximizar conversões" quando a
  medição estiver certa: lance por conversão às cegas otimiza errado.

## 3. Os termos de pesquisa

- **Agrupe os termos por tema**, com custo e conversão: o serviço vendido × genérico de profissão ou bairro × outros
  serviços × informacional. Num caso, só 13% da verba ia para o serviço anunciado.
- **Simule a lista de negativas no histórico antes de aplicar:** quanto bloquearia de custo e de conversão. Deixe de
  fora o termo que converteu.
- **Negativas por tipo de intenção:** barato ou grátis; emprego e curso; documento (pdf, tcc); cliente atual da empresa
  (login, boleto, segunda via); quem quer comprar outra coisa (loja, onde vende); marcas e outros sentidos da palavra;
  reclamação. **Termo de dor real fica**, mesmo parecendo negativo ("meu dente caiu"). Termo de preço também fica.
- **Ampla leva para longe do termo:** o específico vai em frase e exata, e a ampla se reavalia em 7 dias.
- **Grupos por intenção** (o problema, o público, o profissional). O Planejador da região costuma mostrar que o termo
  do problema é mais barato e mais certeiro que "profissional + serviço".
- **Antes de reativar uma conta parada, puxe o histórico inteiro de termos** para montar as negativas.

## 4. O que amplia sem você pedir

- **IA Max (AI Max) leva a verba para fora do tema:** num caso, 1/3 da verba foi para buscas fora do serviço. Negative
  o que não é do serviço, ou desligue por 2 semanas e compare.
- **Muito clique de fora do raio = local em "Presença ou interesse".** Troque para **Presença**.
- **Recomendação do Google de aumentar orçamento não se aceita** com a campanha mal segmentada, e a aplicação automática
  de recomendações fica desligada: mais verba no lugar errado amplia o problema.

## 5. As campanhas entre si

- **Campanha copiada herda tudo** (local, lance, IA Max, palavras, anúncio, sitelinks): pause o que veio e troque os
  recursos pelos do serviço novo. Sitelink do outro serviço já apareceu no anúncio novo.
- **Duas campanhas da mesma conta disputam a mesma busca:** a que tem histórico ganha e a nova fica com 0 impressões.
  Use o Diagnóstico de anúncios e negative uma contra a outra.
- Campanha em "Qualificada (aprendizado)" com 0 impressões por dias: diagnostique (leilão interno, disputa) antes de
  mexer no lance.

## 6. O anúncio e a página

- **Mais de um anúncio responsivo por grupo**, com sitelinks, frases de destaque e snippets. Recurso reprovado se
  refaz. Força "Médio" derruba CTR e qualidade.
- **Sitelink precisa de página ou âncora real**; site de uma página só limita.
- **O caminho exibido no anúncio não é página:** o clique cai onde a URL final manda. Busca de "serviço + preço" pede
  página própria (faixa de investimento, prova permitida, WhatsApp e botão de ligar).
- **Idade no Google só tem faixas fixas** (para público 40+, mantenha 35–44).
- **Setor regulado (saúde, advocacia):** anúncio informativo, sem promessa de resultado, preço, garantia ou depoimento.
  Na página de saúde, nome e registro do profissional no rodapé, e nenhuma promessa ("indolor", "dura 25 anos").
  3 anúncios por ângulo; o pior sai depois de ~2 semanas com cliques.
- **Termo regulado:** compre a palavra que o público busca (proteção veicular: "seguro"), mas escreva no anúncio o nome
  certo do produto. Confira a política do Google para o termo.

## 7. O diagnóstico fixo de 30 dias (o checklist do parecer)

1. Saldo, pagamento e status.
2. Medição: conversão principal, consentimento, secundárias.
3. Recursos reprovados.
4. Termos que gastam sem converter (agrupados por tema) e termos bons que ainda não são palavra.
5. Índice de Qualidade.
6. Limitada por orçamento ou por leilão.
7. IA Max, local "Presença ou interesse", disputa entre campanhas.
8. Dispositivo caro.
9. Recomendações do Google, com ressalva nas que só aumentam gasto.

**O formato do parecer:** os números e o que está bom → os problemas por prioridade → recomendações numeradas com o
efeito esperado → o veredito, o que ficou **não verificado** e a data de reavaliar. Campanha com poucos dias e ~50
cliques não se conclui: arrume a medição e reavalie em 14 dias.

## 8. Aplicar a otimização (só a pedido do dono)

- **Leitura e escrita são etapas separadas:** mostre antes o que muda, aplique com código separado do de leitura (o
  leitor não altera nada).
- **Registre no parecer:** a hora, o que mudou, "conferido na conta" (recarregando a página), o que não mudou, os
  efeitos não planejados (a plataforma às vezes muda mais do que se pediu, como reativar uma palavra pausada), o que não
  foi feito e a data de conferir.
- **Campanha nova sobe pausada**, com o pagamento conferido, e liga com o "pode ativar" do dono.

## 9. Conexão e acesso

- **Agência com vários clientes cria a MCC.** Vincular uma conta que já tem outro administrador avisa esse
  administrador: só com o OK do dono.
- **Se o acesso da API demorar ou for negado**, o **Script do Google Ads na MCC** manda os números para o painel de
  hora em hora, sem aprovação.
- **Pegadinhas:** a tela de consentimento OAuth em modo "Teste" derruba o login a cada 7 dias; a API em nível básico tem
  cota, então a leitura vai espaçada.
- **Alertas próprios do Google:** orçamento da conta acabando, conta suspensa, parou de gastar, gasto na semana sem
  nenhuma conversão, "não consegui ler".
