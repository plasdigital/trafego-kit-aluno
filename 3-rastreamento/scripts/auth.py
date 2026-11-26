#!/usr/bin/env python3
"""
Autoriza o Claude a mexer no Google Tag Manager.

    python auth.py

Abre o navegador, você clica em "Permitir", e o refresh token fica gravado no
`.env` desta pasta. Roda uma vez só — depois disso o token se renova sozinho.

O client OAuth é o mesmo do kit do Google Ads (mesmo projeto do Google Cloud).
Se der erro dizendo que a API está desativada, é porque falta habilitar a
"Tag Manager API" no projeto — o link vem na própria mensagem de erro.
"""

import http.server
import io
import json
import os
import secrets
import socketserver
import threading
import urllib.parse
import urllib.request
import webbrowser

PASTA = os.path.dirname(os.path.abspath(__file__))
ENV = os.path.join(PASTA, ".env")

# As portas que a credencial aceita.
#
# O client OAuth e o mesmo do kit do Google Ads, e la os enderecos de retorno
# cadastrados no Google Cloud sao `http://localhost:8080` ate `:8090`, **sem
# caminho**. Qualquer outra porta -- ou a mesma porta com `/callback` no fim --
# volta como `Erro 400: redirect_uri_mismatch`, que nao explica nada disso.
# Cadastrar um endereco novo no Console tambem resolveria; reaproveitar o que ja
# esta la resolve sem sair do terminal.
PORTAS = range(8080, 8091)

# Ler o container, mexer nas tags do workspace, criar versão e publicar.
# Sem `publish` o Claude monta tudo e não consegue colocar no ar.
ESCOPOS = " ".join([
    "https://www.googleapis.com/auth/tagmanager.readonly",
    "https://www.googleapis.com/auth/tagmanager.edit.containers",
    "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
    "https://www.googleapis.com/auth/tagmanager.publish",
])


def ler_env():
    env = {}
    if os.path.exists(ENV):
        for linha in io.open(ENV, encoding="utf-8"):
            if "=" in linha and not linha.strip().startswith("#"):
                k, v = linha.split("=", 1)
                env[k.strip()] = v.strip().strip('"')
    return env


def gravar_token(refresh_token):
    """Reescreve só a linha do token — o resto do arquivo fica como está."""
    linhas = io.open(ENV, encoding="utf-8").read().splitlines()
    saida, achou = [], False
    for linha in linhas:
        if linha.startswith("GTM_REFRESH_TOKEN="):
            saida.append(f'GTM_REFRESH_TOKEN="{refresh_token}"')
            achou = True
        else:
            saida.append(linha)
    if not achou:
        saida.append(f'GTM_REFRESH_TOKEN="{refresh_token}"')
    io.open(ENV, "w", encoding="utf-8", newline="\n").write("\n".join(saida) + "\n")


class Retorno(http.server.BaseHTTPRequestHandler):
    codigo = None
    estado_recebido = None

    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        Retorno.codigo = q.get("code", [None])[0]
        Retorno.estado_recebido = q.get("state", [None])[0]
        erro = q.get("error", [None])[0]

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        recado = "Pode fechar esta aba e voltar para o terminal."
        if erro:
            recado = f"Autorização negada ({erro}). Volte ao terminal."
        self.wfile.write(
            f"<html><body style='font-family:sans-serif;padding:3rem'>"
            f"<h2>{recado}</h2></body></html>".encode("utf-8")
        )

    def log_message(self, *args):
        pass  # sem ruído de servidor no terminal


def main():
    env = ler_env()
    if not env.get("GOOGLE_CLIENT_ID") or not env.get("GOOGLE_CLIENT_SECRET"):
        raise SystemExit("Faltam GOOGLE_CLIENT_ID/SECRET no .env desta pasta.")

    # A porta vem antes do endereco: e ela que decide o `redirect_uri`, e o
    # Google exige que o endereco pedido aqui seja identico ao que recebe o
    # retorno.
    servidor = None
    for porta in PORTAS:
        try:
            servidor = socketserver.TCPServer(("localhost", porta), Retorno)
            break
        except OSError:
            continue
    if servidor is None:
        raise SystemExit("Nenhuma porta livre entre 8080 e 8090. Feche algum servidor local.")
    redirect = "http://localhost:%d" % porta

    # `state` protege contra alguém devolver um código que não foi você que pediu.
    estado = secrets.token_urlsafe(16)
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
        "client_id": env["GOOGLE_CLIENT_ID"],
        "redirect_uri": redirect,
        "response_type": "code",
        "scope": ESCOPOS,
        "access_type": "offline",   # sem isso não vem refresh token
        "prompt": "consent",        # força vir o refresh token mesmo se já autorizou antes
        "state": estado,
    })

    espera = threading.Thread(target=servidor.handle_request, daemon=True)
    espera.start()

    print("Abrindo o navegador para você autorizar…")
    print("Se não abrir, cole este endereço:\n")
    print(url + "\n")
    webbrowser.open(url)

    # Esperar de verdade. Sem este join o servidor fechava no mesmo instante
    # em que o navegador abria, e o codigo de autorizacao nunca chegava a
    # tempo -- o script falhava sempre, culpando o Google por erro nosso.
    print("Esperando voce clicar em Permitir (ate 5 minutos)...")
    espera.join(timeout=300)
    servidor.server_close()
    if not Retorno.codigo:
        raise SystemExit("Não veio o código de autorização. Tente de novo.")
    if Retorno.estado_recebido != estado:
        raise SystemExit("O `state` voltou diferente — autorização descartada por segurança.")

    dados = urllib.parse.urlencode({
        "code": Retorno.codigo,
        "client_id": env["GOOGLE_CLIENT_ID"],
        "client_secret": env["GOOGLE_CLIENT_SECRET"],
        "redirect_uri": redirect,
        "grant_type": "authorization_code",
    }).encode()
    token = json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", dados))

    if "refresh_token" not in token:
        raise SystemExit("O Google não devolveu refresh token. Rode de novo — o prompt=consent força.")

    gravar_token(token["refresh_token"])
    print("✓ Autorizado. Refresh token gravado em .env")
    print("  Escopos:", token.get("scope", "?"))


if __name__ == "__main__":
    main()
