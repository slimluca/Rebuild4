export type LegacyRedirectResult =
  | { type: "redirect"; destination: string }
  | { type: "gone" }
  | { type: "pass" };

export const directLegacyRedirects: Record<string, string> = {
  "/modelle-webcam": "/modelle-webcam/",
  "/modelle-webcam-online": "/modelle-webcam/",
  "/modelle-online": "/modelle-online-ora/",
  "/modelle-online-ora": "/modelle-online-ora/",
  "/webcam-model": "/diventare-webcam-model/",
  "/webcam-models": "/diventare-webcam-model/",
  "/diventa-webcam-model": "/diventare-webcam-model/",
  "/diventare-webcam-model": "/diventare-webcam-model/",
  "/diventa-camgirl": "/diventare-camgirl/",
  "/camgirl": "/diventare-camgirl/",
  "/lavorare-webcam": "/lavorare-in-webcam/",
  "/lavorare-in-webcam": "/lavorare-in-webcam/",
  "/guadagni-webcam": "/guadagni-webcam-model/",
  "/guadagni-webcam-model": "/guadagni-webcam-model/",
  "/privacy-webcam": "/privacy-webcam-model/",
  "/privacy-webcam-model": "/privacy-webcam-model/",
  "/attrezzatura-webcam": "/attrezzatura-webcam-model/",
  "/attrezzatura-webcam-model": "/attrezzatura-webcam-model/",
  "/modelle-hd": "/modelle-hd/",
  "/nuove-modelle": "/nuove-modelle-webcam/",
  "/nuove-modelle-webcam": "/nuove-modelle-webcam/",
  "/modelle-popolari": "/modelle-popolari/",
  "/modelle-bionde": "/modelle-bionde/",
  "/modelle-brune": "/modelle-brune/",
  "/modelle-asiatiche": "/modelle-asiatiche/",
  "/modelle-italiane": "/modelle-italiane/",
  "/modelle-mature": "/modelle-mature/",
  "/modelle-trans": "/modelle-trans/",
  "/coppie-webcam": "/coppie-webcam/",
  "/ragazze-live": "/ragazze-live/",
  "/camgirl-online": "/camgirl-online/",
};

export const currentPublicPaths = new Set([
  "/",
  "/academy/",
  "/faq/",
  "/privacy-policy/",
  "/termini/",
  "/disclaimer/",
  "/contatti/",
  "/diventare-webcam-model/",
  "/diventare-camgirl/",
  "/lavorare-in-webcam/",
  "/privacy-webcam-model/",
  "/attrezzatura-webcam-model/",
  "/guadagni-webcam-model/",
  "/modelle-webcam/",
  "/modelle-online-ora/",
  "/modelle-disponibili-adesso/",
  "/nuove-modelle-webcam/",
  "/modelle-hd/",
  "/modelle-popolari/",
  "/modelle-con-piu-utenti/",
  "/modelle-private/",
  "/modelle-in-chat-privata/",
  "/modelle-in-chat-pubblica/",
  "/modelle-in-gruppo/",
  "/modelle-con-preview-live/",
  "/modelle-live-cam/",
  "/modelle-in-videochat/",
  "/modelle-mobile/",
  "/coppie-webcam/",
  "/modelle-trans/",
  "/ragazze-live/",
  "/camgirl-online/",
  "/modelle-europee/",
  "/modelle-asiatiche/",
  "/modelle-latine/",
  "/modelle-nordamericane/",
  "/modelle-sudamericane/",
  "/modelle-italiane/",
  "/modelle-spagnole/",
  "/modelle-francesi/",
  "/modelle-tedesche/",
  "/modelle-inglesi/",
  "/modelle-brasiliane/",
  "/modelle-colombiane/",
  "/modelle-giapponesi/",
  "/modelle-coreane/",
  "/modelle-thailandesi/",
  "/modelle-russe/",
  "/modelle-multilingue/",
  "/modelle-18-plus/",
  "/modelle-20-plus/",
  "/modelle-30-plus/",
  "/modelle-40-plus/",
  "/modelle-50-plus/",
  "/modelle-mature/",
  "/modelle-bionde/",
  "/modelle-brune/",
  "/modelle-rosse/",
  "/modelle-capelli-neri/",
  "/modelle-capelli-lunghi/",
  "/modelle-occhi-azzurri/",
  "/modelle-occhi-verdi/",
  "/modelle-tattoo/",
  "/modelle-con-piercing/",
  "/modelle-petite/",
  "/modelle-slim/",
  "/modelle-fitness/",
  "/modelle-curvy/",
  "/modelle-formose/",
  "/modelle-prosperose/",
  "/modelle-naturali/",
  "/modelle-glamour/",
  "/modelle-eleganti/",
  "/modelle-lusso/",
  "/modelle-premium/",
  "/modelle-cosplay/",
  "/modelle-lingerie/",
  "/modelle-romantiche/",
  "/modelle-flirt/",
  "/modelle-dance/",
  "/modelle-toys/",
  "/modelle-feet/",
  "/modelle-bdsm/",
  "/modelle-roleplay/",
  "/modelle-gaming/",
  "/modelle-music/",
  "/modelle-cosplay-live/",
]);

const systemJunkPrefixes = ["/wp-admin", "/wp-content/", "/wp-includes/"];
const systemJunkPaths = new Set(["/wp-login.php", "/xmlrpc.php"]);

const keywordRoutes: Array<{ terms: string[]; destination: string }> = [
  { terms: ["privacy", "sicurezza"], destination: "/privacy-webcam-model/" },
  { terms: ["guadagni", "earnings", "soldi"], destination: "/guadagni-webcam-model/" },
  { terms: ["attrezzatura", "setup", "camera", "luci"], destination: "/attrezzatura-webcam-model/" },
  { terms: ["diventare", "diventa", "lavoro", "lavorare", "model-signup", "creator"], destination: "/diventare-webcam-model/" },
  { terms: ["hd"], destination: "/modelle-hd/" },
  { terms: ["nuove", "new"], destination: "/nuove-modelle-webcam/" },
  { terms: ["popolari", "popular"], destination: "/modelle-popolari/" },
  { terms: ["bionde", "blonde"], destination: "/modelle-bionde/" },
  { terms: ["brune", "brunette"], destination: "/modelle-brune/" },
  { terms: ["asiatiche", "asian"], destination: "/modelle-asiatiche/" },
  { terms: ["italiane", "italia", "italian"], destination: "/modelle-italiane/" },
  { terms: ["mature"], destination: "/modelle-mature/" },
  { terms: ["trans"], destination: "/modelle-trans/" },
  { terms: ["coppie", "couples"], destination: "/coppie-webcam/" },
  { terms: ["ragazze", "girls"], destination: "/ragazze-live/" },
  { terms: ["camgirl"], destination: "/camgirl-online/" },
  { terms: ["live", "online", "modelle", "webcam"], destination: "/modelle-webcam/" },
];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function keywordDestination(pathname: string): string | undefined {
  const haystack = decodeURIComponent(pathname).toLowerCase().replace(/[^a-z0-9]+/g, " ");
  if (/\bcamgirl\b/.test(haystack) && /\b(diventare|diventa|lavoro|lavorare|creator)\b/.test(haystack)) {
    return "/diventare-camgirl/";
  }
  return keywordRoutes.find((route) => route.terms.some((term) => haystack.includes(term)))?.destination;
}

export function isWordPressSystemJunk(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return systemJunkPaths.has(normalized) || systemJunkPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function resolveLegacyRedirect(pathname: string): LegacyRedirectResult {
  const normalized = normalizePath(pathname);
  const direct = directLegacyRedirects[normalized];
  if (direct) {
    return pathname === direct ? { type: "pass" } : { type: "redirect", destination: direct };
  }

  if (/^\/(?:category|tag)\//.test(pathname)) {
    return { type: "redirect", destination: keywordDestination(pathname) ?? "/modelle-webcam/" };
  }

  if (/^\/20\d{2}\/\d{2}\//.test(pathname)) {
    return { type: "redirect", destination: keywordDestination(pathname) ?? "/modelle-webcam/" };
  }

  if (/^\/page\/\d+\/?$/.test(pathname)) {
    const destination = keywordDestination(pathname);
    return { type: "redirect", destination: destination === "/diventare-webcam-model/" ? "/academy/" : destination ?? "/modelle-webcam/" };
  }

  return { type: "pass" };
}

export function isCurrentPublicPath(pathname: string): boolean {
  return currentPublicPaths.has(pathname);
}
