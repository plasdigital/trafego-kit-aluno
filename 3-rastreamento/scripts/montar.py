#!/usr/bin/env python3
"""
Monta o rastreamento dentro de um container do Google Tag Manager.

    python montar.py --config <caminho do .json do cliente>          # monta, NAO publica
    python montar.py --config <...> --publicar                       # monta e coloca no ar
    python montar.py --config <...> --listar                         # so mostra o que ja existe

Cria, a partir do arquivo de configuracao:

  . as tags de base, em todas as paginas -- Google tag do Google Ads, Google tag
    do GA4 (que ja conta a visita de pagina sozinha) e o Meta Pixel;
  . um gatilho para cada evento que o site anuncia;
  . em cada evento, so as tags que o arquivo mandar: `ga4`, `meta` e
    `google_ads` sao decididos evento a evento.

O que nao estiver no arquivo de configuracao simplesmente nao e criado -- da
para comecar so com o Google Ads e acrescentar o resto depois.

**Nada vai para o ar sem `--publicar`.** Sem a flag, as tags ficam no espaco de
trabalho, para conferir no modo "Visualizar" do GTM antes de valer para o
visitante. E a mesma regra do resto da casa: nasce parado.

E idempotente: rodar de novo nao duplica nada -- o que ja existe com o mesmo
nome e atualizado.
"""

import argparse
import io
import json
import os
import urllib.error
import urllib.parse
import urllib.request

PASTA = os.path.dirname(os.path.abspath(__file__))
API = "https://tagmanager.googleapis.com/tagmanager/v2"

# Gatilho embutido do GTM, existe em todo container recem-criado.
TODAS_AS_PAGINAS = "2147479553"


# ---------------------------------------------------------------------------
# Acesso
# ---------------------------------------------------------------------------

def ler_env(caminho=None):
    """Credencial do `.env` desta pasta ou, com `--env`, a de outro arquivo (um por cliente).

    Aceita tambem os nomes `GOOGLE_OAUTH_CLIENT_ID` e `GOOGLE_REFRESH_TOKEN`, se o seu .env usar esses.
    """
    env = {}
    caminho = caminho or os.path.join(PASTA, ".env")
    if os.path.exists(caminho):
        for linha in io.open(caminho, encoding="utf-8"):
            if "=" in linha and not linha.strip().startswith("#"):
                k, v = linha.split("=", 1)
                env[k.strip()] = v.strip().strip('"')
    for nome, apelido in (("GOOGLE_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_ID"),
                          ("GOOGLE_CLIENT_SECRET", "GOOGLE_OAUTH_CLIENT_SECRET"),
                          ("GTM_REFRESH_TOKEN", "GOOGLE_REFRESH_TOKEN")):
        if not env.get(nome) and env.get(apelido):
            env[nome] = env[apelido]
    return env


def access_token(env):
    for chave in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GTM_REFRESH_TOKEN"):
        if not env.get(chave):
            raise SystemExit("Falta %s no .env. Rode `python auth.py` primeiro." % chave)
    dados = urllib.parse.urlencode({
        "client_id": env["GOOGLE_CLIENT_ID"],
        "client_secret": env["GOOGLE_CLIENT_SECRET"],
        "refresh_token": env["GTM_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    resposta = urllib.request.urlopen("https://oauth2.googleapis.com/token", dados)
    return json.load(resposta)["access_token"]


def chamar(token, metodo, caminho, corpo=None):
    req = urllib.request.Request(
        API + caminho,
        method=metodo,
        data=json.dumps(corpo).encode() if corpo is not None else None,
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            texto = r.read().decode()
            return json.loads(texto) if texto else {}
    except urllib.error.HTTPError as e:
        detalhe = e.read().decode()
        try:
            detalhe = json.loads(detalhe)["error"]["message"]
        except Exception:
            pass
        raise SystemExit("\n[x] %s %s\n    HTTP %s: %s\n" % (metodo, caminho, e.code, detalhe))


# ---------------------------------------------------------------------------
# As pecas
# ---------------------------------------------------------------------------

def nome(cfg, antigo, padrao):
    """`"nomes": "plataforma-tipo-detalhe"` no JSON usa o padrao `GA4 - Config - Tag do Google`,
    `GA4 - Evento - generate_lead`. Sem a chave, os nomes curtos (rodar de novo nao duplica: atualiza)."""
    return padrao if cfg.get("nomes") == "plataforma-tipo-detalhe" else antigo


def par(tipo, chave, valor):
    return {"type": tipo, "key": chave, "value": valor}


def gatilho_do_evento(nome_evento):
    """Dispara quando o site empurra `{event: '<nome>'}` na camada de dados."""
    return {
        "name": "Evento - " + nome_evento,
        "type": "customEvent",
        "customEventFilter": [{
            "type": "equals",
            "parameter": [
                par("template", "arg0", "{{_event}}"),
                par("template", "arg1", nome_evento),
            ],
        }],
    }


def variavel_da_camada(nome_parametro):
    """Le um campo do que o site empurrou na camada de dados (`{event, origem: ...}`)."""
    return {
        "name": "DLV - " + nome_parametro,
        "type": "v",
        "parameter": [
            par("integer", "dataLayerVersion", "2"),
            par("boolean", "setDefaultValue", "false"),
            par("template", "name", nome_parametro),
        ],
    }


def script_base_do_clarity(projeto):
    """O trecho do Microsoft Clarity (mapa de calor + gravacao de sessao)."""
    return (
        "<script>\n"
        "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};\n"
        "t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;\n"
        "y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);\n"
        "})(window,document,'clarity','script','" + projeto + "');\n"
        "</script>"
    )


def script_base_do_meta(pixel):
    """O trecho que o proprio Meta manda colar, com o ID ja dentro."""
    return (
        "<script>\n"
        "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n"
        "n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;\n"
        "n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;\n"
        "t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,\n"
        "document,'script','https://connect.facebook.net/en_US/fbevents.js');\n"
        "fbq('init', '" + pixel + "');\n"
        "fbq('track', 'PageView');\n"
        "</script>"
    )


def tags_de_base(cfg):
    """O que carrega em toda pagina, antes de qualquer evento."""
    tags = []

    if cfg.get("google_ads"):
        # A Google tag carrega a base do Ads; ela nao conta nada sozinha.
        tags.append({
            "name": nome(cfg, "Google Ads - base", "Ads - Base - Tag do Google"),
            "type": "googtag",
            "parameter": [par("template", "tagId", cfg["google_ads"]["conversion_id"])],
            "firingTriggerId": [TODAS_AS_PAGINAS],
        })

    if cfg.get("ga4"):
        # Esta, sim, ja registra a visita de pagina sozinha -- por isso o site
        # nao anuncia `page_view`: seria contar duas vezes.
        tags.append({
            "name": nome(cfg, "GA4 - base", "GA4 - Config - Tag do Google"),
            "type": "googtag",
            "parameter": [par("template", "tagId", cfg["ga4"]["measurement_id"])],
            "firingTriggerId": [TODAS_AS_PAGINAS],
        })

    if cfg.get("meta_pixel"):
        tags.append({
            "name": nome(cfg, "Meta Pixel - base", "Meta - Base - Pixel"),
            "type": "html",
            "parameter": [
                par("template", "html", script_base_do_meta(cfg["meta_pixel"]["pixel_id"])),
                par("boolean", "supportDocumentWrite", "false"),
            ],
            "firingTriggerId": [TODAS_AS_PAGINAS],
        })

    if cfg.get("clarity"):
        tags.append({
            "name": nome(cfg, "Clarity - base", "Clarity - Base"),
            "type": "html",
            "parameter": [
                par("template", "html", script_base_do_clarity(cfg["clarity"]["project_id"])),
                par("boolean", "supportDocumentWrite", "false"),
            ],
            "firingTriggerId": [TODAS_AS_PAGINAS],
        })

    return tags


def tags_do_evento(cfg, evento, id_gatilho):
    """As tags penduradas em um evento que o site anuncia."""
    nome_evento = evento["nome"]
    tags = []

    if evento.get("google_ads") and cfg.get("google_ads"):
        # `"google_ads": true` usa a conversao do bloco `google_ads` do arquivo. Um objeto
        # (`{"conversion_label": ..., "apelido": ...}`) troca so o que trouxer: e assim que um
        # site tem duas conversoes, como formulario e clique no WhatsApp (<UM CLIENTE>, 21/out/2026).
        ads = cfg["google_ads"]
        if isinstance(evento["google_ads"], dict):
            ads = {**ads, **evento["google_ads"]}
        tags.append({
            "name": nome(cfg, "Google Ads - conversao " + ads.get("apelido", evento["nome"]),
                         "Ads - Conversão - " + ads.get("apelido", evento["nome"])),
            "type": "awct",
            "parameter": [
                par("template", "conversionId", ads["conversion_id"].replace("AW-", "")),
                par("template", "conversionLabel", ads["conversion_label"]),
                par("boolean", "enableConversionLinker", "true"),
            ],
            "firingTriggerId": [id_gatilho],
        })

    if evento.get("ga4") and cfg.get("ga4"):
        # `sendEcommerceData` faz a tag ler `items`, `value` e `currency` direto
        # da camada de dados. Sem isso o GA4 receberia o evento vazio e nao
        # montaria o relatorio de produtos mais vistos.
        #
        # Nao mandamos `ecommerceMacroData`: esse campo so existe quando a fonte
        # e uma variavel do GTM. Deixando de fora, a fonte e a camada de dados,
        # que e de onde o site fala. A API descarta o campo em silencio se voce
        # mandar assim mesmo -- entao mandar nao quebra nada, so mente.
        parametros = [
            par("template", "measurementIdOverride", cfg["ga4"]["measurement_id"]),
            par("template", "eventName", nome_evento),
            par("boolean", "sendEcommerceData", "true"),
        ]
        # `parametros` do evento: cada campo que o site empurra junto com o
        # evento vai para o GA4 com o mesmo nome. Sem isto o GA4 recebe so o
        # nome do evento -- sabe que clicaram, nao sabe onde.
        if evento.get("parametros"):
            parametros.append({
                "type": "list",
                "key": "eventSettingsTable",
                "list": [{
                    "type": "map",
                    "map": [
                        par("template", "parameter", p),
                        par("template", "parameterValue", "{{DLV - %s}}" % p),
                    ],
                } for p in evento["parametros"]],
            })
        tags.append({
            "name": nome(cfg, "GA4 - " + evento["nome"], "GA4 - Evento - " + evento["nome"]),
            "type": "gaawe",
            "parameter": parametros,
            "firingTriggerId": [id_gatilho],
        })

    if evento.get("meta") and cfg.get("meta_pixel"):
        # Sem valor monetario de proposito: o site nao vende nem cobra, entao
        # valor aqui seria numero inventado. O Meta usa estes eventos para
        # atribuicao e para montar publico.
        #
        # Opcionais (09/out/2026, <UM CLIENTE>):
        #   "meta_params": {"content_name": "veiculo"} -> custom_data lido da camada de dados
        #   "meta_event_id": "event_id"                 -> eventID, o mesmo que o lead grava
        #                                                  no banco; e o que deixa a API de
        #                                                  Conversoes mandar o lead de novo sem
        #                                                  contar duas vezes
        # Evento fora da lista padrao do Meta vai por `trackCustom` (com `track`
        # o Meta recusa o nome e avisa no console).
        metodo = "track" if evento["meta"] in EVENTOS_PADRAO_META else "trackCustom"
        dados = ", ".join("%s: {{DLV - %s}}" % (k, v) for k, v in evento.get("meta_params", {}).items())
        extra = ""
        if evento.get("meta_event_id"):
            extra = ", {eventID: {{DLV - %s}}}" % evento["meta_event_id"]
        argumentos = "'%s'" % evento["meta"]
        if dados or extra:
            argumentos += ", {%s}%s" % (dados, extra)
        # O mesmo evento do Meta em dois gatilhos (Contact no WhatsApp e no
        # telefone): o nome leva o gatilho, senao a 2a tag sobrescreve a 1a.
        repete = sum(1 for e in cfg.get("eventos", []) if e.get("meta") == evento["meta"]) > 1
        sufixo = " · " + nome_evento if repete else ""
        tags.append({
            "name": nome(cfg, "Meta Pixel - " + evento["meta"], "Meta - Evento - " + evento["meta"]) + sufixo,
            "type": "html",
            "parameter": [
                par("template", "html",
                    "<script>if (window.fbq) fbq('%s', %s);</script>" % (metodo, argumentos)),
                par("boolean", "supportDocumentWrite", "false"),
            ],
            "firingTriggerId": [id_gatilho],
        })

    return tags


# Eventos padrao do Pixel: os outros nomes vao por trackCustom.
EVENTOS_PADRAO_META = {
    "AddPaymentInfo", "AddToCart", "AddToWishlist", "CompleteRegistration", "Contact",
    "CustomizeProduct", "Donate", "FindLocation", "InitiateCheckout", "Lead", "PageView",
    "Purchase", "Schedule", "Search", "StartTrial", "SubmitApplication", "Subscribe", "ViewContent",
}


# ---------------------------------------------------------------------------
# Aplicacao (idempotente: procura pelo nome antes de criar)
# ---------------------------------------------------------------------------

def aplicar(token, espaco, recurso, item, existentes):
    chave = {"triggers": "triggerId", "variables": "variableId"}.get(recurso, "tagId")
    achado = None
    for x in existentes:
        if x.get("name") == item["name"]:
            achado = x
            break
    if achado:
        resultado = chamar(token, "PUT", "/%s/%s/%s" % (espaco, recurso, achado[chave]), item)
        print("  ~ atualizado: " + item["name"])
    else:
        resultado = chamar(token, "POST", "/%s/%s" % (espaco, recurso), item)
        print("  + criado:     " + item["name"])
        existentes.append(resultado)
    return resultado


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True, help="JSON do cliente com os IDs")
    p.add_argument("--publicar", action="store_true", help="cria a versao e coloca no ar")
    p.add_argument("--listar", action="store_true", help="so mostra o que ja existe")
    p.add_argument("--env", help="arquivo .env de um cliente; sem isto, o .env desta pasta")
    args = p.parse_args()

    cfg = json.load(io.open(args.config, encoding="utf-8"))
    token = access_token(ler_env(args.env))

    # Cada versao criada/publicada consome o espaco de trabalho e o GTM abre
    # outro, com numero novo. Por isso o numero do JSON so vale se ainda existir;
    # senao usa o espaco de trabalho que estiver aberto. (26/set/2026)
    conteiner = "accounts/%s/containers/%s" % (cfg["account_id"], cfg["container_id"])
    abertos = chamar(token, "GET", "/%s/workspaces" % conteiner).get("workspace", [])
    ids = [w["workspaceId"] for w in abertos]
    wid = str(cfg.get("workspace_id", ""))
    if wid not in ids:
        if not ids:
            raise SystemExit("Nenhum espaco de trabalho aberto no container.")
        wid = ids[0]
        print("(espaco de trabalho atual: %s)" % wid)
    espaco = "%s/workspaces/%s" % (conteiner, wid)

    tags = chamar(token, "GET", "/%s/tags" % espaco).get("tag", [])
    gatilhos = chamar(token, "GET", "/%s/triggers" % espaco).get("trigger", [])

    if args.listar:
        print("Container " + cfg.get("container_publico", cfg["container_id"]))
        print("  %d tag(s):" % len(tags))
        for t in tags:
            print("    - %s  [%s]" % (t["name"], t["type"]))
        print("  %d gatilho(s):" % len(gatilhos))
        for g in gatilhos:
            print("    - %s  [%s]" % (g["name"], g["type"]))
        if not tags and not gatilhos:
            print("    (container vazio)")
        return

    campos = set()
    for ev in cfg.get("eventos", []):
        campos.update(ev.get("parametros", []))
        campos.update(ev.get("meta_params", {}).values())
        if ev.get("meta_event_id"):
            campos.add(ev["meta_event_id"])
    campos = sorted(campos)
    if campos:
        variaveis = chamar(token, "GET", "/%s/variables" % espaco).get("variable", [])
        print("> variaveis da camada de dados")
        for campo in campos:
            aplicar(token, espaco, "variables", variavel_da_camada(campo), variaveis)

    print("> base (todas as paginas)")
    for tag in tags_de_base(cfg):
        aplicar(token, espaco, "tags", tag, tags)

    for evento in cfg.get("eventos", []):
        print("> evento `%s`" % evento["nome"])
        gat = aplicar(token, espaco, "triggers", gatilho_do_evento(evento["nome"]), gatilhos)
        for tag in tags_do_evento(cfg, evento, gat["triggerId"]):
            aplicar(token, espaco, "tags", tag, tags)

    if not args.publicar:
        print("\n[ok] Montado no espaco de trabalho -- NAO esta no ar.")
        print("     Confira no modo 'Visualizar' do GTM e rode de novo com --publicar.")
        return

    versao = chamar(token, "POST", "/%s:create_version" % espaco,
                    {"name": cfg.get("nome_versao", "Rastreamento base")})
    caminho = versao["containerVersion"]["path"]
    chamar(token, "POST", "/%s:publish" % caminho)
    print("\n[ok] Publicado: " + str(versao["containerVersion"].get("name")))


if __name__ == "__main__":
    main()
