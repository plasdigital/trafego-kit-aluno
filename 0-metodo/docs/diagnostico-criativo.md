# Manual de análise: do lead ao criativo (o método do cientista)

O gestor, 18/11/2026:

> *"Quero entender muito bem por que aquele criativo funcionou e aquele não funcionou… levanta sempre suposições…
> para cada etapa do funil… A gente está tentando ser meio que um cientista."*
>
> *"Análise individual para depois ter uma análise total… um lead por vez… depois a gente volta a IA para analisar
> todos esses dados."*
>
> *"Tem coisa que é regra… mas são poucas. A maioria vai ser indicações: induz, mas não determina."*

Vale para todo cliente de leads. Serve para anúncio em vídeo e imagem e também para vídeo de YouTube e arte orgânica
(nesses, a etapa "clique no anúncio" vira o clique no conteúdo).

Exemplo aplicado:
`clientes/<cliente>/ads/mapa-dos-criativos.md`

Método de base: um item por vez, uma ficha de campos fixos guardada para cada um, e a conta (média, %, ranking)
feita por script em cima das fichas, nunca de cabeça em cima do bruto.

**Índice (as "abas"):**
1. O que manda no fim
2. Que análise fazer (menu)
3. Regras × sinais × selos
4. A ficha do lead
5. A ficha do criativo
6. Etapa por etapa: métrica, qualificado × desqualificado, possibilidades e ação
7. WhatsApp e venda (a análise de uma semana depois)
8. Andrômeda: o criativo escolhe o público
9. O ciclo do cientista e a transferência para outro contexto
10. Como entregar

---

## 1. O que manda no fim

A ordem de importância. Uma métrica de baixo nunca ganha de uma de cima:

1. **Venda** (e o valor).
2. **Lead qualificado** (no marketing da agência é o que se entrega: na empresa de proteção veicular, completo com placa).
3. **Lead que responde no WhatsApp.**
4. **Lead** (deixou o contato).
5. Interesse na página (tocou no formulário, rolou, ficou).
6. Clique, CTR, page view, hook.

O gestor: *"todas as vendas vieram do pior criativo, que tem o menor CTR, a menor taxa de conversão… isso é o melhor criativo
que existe, porque o que importa no final das contas é a venda e o lead qualificado."*

Por isso:
- CTR, hook e "% nitidamente desqualificado" **explicam**;
- quem **decide** é o lead qualificado e a venda.

Um criativo com 50% de cliques que saem em 3 s pode ser o melhor da conta se os outros 50% compram.

---

## 2. Que análise fazer (menu)

Escolher pelo que se quer saber; cada uma tem a sua profundidade.

| Análise | Pergunta que responde | Quando | Base |
|---|---|---|---|
| **Uma etapa só** | "o CTR está baixo por quê?" | um número fora do normal | §6, só a etapa |
| **Até uma etapa** | "o anúncio está trazendo gente à página?" | criativo novo, poucos dias | §6, da entrega até a etapa |
| **Funil completo** | "onde o dinheiro se perde?" | toda semana | §6 inteiro, por criativo |
| **Por criativo** | "por que este funcionou e aquele não?" | pausa, teste novo, criativo para outra região | §5 + §6 + §9 |
| **Lead a lead** | "como o lead se comporta, e o que separa quem responde, quem qualifica e quem compra?" | 1× por semana, com os leads da semana anterior | §4 + §7 |
| **Por perfil** | "como age o qualificado, o desqualificado e o que não responde?" | depois de ter as fichas | §4 agrupado |
| **No tempo** | "piorou ou é a semana?" | antes de pausar | mês × 14 dias × semana anterior × 7 dias ([otimizacao-criativo.md](otimizacao-criativo.md) §4.2) |

---

## 3. Regras × sinais × selos

- **Regra (sempre).** Poucas. Valem em todo cliente e em toda época. Violou, não funciona. Exemplos:
  1. **Gancho que para nos 3 primeiros segundos.** "Oi, gente, me chamo o gestor e hoje eu vou falar…" nunca funciona.
  2. **O que importa vai no começo.** Oferta, público e prova ficam nos primeiros 5 s do vídeo, na 1ª linha do texto
     e no topo da página. O tempo médio de vídeo é de 3–8 s, e quem vira lead decide no topo da página.
  3. **Quem julga é o lead qualificado e a venda** (§1).
  4. **Fora da área não é lead.**
- **Sinal (geralmente).** A maioria. Induz, não determina: "fique atento, geralmente é assim". Sempre com um selo:
  - ✅ **forte:** repete em 3+ casos ou tem 100+ visitas;
  - 🟡 **provável:** 2 casos ou amostra média;
  - ⚪ **possível:** 1 caso ou amostra pequena; vira teste, nunca decisão;
  - ❌ **descartado:** o dado vai contra.
- **Feeling.** Entra, desde que escrito como sinal ⚪ com o teste que o confirmaria. O feeling do gestor sobre o mercado
  (concorrência do carro, público novo da scooter) é hipótese de partida, e o dado confirma ou não.

Hipótese sem selo e sem "o que confirmaria" não entra. Pode ficar **inconclusivo**: diga isso e diga qual teste resolve.

---

## 4. A ficha do lead (micro)

Uma ficha por lead (número único que deixou o contato), com campos fixos, gerada por script e guardada só no PC. **Sem
nome, telefone, placa nem texto de mensagem.** empresa de proteção veicular:
`clientes/<cliente>/ads/analise-2026-11-18/fichas_leads.mjs`
(macro: `fichas_macro.py`).

| Bloco | Campos |
|---|---|
| Origem | canal (anúncio, voltou pelo cookie, orgânico), campanha, anúncio, posicionamento, dia, hora, dia da semana |
| Página | página, tela, tempo de carga, quanto tempo ficou, **segundos até deixar o contato**, % rolada, seção mais funda, etapa onde parou, erros, quantas visitas o número fez |
| Formulário | veículo ou produto, completo?, placa (ou equivalente), proteção hoje / situação atual, região, como conheceu |
| WhatsApp (contagens) | tem conversa?, mensagens do lead, mensagens da equipe, minutos até a 1ª resposta da equipe, **respondeu depois da 1ª resposta?**, mandou áudio?, dias desde a última mensagem |
| Conversa (leitura, §7) | perguntas, objeções, recebeu proposta?, respondeu à proposta?, onde parou, motivo, fechou? por quê? |
| CRM / venda | etapa, motivo de arquivamento, venda e valor (confirmada com o cliente) |

**Macro em cima das fichas** (sempre pelo script):
- mínimo, mediana e máximo do tempo até o contato e da rolagem;
- % de completo e de qualificado;
- % que respondeu;
- por anúncio, veículo, hora e situação atual;
- **respondeu × não respondeu** e **qualificado × desqualificado × comprou**: o que muda entre os grupos (anúncio,
  hora, veículo, comportamento na página, tempo de resposta da equipe).

---

## 5. A ficha do criativo

| Campo | O que anotar |
|---|---|
| Formato | vídeo ou imagem; proporção (9:16, 4:5, 16:9); duração |
| Gancho (0–3 s) | o que se vê, o que se ouve, o texto na tela. Tipo: cena real forte, identificação ("Você que é de…"), pergunta de preço, notícia, frase de efeito, pessoa falando |
| Corpo | história (começo, meio e fim), lista de benefícios, prova, demonstração |
| CTA | o que pede e **em que segundo** |
| Voz | pessoa real (dono, equipe, cliente), voz de IA, sem voz |
| Imagem | real da empresa, banco de imagem, genérica, IA, câmera de segurança |
| Oferta | preço, desconto, comparação, nenhuma; onde aparece (vídeo, texto, título) |
| Filtro | o criativo diz quem **não** é atendido? (ex.: "carro de FIPE até R$ 160 mil") |
| Prova | caso pago, depoimento, selo, nota |
| Texto e título | a 1ª linha do texto é lida antes do clique: anotar |
| Botão | Saiba mais, Pedir cotação… |
| Público e região | conjunto, cidades, idade; e o público que a Meta **de fato** entregou (§8) |
| Destino | qual página; ela continua a conversa do criativo? |
| Período e verba | quanto recebeu: criativo sem verba não foi testado |

---

## 6. Etapa por etapa

Em cada etapa:
- a métrica;
- **o qualificado e o desqualificado daquela etapa**;
- as possibilidades, com o que separa uma da outra;
- a ação.

### 6.0 A escada de qualificação (por criativo)

Quem passou por cada degrau, em % das visitas. É a "qualidade do anúncio" antes da venda.

| Degrau | Definição (empresa de proteção veicular) | Leitura |
|---|---|---|
| **Nitidamente desqualificado** | clicou e saiu em até 3 s sem tocar em nada (`saida1_s ≤ 3`) | não deu tempo de ler. Clique curioso ou sem querer. **Mais de ~40% pede explicação** (§6.3–6.4), mas só pesa se o resto também for ruim |
| Olhou | ficou mais de 3 s, não tocou | leu e não quis: oferta, página ou público |
| Interessado | tocou no formulário | quis, e algo travou ou não |
| Lead | deixou o WhatsApp | — |
| Lead completo | terminou o cadastro | — |
| **Lead qualificado** | completo com placa (bike: completo) | a meta do marketing |
| Conversou | respondeu depois da 1ª resposta da equipe | — |
| Proposta / venda | do CRM ou do cliente | o juiz final |

### 6.1 Entrega: impressões, CPM, alcance, frequência

- **Leilão concorrido** (nicho disputado, região nobre, época como a Black Friday). Separa: o mesmo criativo com CPM
  diferente em públicos diferentes.
- **A Meta prevê pouco resultado.** Separa: os rankings de qualidade, engajamento e conversão por anúncio, mais o CPM de
  criativos diferentes no mesmo público.
- **Sem verba:** o CBO deu tudo ao vencedor. Abaixo de 1× a meta gasta, o criativo não foi julgado.
- **Público pequeno.** Separa: a frequência subindo e o CTR caindo de uma semana para a outra.
- **Ação:** concorrência → oferta que se diferencia, não mais verba. Ranking baixo → trocar o gancho. Sem verba → teste
  separado. Cansaço → o próximo criativo do rodízio.

### 6.2 Atenção: hook (vídeo de 3 s ÷ impressões), 25/50/95%, tempo médio

- **Gancho fraco:** logo, pessoa sentada, texto, câmera lenta, imagem que não diz do que se trata. → Regra 1.
- **Imagem genérica ou de IA, voz de IA:** perde credibilidade.
- **Vídeo longo para o que segura.** O tempo médio quase sempre fica em 3–8 s: o que está depois dos 10 s quase ninguém
  vê. → Regra 2.
- **Formato errado para o posicionamento** (16:9 no Reels). Separa: a quebra por posicionamento.

### 6.3 Clique: CTR de link

- **Público errado.** O CTR é baixo em todas as idades e posicionamentos, e outro criativo no mesmo público vai bem → o
  público não é o problema. Com a Andrômeda (§8), "público errado" quase sempre quer dizer "**o criativo chamou** o
  público errado".
- **Público certo, criativo ruim:** gancho ruim (hook baixo) ou gancho bom com corpo que não dá motivo para clicar
  (hook bom, CTR baixo).
- **Poucas pessoas ou cansaço:** frequência subindo, CTR caindo.
- **CTR alto demais, que engana:**
  - curiosidade (história, notícia);
  - toque sem querer (Stories do Facebook com CTR de 3–6%);
  - isca de clique (ranking de qualidade "abaixo da média").

  Separa: a escada (§6.0). CTR alto com muito "nitidamente desqualificado" é clique sem intenção.

### 6.4 Chegada: clique → page view; saída em 3 s

- **Página lenta.** Separa: o tempo de carregamento medido. Se ele é bom e saem do mesmo jeito, não é a página.
- **Clique sem querer ou impaciente:** clique → page view abaixo de ~60% só naquele criativo.
- **Clique curioso:** abre e sai em 3 s. Compare entre criativos na mesma página.

### 6.5 Página → começou → contato → enviou

- **A página é o problema.** Separa: o mesmo criativo em 2 páginas e criativos diferentes na mesma página. Se o criativo
  dá o mesmo número em toda página, é o criativo.
- **O criativo promete X e a página diz Y** (notícia → página de preço).
- **Não acham o formulário** (celular pequeno, formulário abaixo da dobra). Separa: a seção mais funda de quem não tocou.
- **Erro no formulário.** Separa: quem tocou e não avançou, e os erros gravados. Conferir antes de culpar o criativo.
- **A oferta assusta ou não existe.** Com a oferta no criativo, quem clica já aceitou o preço.
- **Pedir o contato afasta:** pesa em todos os criativos e não explica a diferença entre eles.
- **Como o lead decide** (empresa de proteção veicular, novembro: 118 leads):
  - mediana de 10 s até deixar o WhatsApp;
  - 25% em até 5 s;
  - rolagem mediana de 13%.

  O lead decide no topo. → Regra 2.

### 6.6 Qualidade: quem chega

- **Perfil:** veículo ou produto, região, dentro ou fora da área, situação atual, critério de aceitação (FIPE, idade).
- **O criativo escolhe o público** (§8). Exemplo da empresa de proteção veicular: perda total atraiu motorista de aplicativo.
- **A oferta atrai quem caça preço.**
- **O criativo também filtra.** Quando um critério de aceitação recusa muita gente num público (FIPE alta na Barra), o
  criativo pode dizer quem é atendido ("Você que é da Barra e tem carro de até R$ 160 mil de FIPE"). Só para o
  critério que já recusou muitos leads; o que se aceita e se repassa a parceiro não precisa ir.
- **Atendimento:** lead bom mal atendido parece lead ruim (Sobral: 50% atendimento, 30% criativo, 20% nutrição).

### 6.7 Tempo e contexto (em todas as etapas)

- Dia da semana e horário (no banco, contato ÷ visitas por faixa).
- Sazonalidade: CPM de todos subindo junto = leilão, não criativo.
- Mudança na conta: aprendizado reiniciado, conta parada sem saldo, verba nova.
- Concorrente com promoção.
- Posicionamentos que não rendem (Audience Network, Messenger): não abrir, e não discutir.

---

## 7. WhatsApp e venda: a análise de uma semana depois

A conversa precisa de tempo. **Uma vez por semana**, ler os leads da semana anterior:

1. **Contagens (script, já na ficha):** respondeu?, mensagens, 1ª resposta da equipe, áudio.
2. **Leitura da conversa, uma por vez** (analise-micro-macro.md):
   - antes, áudio vira texto (Whisper local) e imagem vira descrição;
   - a ficha da conversa: perguntas, objeções, recebeu proposta?, respondeu à proposta?, onde parou, motivo, fechou?
3. **Por que fechou × por que não fechou.** o gestor, 18/11: a equipe passa a **perguntar** ao lead que fechou por que
   fechou e ao que não fechou por que não fechou. A resposta entra na ficha (motivo dito pelo próprio lead) e desenha
   o perfil do qualificado e do desqualificado.
4. **Macro:** o perfil de quem compra, de quem é desqualificado e de **quem não responde**: de que anúncio vem, a que
   hora chegou, quanto a equipe demorou, como agiu na página.

Cuidado: "não respondeu no Chatwoot" não prova que ninguém atendeu (a equipe pode ligar), e a venda só se confirma com o
cliente.

---

## 8. Andrômeda: o criativo escolhe o público

Fonte: Sobral, live #361, e o texto de engenharia da Meta (2024).

- **O que é:** o motor da Meta que, por IA, escolhe qual anúncio mostrar a cada pessoa. Com público aberto, **quem acha
  o público é o anúncio** (o que ele mostra, diz e para quem fala).
- **Criativos parecidos contam como um só.** "Trocar a camiseta" não é criativo novo. Conceitos distintos se fazem por
  ângulo (problema, desejo, segmento), gancho, narrativa e formato.
- **Na análise:**
  1. Sempre olhar **quem a Meta entregou** para cada criativo (idade, gênero, posicionamento) e **quem chegou** (veículo,
     região, situação atual). Na empresa de proteção veicular, com o mesmo público aberto 25+:
     - o F-028 (scooter) foi 54% para mulheres;
     - o F-025 (perda total), 88% para homens, com 35% de motorista de aplicativo;
     - o V-24 (Rio das Ostras) pendeu para 45–64 anos.
  2. "Público errado" vira "o que no criativo chamou esse público?".
  3. **Tema do criativo é segmentação.** Cidade, chuva, aplicativo, bike: a Meta entrega para quem se interessa pelo
     tema. O vídeo da chuva achou quem lê notícia de temporal; o da cidade achou quem mora lá. Escolher o tema é escolher
     o público.
  4. **Vários vídeos do mesmo molde** (os 7 dos Lagos, todos institucionais por cidade) podem ser tratados como um
     conceito. Para testar, variar o ângulo, não só a cidade.
- **O controle geográfico continua sendo nosso.** Negócio local não usa público Advantage+ sem limite (fora da área não
  é lead).

---

## 9. O ciclo do cientista e a transferência

**O ciclo:**
1. Ficha.
2. Funil e escada.
3. Onde fura (comparar com os vizinhos).
4. Possibilidades daquela etapa, com selo.
5. Lei ou sinal.
6. Experimento que muda o mínimo possível para separar uma hipótese da outra. Se mudar duas coisas de propósito,
   escrever as duas.
7. Resultado registrado no sinal (sobe ou desce o selo).

**Transferir para outro público ou região:**
1. **O que exatamente funcionou?** Em geral 2 ou 3 elementos (ex.: identificação local + oferta no texto), não o vídeo
   inteiro.
2. **Por que funcionou ali?** A condição de fundo: marca nova na região, pouca concorrência, preço baixo para aquele
   público.
3. **Essa condição existe no outro lugar?** Se não existe, escrever o risco e o que mediria o fracasso.
4. **O que adaptar:** manter as regras, trocar o que dependia da condição. Exemplo (Barra, o gestor, 18/11):
   - o desconto dos Lagos vira **comparação com o seguro** ("a mesma proteção por um custo menor");
   - o criativo **filtra** o que lá mais desqualifica ("FIPE até R$ 160 mil").

---

## 10. Como entregar

- **Documento vivo por cliente**: `clientes/<cliente>/ads/mapa-dos-criativos.md`, com:
  - o que aprendemos em uma tela;
  - a ficha;
  - o funil;
  - a escada;
  - o lead a lead;
  - caso a caso;
  - experimentos;
  - regras e sinais.

  Atualizado a cada análise: não se cria outro do zero.
- Fichas de lead: JSON local por análise, nunca publicado.
- Na resposta ao gestor: os sinais que mudaram de selo, os experimentos propostos e o que ficou inconclusivo.
- Experimento que custa verba ou mexe em campanha → decisão do gestor (a verba só muda quando ele manda).
