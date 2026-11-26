# Instalar o rastreamento de um site: Tag Manager + Google Ads + Meta Pixel + GA4

> **Objetivo:** fazer um site avisar o Google Ads, o Meta e o GA4 toda vez que alguém faz a ação que
> importa — e deixar montado o caminho para acrescentar a próxima tag sem tocar no código de novo.
> **Área:** Marketing / Serviços a clientes · **Status:** 🟢 validado
> **Ferramentas:** `3-rastreamento/scripts/` do kit (`auth.py`, `montar.py`) · `tagmanager.google.com` · `console.cloud.google.com`
> **Entrada:** um site no ar que você consegue publicar + uma conta Google
> **Saída:** Google Ads gravando conversão, Meta recebendo evento, GA4 mostrando o funil.
>
> **Escrito em 01/set/2026**, no caso real da **farmácia** — vitrine Next.js de uma loja
> onde o site não vende: a ação que importa é abrir a conversa no WhatsApp.

---

## 0. Como ler isto

| Se você quer… | Vá para |
|---|---|
| **Nunca fez isso na vida** — o que precisa existir antes | **§0.5** |
| Decidir se você mesmo faz | **§1.1** — fazer × contratar |
| Decidir se usa Tag Manager ou tag no código | **§1.2** |
| Não confundir os nomes parecidos | **§2** |
| **Descobrir o que medir** (a parte que ninguém escreve) | **§3** |
| Executar | **§4** — os dez passos |
| Consertar algo que não funciona | **§5** — armadilhas |

---

## 0.5 — O que precisa existir antes (a corrente do zero)

| # | O que | O que é (para quem nunca viu) | Obrigatório? | Se faltar | ⏯️ |
|---|---|---|---|---|---|
| 1 | E-mail | qualquer um *(óbvio)* | sempre | não há conta Google | — |
| 2 | Conta Google | a mesma do Gmail *(óbvio)* | sempre | não há Tag Manager | — |
| 3 | **Um site no ar** | páginas publicadas num endereço | sempre | não há o que medir | ⏯️ |
| 4 | **Poder publicar o site** | acesso ao painel, ao FTP ou ao deploy | sempre | o container nunca entra no HTML | 🧱 ⏯️ |
| 5 | Conta no Google Ads | onde a campanha roda | só se for medir anúncio do Google | mede visita, não mede conversão de anúncio | ⏯️ |
| 6 | Portfólio comercial da Meta (BM) | a "empresa" dentro do Facebook | só se for usar o Pixel | não existe pixel | ⏯️ |
| 7 | Python 3 na máquina | a linguagem que roda os scripts | só para a parte automatizada | faz tudo no painel, na mão | — |
| 8 | Projeto no Google Cloud | a "conta de desenvolvedor" do Google | só para a parte automatizada | idem | ⏯️ |

```
1. e-mail ─┐
2. conta Google │
3. site no ar   ├─ antes de qualquer coisa
4. poder publicar ─┘
   └──► §1: fazer ou contratar?
        └──► §3: o que medir?
             └──► §4: os dez passos
```

> 🧱 **O item 4 é onde mais gente trava, e ninguém avisa.** Não é dificuldade técnica: é que quem
> pediu o rastreamento muitas vezes **não tem a senha do site**. Descubra isso no primeiro dia, não
> no passo 4. Na farmácia o site publica por build Docker numa VPS, com chave SSH — o que
> significa que "colar uma tag" custava dez minutos e só podia ser feito de uma máquina específica.
> Foi exatamente esse custo que decidiu a §1.2 a favor do Tag Manager.

---

## 1. As duas bifurcações

### 1.1 Fazer você mesmo × contratar

A pergunta não é de marca, é de **posse**:

| | Contratar (agência, plugin pago, freelancer) | Fazer |
|---|---|---|
| Quanto custa | R$ 300–1.500 de setup, ou mensalidade | seu tempo: 40 min na primeira vez |
| **De quem fica o container** | 🧱 **da agência**, quase sempre | seu / do cliente |
| Quando quebra | você espera | você conserta na hora |
| Quando você troca de agência | o histórico do GA4 fica lá | vai com você |
| Vale quando | o site é grande, tem e-commerce de verdade, muitos eventos | o site tem um objetivo claro e poucas ações |

> 🧱 **O erro de decisão mais caro:** deixar o container na conta de quem executou. O container é
> onde mora a medição inteira; se ele é da agência, sair da agência é recomeçar do zero. **Se
> contratar, exija ser o proprietário e adicione o executor como administrador** — que é
> exatamente o arranjo usado na farmácia, invertido: container na conta da agência, cliente
> como administrador, para o cliente nunca ficar refém.

### 1.2 Tag no código × Tag Manager

Colar a tag direto no código **funciona**. O problema aparece no **segundo** pixel: cada tag nova
vira alteração de código, build e deploy.

| | Tag no código | Tag Manager |
|---|---|---|
| Primeira tag | mais simples | mais passos |
| Segunda tag em diante | outro deploy | configuração, sem deploy |
| Custo permanente | zero | ~80 KB de JavaScript e uma peça a mais para entender |
| Quem consegue mexer depois | quem programa | quem sabe usar um painel |

**A regra:** três tags ou mais, ou publicar o site é caro → Tag Manager. Site estático simples com
uma tag só → cole no código e siga a vida.

---

## 2. Os nomes que colidem

Separe estes pares **antes** de mexer, ou você vai procurar coisa na tela errada:

| Isto | Não é isto |
|---|---|
| **Google Tag Manager** — a caixa que carrega tags | **Google tag** (`gtag.js`) — uma tag que vai *dentro* da caixa |
| **ID do container** `GTM-XXXXXXX` | **ID de conversão** `AW-XXXXXXXXX` | 
| **ID de conversão** `AW-…` — a conta toda | **rótulo** da conversão — a ação específica dentro dela |
| **GA4** `G-XXXXXXX` — medição | **Google Ads** `AW-…` — anúncio. São contas diferentes, painéis diferentes |
| **Espaço de trabalho** — seu rascunho | **Versão publicada** — o que o visitante recebe |
| **Modo Visualizar** — prova que a tag *disparou* | **Relatório da plataforma** — prova que ela *chegou* |

E os apelidos que são a mesma coisa: **portfólio comercial = gerenciador de negócios = Business
Manager = BM**. **Camada de dados = dataLayer.**

---

## 3. Decidir o que medir

Esta é a seção que os tutoriais pulam — e é a que decide se a campanha aprende ou queima dinheiro.

### 3.1 A pergunta única

> **Qual é a ação que, se acontecer, o dinheiro do anúncio valeu?**

Uma. Não três. Essa é a **conversão**. Todo o resto que você medir é **diagnóstico**: serve para
explicar por que a conversão aconteceu ou não, e não deve entrar na conta do lance.

Na farmácia: o site não vende nem cobra: soma um pedido e abre o WhatsApp. Logo a conversão é
**o clique que abre a conversa**. Ver produto e montar carrinho são degraus, não o topo.

### 3.2 O funil: quatro eventos e uma visita

| Evento | Quando | Para que serve |
|---|---|---|
| `page_view` | toda página | **não precisa de código** — a tag base do GA4 conta sozinha |
| `view_item` | abriu a página de um produto | qual produto puxa visita |
| `add_to_cart` | botou no carrinho | quem passou do interesse para a intenção |
| `view_cart` | abriu o carrinho | quantos montaram o pedido |
| `whatsapp_click` | 🎯 clicou para conversar | **a conversão** |

O valor disso não é a contagem: é a **queda entre degraus**. Muita gente vendo produto e ninguém no
carrinho é problema de preço ou de estoque. Carrinho cheio e ninguém no WhatsApp é problema do
botão. Sem os degraus você só sabe que não converteu, e não onde perdeu.

### 3.3 Quem é avisado em cada degrau

| Evento | Google Ads | Meta | GA4 |
|---|---|---|---|
| `page_view` | — | PageView | ✅ automático |
| `view_item` | — | ViewContent | ✅ |
| `add_to_cart` | — | AddToCart | ✅ |
| `view_cart` | — | — | ✅ |
| `whatsapp_click` | ✅ **conversão** | Lead | ✅ |

> 🧱 **O erro caro aqui:** marcar vários eventos como conversão no Google Ads porque "quanto mais
> dados melhor". Não é. Cada ação **primária** entra na conta do lance automático — e o Maximize
> Conversions passa a perseguir a ação mais fácil e mais barata. Você acaba pagando por gente que
> abre carrinho e vai embora. **Uma primária. As outras, se você quiser vê-las no Ads, entram como
> secundárias (só observação).**

### 3.4 Nomes de evento: use os do catálogo

`view_item`, `add_to_cart`, `view_cart` e `purchase` são nomes que o GA4 **já conhece**. Usando
eles, o relatório de funil e o de produtos mais vistos aparecem prontos. Nome inventado obriga a
construir cada relatório na mão.

Invente nome só quando não existir equivalente — `whatsapp_click` é o caso: não há no catálogo nada
que signifique "foi conversar".

### 3.5 🔒 O que nunca entra na camada de dados

Nome, telefone, e-mail, CPF, endereço. Em site de saúde, também qualquer coisa que ligue **uma
pessoa** a **um remédio**.

O que a tag precisa saber é **o que** aconteceu, nunca **com quem**. Produto pode entrar porque a
URL da página (`/produtos/dipirona-500mg`) já o revela — o evento não acrescenta exposição, só
torna o dado legível em relatório. Telefone não pode entrar de jeito nenhum.

---

## 4. Os dez passos

### Passo 1 · Google Cloud Console — a credencial da automação ⏯️

Isto é o que permite a um script (ou a um agente de IA) mexer no Tag Manager por você. **Se for
fazer tudo no painel, na mão, pule para o Passo 2** — nada aqui é obrigatório para o resultado.

1. Abra [console.cloud.google.com](https://console.cloud.google.com) e **crie um projeto** — ou reaproveite um: o mesmo projeto serve para Google Ads, Tag Manager e Analytics.
2. Procure a lupa no topo, busque **"Tag Manager API"** e clique em **Ativar**. *(Se for automatizar o Ads também, ative a "Google Ads API".)*
3. Procure **"Tela de permissão OAuth"**. Tipo **Externo**, nome do app, e-mail de suporte. Em **Usuários de teste**, adicione **o seu próprio e-mail**.
4. Em **Credenciais**, botão **Criar credencial → ID do cliente OAuth**, tipo **App para computador**. Guarde o **Client ID** e o **Client Secret**.

**Sinal de sucesso:** a tela mostra Client ID terminado em `.apps.googleusercontent.com`.

> 🧱 **A pegadinha mais comum do processo inteiro:** esquecer o passo 3 (seu e-mail em *Usuários de
> teste*). O erro só aparece muito depois, no Passo 6, e ele fala de **"acesso bloqueado"** — não
> menciona usuário de teste em lugar nenhum. Você procura a coisa errada por meia hora.

### Passo 2 · Tag Manager — a conta e o container

1. Abra [tagmanager.google.com](https://tagmanager.google.com).
2. **Criar conta**: nome do cliente, país. Uma conta por cliente.
3. Dentro dela, **criar container**: nome (ex.: "Site"), plataforma **Web**.
4. O Google mostra dois trechos de código e o **ID do container** (`GTM-XXXXXXX`).

Anote também três números que só aparecem **na barra de endereço**, e que a automação exige:

```
tagmanager.google.com/#/container/accounts/<CONTA>/containers/<CONTAINER>/workspaces/<ESPAÇO>
```

**Sinal de sucesso:** você tem quatro coisas anotadas — `GTM-XXXXXXX` e os três números.

### Passo 3 · O site anuncia o que aconteceu

Aqui está a decisão técnica que mais economiza dor depois.

O Tag Manager consegue adivinhar cliques olhando o HTML ("disparar quando clicarem num link que
contém `wa.me`"). **Não faça assim.** No dia em que o botão mudar de classe, ou nascer um botão
novo, o gatilho quebra **em silêncio** — e você descobre pelo relatório vazio, semanas depois.

O certo é o site **declarar** o que aconteceu:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'view_item',
  currency: 'BRL',
  value: 12.9,
  items: [{ item_id: '481', item_name: 'Dipirona 500mg', price: 12.9 }],
});
```

Para o clique, **um ouvinte só, preso ao documento**, em vez de um `onClick` em cada botão:

```js
document.addEventListener('click', (evento) => {
  if (!evento.target.closest('a[href*="wa.me/"]')) return;
  window.dataLayer.push({ event: 'whatsapp_click', whatsapp_origem: location.pathname });
}, true);   // ⬅ fase de captura
```

Dois detalhes que parecem preciosismo e não são:

- **Delegação no documento** resolve de uma vez todos os botões que já existem — e o próximo, que ainda não foi escrito, já nasce medido. Na farmácia eram seis lugares que abriam o WhatsApp, e alguns eram componentes de servidor, que não têm evento.
- **Fase de captura** (o `true` no final) porque o link abre outra aba e, no celular, o sistema pode trocar de aplicativo antes de a bolha do evento terminar. Sem isso você perde cliques de celular — que é a maioria.

**Sinal de sucesso:** abra o site, aperte F12, aba **Console**, digite `dataLayer` e dê Enter. Faça
a ação. O evento aparece na lista.

### Passo 4 · Instalar o container no site

O Google dá dois trechos: um para o `<head>` e um `<noscript>` para logo depois do `<body>`.

- **HTML puro:** cole os dois, em **todas** as páginas.
- **Next.js (App Router):** o do `<head>` vai num componente cliente com `<Script strategy="afterInteractive">`; o `<noscript>` no topo do layout. Ponha no layout do **site público**, não no raiz — assim a área administrativa não entra na medição.
- **WordPress:** qualquer plugin de GTM, ou o `header.php` do tema filho.

Publique o site. **Este é o único deploy que o processo inteiro custa.**

**Sinal de sucesso:** veja o código-fonte da página no ar (Ctrl+U) e procure por `GTM-`. Tem que
aparecer.

### Passo 5 · Os três identificadores

Cada plataforma esconde o seu número num lugar diferente:

| Plataforma | O que você precisa | Onde acha |
|---|---|---|
| **Google Ads** | `AW-XXXXXXXXX` **e o rótulo** | *Metas → Conversões → Resumo* → clique na ação → **Configurar tag → Instalar manualmente**. O trecho traz `send_to: 'AW-XXXXXXXXX/rótulo'` — os dois pedaços estão ali, separados pela barra |
| **Meta Pixel** | o ID (15–16 dígitos) | *Gerenciador de Eventos → Fontes de dados* |
| **GA4** | `G-XXXXXXX` | *Admin → Fluxos de dados → o fluxo do site* |

> ⚠️ **Google Ads: aproveite a ação de conversão que já existe** em vez de criar uma nova. O
> histórico dela é o que o lance automático usa para aprender — ação nova começa do zero e a
> campanha volta à fase de aprendizado.
>
> 🧱 **Meta: confira se o pixel está atribuído à conta de anúncio.** É comum ele existir no
> portfólio e não estar ligado à conta. Aí ele registra o evento normalmente, você vê tudo verde no
> Gerenciador de Eventos — **e o anúncio não enxerga nada.** Na farmácia era exatamente esse
> o caso: pixel criado em set/2024, parado desde fev/2025, e a lista de contas com acesso estava
> vazia. Confira em *Gerenciador de Eventos → o pixel → Configurações → Contas de anúncios
> atribuídas*.

### Passo 6 · Autorizar a automação ⏯️

Com os scripts de `3-rastreamento/scripts/` (rode de dentro dessa pasta):

1. Copie `.env.example` para `.env` e preencha `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (Passo 1).
2. `python auth.py`

O navegador abre, você clica em **Permitir**, o token fica gravado no `.env`. **Roda uma vez só.**

**Sinal de sucesso:** o terminal imprime `[ok] Autorizado` e lista os escopos.

> ⚠️ Se aparecer que a **Tag Manager API está desativada**, o próprio erro traz o link. Habilite,
> espere um minuto, rode de novo.

### Passo 7 · Montar as tags

Escreva o arquivo de configuração — os identificadores do Passo 5, os do Passo 2 e a tabela da §3.3:

```json
{
  "container_publico": "GTM-XXXXXXX",
  "account_id": "…", "container_id": "…", "workspace_id": "…",
  "google_ads": { "conversion_id": "AW-…", "conversion_label": "…" },
  "meta_pixel": { "pixel_id": "…" },
  "ga4":        { "measurement_id": "G-…" },
  "eventos": [
    { "nome": "view_item",      "ga4": true, "meta": "ViewContent" },
    { "nome": "add_to_cart",    "ga4": true, "meta": "AddToCart" },
    { "nome": "view_cart",      "ga4": true },
    { "nome": "whatsapp_click", "ga4": true, "meta": "Lead", "google_ads": true }
  ]
}
```

```bash
python montar.py --config <caminho do json>
```

Ele cria as tags de base (as que carregam em toda página) e, para cada evento, o gatilho mais as
tags que aquele evento pediu. O que não estiver no arquivo não é criado — dá para começar só com o
Google Ads e acrescentar o resto depois. Rodar de novo não duplica: atualiza.

**Nada vai para o ar ainda.** As tags ficam no espaço de trabalho, de propósito.

**Sinal de sucesso:** a saída lista cada peça com `+ criado`, e termina em *"NÃO está no ar"*.

### Passo 8 · Testar antes de valer para o visitante

No Tag Manager, botão **Visualizar** (canto superior direito). Digite a URL do site; abre uma
janela conectada ao container.

Percorra o funil de verdade: abra um produto, adicione ao carrinho, abra o carrinho, clique no
botão. No painel do lado, a cada passo:

1. o evento aparece na coluna da esquerda, com o nome que você escolheu;
2. as tags daquele evento aparecem em **Tags Fired** (disparadas), e não em "Not Fired".

**Como ler a falha:** evento não aparece → o problema é do **Passo 3**, o site não anunciou. Evento
aparece e a tag não dispara → o problema é o **gatilho**.

### Passo 9 · Publicar

```bash
python montar.py --config <caminho do json> --publicar
```

Ou o botão **Enviar**, no painel. A partir daqui vale para todo mundo.

**Sinal de sucesso:** o container mostra "Versão 1" (ou a próxima) como publicada, com data.

### Passo 10 · Provar que está gravando — no dia seguinte

Testar no modo Visualizar prova que a tag **disparou**. **Não prova que a plataforma recebeu.** São
coisas diferentes, e é aqui que o processo termina de verdade:

| Onde | O que tem que aparecer | Quando |
|---|---|---|
| **GA4** → *Relatórios → Tempo real* | os eventos do funil | segundos |
| **Meta** → *Gerenciador de Eventos* | o evento em "Atividade recente" | minutos |
| **Google Ads** → *Metas → Conversões* | a ação sai de **"Inativa"** e vira **"Gravando conversões"** | horas, às vezes um dia |

Só quando as três estiverem verdes o rastreamento existe.

---

## 5. As armadilhas

| Sintoma | Causa |
|---|---|
| Tag dispara no Visualizar, Ads segue "Inativa" | normal nas primeiras horas. Passou de um dia: confira o **rótulo** — rótulo errado dispara para o nada, sem erro nenhum |
| Evento não aparece na camada de dados | o ouvinte foi montado antes do elemento existir, ou está na fase de bolha e o link abre outra aba antes. Delegação no documento, fase de captura |
| Conversão contada duas vezes | a tag ficou no código **e** no GTM. Ao migrar, tire a do código |
| O mesmo evento conta 10 vezes numa visita | o evento está preso a algo que re-renderiza (mudar quantidade, filtrar lista). Trave com uma referência: uma vez por tela |
| GA4 recebe o evento mas sem produto nenhum | falta ligar **"enviar dados de e-commerce"** na tag do GA4 — sem isso ela ignora `items` |
| Pixel do Meta registra, anúncio não enxerga | pixel não atribuído à conta de anúncio (§ Passo 5) |
| "Acesso bloqueado" no `auth.py` | seu e-mail não está em **Usuários de teste** na tela de permissão OAuth |
| `Erro 400: redirect_uri_mismatch` | o endereço de retorno que o script pede não é um dos cadastrados na credencial. Em **Credenciais → o cliente OAuth → URIs de redirecionamento autorizados** está a lista exata; o script tem de usar um deles **letra por letra** — `http://localhost:8080` e `http://localhost:8080/callback` são endereços **diferentes** para o Google. Ou cadastre o novo, ou faça o script usar um que já existe |
| A API está ativada e mesmo assim dá 403 | você ativou em **outro projeto**. A mensagem traz o **número** do projeto (ex.: `73683937884`) e o Console mostra o **ID** (ex.: `meu-projeto-438420`) — parecem coisas diferentes e são o mesmo projeto. Confira pelo número, não pelo nome |
| O navegador abre e o script morre na hora | o script fechou o servidor local sem esperar o clique. Tem de aguardar o retorno (`join`), senão o código de autorização chega depois que ninguém está mais ouvindo |
| Site publicado e nenhuma tag no HTML | o container foi colado no layout errado (o da área administrativa), ou o build subiu sem a variável de ambiente. **Prefira constante no código a variável de ambiente**: em `.env`, o risco real não é vazar (o ID vai no HTML de qualquer jeito) — é o deploy subir sem ela e o site rodar sem medição. Aconteceu na farmácia em 17/ago/2026, e a campanha ficou meses sem sinal |
| Campanha "não converte mais" depois de trocar o site | 🧱 o site novo subiu sem a tag do antigo. **Sempre confira o Passo 4 depois de qualquer troca de site** |

---

## 6. O que este processo NÃO cobre

- **Consentimento (LGPD).** Site com pixel de publicidade deveria pedir consentimento. O Tag Manager tem o *Consent Mode* para isso — é assunto próprio, e o processo acima não o instala. ⏯️
- **Rastreamento pelo servidor** (server-side GTM), que resolve bloqueadores e a vida curta dos cookies. Só compensa com volume.
- **Conversões offline** — a venda que fecha no balcão. Precisa de importação de conversão, e depende de o cliente registrar a origem.
- **Anúncio no Meta** propriamente dito. Aqui só se instala o pixel.
