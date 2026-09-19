import type { Metadata } from "next";
export { getLiveModels, getVisitorGeoFromHeaders, type LiveModel } from "@/lib/models";

export const siteUrl = "https://modellewebcam.com";
export const brand = "Modelle Webcam";

export const navItems = [
  { href: "/modelle-webcam/#online", label: "Online ora" },
  { href: "/modelle-webcam/", label: "Categorie" },
  { href: "/modelle-hd/", label: "HD" },
  { href: "/modelle-italiane/", label: "Italiane" },
  { href: "/nuove-modelle-webcam/", label: "Nuove" },
];

export const academyLinks = [
  { href: "/diventare-webcam-model/", label: "Diventa webcam model" },
  { href: "/diventare-camgirl/", label: "Diventa camgirl" },
  { href: "/lavorare-in-webcam/", label: "Lavorare in webcam" },
  { href: "/privacy-webcam-model/", label: "Proteggi privacy" },
  { href: "/attrezzatura-webcam-model/", label: "Prepara studio" },
  { href: "/guadagni-webcam-model/", label: "Guadagni realistici" },
];

export const creatorNavItems = [
  { href: "/diventare-webcam-model/", label: "Come iniziare", cta: false },
  { href: "/privacy-webcam-model/", label: "Privacy", cta: false },
  { href: "/attrezzatura-webcam-model/", label: "Attrezzatura", cta: false },
  { href: "/guadagni-webcam-model/", label: "Guadagni", cta: false },
  { href: "/go/model-signup", label: "Apri il tuo profilo", cta: true },
] as const;

export const creatorGuideSlugs = new Set([
  "diventare-webcam-model",
  "diventare-camgirl",
  "lavorare-in-webcam",
  "privacy-webcam-model",
  "attrezzatura-webcam-model",
  "guadagni-webcam-model",
]);

export function isCreatorGuideSlug(slug: string): boolean {
  return creatorGuideSlugs.has(slug);
}

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
  updated?: string;
  sources?: { href: string; label: string }[];
};

export const guidePages: Record<string, GuidePage> = {
  "diventare-webcam-model": {
    slug: "diventare-webcam-model",
    title: "Come diventare webcam model in Italia",
    description:
      "Guida pratica per diventare webcam model in Italia con privacy, nome artistico, attrezzatura, studio, limiti personali e aspettative realistiche.",
    eyebrow: "Guida pratica",
    intro: "Apri il tuo profilo solo dopo aver preparato identità, studio, privacy e limiti personali.",
    updated: "16 settembre 2026",
    sources: [
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048893171-How-do-I-get-started", label: "Fonte ufficiale Chaturbate: primi passi" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048893411-How-do-I-get-age-verified", label: "Fonte ufficiale Chaturbate: verifica dell'età" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048402292-Rules-and-Safety", label: "Fonte ufficiale Chaturbate: regole e sicurezza" },
    ],
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
      {
        kicker: "Verifica",
        title: "Prepara i documenti prima della registrazione",
        body: "La piattaforma richiede la verifica dell'età con un documento pubblico valido, leggibile e non scaduto. Ogni persona che compare nella trasmissione deve completare la procedura prevista. Organizza questo passaggio in uno spazio privato, controlla che le immagini siano nitide e caricale soltanto attraverso la pagina ufficiale. Non inviare documenti in chat o a contatti non verificati. La verifica conferma l'idoneità dell'account, ma non sostituisce la preparazione personale e la lettura dell'accordo per broadcaster indipendenti.",
        points: ["Solo canale ufficiale", "Documento valido", "Ogni partecipante verificato", "Accordo letto"],
      },
      {
        kicker: "Sicurezza",
        title: "Configura account e stanza con prudenza",
        body: "Usa una password unica, conserva i codici di recupero in un luogo sicuro e attiva l'autenticazione a due fattori quando è disponibile. Controlla lo sfondo con la stessa attenzione riservata all'account. Etichette di spedizione, viste dalla finestra, notifiche e oggetti personali possono rivelare più del previsto. Le limitazioni geografiche possono ridurre l'esposizione in alcune aree, ma non garantiscono una copertura assoluta. Considerale una misura aggiuntiva, non l'unica protezione.",
        points: ["Password unica", "Recupero protetto", "Sfondo controllato", "Limitazioni riviste"],
      },
      {
        kicker: "Prova",
        title: "Fai una sessione tecnica senza pubblico",
        body: "Registra alcuni minuti di prova e rivedili con cuffie e su uno schermo diverso. Controlla voce, rumori, messa a fuoco, riflessi, stabilità della connessione e comodità della postazione. Simula anche una breve interruzione per capire come fermare la trasmissione e riprendere il controllo. Una prova non deve essere perfetta. Serve a individuare problemi concreti prima che diventino fonte di stress durante una sessione reale.",
        points: ["Audio riascoltato", "Riflessi controllati", "Interruzione provata", "Postazione comoda"],
      },
      {
        kicker: "Decisione",
        title: "Procedi solo con confini sostenibili",
        body: "Scrivi in anticipo ciò che accetti, ciò che rifiuti e le condizioni che ti fanno interrompere una sessione. Definisci orari compatibili con sonno, lavoro e vita privata. Non spostare conversazioni su account personali per pressione di un utente. Se una richiesta supera i tuoi limiti, fermarti è una decisione professionale. Rivedi periodicamente regole, impostazioni e costi, perché la situazione può cambiare anche dopo un avvio ordinato.",
        points: ["Limiti scritti", "Orari sostenibili", "Canali separati", "Diritto di fermarsi"],
      },
    ],
    faqs: globalFaqs.slice(0, 6),
  },
  "diventare-camgirl": {
    slug: "diventare-camgirl",
    title: "Come diventare camgirl in Italia",
    description: "Guida per diventare camgirl in Italia con identità separata, privacy, studio domestico, limiti personali e preparazione consapevole.",
    eyebrow: "Primi passi",
    intro: "Parti da stile, privacy e limiti. La camera arriva dopo.",
    updated: "16 settembre 2026",
    sources: [
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048893411-How-do-I-get-age-verified", label: "Fonte ufficiale Chaturbate: verifica dell'età" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048892411-Settings-Privacy", label: "Fonte ufficiale Chaturbate: impostazioni e privacy" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048402292-Rules-and-Safety", label: "Fonte ufficiale Chaturbate: regole e sicurezza" },
    ],
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
      {
        kicker: "Verifica",
        title: "Completa i requisiti con calma",
        body: "Prima di trasmettere devi leggere l'accordo previsto dalla piattaforma e completare la verifica dell'età attraverso i canali ufficiali. Il documento deve essere valido e chiaramente leggibile. Se partecipa un'altra persona, anche lei deve essere approvata prima di apparire. Prepara questi passaggi senza fretta e non condividere immagini dei documenti con utenti, agenzie non verificate o contatti ricevuti in messaggi privati.",
        points: ["Maggiorenne", "Documento leggibile", "Partecipanti approvati", "Canali ufficiali"],
      },
      {
        kicker: "Identità",
        title: "Costruisci una presenza che non riveli la vita privata",
        body: "Scegli un nome facile da ricordare ma scollegato da nome reale, vecchi nickname e profili personali. Usa fotografie create appositamente, un indirizzo email dedicato e account social separati. Controlla che amici, luoghi, targhe e dettagli domestici non compaiano nelle immagini. La coerenza del profilo nasce dal tono e dallo stile, non dalla quantità di informazioni personali condivise.",
        points: ["Nome distinto", "Foto dedicate", "Email separata", "Nessun luogo riconoscibile"],
      },
      {
        kicker: "Confini",
        title: "Decidi le regole prima delle richieste",
        body: "Prepara risposte semplici per rifiutare richieste scomode e stabilisci quando chiudere una conversazione. Le impostazioni della stanza possono aiutare a gestire accesso, utenti e sessioni private, ma il controllo personale resta centrale. Non accettare spostamenti su canali privati per paura di perdere pubblico. Una regola applicata con continuità protegge più di una decisione presa sotto pressione.",
        points: ["Regole chiare", "Risposte preparate", "Blocco quando serve", "Nessuna pressione"],
      },
      {
        kicker: "Routine",
        title: "Valuta energia, tempi e costi reali",
        body: "Organizza sessioni brevi all'inizio e lascia spazio a preparazione, riordino e recupero. Annota le spese per luce, connessione e attrezzatura senza comprare tutto subito. I risultati non sono garantiti e non dipendono soltanto dal tempo online. Se vuoi capire obblighi fiscali, contratti o inquadramento professionale in Italia, rivolgiti a un consulente qualificato che possa valutare la tua situazione personale.",
        points: ["Sessioni sostenibili", "Costi annotati", "Pause previste", "Consulenza qualificata"],
      },
      {
        kicker: "Avvio",
        title: "Usa le prime settimane per osservare e correggere",
        body: "All'inizio evita di fissare obiettivi economici rigidi. Concentrati sulla capacità di rispettare gli orari, mantenere la scena privata e gestire la conversazione senza superare i tuoi confini. Dopo ogni sessione annota soltanto elementi utili, come problemi tecnici, richieste ricorrenti e livello di energia. Rivedi il profilo con calma e modifica una cosa alla volta. Se il percorso crea pressione, interrompi e rivaluta spazio, aspettative e supporto disponibile. La visibilità iniziale offerta dalla piattaforma è temporanea e non garantisce pubblico, entrate o continuità. Confrontati con una persona fidata senza condividere credenziali o documenti e stabilisci in anticipo a chi chiedere aiuto se qualcosa ti mette in difficoltà.",
        points: ["Obiettivi prudenti", "Note operative", "Una modifica alla volta", "Possibilità di fermarsi"],
      },
    ],
    faqs: globalFaqs.slice(0, 4),
  },
  "lavorare-in-webcam": {
    slug: "lavorare-in-webcam",
    title: "Lavorare in webcam da casa",
    description: "Indicazioni pratiche per lavorare in webcam da casa con privacy, spazio controllato, orari sostenibili e organizzazione degli account.",
    eyebrow: "Lavoro da casa",
    intro: "Casa e profilo creator devono restare separati, anche quando usi la stessa stanza.",
    updated: "16 settembre 2026",
    sources: [
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048893171-How-do-I-get-started", label: "Fonte ufficiale Chaturbate: primi passi" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048401752-Show-Types", label: "Fonte ufficiale Chaturbate: tipi di sessione" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360038181692-How-do-I-get-paid", label: "Fonte ufficiale Chaturbate: pagamenti" },
    ],
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
      {
        kicker: "Separazione",
        title: "Distingui lo spazio professionale da quello personale",
        body: "Anche se lavori dalla stessa abitazione, scegli una zona che possa essere preparata e chiusa. Rimuovi corrispondenza, fotografie, documenti, medicinali e oggetti legati alla routine familiare. Disattiva le notifiche sui dispositivi visibili e usa un profilo separato sul computer quando possibile. Alla fine della sessione riponi camera e materiali, chiudi gli account e restituisci alla stanza la sua funzione privata.",
        points: ["Zona dedicata", "Oggetti rimossi", "Notifiche disattivate", "Account chiusi"],
      },
      {
        kicker: "Programma",
        title: "Costruisci orari che puoi mantenere",
        body: "Considera preparazione, durata, pause e tempo necessario per sistemare lo spazio. Un calendario troppo intenso può ridurre attenzione e capacità di applicare i tuoi limiti. Inizia con blocchi realistici e controlla come ti senti il giorno successivo. La costanza ha valore soltanto quando rimane compatibile con riposo, impegni personali e sicurezza. Non pubblicare orari che rivelino abitudini domestiche troppo precise.",
        points: ["Tempo di preparazione", "Pause reali", "Recupero", "Orari prudenti"],
      },
      {
        kicker: "Sessioni",
        title: "Comprendi le diverse modalità prima di usarle",
        body: "Le sessioni pubbliche, private, protette da password o nascoste seguono regole e impostazioni differenti. Prima di accettare una richiesta controlla durata, prezzo, possibilità di registrazione e condizioni visibili nel pannello della stanza. Chiarisci ciò che è incluso e mantieni i confini concordati. Le impostazioni possono essere modificate, quindi rileggile dopo ogni aggiornamento importante invece di affidarti alla memoria.",
        points: ["Modalità compresa", "Impostazioni controllate", "Condizioni chiare", "Registrazione verificata"],
      },
      {
        kicker: "Amministrazione",
        title: "Registra entrate e spese senza fare previsioni ottimistiche",
        body: "Conserva riepiloghi di pagamenti, spese e periodi lavorati in un archivio privato. Le piattaforme possono usare soglie, calendari e metodi di pagamento diversi, quindi consulta sempre le istruzioni correnti prima di pianificare una scadenza. Per tasse, contributi, contratti o organizzazione dell'attività in Italia serve un professionista qualificato. Una guida generale non può determinare gli obblighi applicabili al tuo caso.",
        points: ["Riepiloghi conservati", "Scadenze verificate", "Spese distinte", "Consulente italiano"],
      },
      {
        kicker: "Chiusura",
        title: "Termina ogni giornata con una routine precisa",
        body: "Dopo l'ultima sessione chiudi la trasmissione, verifica che la camera sia davvero inattiva e disconnetti gli account usati. Salva solo i riepiloghi necessari in una cartella protetta, elimina file di prova che non servono e riponi documenti e dispositivi. Controlla eventuali avvisi della piattaforma attraverso il pannello ufficiale, non dai collegamenti ricevuti in chat. Infine annota manutenzione, acquisti o problemi da risolvere prima della sessione successiva. Una chiusura ordinata riduce errori e impedisce al lavoro di occupare tutta la vita domestica. Se condividi la casa, concorda segnali e orari che proteggano la privacy di tutte le persone presenti senza spiegare pubblicamente la tua routine.",
        points: ["Trasmissione chiusa", "Account disconnessi", "File protetti", "Spazio ripristinato"],
      },
    ],
    faqs: [globalFaqs[1], globalFaqs[2], globalFaqs[5]],
  },
  "guadagni-webcam-model": {
    slug: "guadagni-webcam-model",
    title: "Guadagni di una webcam model",
    description: "Scopri i fattori che influenzano i guadagni di una webcam model. Le entrate variano, dipendono da molte condizioni e non sono mai garantite.",
    eyebrow: "Entrate variabili",
    intro: "I guadagni non sono garantiti. Leggi le variabili prima di fare piani.",
    updated: "16 settembre 2026",
    sources: [
      { href: "https://support.chaturbate.com/hc/en-us/articles/360038181692-How-do-I-get-paid", label: "Fonte ufficiale Chaturbate: pagamenti" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360037125852-How-do-I-convert-my-tokens", label: "Fonte ufficiale Chaturbate: conversione dei token" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048401752-Show-Types", label: "Fonte ufficiale Chaturbate: tipi di sessione" },
    ],
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
      {
        kicker: "Meccanismo",
        title: "Distingui token, conversione e pagamento",
        body: "I token ricevuti durante l'attività non coincidono automaticamente con denaro già inviato. La piattaforma prevede una procedura di conversione e un successivo pagamento secondo il metodo e il calendario selezionati. La documentazione ufficiale indica che la verifica dell'età deve restare attiva per convertire i token. Controlla sempre il saldo e lo stato delle operazioni nel tuo account, senza basarti su messaggi di utenti o calcoli esterni.",
        points: ["Saldo controllato", "Conversione distinta", "Pagamento verificato", "Account valido"],
      },
      {
        kicker: "Calendario",
        title: "Leggi soglie, costi e tempi aggiornati",
        body: "I metodi di pagamento possono avere soglie minime, costi e tempi di consegna differenti. Questi dati possono cambiare, quindi vanno verificati sulla pagina ufficiale prima di scegliere. Un importo sotto la soglia può essere riportato al periodo successivo. Pianifica le spese personali senza considerare come disponibile un pagamento ancora in elaborazione e conserva le conferme inviate dalla piattaforma.",
        points: ["Soglia minima", "Costo del metodo", "Tempo di consegna", "Conferme conservate"],
      },
      {
        kicker: "Valutazione",
        title: "Calcola il risultato dopo tutti i costi",
        body: "Per valutare il lavoro considera attrezzatura, connessione, energia, manutenzione, tempo di preparazione e periodi senza entrate. Dividi le spese occasionali da quelle ricorrenti e confrontale con somme effettivamente ricevute, non con obiettivi o stime. Un mese positivo non garantisce lo stesso risultato in futuro. Evita debiti o acquisti importanti basati su previsioni che la piattaforma non promette.",
        points: ["Costi completi", "Somme ricevute", "Nessuna garanzia", "Acquisti prudenti"],
      },
      {
        kicker: "Consulenza",
        title: "Chiedi assistenza qualificata per la situazione italiana",
        body: "Il trattamento fiscale e l'organizzazione del lavoro dipendono dalle circostanze individuali. Residenza, continuità dell'attività, importi e altri redditi possono cambiare la valutazione. Porta a un professionista italiano i riepiloghi dei pagamenti e delle spese, evitando di affidarti a esempi generici trovati online. Questa pagina offre criteri di pianificazione e non sostituisce consulenza fiscale, legale o contabile.",
        points: ["Dati ordinati", "Caso individuale", "Professionista qualificato", "Niente promesse"],
      },
      {
        kicker: "Confronto",
        title: "Valuta periodi completi invece di singole giornate",
        body: "Una sessione molto positiva o molto debole non descrive l'andamento complessivo. Confronta periodi abbastanza lunghi da includere giorni, orari e livelli di energia differenti. Usa soltanto importi effettivamente ricevuti e sottrai le spese attribuibili all'attività. Annota anche il tempo non trascorso in diretta, come preparazione, assistenza e gestione dell'account. Se il risultato non compensa costi e pressione personale, ridurre il ritmo o interrompere resta una scelta valida. Nessuna metrica impone di continuare e nessun risultato passato assicura quello futuro.",
        points: ["Periodi completi", "Importi ricevuti", "Tempo totale", "Scelta reversibile"],
      },
    ],
    faqs: [globalFaqs[2], globalFaqs[5], globalFaqs[7]],
  },
  "privacy-webcam-model": {
    slug: "privacy-webcam-model",
    title: "Privacy per webcam model",
    description: "Proteggi identità, account, nome artistico, sfondo e dati personali con controlli pratici pensati per chi lavora come webcam model.",
    eyebrow: "Protezione personale",
    intro: "La privacy è una configurazione continua: identità, scena, account e regole personali.",
    updated: "16 settembre 2026",
    sources: [
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048892411-Settings-Privacy", label: "Fonte ufficiale Chaturbate: impostazioni e privacy" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048402292-Rules-and-Safety", label: "Fonte ufficiale Chaturbate: regole e sicurezza" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360036473091-How-do-I-block-a-country-region-and-or-state-from-viewing-my-cam", label: "Fonte ufficiale Chaturbate: blocco geografico" },
    ],
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
      {
        kicker: "Accesso",
        title: "Proteggi credenziali e recupero dell'account",
        body: "Crea una password lunga e unica che non usi altrove. Conserva i codici di recupero separatamente e attiva l'autenticazione a due fattori quando il servizio la supporta. Non condividere schermate che mostrano email, saldo o impostazioni. Controlla periodicamente le sessioni aperte e cambia subito la password se ricevi avvisi inattesi. L'indirizzo email dedicato deve avere a sua volta credenziali uniche e strumenti di recupero sicuri.",
        points: ["Password unica", "Due fattori", "Recupero protetto", "Sessioni controllate"],
      },
      {
        kicker: "Posizione",
        title: "Riduci gli indizi geografici nella scena",
        body: "Controlla finestre, rumori, consegne, uniformi, targhe, orologi e riflessi. Anche piccoli dettagli possono collegare la stanza a un luogo preciso. Le impostazioni regionali permettono di limitare l'accesso da alcune aree, ma il riconoscimento basato sull'indirizzo di rete non è infallibile e può essere aggirato. Usa quindi il blocco geografico insieme alla separazione dell'identità e a uno sfondo privo di elementi riconoscibili.",
        points: ["Finestre coperte", "Riflessi verificati", "Consegne rimosse", "Blocco regionale rivisto"],
      },
      {
        kicker: "Registrazioni",
        title: "Considera la possibilità di copie non autorizzate",
        body: "Una trasmissione può essere registrata da terzi anche quando le impostazioni limitano l'accesso. Valuta ogni scelta sapendo che immagini o clip potrebbero circolare fuori dal contesto originale. Un segno grafico discreto può aiutare ad associare il contenuto alla tua identità pubblica. Se trovi copie online, raccogli gli indirizzi precisi e usa il servizio di segnalazione indicato dalla piattaforma, senza contattare direttamente persone che ti intimidiscono.",
        points: ["Rischio compreso", "Segno pubblico valutato", "Indirizzi raccolti", "Canale di segnalazione"],
      },
      {
        kicker: "Revisione",
        title: "Ripeti il controllo prima di ogni sessione",
        body: "La privacy non si completa una volta sola. Un pacco appoggiato sul tavolo, una notifica nuova o una modifica della stanza possono creare un rischio che ieri non esisteva. Usa la checklist prima di iniziare, dopo aver spostato la camera e quando cambia una persona presente. Se un controllo non è completato, rimanda l'avvio finché non hai risolto. La percentuale serve a sostenere una routine, non a garantire anonimato assoluto.",
        points: ["Controllo ripetuto", "Camera ricontrollata", "Notifiche nascoste", "Avvio rimandabile"],
      },
    ],
    faqs: [globalFaqs[4], globalFaqs[6], globalFaqs[0]],
  },
  "attrezzatura-webcam-model": {
    slug: "attrezzatura-webcam-model",
    title: "Attrezzatura per webcam model",
    description: "Guida all'attrezzatura per webcam model con camera, illuminazione, audio, connessione affidabile e organizzazione pratica dello studio.",
    eyebrow: "Preparazione dello studio",
    intro: "Uno studio semplice, stabile e pulito vale più di acquisti costosi fatti troppo presto.",
    updated: "16 settembre 2026",
    sources: [
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048893171-How-do-I-get-started", label: "Fonte ufficiale Chaturbate: primi passi" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048402292-Rules-and-Safety", label: "Fonte ufficiale Chaturbate: regole e sicurezza" },
      { href: "https://support.chaturbate.com/hc/en-us/articles/360048892411-Settings-Privacy", label: "Fonte ufficiale Chaturbate: impostazioni e privacy" },
    ],
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
      {
        kicker: "Camera",
        title: "Cerca stabilità prima della risoluzione massima",
        body: "Una camera ben posizionata, con messa a fuoco stabile e un'inquadratura controllata, è più utile di un modello costoso usato male. Fissala su un supporto sicuro e lascia spazio per muoverti senza urtarla. Registra una prova alla risoluzione prevista e controlla se il computer mantiene una resa fluida. Evita di acquistare accessori finché non sai quale problema concreto devono risolvere.",
        points: ["Supporto stabile", "Fuoco controllato", "Prova registrata", "Acquisti motivati"],
      },
      {
        kicker: "Luce e audio",
        title: "Rendi chiari volto e voce senza affaticarti",
        body: "Posiziona una luce morbida davanti o leggermente di lato, evitando lampade intense direttamente negli occhi. Controlla che non compaiano riflessi su finestre, specchi o superfici lucide. Per l'audio, registra il rumore della stanza e verifica ventilatori, strada e riverbero. Un microfono vicino può migliorare la voce, ma deve restare fuori dal percorso dei cavi e non limitare i movimenti.",
        points: ["Luce morbida", "Riflessi rimossi", "Rumore ascoltato", "Microfono sicuro"],
      },
      {
        kicker: "Connessione",
        title: "Misura la stabilità e prepara una riserva",
        body: "Esegui più prove in orari simili a quelli in cui pensi di lavorare. Una velocità elevata non basta se la connessione perde pacchetti o si interrompe. Quando possibile usa un collegamento via cavo e limita aggiornamenti o sincronizzazioni durante la sessione. Prepara una procedura semplice per chiudere la trasmissione in caso di problemi e valuta una connessione di riserva che non esponga dati personali sullo schermo.",
        points: ["Prove ripetute", "Cavo quando possibile", "Aggiornamenti sospesi", "Riserva pronta"],
      },
      {
        kicker: "Sicurezza",
        title: "Organizza cavi, comfort e privacy",
        body: "Fissa i cavi lontano dai passaggi, usa prese in buone condizioni e lascia libera una via per alzarti rapidamente. Regola sedia, temperatura e altezza della camera per evitare posture forzate. Controlla tutto ciò che entra nell'inquadratura, comprese notifiche, riflessi e oggetti dietro di te. Il controllo di preparazione indica i passaggi completati nel browser e non sostituisce una verifica elettrica o professionale.",
        points: ["Cavi fissati", "Presa sicura", "Postura sostenibile", "Scena privata"],
      },
      {
        kicker: "Acquisti",
        title: "Definisci un ordine di miglioramento",
        body: "Correggi prima ciò che impedisce una sessione stabile. Una lampada ben posizionata o un cavo di rete può risolvere più problemi di una camera nuova. Stabilisci un budget, prova ogni cambiamento e conserva ricevute e garanzie. Evita di acquistare attrezzatura con denaro che dipende da entrate future non garantite.",
        points: ["Problema identificato", "Budget definito", "Prova singola", "Garanzie conservate"],
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
  intro: "Moduli essenziali per passare da idea a profilo preparato, senza effetto blog.",
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
  const metadataTitles: Record<string, string> = {
    "diventare-webcam-model": "Come diventare webcam model in Italia con privacy e setup",
    "diventare-camgirl": "Come diventare camgirl in Italia con privacy e studio",
    "lavorare-in-webcam": "Lavorare in webcam da casa con privacy e organizzazione",
    "privacy-webcam-model": "Privacy webcam model per proteggere identità e account",
    "attrezzatura-webcam-model": "Attrezzatura webcam model per camera, luce, audio e studio",
    "guadagni-webcam-model": "Guadagni webcam model e fattori che influenzano le entrate",
  };
  const title = metadataTitles[page.slug] ?? page.title;
  const indexable = Object.prototype.hasOwnProperty.call(metadataTitles, page.slug);
  return {
    title,
    description: page.description,
    alternates: { canonical: `${siteUrl}/${page.slug}/` },
    robots: { index: indexable, follow: true },
    openGraph: {
      title,
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
