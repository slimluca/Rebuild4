import type { Metadata } from "next";
export { getLiveModels, getVisitorGeoFromHeaders, type LiveModel } from "@/lib/models";

export const siteUrl = "https://modellewebcam.com";
export const brand = "Modelle Webcam";

export const navItems = [
  { href: "/modelle-online-ora/", label: "Online ora" },
  { href: "/modelle-webcam/", label: "Categorie" },
  { href: "/diventare-webcam-model/", label: "Diventa model" },
  { href: "/privacy-webcam-model/", label: "Privacy" },
  { href: "/guadagni-webcam-model/", label: "Guadagni" },
];

export const academyLinks = [
  { href: "/diventare-webcam-model/", label: "Diventa webcam model" },
  { href: "/diventare-camgirl/", label: "Diventa camgirl" },
  { href: "/lavorare-in-webcam/", label: "Lavorare in webcam" },
  { href: "/privacy-webcam-model/", label: "Proteggi privacy" },
  { href: "/attrezzatura-webcam-model/", label: "Prepara studio" },
  { href: "/guadagni-webcam-model/", label: "Guadagni realistici" },
];

export const globalFaqs = [
  {
    question: "Serve essere maggiorenni?",
    answer: "Sì. Il sito e i percorsi collegati sono riservati esclusivamente ad adulti 18+.",
  },
  {
    question: "Posso lavorare da casa?",
    answer: "Sì, se hai uno spazio privato, controllato e separato dalla tua vita personale.",
  },
  {
    question: "I guadagni sono garantiti?",
    answer: "No. Dipendono da piattaforma, tempo online, qualità del profilo, comunicazione e costanza.",
  },
  {
    question: "Che attrezzatura serve?",
    answer: "Camera stabile, luce morbida, audio chiaro, connessione affidabile e uno sfondo pulito.",
  },
  {
    question: "Come proteggo la mia identità?",
    answer: "Usa nome d'arte, email dedicata, profili separati e nessun dettaglio privato in scena.",
  },
  {
    question: "Devo valutare tasse e regole locali?",
    answer: "Sì. Per scelte fiscali o legali è corretto parlare con un professionista qualificato.",
  },
  {
    question: "È adatto a chiunque?",
    answer: "No. Serve consenso pieno, privacy, autonomia e capacità di gestire confini.",
  },
  {
    question: "Da dove inizio?",
    answer: "Prepara profilo, privacy, studio e limiti. Poi valuta la registrazione.",
  },
];

export type GuideSection = {
  kicker?: string;
  title: string;
  body: string;
  points?: string[];
};

export type GuidePage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  ctaLabel?: string;
  ctaHref?: string;
  sections: GuideSection[];
  faqs?: typeof globalFaqs;
};

export const guidePages: Record<string, GuidePage> = {
  "diventare-webcam-model": {
    slug: "diventare-webcam-model",
    title: "Diventa webcam model",
    description:
      "Percorso compatto per aprire un profilo creator 18+ con privacy, setup, registrazione e aspettative realistiche.",
    eyebrow: "Creator signup",
    intro: "Apri il tuo profilo solo dopo aver preparato identità, studio, privacy e limiti personali.",
    ctaLabel: "Candidati come model",
    ctaHref: "/go/model-signup",
    sections: [
      {
        kicker: "Profilo",
        title: "Apri un'identità separata",
        body: "Scegli un nome d'arte, crea email dedicate e non collegare la presenza creator ai profili privati.",
        points: ["Nome d'arte", "Email dedicata", "Social separati", "Foto non riciclate"],
      },
      {
        kicker: "Studio",
        title: "Prepara un set controllato",
        body: "Luce, audio, sfondo e connessione devono essere pronti prima della registrazione.",
        points: ["Luce morbida", "Audio pulito", "Sfondo neutro", "Connessione stabile"],
      },
      {
        kicker: "Privacy",
        title: "Tieni fuori i dettagli personali",
        body: "Niente cognome, città precisa, documenti, foto familiari, viste dalla finestra o oggetti riconoscibili.",
        points: ["Nessun dato privato", "Canali separati", "Sfondo verificato", "Routine protetta"],
      },
      {
        kicker: "Regole",
        title: "Leggi condizioni e verifiche",
        body: "Controlla documenti richiesti, strumenti di sicurezza, pagamenti e regole della piattaforma.",
        points: ["Documenti validi", "Termini letti", "Pagamenti chiari", "Sicurezza attiva"],
      },
      {
        kicker: "Online",
        title: "Vai live con confini chiari",
        body: "Decidi prima cosa accetti, cosa rifiuti e quanto tempo puoi sostenere.",
        points: ["Limiti scritti", "Orari realistici", "Pause", "Blocco richieste scomode"],
      },
      {
        kicker: "Risultati",
        title: "Guadagni senza promesse",
        body: "Le entrate variano. Valuta tempo, qualità, costi, continuità e obblighi locali.",
        points: ["Nessuna garanzia", "Costi monitorati", "Entrate tracciate", "Supporto qualificato"],
      },
    ],
    faqs: globalFaqs.slice(0, 6),
  },
  "diventare-camgirl": {
    slug: "diventare-camgirl",
    title: "Diventa camgirl",
    description: "Primi passi per creare una presenza webcam 18+ con discrezione, studio e confini chiari.",
    eyebrow: "Start creator",
    intro: "Parti da stile, privacy e limiti. La camera arriva dopo.",
    ctaLabel: "Scopri come iniziare",
    ctaHref: "/diventare-webcam-model/",
    sections: [
      {
        kicker: "Stile",
        title: "Scegli come presentarti",
        body: "Definisci tono, disponibilità e confini prima di aprire un profilo.",
        points: ["Stile", "Bio", "Limiti", "Routine"],
      },
      {
        kicker: "Privacy",
        title: "Separa tutto",
        body: "Account, email, immagini e canali devono restare dedicati al percorso creator.",
      },
      {
        kicker: "Setup",
        title: "Testa prima di andare live",
        body: "Verifica luce, audio, inquadratura e connessione in anticipo.",
      },
    ],
    faqs: globalFaqs.slice(0, 4),
  },
  "lavorare-in-webcam": {
    slug: "lavorare-in-webcam",
    title: "Lavorare in webcam",
    description: "Modulo pratico su spazio domestico, orari, privacy e gestione del lavoro in webcam.",
    eyebrow: "Home studio",
    intro: "Casa e profilo creator devono restare separati, anche quando usi la stessa stanza.",
    sections: [
      {
        kicker: "Spazio",
        title: "Crea una zona privata",
        body: "Scegli una stanza chiudibile, silenziosa e senza dettagli personali visibili.",
        points: ["Porta chiusa", "Sfondo neutro", "Rumori ridotti", "Oggetti rimossi"],
      },
      {
        kicker: "Ritmo",
        title: "Imposta orari sostenibili",
        body: "La costanza aiuta solo se non compromette sicurezza, energia e vita privata.",
      },
      {
        kicker: "Controllo",
        title: "Tieni regole e pagamenti sotto mano",
        body: "Prima di procedere verifica condizioni, privacy, pagamenti e obblighi locali.",
      },
    ],
    faqs: [globalFaqs[1], globalFaqs[2], globalFaqs[5]],
  },
  "guadagni-webcam-model": {
    slug: "guadagni-webcam-model",
    title: "Guadagni webcam model",
    description: "Aspettative realistiche sui fattori che influenzano i guadagni in webcam, senza promesse.",
    eyebrow: "Earnings console",
    intro: "I guadagni non sono garantiti. Leggi le variabili prima di fare piani.",
    sections: [
      {
        kicker: "Variabili",
        title: "Cosa incide",
        body: "Tempo online, profilo, qualità tecnica, comunicazione, lingue e regole della piattaforma.",
        points: ["Tempo", "Profilo", "Setup", "Lingue", "Regole"],
      },
      {
        kicker: "Costi",
        title: "Considera il lavoro reale",
        body: "Conta anche preparazione, pause, attrezzatura, energia e gestione della privacy.",
      },
      {
        kicker: "Obblighi",
        title: "Verifica la tua situazione",
        body: "Per tasse o aspetti legali serve un professionista qualificato.",
      },
    ],
    faqs: [globalFaqs[2], globalFaqs[5], globalFaqs[7]],
  },
  "privacy-webcam-model": {
    slug: "privacy-webcam-model",
    title: "Privacy webcam model",
    description: "Controlli privacy per proteggere identità, sfondo, account, dati e confini personali.",
    eyebrow: "Privacy console",
    intro: "La privacy è una configurazione continua: identità, scena, account e regole personali.",
    sections: [
      {
        kicker: "Identità",
        title: "Usa un nome d'arte",
        body: "Non collegarlo al tuo nome reale, ai profili privati o a foto già pubblicate.",
        points: ["Nome separato", "Email dedicata", "Foto nuove", "Social distinti"],
      },
      {
        kicker: "Scena",
        title: "Controlla l'inquadratura",
        body: "Rimuovi finestre, documenti, pacchi, foto, targhe e oggetti riconoscibili.",
      },
      {
        kicker: "Account",
        title: "Attiva strumenti di sicurezza",
        body: "Usa impostazioni privacy, blocchi disponibili e autenticazione quando possibile.",
      },
      {
        kicker: "Confini",
        title: "Non spostare la conversazione",
        body: "Mantieni tutto su canali dedicati e interrompi richieste fuori limite.",
      },
    ],
    faqs: [globalFaqs[4], globalFaqs[6], globalFaqs[0]],
  },
  "attrezzatura-webcam-model": {
    slug: "attrezzatura-webcam-model",
    title: "Attrezzatura webcam model",
    description: "Setup essenziale per camera, luce, audio, connessione e ambiente creator.",
    eyebrow: "Studio setup",
    intro: "Uno studio semplice, stabile e pulito vale più di acquisti costosi fatti troppo presto.",
    sections: [
      {
        kicker: "Base",
        title: "Parti dagli elementi visibili",
        body: "Camera nitida, luce morbida, audio chiaro e connessione stabile.",
        points: ["Camera", "Luce", "Audio", "Connessione"],
      },
      {
        kicker: "Comfort",
        title: "Rendi il set sostenibile",
        body: "Sedia, temperatura, cavi e sfondo devono aiutarti a restare concentrata.",
      },
      {
        kicker: "Upgrade",
        title: "Migliora solo ciò che serve",
        body: "Prima audio e luce, poi camera e dettagli di scena.",
      },
    ],
    faqs: [globalFaqs[3], globalFaqs[1], globalFaqs[4]],
  },
};

export const academyPage: GuidePage = {
  slug: "academy",
  title: "Academy creator",
  description: "Dashboard compatta per preparare profilo, privacy, studio, presenza online e candidatura.",
  eyebrow: "Academy dashboard",
  intro: "Moduli rapidi per passare da idea a profilo preparato, senza effetto blog.",
  ctaLabel: "Apri il percorso",
  ctaHref: "/diventare-webcam-model/",
  sections: [
    { kicker: "Preparazione", title: "Valuta il percorso", body: "Motivazione, spazio e confini devono essere chiari prima della registrazione.", points: ["Consenso", "Spazio", "Limiti"] },
    { kicker: "Privacy", title: "Separa identità e account", body: "Nome d'arte, email dedicata e scena pulita riducono esposizioni inutili.", points: ["Nome", "Email", "Sfondo"] },
    { kicker: "Presenza", title: "Costruisci un profilo coerente", body: "Bio, tono e disponibilità devono essere professionali e sostenibili.", points: ["Bio", "Tono", "Orari"] },
    { kicker: "Studio", title: "Prepara camera e luce", body: "Qualità percepita, audio e connessione contano subito.", points: ["Camera", "Luce", "Audio"] },
    { kicker: "Guadagni", title: "Ragiona senza promesse", body: "Risultati variabili, costi reali e obblighi locali vanno considerati.", points: ["Variabili", "Costi", "Regole"] },
    { kicker: "Candidatura", title: "Procedi quando sei pronta", body: "Leggi condizioni, verifica documenti e mantieni i tuoi limiti.", points: ["Documenti", "Termini", "Controllo"] },
  ],
  faqs: globalFaqs,
};

export const legalPages: Record<string, GuidePage> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "Informazioni sul trattamento dei dati e sull'uso responsabile del sito Modelle Webcam.",
    eyebrow: "Info",
    intro: "Informazioni sintetiche su dati tecnici, contatti e percorsi esterni.",
    sections: [
      { title: "Dati tecnici", body: "Il sito può trattare dati necessari a sicurezza e funzionamento." },
      { title: "Contatti", body: "I messaggi ricevuti vengono usati solo per rispondere." },
      { title: "Percorsi esterni", body: "Alcuni pulsanti possono aprire piattaforme terze tramite passaggi interni." },
    ],
  },
  termini: {
    slug: "termini",
    title: "Termini di utilizzo",
    description: "Condizioni generali per l'uso del sito Modelle Webcam.",
    eyebrow: "Info",
    intro: "Il sito è destinato ad adulti e offre contenuti informativi.",
    sections: [
      { title: "Contenuti", body: "Le informazioni non sostituiscono consulenza legale, fiscale o professionale." },
      { title: "Accesso 18+", body: "Se non sei maggiorenne, non utilizzare il sito." },
      { title: "Responsabilità", body: "Ogni decisione resta personale e richiede lettura delle condizioni applicabili." },
    ],
  },
  disclaimer: {
    slug: "disclaimer",
    title: "Disclaimer",
    description: "Avvertenze su contenuti adulti, guadagni variabili, sicurezza e responsabilità personali.",
    eyebrow: "Info",
    intro: "Nessun risultato economico è promesso o garantito.",
    sections: [
      { title: "Guadagni variabili", body: "Ogni scenario è informativo e non garantisce risultati individuali." },
      { title: "Obblighi locali", body: "Per tasse e aspetti legali consulta un professionista qualificato." },
      { title: "Sicurezza", body: "Non condividere dati privati e non agire sotto pressione." },
    ],
  },
  contatti: {
    slug: "contatti",
    title: "Contatti",
    description: "Contatta Modelle Webcam per richieste editoriali o informazioni sul progetto.",
    eyebrow: "Contatti",
    intro: "Scrivi solo richieste chiare e non inviare dati sensibili non richiesti.",
    sections: [
      { title: "Email", body: "Scrivi a info@modellewebcam.com con un messaggio sintetico." },
      { title: "Piattaforme", body: "Per documenti, pagamenti o verifica consulta le condizioni della piattaforma scelta." },
    ],
  },
};

export const allStaticPages = [
  { path: "/", title: "Homepage" },
  ...Object.values(guidePages).map((page) => ({ path: `/${page.slug}/`, title: page.title })),
  { path: "/modelle-webcam/", title: "Modelle webcam online" },
  { path: "/academy/", title: academyPage.title },
  { path: "/faq/", title: "FAQ" },
  ...Object.values(legalPages).map((page) => ({ path: `/${page.slug}/`, title: page.title })),
];

export function pageMetadata(page: GuidePage): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${siteUrl}/${page.slug}/` },
    openGraph: {
      title: `${page.title} | ${brand}`,
      description: page.description,
      url: `${siteUrl}/${page.slug}/`,
      siteName: brand,
      locale: "it_IT",
      type: "website",
    },
  };
}

export function faqSchema(faqs: typeof globalFaqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
