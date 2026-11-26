# LP com formulário inteligente (cliente de geração de leads)

o gestor, 22/out/2026: *"aquele formulário aparecendo uma pergunta por vez, dando destaque a elementos
desclassificatórios, isso faz total diferença para qualificar os leads... resgatar o pessoal que não
preencheu completamente, mas não marcar como lead... mesmo que a gente não atenda aquele tipo de
cliente, deixar ali para ver se está chegando."*

**A tese:** o formulário filtra o lead **sem perder ninguém**. Quem é bom chega ao comercial com os dados
prontos. Quem largou no meio vira resgate. Quem não serve fica registrado, para se saber se esse público
está chegando, mas não conta como lead nem treina o algoritmo.

Implementação de referência: empresa de proteção veicular. Ver o
README da LP,
gerar-etapas.mjs,
etapas.js e o
banco.

## As 10 peças (o padrão para todo cliente novo)

1. **Uma pergunta por tela**, sem dizer quantas faltam. Botões grandes (≥ 42 px), de um toque sempre que der.
2. **WhatsApp primeiro.** Quem larga no meio já deixou como ser chamado. O nome vem por último.
3. **Pergunta que qualifica, com saída para quem não sabe.** Exemplo: a placa vem com "É 0 km" e "Não lembro"; quem não deu a placa responde marca, modelo e ano. O CEP vem com "Não sei o CEP", que abre a lista de cidades da área.
4. **Critério desclassificatório em destaque, na pergunta em que ele aparece.** Exemplo: "Protegemos somente no estado do RJ", com um "!" amarelo junto do CEP. Critério que só gera dúvida fica fora da página e vira aviso para o vendedor.
5. **Categoria que o cliente não atende continua no formulário.** Exemplo: van/utilitário e caminhão. Ela segue para o WhatsApp, o CRM e o e-mail, mas **não vira lead**: o evento é `cotacao_fora_perfil` em vez de `generate_lead`, e a API de Conversões pula esse lead (coluna `fora_perfil`).
6. **Captura parcial.** Cada campo é gravado ao sair dele, só preenchendo e nunca apagando. Com WhatsApp e 10 min parado, vira **cotação incompleta**: e-mail para o comercial e card no CRM, no máximo um por número a cada 2 dias, e nunca se a pessoa enviou em outra visita.
7. **Medidas de comportamento** gravadas por visita: rolagem, seção mais funda, tempo por etapa, erros por etapa, voltas, saídas da aba e carregamento. São elas que respondem "onde o lead parou" na [análise](analise-funil.md).
8. **Origem completa:** UTMs, gclid/fbclid, 1º e último toque, `fbp`/`fbc`, `ga_client_id`. Cada resposta vira coluna (região, veículo, proteção hoje…), para cruzar com o WhatsApp.
9. **Fim sem página de obrigado:** "Abrindo o seu WhatsApp em 3… 2… 1…", com a mensagem pronta (o que a pessoa respondeu). E-mail para a agência e para o comercial a cada lead, e envio ao CRM do cliente.
10. **Teste não suja a métrica:** números de teste do gestor numa tabela de config (fora do código), `?modo=teste` marca o aparelho e não carrega o GTM, e `/teste/` publica uma cópia sem rastreio. Teste fica fora do CRM, da API de Conversões, do e-mail e do funil.

## Decisões de interface que já se provaram

- **Nunca pré-marcar resposta.** O "Carro" vinha marcado e um motorista de aplicativo foi como carro pessoal.
- **Nome que não confunde:** "Carro de aplicativo/táxi" em vez de "carro" para os dois.
- **Preço "a partir de" no topo** e a 1ª pergunta visível na 1ª tela de um celular de 360 px.
- **Sem botão direto de WhatsApp na página:** a pessoa cadastra primeiro, depois é levada ao WhatsApp.
- **`?veiculo=` (ou equivalente) no link do anúncio** já responde a 1ª pergunta.
- **Para mudar a página, troca-se o que abre no endereço, nunca o link do anúncio:** trocar o link reinicia o aprendizado.
- **Google pede preço na página; Meta já leva o preço no criativo.** Quem vem da busca não sabe o preço.

## Antes de publicar

- Teste de ponta a ponta (empresa de proteção veicular: `lp/teste-etapas.mjs` e `lp/teste-funil.mjs`): preencher como lead bom, como fora do perfil e largando no meio, e conferir banco, CRM, e-mail, WhatsApp e eventos.
- Velocidade em 4G simulado.
- Link da política de privacidade no formulário, curto ("ver como usamos seus dados").

## Ajustes do gestor

- **25/11/2026 (LP da empresa de rastreamento veicular): o formulário tem que parecer formulário.** Três botões grandes soltos não parecem cadastro: o cartão leva título ("Cotação grátis"), rótulo de campo, opção com cara de opção (marcador de escolha) e o botão de seguir visível. Porquê: *"o formulário tem que parecer um pouco mais formulário, não parece"*.
- **25/11/2026: seção que repete o formulário sai.** Uma seção "escolha o seu veículo" depois de um formulário que já pergunta o veículo é repetição. Porquê: *"ficou repetitivo… a terceira seção já existe"*.
- **25/11/2026: "como funciona" em passos não entra em LP.** Porquê: *"esse processo de como que funciona, ninguém nunca lê isso"*.
- **25/11/2026: a 2ª seção é confiança.** Logo abaixo do topo: prova social (nota do Google, depoimentos, números reais). Os valores ficam no topo, no molde da empresa de proteção veicular ("Valores mensais a partir de", um por tipo de veículo, sem "/mês" em cada um). Porquê: *"a segunda seção é algo que vai gerar confiança, credibilidade… tinha que ter a parte de provas sociais, depoimentos"*.
- **25/11/2026: quadro de vídeo usado como foto parece vídeo quebrado.** Frame com legenda queimada ou pose de fala não serve de foto de seção. Porquê: *"você tentou botar alguns vídeos, mas não rolou"*.
