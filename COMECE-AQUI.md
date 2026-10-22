# Comece aqui

Do zero até o primeiro painel do estudo de mercado. As contas de anúncio (`meta-ads/` e `google-ads/`) têm o
próprio `COMECE-AQUI.md`, e você só precisa delas quando for operar uma conta.

## 1. Instale o que falta

| | Como confere | Se não tiver |
|---|---|---|
| Node 20 ou mais novo | `node -v` | [nodejs.org](https://nodejs.org), versão LTS |
| Google Chrome | abre no seu PC | [google.com/chrome](https://www.google.com/chrome) |
| ffmpeg | `ffmpeg -version` | Windows: `winget install Gyan.FFmpeg` · Mac: `brew install ffmpeg` |
| Python 3 (opcional) | `python --version` | [python.org](https://www.python.org) |

## 2. Baixe a pasta e as dependências

```bash
git clone https://github.com/plasdigital/trafego-kit-aluno.git
cd trafego-kit-aluno
npm install
```

O `npm install` baixa o Playwright, que controla o seu Chrome para ler a Biblioteca de Anúncios. Ele **não**
baixa outro navegador: usa o Chrome que você já tem.

Para transcrever a fala dos vídeos (opcional): `pip install faster-whisper`. Sem placa de vídeo NVIDIA, a
transcrição roda na CPU e fica lenta. Dá para pular, e a análise usa a imagem e o texto do anúncio.

## 3. Abra o agente aqui dentro e peça o estudo

```bash
claude
```

> *"faz um estudo de mercado de <o seu nicho> em <a sua cidade>"*

O agente vai montar o `estudo.json` com você, que é a única parte que pede a sua cabeça:

- **o que você vende, para quem e o que você nunca promete**: é contra isso que ele avalia cada anúncio;
- **de 8 a 20 buscas** que o seu cliente faria, algumas com a cidade;
- **os grupos de concorrente** (ex.: clínica × rede);
- **os benefícios** que se anunciam no seu nicho (avaliação grátis, parcelamento, prazo…).

Depois ele coleta, analisa e abre o painel em `1-estudo-de-mercado/estudos/<nome>/painel/index.html`.

## 4. A parte do Google (opcional)

O Planejador de palavras-chave do Google Ads mostra o que se busca e quanto concorre. É de graça, mas exige uma
conta do Google Ads (não precisa de campanha ativa).

1. Google Ads › **Ferramentas** › **Planejador de palavras-chave** › **Descobrir novas palavras-chave**.
2. Coloque 5 a 10 buscas do seu nicho e a sua região.
3. **Baixar ideias de palavras-chave** › CSV.
4. Peça ao agente: *"põe esse CSV no estudo"* (ele roda o `google-palavras.mjs`).

Já tem o `google-ads/` configurado com acesso **Basic** na API? Aí o agente tira as palavras direto pelo
`keyword_planner.py`, sem você baixar nada. Com o acesso Explorer, a pesquisa de palavra-chave não é liberada.
