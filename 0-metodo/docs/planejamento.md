# Planejamento de campanha (Google e Meta)

Feito na empresa de proteção veicular e na empresa de drywall e planejados. A página publicada para o cliente é gerada por
publicar.mjs, que sobe em
`ads.seudominio.com.br/<cliente>/plano-google-ads/` e `/plano-meta-ads/` pela API da Hostinger. Cliente
novo copia esse gerador.

## Antes de planejar

- O estudo de concorrentes ([concorrentes.md](concorrentes.md)) e a ficha do produto: o preço "a partir de", o que cobre, o que **não** atende (critérios de aceitação) e a área de atendimento. Perguntas que o cliente precisa confirmar vão numeradas, com o que já se sabe escrito, para ele só confirmar.
- O que o comercial mais fecha (na empresa de drywall e planejados, drywall), que pesa mais que a busca.
- A ficha de contas do cliente e o rastreamento mínimo já no ar.

## Google Ads (Rede de Pesquisa)

- **Começar restrito e abrir com o resultado:** região perto da empresa (empresa de drywall e planejados: raio de 20 km da loja, decisão fixa do gestor de 27/out/2026; o raio é escolha de verba, não a área de atendimento) e as buscas mais óbvias. Ir negativando e ampliando.
- **Sem campanha de marca** no começo e **sem comprar o nome do concorrente**.
- Local por **Presença**, nunca "Presença ou interesse".
- Volume de busca real (Planejador de palavras-chave) da região e, para entender o nicho, do estado ou do Brasil.
- Lista de **negativas** desde o 1º dia (vagas, curso, grátis, "perto de mim" quando não é a loja…).
- **Uma LP por serviço** quando o serviço muda a busca (empresa de drywall e planejados: drywall × planejados).
- A LP do Google mostra preço: quem vem da busca não sabe.
- Campanha sobe **pausada**; o gestor ativa.

## Meta Ads

- **Objetivo:** cadastro na LP com formulário (rendeu mais que mensagem na empresa de proteção veicular). Mensagem direta quando o negócio vende na conversa (farmácia).
> **O que aqui é fixo e o que é aprendizado (o gestor, 26/11/2026).** Fixo: o público dentro da área, a campanha subir
> pausada e o rastreamento ([criar-contas.md](criar-contas.md)). A estrutura de campanha, os dias sem mexer e o ritmo
> de teste são **aprendizados de campanhas reais**: ponto de partida, não regra. O gestor decide com o resultado; o
> agente pergunta como ele quer estruturar e otimizar antes de montar.

- **Estrutura que funcionou na empresa de proteção veicular (o gestor, 27/out/2026; aprendizado, não regra fixa):**
  - **Uma campanha CBO por perfil** (na empresa de proteção veicular, por veículo: carro × moto e scooter), isoladas umas das outras.
  - **O criativo que já funciona fica num conjunto só dele, com verba mínima de R$ 15 a R$ 20 por dia,** para o Meta
    gastar nele.
  - **Criativo novo é sempre testado em outro conjunto,** com teto. Dentro do conjunto do vencedor ele não recebe
    entrega. O que vencer ganha conjunto próprio com piso, ou entra no validado.
  - Origem: na empresa de proteção veicular, as imagens novas tomaram a verba do único vídeo de carro que vendia, dentro do mesmo conjunto
    (out/2026).
- **Métrica fixa do anúncio para o site:** cliques no link → visitas (banco) → page view (Meta), por anúncio. Clique →
  visita é a perda no carregamento; clique → page view mostra quem fecha antes do Pixel carregar
  ([analise-funil.md](analise-funil.md), degrau 2).
- **Régua de pausa:** a do gestor, em [otimizacao-criativo.md](otimizacao-criativo.md) §4.1.
- **Público:** cidade só da área, expansão de local **desligada** (`targeting_automation.individual_setting.geo = 0`),
  sem Advantage+ de público fora da área. ⚠️ Desde nov/2026 a Meta **tirou** o "Pessoas que moram neste local": conjunto
  novo não manda `location_types`; conjunto antigo que dá erro ao editar se regrava sem esse campo; conjunto duplicado
  herda o original, então leia a segmentação pela API antes de ligar ou religar. Idade cortada quando o produto pede (empresa de proteção veicular: a partir de 25 anos).
- **Horário:** só quando há atendimento para responder (farmácia: de 9h a 1 h antes de a entrega fechar).
- **Criativos:** os escolhidos das referências, com a variação por perfil; conteúdo dentro do 4:5 mesmo quando vai para stories.
- **Aprendizado de ritmo:** deixar a campanha aprender nos primeiros dias antes de mexer na estrutura; verba sobe aos
  poucos (até ~20% a cada 3 ou 4 dias). Otimização diária do anúncio pela régua de pausa também é válida; o gestor
  escolhe.
- Campanha sobe **pausada**; o gestor ativa.

## A página do plano (para o cliente)

Destino, público, local, verba por dia e por canal, palavras e negativas, criativos, o que se mede e quando
se revê. Visual, em lista; o cliente bate o olho e entende.

## Aprendizados de 26/11/2026 (empresa de proteção veicular, farmácia, empresa de drywall e planejados): ponto de partida, não regra fixa

**Meta**
- **Por que conversão no site e não mensagem:** no objetivo de mensagem, todo clique, até o sem querer, vira sinal de
  público para o algoritmo, que passa a buscar curioso; daí o lead que chama no WhatsApp e não responde. A página
  filtra antes. Mensagem direta só quando o negócio vende na conversa e o volume compensa (farmácia, 05/11).
- **A verba se divide pelo valor do perfil, não pelo lead mais barato.** Com mais de um produto, a fatia de cada um sai
  do valor dele para o negócio (ticket, risco, estratégia) e o perfil prioritário ganha campanha própria; sem isso a
  plataforma joga a verba no lead barato. Produto pouco anunciado na região tem leilão mais barato (empresa de proteção veicular, 27/10).
- **Post que o cliente quer impulsionar entra como anúncio dentro da campanha que já existe**, com a própria publicação
  (mantém o engajamento), nunca impulsionamento solto, fora da medição (farmácia, 17 e 19/11).
- **Vídeo novo com destino ao WhatsApp vira anúncio na mesma campanha**, não campanha nova (farmácia, 08/11).
- **Nenhuma configuração que não foi pedida** (horário fixo, data de fim) entra por conta própria: o horário fixo
  travou a entrega de uma campanha de vídeo (farmácia, 08/11). O "horário só com atendimento" vale para campanha de
  conversa; campanha de vídeo pode rodar o dia todo.
- **Conta de anúncio trocada:** a antiga vira só histórico e nada nasce nela. Depois de criar, conferir em que conta
  foi criado. Criar e editar pela API com o token do usuário do sistema (farmácia, 02/11).

**Google**
- **Compre a palavra do público, escreva a palavra certa.** Os termos que o público busca entram mesmo quando não são o
  nome técnico ou regulado do produto (proteção veicular: "seguro"); o texto do anúncio mantém o nome correto. O
  título usa a palavra do público que cobre o grupo de produtos (empresa de proteção veicular, 13/11). Confira a política do Google para o
  termo antes de comprar.
- **Antes de reativar uma conta, puxe o histórico inteiro de termos de busca** para montar as negativas (empresa de proteção veicular, 13/11).
- **Muito clique e pouco lead: revise a copy antes de cortar palavra.** Termo, anúncio e página dizem o mesmo; palavra
  que já trouxe lead fica e ganha um anúncio melhor. A copy de serviço: [anuncios.md](anuncios.md) (empresa de drywall e planejados, 17/11).

**Verba**
- **A verba sai da meta:** meta de leads qualificados × custo por lead esperado. Combine com o cliente se o valor é com
  ou sem o imposto da plataforma e informe o investido sempre com o imposto (empresa de proteção veicular, 27/10 e 11/11).
- **Durante o mês:** acumulado × meta × dias que faltam (descontando os dias parados), com uma taxa de desqualificação
  estimada; o que falta vira meta de leads por dia (empresa de proteção veicular, 18/11).
- **A verba segue a venda, entre canais e entre campanhas:** o canal que mais vende no WhatsApp recebe do que vende
  menos, mesmo que a plataforma diga outra coisa. Em passos pequenos: o valor sai de uma e entra na outra, sem subir o
  total de uma vez (farmácia, 04/11; empresa de proteção veicular, 11/11).
- **Gaste a verba combinada inteira:** sobra no fim do mês é lead que não veio (empresa de drywall e planejados).
- **Preço em qualquer peça:** só "a partir de R$ X/mês", uma vez, com todos os benefícios e sem dizer qual plano tem
  cada um. Nada de "só no plano X" ou "conforme o plano": o detalhe assusta antes de virar lead e quem explica é o
  vendedor. Exceção só se o dono da conta disser que é obrigatório (empresa de proteção veicular, 09 e 10/11).

**Duas estruturas de Meta que funcionaram (escolha do gestor, não regra):**
- **Vencedor protegido** (empresa de proteção veicular, 27/out): o vencedor num conjunto próprio com piso, o teste em outro conjunto com teto.
  Serve quando um criativo novo começa a roubar a verba do único que vende.
- **Um conjunto só** (campanha da própria agência, 11/nov): CBO, público aberto por idade, 4 a 6 criativos bem
  diferentes e lote novo a cada 7 a 15 dias no mesmo conjunto (é o que o [criativos.md](criativos.md) descreve). Serve
  para verba pequena e largada.

**Ritmo:** "dar uns dias para aprender" e "otimizar todo dia pela régua" convivem (farmácia, 05/11). O parâmetro que não
muda é a régua de pausa ([otimizacao-criativo.md](otimizacao-criativo.md)); o quanto mexer, e quando, é do gestor.
