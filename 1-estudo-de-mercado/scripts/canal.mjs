// Para onde vai o tráfego de cada anúncio, lido do tipo do botão (cta_tipo) e do link (destino) da Biblioteca da Meta.
// "fb.me/" é o link que a Biblioteca mostra para o formulário instantâneo da Meta, qualquer que seja o botão
// ("Cadastre-se", "Saiba mais", "Pedir orçamento"); por isso o domínio vem antes do texto do botão.
// Distribuição (cria base, não traz lead): perfil do Instagram e sem botão. Todo o resto é captação.
const FORM_EXTERNO = /typeform\.com|respondi\.app|yayforms|advforms|jotform|forms\.gle|docs\.google\.com\/forms|tally\.so|^form\.|\/form/;

export function canalDe(a) {
  const tipo = a.cta_tipo || '';
  const url = (a.destino || '').toLowerCase();
  const dominio = url.replace(/^https?:\/\/(www\.)?/, '').split(/[/?#]/)[0];
  if (tipo === 'WHATSAPP_MESSAGE' || /wa\.me|whatsapp\.com/.test(url)) return 'WhatsApp';
  if (tipo === 'INSTAGRAM_MESSAGE' || /ig\.me/.test(url)) return 'Direct do Instagram';
  if (tipo === 'MESSAGE_PAGE' || /m\.me|messenger\.com/.test(url)) return 'Messenger';
  if (tipo === 'SIGN_UP' || /^fb\.(me|com)$/.test(dominio) || /lead_gen/.test(url)) return 'Formulário da Meta';
  if (tipo === 'VIEW_INSTAGRAM_PROFILE' || /instagram\.com/.test(dominio)) return 'Perfil do Instagram';
  if (!/^https?:/.test(url)) return 'Sem botão';
  if (FORM_EXTERNO.test(dominio + url.slice(url.indexOf(dominio) + dominio.length))) return 'Formulário externo';
  return 'Site/LP';
}

export const objetivoDe = (canal) => (canal === 'Perfil do Instagram' || canal === 'Sem botão' ? 'distribuicao' : 'captacao');

// Endereço da página sem rastreio (utm, hsa, fbclid, {{macros}}), para visitar uma vez só cada LP
export function enderecoLimpo(url) {
  try {
    const u = new URL(url);
    for (const k of [...u.searchParams.keys()]) if (/^(utm_|hsa_|fbclid|gclid)/.test(k) || /\{\{/.test(u.searchParams.get(k))) u.searchParams.delete(k);
    u.hash = '';
    return u.toString().replace(/\/$/, '');
  } catch { return null; }
}
