import { LiveModel, modelSearchValues, normalizeToken, valueMatches } from "@/lib/models";
import type { LiveModelOptions } from "@/lib/models";

export const CATEGORY_MIN_INDEXABLE_MODELS = 8;

export type ChaturbateCategoryQuery = {
  gender?: string | string[];
  region?: string | string[];
  tags?: string[];
  hd?: boolean;
};

export type ModelCategory = {
  slug: string;
  title: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  badges: string[];
  canonicalPath: string;
  minimumModelCount: number;
  related: string[];
  sitemapSafe?: boolean;
  providerSupport: "chaturbate"[];
  chaturbateQuery?: ChaturbateCategoryQuery;
  matchNotes: string;
  faq?: { question: string; answer: string }[];
  match: (model: LiveModel) => boolean;
};

type CategoryInput = Omit<ModelCategory, "minimumModelCount" | "canonicalPath" | "metaTitle" | "metaDescription" | "providerSupport"> & {
  metaTitle?: string;
  metaDescription?: string;
  providerSupport?: "chaturbate"[];
};

const FEMALE_QUERY = { gender: "f" };
const ONLINE_SHOWS = ["public", "private", "group"];

function textValues(model: LiveModel): string[] {
  return modelSearchValues(model);
}

function fieldMatches(values: Array<string | undefined>, terms: string[]): boolean {
  return valueMatches(values.filter((value): value is string => Boolean(value)).map(normalizeToken), terms);
}

function tagMatches(model: LiveModel, terms: string[]): boolean {
  return valueMatches(
    [...model.tags, ...model.categories, model.roomSubject].filter((value): value is string => Boolean(value)).map(normalizeToken),
    terms
  );
}

function anyMatches(model: LiveModel, terms: string[]): boolean {
  return valueMatches(textValues(model), terms);
}

function isFemale(model: LiveModel): boolean {
  return fieldMatches([model.gender], ["f", "female"]);
}

function isCouple(model: LiveModel): boolean {
  return fieldMatches([model.gender], ["c", "couple"]);
}

function isTrans(model: LiveModel): boolean {
  return fieldMatches([model.gender], ["t", "trans"]);
}

function isOnline(model: LiveModel): boolean {
  return model.isOnline === true || fieldMatches([model.status, model.showType, model.chatType], ONLINE_SHOWS);
}

function showIs(show: string): (model: LiveModel) => boolean {
  return (model) => fieldMatches([model.status, model.showType, model.chatType], [show]);
}

function isNew(model: LiveModel): boolean {
  return model.isNew === true;
}

function isHd(model: LiveModel): boolean {
  return model.isHd === true || (typeof model.streamQuality === "number" && model.streamQuality >= 7);
}

function hasPreview(model: LiveModel): boolean {
  return Boolean(model.image || model.thumbnail || model.previewImage);
}

function ageAtLeast(minimum: number): (model: LiveModel) => boolean {
  return (model) => typeof model.age === "number" && model.age >= minimum;
}

function popular(model: LiveModel): boolean {
  return (model.numUsers ?? 0) >= 150 || (model.numFollowers ?? 0) >= 10000;
}

function countryOrLanguage(countryTerms: string[], languageTerms: string[]): (model: LiveModel) => boolean {
  return (model) =>
    fieldMatches([model.country, model.location], countryTerms) ||
    fieldMatches([model.language, ...(model.spokenLanguages ?? []), ...model.languages], languageTerms);
}

function makeCategory(input: CategoryInput): ModelCategory {
  return {
    ...input,
    canonicalPath: `/${input.slug}/`,
    metaTitle: input.metaTitle ?? `${input.title} online 18+`,
    metaDescription:
      input.metaDescription ?? `${input.title} con profili live filtrati solo da metadati reali disponibili.`,
    minimumModelCount: CATEGORY_MIN_INDEXABLE_MODELS,
    providerSupport: input.providerSupport ?? ["chaturbate"],
  };
}

const coreRelated = ["modelle-online-ora", "modelle-hd", "nuove-modelle-webcam", "modelle-popolari"];

const categoryInputs: CategoryInput[] = [
  {
    slug: "modelle-online-ora",
    title: "Modelle webcam online ora",
    intro: "Profili 18+ attivi in questo momento, filtrati dallo stato live restituito dalla sorgente.",
    badges: ["Online ora", "Live", "18+"],
    related: ["modelle-hd", "nuove-modelle-webcam", "modelle-popolari", "modelle-webcam"],
    sitemapSafe: true,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "current_show public, private o group",
    match: (model) => isFemale(model) && isOnline(model),
  },
  {
    slug: "modelle-disponibili-adesso",
    title: "Modelle disponibili adesso",
    intro: "Una vista immediata sui profili 18+ disponibili, senza risultati generici fuori categoria.",
    badges: ["Disponibili", "Live", "18+"],
    related: coreRelated,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "stato online reale",
    match: (model) => isFemale(model) && isOnline(model),
  },
  {
    slug: "nuove-modelle-webcam",
    title: "Nuove modelle webcam",
    intro: "Profili 18+ mostrati solo quando il feed li segnala come nuovi.",
    badges: ["Nuove", "18+", "Aggiornate"],
    related: ["modelle-online-ora", "modelle-hd", "modelle-italiane", "modelle-asiatiche"],
    sitemapSafe: true,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "is_new true",
    match: (model) => isFemale(model) && isNew(model),
  },
  {
    slug: "modelle-hd",
    title: "Modelle webcam HD",
    intro: "Profili 18+ in alta definizione, verificati dal parametro HD o dal campo tecnico restituito.",
    badges: ["HD", "Live", "18+"],
    related: ["modelle-online-ora", "nuove-modelle-webcam", "modelle-popolari", "modelle-italiane"],
    sitemapSafe: true,
    chaturbateQuery: { ...FEMALE_QUERY, hd: true },
    matchNotes: "hd=true e is_hd true",
    match: (model) => isFemale(model) && isHd(model),
  },
  {
    slug: "modelle-popolari",
    title: "Modelle webcam popolari",
    intro: "Profili con segnali reali di attività, come utenti in stanza o follower dichiarati dal feed.",
    badges: ["Popolari", "Utenti", "18+"],
    related: ["modelle-con-piu-utenti", "modelle-hd", "modelle-online-ora", "modelle-private"],
    sitemapSafe: true,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "num_users o num_followers sopra soglia",
    match: (model) => isFemale(model) && popular(model),
  },
  {
    slug: "modelle-con-piu-utenti",
    title: "Modelle con più utenti",
    intro: "Categorie ordinate per interesse reale: vengono considerate solo stanze con pubblico numeroso.",
    badges: ["Utenti", "Live", "18+"],
    related: ["modelle-popolari", "modelle-hd", "modelle-online-ora", "modelle-private"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "num_users almeno 150",
    match: (model) => isFemale(model) && (model.numUsers ?? 0) >= 150,
  },
  {
    slug: "modelle-private",
    title: "Modelle webcam private",
    intro: "Profili 18+ in stanza privata, mostrati solo quando current_show indica private.",
    badges: ["Private", "Stanze", "18+"],
    related: ["modelle-in-chat-privata", "modelle-online-ora", "modelle-popolari", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "current_show private",
    match: (model) => isFemale(model) && showIs("private")(model),
  },
  {
    slug: "modelle-in-chat-privata",
    title: "Modelle in chat privata",
    intro: "Stanze private 18+ filtrate dallo stato live effettivo, senza sostituzioni casuali.",
    badges: ["Privata", "Live", "18+"],
    related: ["modelle-private", "modelle-online-ora", "modelle-hd", "modelle-mature"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "current_show private",
    match: (model) => isFemale(model) && showIs("private")(model),
  },
  {
    slug: "modelle-in-chat-pubblica",
    title: "Modelle in chat pubblica",
    intro: "Profili 18+ in chat pubblica quando lo stato della stanza lo conferma.",
    badges: ["Pubblica", "Live", "18+"],
    related: ["modelle-online-ora", "modelle-hd", "modelle-popolari", "modelle-con-preview-live"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "current_show public",
    match: (model) => isFemale(model) && showIs("public")(model),
  },
  {
    slug: "modelle-in-gruppo",
    title: "Modelle in gruppo",
    intro: "Stanze di gruppo 18+ incluse solo quando il feed indica current_show group.",
    badges: ["Gruppo", "Live", "18+"],
    related: ["modelle-online-ora", "modelle-private", "modelle-hd", "modelle-popolari"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "current_show group",
    match: (model) => isFemale(model) && showIs("group")(model),
  },
  {
    slug: "modelle-con-preview-live",
    title: "Modelle con preview live",
    intro: "Profili 18+ con immagine live disponibile dal feed, senza contenuti creati artificialmente.",
    badges: ["Preview", "Live", "18+"],
    related: ["modelle-live-cam", "modelle-hd", "modelle-online-ora", "modelle-popolari"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "image_url o image_url_360x270 presente",
    match: (model) => isFemale(model) && hasPreview(model),
  },
  {
    slug: "modelle-live-cam",
    title: "Modelle live cam",
    intro: "Una selezione di profili live 18+ filtrata dallo stato stanza e dai metadati disponibili.",
    badges: ["Live cam", "Online", "18+"],
    related: coreRelated,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "stato online reale",
    match: (model) => isFemale(model) && isOnline(model),
  },
  {
    slug: "modelle-in-videochat",
    title: "Modelle in videochat",
    intro: "Profili 18+ disponibili in videochat quando lo stato live conferma la stanza attiva.",
    badges: ["Videochat", "Live", "18+"],
    related: coreRelated,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "stato online reale",
    match: (model) => isFemale(model) && isOnline(model),
  },
  {
    slug: "modelle-mobile",
    title: "Modelle mobile",
    intro: "Categoria mostrata solo se tag o hashtag indicano una sessione mobile in modo esplicito.",
    badges: ["Mobile", "Tag reali", "18+"],
    related: ["modelle-online-ora", "modelle-hd", "modelle-live-cam", "modelle-con-preview-live"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["mobile"] },
    matchNotes: "tag o hashtag mobile",
    match: (model) => isFemale(model) && tagMatches(model, ["mobile"]),
  },
  {
    slug: "modelle-webcam",
    title: "Modelle webcam",
    intro: "Profili femminili 18+ restituiti dal feed live, con link interni e metadati verificabili.",
    badges: ["Modelle", "Live", "18+"],
    related: ["ragazze-live", "camgirl-online", "modelle-online-ora", "modelle-hd"],
    sitemapSafe: true,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "gender f",
    match: isFemale,
  },
  {
    slug: "coppie-webcam",
    title: "Coppie webcam",
    intro: "Coppie 18+ mostrate solo quando il feed indica la categoria di genere dedicata.",
    badges: ["Coppie", "Live", "18+"],
    related: ["modelle-webcam", "modelle-trans", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: { gender: "c" },
    matchNotes: "gender c",
    match: isCouple,
  },
  {
    slug: "modelle-trans",
    title: "Modelle trans",
    intro: "Profili trans 18+ filtrati dal parametro di genere supportato e dai campi restituiti.",
    badges: ["Trans", "Live", "18+"],
    related: ["modelle-webcam", "coppie-webcam", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: { gender: "t" },
    matchNotes: "gender t",
    match: isTrans,
  },
  {
    slug: "ragazze-live",
    title: "Ragazze live",
    intro: "Profili femminili adulti online, organizzati in una griglia diretta e senza filler.",
    badges: ["Live", "Modelle", "18+"],
    related: ["modelle-webcam", "camgirl-online", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "gender f e stato live",
    match: (model) => isFemale(model) && isOnline(model),
  },
  {
    slug: "camgirl-online",
    title: "Camgirl online",
    intro: "Camgirl 18+ online con risultati basati su genere e stato live reali.",
    badges: ["Camgirl", "Online", "18+"],
    related: ["modelle-webcam", "ragazze-live", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "gender f e stato live",
    match: (model) => isFemale(model) && isOnline(model),
  },
  {
    slug: "modelle-europee",
    title: "Modelle europee",
    intro: "Profili 18+ dall'area Europa e Russia quando il filtro regionale o paese lo conferma.",
    badges: ["Europa", "Live", "18+"],
    related: ["modelle-italiane", "modelle-spagnole", "modelle-francesi", "modelle-tedesche"],
    sitemapSafe: true,
    chaturbateQuery: { ...FEMALE_QUERY, region: "europe_russia" },
    matchNotes: "region europe_russia o paese europeo",
    match: (model) => isFemale(model) && anyMatches(model, ["italy", "italia", "spain", "france", "germany", "russia", "europe"]),
  },
  {
    slug: "modelle-asiatiche",
    title: "Modelle asiatiche",
    intro: "Modelle webcam asiatiche 18+ filtrate con regione Asia e segnali reali di paese, lingua o tag.",
    badges: ["Asia", "Live", "18+"],
    related: ["modelle-giapponesi", "modelle-coreane", "modelle-thailandesi", "modelle-latine"],
    sitemapSafe: true,
    chaturbateQuery: { ...FEMALE_QUERY, region: "asia" },
    matchNotes: "region asia, paese asiatico o tag coerenti",
    match: (model) => isFemale(model) && anyMatches(model, ["asian", "asia", "japan", "korea", "thai", "china", "philippines"]),
  },
  {
    slug: "modelle-latine",
    title: "Modelle latine",
    intro: "Profili latini 18+ filtrati da Sud America, paese, lingua o tag espliciti.",
    badges: ["Latine", "Live", "18+"],
    related: ["modelle-sudamericane", "modelle-brasiliane", "modelle-colombiane", "modelle-asiatiche"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "southamerica" },
    matchNotes: "region southamerica, paese o tag latin",
    match: (model) => isFemale(model) && anyMatches(model, ["latin", "latina", "south america", "brazil", "colombia", "spanish"]),
  },
  {
    slug: "modelle-nordamericane",
    title: "Modelle nordamericane",
    intro: "Profili 18+ dal Nord America quando la regione o il paese lo indicano.",
    badges: ["Nord America", "Live", "18+"],
    related: ["modelle-inglesi", "modelle-popolari", "modelle-hd", "modelle-online-ora"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "northamerica" },
    matchNotes: "region northamerica o paese coerente",
    match: (model) => isFemale(model) && anyMatches(model, ["united states", "usa", "canada", "north america", "american"]),
  },
  {
    slug: "modelle-sudamericane",
    title: "Modelle sudamericane",
    intro: "Profili 18+ dal Sud America filtrati da regione e metadati di paese o lingua.",
    badges: ["Sud America", "Live", "18+"],
    related: ["modelle-latine", "modelle-brasiliane", "modelle-colombiane", "modelle-spagnole"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "southamerica" },
    matchNotes: "region southamerica o paesi sudamericani",
    match: (model) => isFemale(model) && anyMatches(model, ["brazil", "colombia", "argentina", "chile", "peru", "south america"]),
  },
  {
    slug: "modelle-italiane",
    title: "Modelle italiane",
    intro: "Modelle webcam italiane o in lingua italiana 18+ filtrate solo da paese, lingua o tag espliciti.",
    badges: ["Italia", "Italiano", "18+"],
    related: ["modelle-europee", "modelle-spagnole", "modelle-francesi", "modelle-online-ora"],
    sitemapSafe: true,
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "country IT/Italy o spoken_languages italiano",
    match: (model) => isFemale(model) && countryOrLanguage(["it", "italy", "italia"], ["italian", "italiano"])(model),
  },
  {
    slug: "modelle-spagnole",
    title: "Modelle spagnole",
    intro: "Profili 18+ spagnoli o in lingua spagnola, mostrati solo quando i dati lo indicano.",
    badges: ["Spagnolo", "Europa", "18+"],
    related: ["modelle-italiane", "modelle-latine", "modelle-francesi", "modelle-europee"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "country Spain o lingua Spanish",
    match: (model) => isFemale(model) && countryOrLanguage(["spain", "es", "espana", "españa"], ["spanish", "espanol", "español"])(model),
  },
  {
    slug: "modelle-francesi",
    title: "Modelle francesi",
    intro: "Profili 18+ francesi o in lingua francese, filtrati dai campi disponibili.",
    badges: ["Francese", "Europa", "18+"],
    related: ["modelle-italiane", "modelle-spagnole", "modelle-tedesche", "modelle-europee"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "country France o lingua French",
    match: (model) => isFemale(model) && countryOrLanguage(["france", "fr"], ["french", "francais", "français"])(model),
  },
  {
    slug: "modelle-tedesche",
    title: "Modelle tedesche",
    intro: "Profili 18+ tedeschi o in lingua tedesca con corrispondenza dai metadati reali.",
    badges: ["Tedesco", "Europa", "18+"],
    related: ["modelle-europee", "modelle-francesi", "modelle-italiane", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "country Germany o lingua German",
    match: (model) => isFemale(model) && countryOrLanguage(["germany", "de", "deutschland"], ["german", "deutsch"])(model),
  },
  {
    slug: "modelle-inglesi",
    title: "Modelle inglesi",
    intro: "Profili 18+ in inglese o da paesi anglofoni quando paese e lingua lo confermano.",
    badges: ["Inglese", "Lingua", "18+"],
    related: ["modelle-nordamericane", "modelle-europee", "modelle-multilingue", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "spoken_languages English o paese anglofono",
    match: (model) => isFemale(model) && countryOrLanguage(["united kingdom", "uk", "gb", "united states", "usa"], ["english"])(model),
  },
  {
    slug: "modelle-brasiliane",
    title: "Modelle brasiliane",
    intro: "Profili brasiliani 18+ filtrati da paese, lingua o segnali espliciti nei tag.",
    badges: ["Brasile", "Latine", "18+"],
    related: ["modelle-latine", "modelle-sudamericane", "modelle-colombiane", "modelle-spagnole"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "southamerica" },
    matchNotes: "country Brazil o lingua Portuguese",
    match: (model) => isFemale(model) && countryOrLanguage(["brazil", "brasil", "br"], ["portuguese", "portugues", "português"])(model),
  },
  {
    slug: "modelle-colombiane",
    title: "Modelle colombiane",
    intro: "Profili colombiani 18+ mostrati solo con paese, lingua o tag coerenti.",
    badges: ["Colombia", "Latine", "18+"],
    related: ["modelle-latine", "modelle-sudamericane", "modelle-brasiliane", "modelle-spagnole"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "southamerica" },
    matchNotes: "country Colombia o tag Colombian",
    match: (model) => isFemale(model) && anyMatches(model, ["colombia", "colombian", "colombiana"]),
  },
  {
    slug: "modelle-giapponesi",
    title: "Modelle giapponesi",
    intro: "Profili giapponesi 18+ filtrati da paese, lingua o tag espliciti.",
    badges: ["Giappone", "Asia", "18+"],
    related: ["modelle-asiatiche", "modelle-coreane", "modelle-thailandesi", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "asia" },
    matchNotes: "country Japan o lingua Japanese",
    match: (model) => isFemale(model) && countryOrLanguage(["japan", "jp"], ["japanese"])(model),
  },
  {
    slug: "modelle-coreane",
    title: "Modelle coreane",
    intro: "Profili coreani 18+ inclusi solo quando paese, lingua o tag lo indicano.",
    badges: ["Corea", "Asia", "18+"],
    related: ["modelle-asiatiche", "modelle-giapponesi", "modelle-thailandesi", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "asia" },
    matchNotes: "country Korea o lingua Korean",
    match: (model) => isFemale(model) && countryOrLanguage(["korea", "south korea", "kr"], ["korean"])(model),
  },
  {
    slug: "modelle-thailandesi",
    title: "Modelle thailandesi",
    intro: "Profili thailandesi 18+ filtrati da paese, lingua o tag espliciti.",
    badges: ["Thailandia", "Asia", "18+"],
    related: ["modelle-asiatiche", "modelle-giapponesi", "modelle-coreane", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "asia" },
    matchNotes: "country Thailand o lingua Thai",
    match: (model) => isFemale(model) && countryOrLanguage(["thailand", "thai", "th"], ["thai"])(model),
  },
  {
    slug: "modelle-russe",
    title: "Modelle russe",
    intro: "Profili russi 18+ filtrati da regione Europa/Russia, paese o lingua.",
    badges: ["Russo", "Europa", "18+"],
    related: ["modelle-europee", "modelle-tedesche", "modelle-hd", "modelle-online-ora"],
    chaturbateQuery: { ...FEMALE_QUERY, region: "europe_russia" },
    matchNotes: "country Russia o lingua Russian",
    match: (model) => isFemale(model) && countryOrLanguage(["russia", "ru"], ["russian"])(model),
  },
  {
    slug: "modelle-multilingue",
    title: "Modelle multilingue",
    intro: "Profili 18+ con più lingue dichiarate nei campi spoken_languages.",
    badges: ["Lingue", "Discovery", "18+"],
    related: ["modelle-italiane", "modelle-inglesi", "modelle-spagnole", "modelle-francesi"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "almeno due lingue dichiarate",
    match: (model) => isFemale(model) && (model.spokenLanguages?.length ?? model.languages.length) >= 2,
  },
  {
    slug: "modelle-18-plus",
    title: "Modelle 18 plus",
    intro: "Profili adulti con età dichiarata a partire da 18 anni, quando il campo età è presente.",
    badges: ["18+", "Età", "Live"],
    related: ["modelle-20-plus", "modelle-online-ora", "modelle-hd", "nuove-modelle-webcam"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "age >= 18",
    match: (model) => isFemale(model) && ageAtLeast(18)(model),
  },
  {
    slug: "modelle-20-plus",
    title: "Modelle 20 plus",
    intro: "Profili 20+ con età dichiarata, senza inferenze da immagini o nomi.",
    badges: ["20+", "Età", "Live"],
    related: ["modelle-18-plus", "modelle-30-plus", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "age >= 20",
    match: (model) => isFemale(model) && ageAtLeast(20)(model),
  },
  {
    slug: "modelle-30-plus",
    title: "Modelle 30 plus",
    intro: "Profili 30+ basati esclusivamente sul campo età disponibile nel feed.",
    badges: ["30+", "Età", "Live"],
    related: ["modelle-20-plus", "modelle-40-plus", "modelle-mature", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "age >= 30",
    match: (model) => isFemale(model) && ageAtLeast(30)(model),
  },
  {
    slug: "modelle-40-plus",
    title: "Modelle 40 plus",
    intro: "Profili 40+ mostrati quando l'età dichiarata lo consente.",
    badges: ["40+", "Mature", "18+"],
    related: ["modelle-30-plus", "modelle-50-plus", "modelle-mature", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "age >= 40",
    match: (model) => isFemale(model) && ageAtLeast(40)(model),
  },
  {
    slug: "modelle-50-plus",
    title: "Modelle 50 plus",
    intro: "Profili 50+ con età dichiarata, senza attribuzioni inventate.",
    badges: ["50+", "Mature", "18+"],
    related: ["modelle-40-plus", "modelle-mature", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: FEMALE_QUERY,
    matchNotes: "age >= 50",
    match: (model) => isFemale(model) && ageAtLeast(50)(model),
  },
  {
    slug: "modelle-mature",
    title: "Modelle mature",
    intro: "Profili mature 18+ basati su età adulta dichiarata o tag mature restituiti dal feed.",
    badges: ["Mature", "Età", "18+"],
    related: ["modelle-40-plus", "modelle-50-plus", "modelle-curvy", "modelle-online-ora"],
    sitemapSafe: true,
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["mature"] },
    matchNotes: "tag mature o age >= 40",
    match: (model) => isFemale(model) && (ageAtLeast(40)(model) || tagMatches(model, ["mature"])),
  },
  {
    slug: "modelle-bionde",
    title: "Modelle bionde",
    intro: "Modelle webcam bionde 18+ mostrate solo quando tag o hashtag dichiarano blonde.",
    badges: ["Bionde", "Tag reali", "18+"],
    related: ["modelle-brune", "modelle-rosse", "modelle-hd", "modelle-online-ora"],
    sitemapSafe: true,
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["blonde"] },
    matchNotes: "tag o hashtag blonde",
    match: (model) => isFemale(model) && tagMatches(model, ["blonde", "blond"]),
  },
  {
    slug: "modelle-brune",
    title: "Modelle brune",
    intro: "Profili bruni 18+ inclusi solo con tag o hashtag brunette, brunet o brown hair.",
    badges: ["Brune", "Tag reali", "18+"],
    related: ["modelle-bionde", "modelle-rosse", "modelle-curvy", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["brunette"] },
    matchNotes: "tag o hashtag brunette",
    match: (model) => isFemale(model) && tagMatches(model, ["brunette", "brunet", "brown hair"]),
  },
  {
    slug: "modelle-rosse",
    title: "Modelle rosse",
    intro: "Profili redhead 18+ mostrati solo quando i tag lo dichiarano.",
    badges: ["Rosse", "Tag reali", "18+"],
    related: ["modelle-bionde", "modelle-brune", "modelle-tattoo", "modelle-online-ora"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["redhead"] },
    matchNotes: "tag redhead",
    match: (model) => isFemale(model) && tagMatches(model, ["redhead", "ginger", "red hair"]),
  },
  {
    slug: "modelle-capelli-neri",
    title: "Modelle capelli neri",
    intro: "Profili con capelli neri solo quando tag o hashtag black hair sono presenti.",
    badges: ["Capelli neri", "Tag reali", "18+"],
    related: ["modelle-brune", "modelle-bionde", "modelle-eleganti", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["blackhair"] },
    matchNotes: "tag blackhair o black hair",
    match: (model) => isFemale(model) && tagMatches(model, ["blackhair", "black hair"]),
  },
  {
    slug: "modelle-capelli-lunghi",
    title: "Modelle capelli lunghi",
    intro: "Profili con capelli lunghi filtrati solo da tag o hashtag espliciti.",
    badges: ["Capelli lunghi", "Tag reali", "18+"],
    related: ["modelle-bionde", "modelle-brune", "modelle-glamour", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["longhair"] },
    matchNotes: "tag longhair o long hair",
    match: (model) => isFemale(model) && tagMatches(model, ["longhair", "long hair"]),
  },
  {
    slug: "modelle-occhi-azzurri",
    title: "Modelle occhi azzurri",
    intro: "Categoria disponibile solo con tag o hashtag blue eyes reali.",
    badges: ["Occhi azzurri", "Tag reali", "18+"],
    related: ["modelle-occhi-verdi", "modelle-bionde", "modelle-glamour", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["blueeyes"] },
    matchNotes: "tag blueeyes o blue eyes",
    match: (model) => isFemale(model) && tagMatches(model, ["blueeyes", "blue eyes"]),
  },
  {
    slug: "modelle-occhi-verdi",
    title: "Modelle occhi verdi",
    intro: "Categoria mostrata solo quando tag o hashtag green eyes sono presenti.",
    badges: ["Occhi verdi", "Tag reali", "18+"],
    related: ["modelle-occhi-azzurri", "modelle-brune", "modelle-glamour", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["greeneyes"] },
    matchNotes: "tag greeneyes o green eyes",
    match: (model) => isFemale(model) && tagMatches(model, ["greeneyes", "green eyes"]),
  },
  {
    slug: "modelle-tattoo",
    title: "Modelle tattoo",
    intro: "Modelle con tatuaggi mostrate solo quando tag o hashtag tattoo/tattoos sono presenti.",
    badges: ["Tattoo", "Tag reali", "18+"],
    related: ["modelle-con-piercing", "modelle-rosse", "modelle-curvy", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["tattoo"] },
    matchNotes: "tag tattoo o tattoos",
    match: (model) => isFemale(model) && tagMatches(model, ["tattoo", "tattoos"]),
  },
  {
    slug: "modelle-con-piercing",
    title: "Modelle con piercing",
    intro: "Profili con piercing inclusi solo con tag o hashtag espliciti.",
    badges: ["Piercing", "Tag reali", "18+"],
    related: ["modelle-tattoo", "modelle-glamour", "modelle-hd", "modelle-online-ora"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["piercing"] },
    matchNotes: "tag piercing",
    match: (model) => isFemale(model) && tagMatches(model, ["piercing", "piercings"]),
  },
  {
    slug: "modelle-petite",
    title: "Modelle petite",
    intro: "Profili petite 18+ mostrati solo quando i tag lo dichiarano.",
    badges: ["Petite", "Tag reali", "18+"],
    related: ["modelle-slim", "modelle-fitness", "modelle-bionde", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["petite"] },
    matchNotes: "tag petite",
    match: (model) => isFemale(model) && tagMatches(model, ["petite"]),
  },
  {
    slug: "modelle-slim",
    title: "Modelle slim",
    intro: "Profili slim 18+ filtrati da tag o hashtag, mai da interpretazioni delle immagini.",
    badges: ["Slim", "Tag reali", "18+"],
    related: ["modelle-petite", "modelle-fitness", "modelle-eleganti", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["slim"] },
    matchNotes: "tag slim",
    match: (model) => isFemale(model) && tagMatches(model, ["slim", "skinny"]),
  },
  {
    slug: "modelle-fitness",
    title: "Modelle fitness",
    intro: "Profili fitness 18+ inclusi solo con tag reali coerenti.",
    badges: ["Fitness", "Tag reali", "18+"],
    related: ["modelle-slim", "modelle-petite", "modelle-glamour", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["fitness"] },
    matchNotes: "tag fitness",
    match: (model) => isFemale(model) && tagMatches(model, ["fitness", "athletic"]),
  },
  {
    slug: "modelle-curvy",
    title: "Modelle curvy",
    intro: "Profili curvy 18+ selezionati solo quando tag o hashtag curvy o plus size sono presenti.",
    badges: ["Curvy", "Tag reali", "18+"],
    related: ["modelle-prosperose", "modelle-formose", "modelle-mature", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["curvy"] },
    matchNotes: "tag curvy o plus size",
    match: (model) => isFemale(model) && tagMatches(model, ["curvy", "plus size", "plussize"]),
  },
  {
    slug: "modelle-formose",
    title: "Modelle formose",
    intro: "Profili formosi 18+ con corrispondenza esplicita da tag e hashtag.",
    badges: ["Formose", "Tag reali", "18+"],
    related: ["modelle-curvy", "modelle-prosperose", "modelle-naturali", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["curvy"] },
    matchNotes: "tag curvy, busty o voluptuous",
    match: (model) => isFemale(model) && tagMatches(model, ["curvy", "busty", "voluptuous"]),
  },
  {
    slug: "modelle-prosperose",
    title: "Modelle prosperose",
    intro: "Profili 18+ mostrati solo con tag reali come bigboobs, busty, big boobs o boobs.",
    badges: ["Prosperose", "Tag reali", "18+"],
    related: ["modelle-curvy", "modelle-formose", "modelle-brune", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["bigboobs"] },
    matchNotes: "tag bigboobs, busty, big boobs o boobs",
    match: (model) => isFemale(model) && tagMatches(model, ["bigboobs", "big boobs", "busty", "boobs"]),
  },
  {
    slug: "modelle-naturali",
    title: "Modelle naturali",
    intro: "Profili naturali 18+ inclusi solo quando tag o hashtag dichiarano natural.",
    badges: ["Naturali", "Tag reali", "18+"],
    related: ["modelle-formose", "modelle-glamour", "modelle-eleganti", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["natural"] },
    matchNotes: "tag natural",
    match: (model) => isFemale(model) && tagMatches(model, ["natural"]),
  },
  {
    slug: "modelle-glamour",
    title: "Modelle glamour",
    intro: "Profili glamour 18+ filtrati da tag espliciti e metadati testuali reali.",
    badges: ["Glamour", "Tag reali", "18+"],
    related: ["modelle-eleganti", "modelle-lusso", "modelle-premium", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["glamour"] },
    matchNotes: "tag glamour",
    match: (model) => isFemale(model) && tagMatches(model, ["glamour"]),
  },
  {
    slug: "modelle-eleganti",
    title: "Modelle eleganti",
    intro: "Categoria elegante disponibile solo con tag reali come elegant o classy.",
    badges: ["Eleganti", "Tag reali", "18+"],
    related: ["modelle-glamour", "modelle-lusso", "modelle-premium", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["classy"] },
    matchNotes: "tag classy o elegant",
    match: (model) => isFemale(model) && tagMatches(model, ["classy", "elegant"]),
  },
  {
    slug: "modelle-lusso",
    title: "Modelle lusso",
    intro: "Profili con stile luxury mostrati solo quando i tag lo indicano esplicitamente.",
    badges: ["Lusso", "Tag reali", "18+"],
    related: ["modelle-premium", "modelle-glamour", "modelle-eleganti", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["luxury"] },
    matchNotes: "tag luxury",
    match: (model) => isFemale(model) && tagMatches(model, ["luxury", "lux"]),
  },
  {
    slug: "modelle-premium",
    title: "Modelle premium",
    intro: "Profili premium 18+ basati su segnali reali come alta definizione, popolarità o tag premium.",
    badges: ["Premium", "Live", "18+"],
    related: ["modelle-hd", "modelle-popolari", "modelle-glamour", "modelle-lusso"],
    chaturbateQuery: { ...FEMALE_QUERY, hd: true },
    matchNotes: "HD, popolarità o tag premium",
    match: (model) => isFemale(model) && (isHd(model) || popular(model) || tagMatches(model, ["premium"])),
  },
  {
    slug: "modelle-cosplay",
    title: "Modelle cosplay",
    intro: "Profili cosplay 18+ filtrati da tag o hashtag reali.",
    badges: ["Cosplay", "Tag reali", "18+"],
    related: ["modelle-cosplay-live", "modelle-roleplay", "modelle-gaming", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["cosplay"] },
    matchNotes: "tag cosplay",
    match: (model) => isFemale(model) && tagMatches(model, ["cosplay"]),
  },
  {
    slug: "modelle-lingerie",
    title: "Modelle lingerie",
    intro: "Profili lingerie 18+ mostrati solo quando tag o hashtag lingerie sono presenti.",
    badges: ["Lingerie", "Tag reali", "18+"],
    related: ["modelle-glamour", "modelle-eleganti", "modelle-prosperose", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["lingerie"] },
    matchNotes: "tag lingerie",
    match: (model) => isFemale(model) && tagMatches(model, ["lingerie"]),
  },
  {
    slug: "modelle-romantiche",
    title: "Modelle romantiche",
    intro: "Categoria soft 18+ basata su tag romantic o romance restituiti dal feed.",
    badges: ["Romantiche", "Tag reali", "18+"],
    related: ["modelle-flirt", "modelle-eleganti", "modelle-glamour", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["romantic"] },
    matchNotes: "tag romantic o romance",
    match: (model) => isFemale(model) && tagMatches(model, ["romantic", "romance"]),
  },
  {
    slug: "modelle-flirt",
    title: "Modelle flirt",
    intro: "Profili flirt 18+ inclusi solo quando il feed espone tag coerenti.",
    badges: ["Flirt", "Tag reali", "18+"],
    related: ["modelle-romantiche", "modelle-dance", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["flirt"] },
    matchNotes: "tag flirt",
    match: (model) => isFemale(model) && tagMatches(model, ["flirt", "flirty"]),
  },
  {
    slug: "modelle-dance",
    title: "Modelle dance",
    intro: "Profili dance 18+ filtrati da tag o hashtag espliciti.",
    badges: ["Dance", "Tag reali", "18+"],
    related: ["modelle-music", "modelle-flirt", "modelle-fitness", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["dance"] },
    matchNotes: "tag dance o dancing",
    match: (model) => isFemale(model) && tagMatches(model, ["dance", "dancing"]),
  },
  {
    slug: "modelle-toys",
    title: "Modelle toys",
    intro: "Categoria 18+ basata solo su tag toys o toy restituiti dal feed.",
    badges: ["Toys", "Tag reali", "18+"],
    related: ["modelle-bdsm", "modelle-lingerie", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["toys"] },
    matchNotes: "tag toys o toy",
    match: (model) => isFemale(model) && tagMatches(model, ["toys", "toy"]),
  },
  {
    slug: "modelle-feet",
    title: "Modelle feet",
    intro: "Profili 18+ inclusi solo quando tag o hashtag feet sono presenti.",
    badges: ["Feet", "Tag reali", "18+"],
    related: ["modelle-toys", "modelle-lingerie", "modelle-online-ora", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["feet"] },
    matchNotes: "tag feet",
    match: (model) => isFemale(model) && tagMatches(model, ["feet"]),
  },
  {
    slug: "modelle-bdsm",
    title: "Modelle BDSM",
    intro: "Profili BDSM 18+ mostrati solo quando tag reali indicano la categoria.",
    badges: ["BDSM", "Tag reali", "18+"],
    related: ["modelle-roleplay", "modelle-toys", "modelle-lingerie", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["bdsm"] },
    matchNotes: "tag bdsm",
    match: (model) => isFemale(model) && tagMatches(model, ["bdsm"]),
  },
  {
    slug: "modelle-roleplay",
    title: "Modelle roleplay",
    intro: "Profili roleplay 18+ filtrati da tag o hashtag reali.",
    badges: ["Roleplay", "Tag reali", "18+"],
    related: ["modelle-cosplay", "modelle-cosplay-live", "modelle-bdsm", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["roleplay"] },
    matchNotes: "tag roleplay",
    match: (model) => isFemale(model) && tagMatches(model, ["roleplay", "role play"]),
  },
  {
    slug: "modelle-gaming",
    title: "Modelle gaming",
    intro: "Profili gaming 18+ mostrati solo con tag gaming o gamer reali.",
    badges: ["Gaming", "Tag reali", "18+"],
    related: ["modelle-cosplay", "modelle-cosplay-live", "modelle-music", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["gaming"] },
    matchNotes: "tag gaming o gamer",
    match: (model) => isFemale(model) && tagMatches(model, ["gaming", "gamer"]),
  },
  {
    slug: "modelle-music",
    title: "Modelle music",
    intro: "Profili music 18+ filtrati da tag music, musician o singing.",
    badges: ["Music", "Tag reali", "18+"],
    related: ["modelle-dance", "modelle-gaming", "modelle-cosplay", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["music"] },
    matchNotes: "tag music, musician o singing",
    match: (model) => isFemale(model) && tagMatches(model, ["music", "musician", "singing"]),
  },
  {
    slug: "modelle-cosplay-live",
    title: "Modelle cosplay live",
    intro: "Cosplay live 18+ con tag cosplay e stato stanza attivo.",
    badges: ["Cosplay", "Live", "18+"],
    related: ["modelle-cosplay", "modelle-roleplay", "modelle-gaming", "modelle-hd"],
    chaturbateQuery: { ...FEMALE_QUERY, tags: ["cosplay"] },
    matchNotes: "tag cosplay e stato live",
    match: (model) => isFemale(model) && isOnline(model) && tagMatches(model, ["cosplay"]),
  },
];

export const categories: ModelCategory[] = categoryInputs.map(makeCategory);

export const modelCategories = categories;

export function getCategoryBySlug(slug: string): ModelCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getModelsByCategory(categorySlug: string, models: LiveModel[]): LiveModel[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  const matched = models.filter(category.match);
  if (category.slug === "modelle-popolari" || category.slug === "modelle-con-piu-utenti") {
    return matched.sort((a, b) => (b.numUsers ?? 0) - (a.numUsers ?? 0));
  }
  return matched;
}

export function getRelatedCategories(category: ModelCategory): ModelCategory[] {
  return category.related.map(getCategoryBySlug).filter((item): item is ModelCategory => Boolean(item));
}

export function getSitemapCategoryPaths(): string[] {
  return categories.filter((category) => category.sitemapSafe).map((category) => category.canonicalPath);
}

export function getCategoryModelOptions(category: ModelCategory): LiveModelOptions {
  return {
    gender: category.chaturbateQuery?.gender,
    region: category.chaturbateQuery?.region,
    tags: category.chaturbateQuery?.tags,
    hd: category.chaturbateQuery?.hd,
  };
}

export function getCategoriesUsingQueryParams(): ModelCategory[] {
  return categories.filter((category) => Boolean(category.chaturbateQuery));
}
