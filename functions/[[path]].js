// Cloudflare Pages functions/[[path]].js (cluster projeleri için)
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // ═══════════════════════════════════════════════════
  // DESTEKLENEN SAYFALAR (flat yapı)
  // Aşağıdaki liste build sırasında panelde belirlediğiniz
  // URL path'lerle (örn. giris-rehberi, guvenlik-rehberi) doldurulur.
  // Googlebot bu path'lere geldiğinde → Cloudflare static dosyayı sunar:
  //   /              → index.html
  //   /slug-adiniz/  → slug-adiniz.html
  // TR IP     → tr.html
  // Diğer IP  → index2.html
  // ═══════════════════════════════════════════════════

  const clusterPaths = new Set([
    '/',
    '/index.html',
        '/giris-rehberi',
    '/giris-rehberi/',
    '/guvenlik-rehberi',
    '/guvenlik-rehberi/',
    '/uyelik-rehberi',
    '/uyelik-rehberi/',
    '/odeme-yontemleri',
    '/odeme-yontemleri/',
    '/mobil-erisim',
    '/mobil-erisim/',
    '/bonus-kampanyalar',
    '/bonus-kampanyalar/',
    '/keyword-ana',
    '/keyword-ana/',
    '/keyword-giris',
    '/keyword-giris/',
    '/telegram',
    '/telegram/',
    '/twitter',
    '/twitter/',
    '/guncel',
    '/guncel/',
    '/guncel-giris',
    '/guncel-giris/',
  
  ]);

  // Bu path bizim yönettiğimiz sayfalardan biri mi?
  if (!clusterPaths.has(url.pathname)) {
    return context.next();
  }

  // ═══════════════════════════════════════════════════
  // GOOGLEBOT TESPİTİ
  // ═══════════════════════════════════════════════════

  const isGooglebot = /googlebot|googlebot-image|googlebot-news|googlebot-video|googlebot-mobile|mediapartners-google|adsbot-google|adsbot-google-mobile|apis-google|google-inspectiontool|googleweblight|storebot-google|google-extended|google-safety|googleother|googleother-image|google-cloudvertexbot|google-site-verification|feedfetcher-google|google favicon|googlesites/i.test(userAgent);

  if (isGooglebot) {
    console.log(`Googlebot → ${url.pathname}`);
    // Cloudflare Pages flat yapıda dosyayı otomatik sunar:
    //   / → index.html
    //   /giris-rehberi/ → giris-rehberi.html
    return context.next();
  }

  // ═══════════════════════════════════════════════════
  // KULLANICI YÖNLENDİRME
  // TR  → tr.html
  // Diğer → index2.html
  // ═══════════════════════════════════════════════════

  const country = (request.headers.get('cf-ipcountry') || '').toUpperCase();

  if (country === 'TR') {
    console.log(`TR user on ${url.pathname} → /tr.html`);
    return Response.redirect(`${url.origin}/tr.html`, 302);
  } else {
    console.log(`Non-TR user on ${url.pathname} → /index2.html`);
    return Response.redirect(`${url.origin}/index2.html`, 302);
  }
}
