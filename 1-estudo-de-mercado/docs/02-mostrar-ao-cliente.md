# Mostrar o painel ao cliente

## No seu computador

O painel é um arquivo: `estudos/<slug>/painel/index.html`. Dois cliques e ele abre no navegador, sem internet e
sem servidor. Para você estudar, é só isso.

## Para o cliente ver de onde estiver

A pasta `painel/` é um **site estático**: um HTML e as imagens e vídeos em `painel/midia/`. Não tem banco, não tem
código rodando no servidor. Por isso **não precisa de VPS**: uma hospedagem de site comum resolve, e é mais barata
e mais simples.

| Você quer | Precisa de |
|---|---|
| o cliente abrir o painel por um link, com senha | **hospedagem de site** + um domínio (ou um subdomínio de um domínio seu, como `estudos.suaempresa.com.br`) |
| a coleta rodar sozinha todo mês, sem o seu PC ligado | **VPS** (aí o kit roda lá, agendado) |

Recomendação: a hospedagem de site da Hostinger.
[Hospedagem de site](https://www.hostg.xyz/aff_c?offer_id=6&aff_id=214984&url_id=3648) ·
[VPS](https://www.hostg.xyz/aff_c?offer_id=6&aff_id=214984&url_id=5038) ·
cupom `PEDROALMEIDA` (10% de desconto).

### O passo a passo

1. **Crie uma pasta por cliente** na hospedagem, por exemplo `public_html/estudo-clinica-x/`.
2. **Suba a pasta `painel/` inteira** para lá (o `index.html` e a `midia/`), pelo Gerenciador de Arquivos do
   painel da hospedagem ou por FTP. Sem a `midia/`, o painel abre sem imagem.
3. **Proteja a pasta com senha.** No painel da hospedagem, procure **"proteger pasta com senha"** (em inglês,
   *Password Protect Directories*), escolha a pasta do cliente e crie o usuário e a senha dele. O navegador pede
   login antes de mostrar qualquer coisa.
4. Mande ao cliente o link (`https://seudominio.com.br/estudo-clinica-x/`), o usuário e a senha.

Quer que o agente faça? Peça: *"sobe o painel do estudo X para a minha hospedagem, na pasta Y"*. Ele precisa do
acesso FTP (host, usuário, senha), que fica no `.env` da raiz, nunca no chat de outra pessoa.

## Cuidados

- O painel tem **anúncio, vídeo e print de terceiros**. É material de estudo: mostre só a quem contratou, sempre
  com senha. O painel já sai com `noindex`, para o Google não mostrar a página nas buscas.
- Um painel por cliente, numa pasta por cliente, com a senha dele. Nunca o estudo de um cliente no link de outro.
- Atualizou o estudo? Rode o `montar.mjs` e suba a `painel/` de novo por cima.
