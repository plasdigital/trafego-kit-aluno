# Régua da análise das páginas de destino (LP e formulário externo)

A análise da peça não basta. O que vende é
o caminho inteiro: **anúncio → página → o que a página pede → para onde ela leva**.

## Entrada (por página, em `estudos/<slug>/paginas/<página>/`)

- `pagina.json`: endereço final, títulos (h1/h2/h3), botões, links de WhatsApp (com a mensagem pronta, se houver),
  links de agenda, campos do formulário da página, `perguntas` (lidas do código dos formulários de várias telas:
  Typeform, Respondi, Yay), preços e o texto da página (até 12 mil caracteres).
- `folha.jpg`: a página inteira como o celular vê, cortada em colunas da esquerda para a direita. `topo.jpg`: a 1ª tela.
- O lote (`lote-pag-N.json`) diz quais anúncios do painel (código `M-…`) mandam para cada página.

⚠️ As `perguntas` vêm com sujeira do código (pedaços de script, fonte, `de1ab8…`, `Math.random`). Use só o que é
pergunta ou opção de resposta de verdade. Nunca preencha nem envie formulário: isso viraria um lead falso no concorrente.

## Saída: `analise-paginas-N.json`

```json
{ "paginas": [ {
  "slug": "...",
  "tipo": "lp | formulario | site | blog | outro",
  "promessa": "a frase principal da 1ª tela, em português simples (até 140 caracteres)",
  "oferta": "o que a pessoa recebe ao converter: diagnóstico grátis, demonstração, teste grátis, orçamento, aula...",
  "leva_para": ["formulario-na-pagina", "formulario-externo", "whatsapp", "agenda", "checkout", "ligacao", "nenhum"],
  "mensagem_whatsapp": "a mensagem pronta do link, se houver, senão null",
  "perguntas": ["as perguntas do formulário, limpas, na ordem"],
  "filtros": ["faturamento", "verba-anuncio", "nicho", "cargo", "tamanho-equipe", "ja-investe-trafego", "instagram", "prazo", "cidade"],
  "faixas_faturamento": ["as opções de faturamento, se houver"],
  "estrutura": ["as seções na ordem, em 2 a 5 palavras cada: 'Promessa + formulário', 'Logos de clientes', 'Depoimentos em vídeo', 'Como funciona em 3 passos', 'FAQ', 'Botão final'"],
  "provas": ["o que a página usa como prova: números, cases, logos, depoimentos, prints, selo"],
  "atrito": "baixo | medio | alto (quantos passos e campos até virar contato)",
  "notas": { "clareza": 0, "oferta": 0, "prova": 0, "qualificacao": 0, "caminho": 0 },
  "vale_copiar": "o que vale copiar dessa página, em 1 ou 2 frases",
  "fraco": "o que está fraco ou atrapalha, em 1 frase",
  "como_usar": "como quem pediu o estudo usaria essa ideia na LP dele, em 1 ou 2 frases"
} ] }
```

- **Notas de 0 a 2:**
  - **clareza:** em 5 segundos dá para entender o que é e para quem é?
  - **oferta:** há um motivo concreto para converter agora?
  - **prova:** a prova é real e específica?
  - **qualificacao:** o formulário separa o cliente bom do curioso?
  - **caminho:** o próximo passo é óbvio e curto?
- **Filtro** é o que a página usa para escolher o lead (pergunta de faturamento, aviso de verba mínima, nicho
  fechado). Uma pergunta só de contato (nome, e-mail, WhatsApp) não é filtro. Se o nicho filtra por outra coisa
  (convênio, tipo de tratamento, bairro), crie um id curto novo.
- **Linguagem:** português simples, frases curtas, nada de jargão sem explicar (LP, CTA e lead podem ficar).
