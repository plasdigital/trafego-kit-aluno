# Estudo de concorrentes e referências de criativo

O gestor pediu em quase todo cliente (empresa de proteção veicular, associação de proteção, empresa de drywall e planejados, farmácia): *"pega os concorrentes que anunciam,
me dá o link da página de anúncios, os que estão rodando há mais tempo, salva como referência."*

## Como fazer

1. **Quem são:** concorrentes da mesma cidade/região (Google Maps e busca) e as marcas grandes do nicho no Brasil todo, para referência de criativo.
2. **Biblioteca de anúncios da Meta:** MCP `ads_library_search` ou a busca pública. Para cada anunciante, entregar o **link da página de anúncios completa** (`facebook.com/ads/library/?view_all_page_id=<id>`), que o gestor sempre pede e não acha sozinho. Conferir que o link abre antes de entregar: ele já reclamou de link errado.
3. **Filtro de qualidade:** anúncio **ativo há mais de 15 dias** tende a ser bom. Quanto mais tempo rodando, mais forte a referência. Anúncio repetido em várias versões também é sinal.
4. **Separar formato:** vídeo, imagem e carrossel. No nicho de proteção veicular, vídeo dominou.
5. **Analisar o gancho** (os 3 primeiros segundos ou a frase do topo da arte): é onde o mercado mais erra, e é o que o gestor mais comenta.
6. **O que cada concorrente destaca:** preço "a partir de", benefícios, garantias e diferenciais. Vira a tabela "o que eles oferecem × o que nós oferecemos", que alimenta o criativo e a LP.
7. **Regulação do nicho:** o que não se pode dizer (proteção veicular não é "seguro") e imagem que choca demais.

## Onde guardar

- ⛔ **A mídia do anúncio (vídeo, imagem) se baixa na hora** e fica na pasta do estudo (`1-estudo-de-mercado/scripts/baixar.mjs`). O link do fbcdn vence em dias e o anúncio some da Biblioteca quando sai do ar (o gestor, 03/nov/2026).

- Referência escolhida pelo gestor → **painel do cliente** (aba de referências), com código (`C-0xx`), link, formato, dias rodando e a nota dele (gancho, roteiro).
- Comentário do gestor em áudio sobre cada referência → a IA transcreve e preenche os campos.
- Estudo escrito → `clientes/<cliente>/concorrentes/AAAA-MM-DD-<assunto>.md`.

## Aprendizados de 26/11/2026 (ponto de partida, não regra fixa)

- **O estudo virou varredura:** a biblioteca da Meta e a do Google varridas por termo, com o vídeo transcrito e tudo
  num painel (empresa de proteção veicular, 06/11). A esteira está em `1-estudo-de-mercado/` no kit do aluno. O corte usado na esteira é
  **30 dias rodando** (o gestor, 22/10/2026); os 15 dias do passo 3 acima são o mínimo para olhar.
- **Estudo por produto**, quando o cliente vende mais de um: cada produto tem concorrente e comunicação próprios
  (empresa de proteção veicular, 09/11).
- **O estudo entrega os links das landing pages** de cada concorrente, a comunicação de cada um e os criativos: alimenta
  a LP e o criativo do cliente (empresa de rastreamento veicular, 25/11).
- **Anúncio de busca: pesquise os concorrentes no próprio Google** e copie a estrutura que deixa o serviço claro
  (títulos e sitelinks), não o texto (empresa de drywall e planejados, 17/11).
- **Na venda, o estudo é argumento:** o volume de buscas do serviço na região, no estado e no país prova que existe
  demanda antes de o cliente investir; o estudo fica pronto antes da reunião (farmácia, 04 e 19/11).
- **Criativo novo parte de uma referência codificada** do estudo (o código da referência fica no registro do criativo)
  (empresa de proteção veicular, 09/11).

## Concorrência local (preço e oferta)

Para varejo (farmácia, Black Friday): pesquisar os concorrentes do bairro e da cidade (site, Instagram, Google
Maps, iFood/app), o que anunciam, a faixa de preço dos produtos-chave e as promoções. O estudo vai para o
hub ou painel do cliente quando ele tiver um.
