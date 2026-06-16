import { LiveModel, normalizeToken, valueMatches } from "@/lib/models";

export const CATEGORY_MIN_INDEXABLE_MODELS = 8;

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
  faq?: { question: string; answer: string }[];
  match: (model: LiveModel) => boolean;
};

const hairTerms = {
  blonde: ["blonde", "blond", "bionda", "bionde", "biondo", "fair hair"],
  brunette: ["brunette", "brown hair", "bruna", "brune", "bruno", "castana", "castane", "brown"],
  redhead: ["redhead", "red hair", "ginger", "rossa", "rosse", "rosso"],
};

function fieldMatches(values: Array<string | undefined>, terms: string[]): boolean {
  return valueMatches(values.filter((value): value is string => Boolean(value)).map(normalizeToken), terms);
}

function hairMatches(model: LiveModel, terms: string[]): boolean {
  return fieldMatches([model.hairColor], terms);
}

function ageAtLeast(model: LiveModel, minimum: number): boolean {
  return typeof model.age === "number" && model.age >= minimum;
}

function isOnline(model: LiveModel): boolean {
  return fieldMatches([model.status], ["free_chat", "member_chat", "private_chat"]) || model.isOnline === true;
}

function isNew(model: LiveModel): boolean {
  return model.isNew === true;
}

function isHd(model: LiveModel): boolean {
  return model.isHd === true || (typeof model.streamQuality === "number" && model.streamQuality >= 7);
}

function isPrivate(model: LiveModel): boolean {
  return fieldMatches([model.status], ["private_chat"]) || model.isPrivate === true;
}

function isProsperous(model: LiveModel): boolean {
  return fieldMatches([model.breastSize], ["big", "huge"]);
}

function isItalian(model: LiveModel): boolean {
  return fieldMatches([model.country], ["it"]) || fieldMatches([model.language, ...model.languages], ["italian"]);
}

function isAsian(model: LiveModel): boolean {
  return fieldMatches([model.ethnicity], ["asian"]);
}

function isLatin(model: LiveModel): boolean {
  return fieldMatches([model.ethnicity], ["latin"]);
}

function isMature(model: LiveModel): boolean {
  return fieldMatches([...model.categories], ["mature"]) || ageAtLeast(model, 40);
}

function buildMatches(model: LiveModel, terms: string[]): boolean {
  return fieldMatches([model.build], terms);
}

function appearanceMatches(model: LiveModel, terms: string[]): boolean {
  return fieldMatches(model.appearances, terms);
}

export const modelCategories = [
  {
    slug: "modelle-bionde",
    title: "Modelle webcam bionde",
    intro:
      "Scopri una selezione aggiornata di modelle webcam bionde 18+ quando la sorgente live rende disponibili profili con capelli biondi dichiarati nei metadati.",
    metaTitle: "Modelle webcam bionde online 18+",
    metaDescription: "Modelle webcam bionde online con profili live filtrati solo da metadati reali.",
    badges: ["Bionde", "18+", "Live"],
    canonicalPath: "/modelle-bionde/",
    related: ["modelle-brune", "modelle-rosse", "modelle-hd", "modelle-online-ora"],
    sitemapSafe: true,
    match: (model) => hairMatches(model, hairTerms.blonde),
  },
  {
    slug: "modelle-brune",
    title: "Modelle webcam brune",
    intro:
      "Una griglia premium di modelle webcam brune 18+ filtrata da valori reali come brunette, brown hair, bruna o castana quando presenti nei dati disponibili.",
    metaTitle: "Modelle webcam brune online 18+",
    metaDescription: "Sfoglia modelle webcam brune online con filtri coerenti sui metadati disponibili.",
    badges: ["Brune", "18+", "Metadata match"],
    canonicalPath: "/modelle-brune/",
    related: ["modelle-bionde", "modelle-rosse", "modelle-curvy", "modelle-hd"],
    match: (model) => hairMatches(model, hairTerms.brunette),
  },
  {
    slug: "modelle-rosse",
    title: "Modelle webcam rosse",
    intro:
      "Profili 18+ con capelli rossi o redhead mostrati solo quando i metadati li identificano esplicitamente con tag, categoria o campo capelli.",
    metaTitle: "Modelle webcam rosse online 18+",
    metaDescription: "Modelle webcam rosse e redhead online filtrate da campi reali disponibili.",
    badges: ["Rosse", "18+", "Live"],
    canonicalPath: "/modelle-rosse/",
    related: ["modelle-bionde", "modelle-brune", "modelle-tattoo", "modelle-online-ora"],
    match: (model) => hairMatches(model, hairTerms.redhead),
  },
  {
    slug: "modelle-prosperose",
    title: "Modelle webcam prosperose",
    intro:
      "Modelle webcam prosperose 18+ mostrate solo quando busto, corpo, feature, stile, interessi, tag o categorie dichiarano esplicitamente una corrispondenza.",
    metaTitle: "Modelle webcam prosperose online 18+",
    metaDescription: "Modelle webcam prosperose online filtrate esclusivamente da metadati reali disponibili.",
    badges: ["Prosperose", "18+", "Metadata"],
    canonicalPath: "/modelle-prosperose/",
    related: ["modelle-curvy", "modelle-brune", "modelle-hd", "modelle-online-ora"],
    match: isProsperous,
  },
  {
    slug: "modelle-asiatiche",
    title: "Modelle webcam asiatiche",
    intro:
      "Modelle webcam asiatiche 18+ con corrispondenza basata su tag, categorie, paese, lingua o metadati etnici disponibili.",
    metaTitle: "Modelle webcam asiatiche online 18+",
    metaDescription: "Scopri modelle webcam asiatiche online con filtri basati su metadati reali.",
    badges: ["Asiatiche", "18+", "Online"],
    canonicalPath: "/modelle-asiatiche/",
    related: ["modelle-latine", "modelle-hd", "modelle-online-ora", "nuove-modelle-webcam"],
    sitemapSafe: true,
    match: isAsian,
  },
  {
    slug: "modelle-latine",
    title: "Modelle webcam latine",
    intro:
      "Profili latini 18+ mostrati quando i metadati indicano valori come latina, latin, latino, sudamerica o paesi coerenti.",
    metaTitle: "Modelle webcam latine online 18+",
    metaDescription: "Modelle webcam latine online filtrate da tag, categorie, paese o lingua reali.",
    badges: ["Latine", "18+", "Live"],
    canonicalPath: "/modelle-latine/",
    related: ["modelle-asiatiche", "modelle-curvy", "modelle-hd", "modelle-online-ora"],
    match: isLatin,
  },
  {
    slug: "modelle-mature",
    title: "Modelle webcam mature",
    intro:
      "Una selezione 18+ dedicata a profili mature quando i dati li etichettano chiaramente o quando l'età dichiarata rientra in una fascia adulta matura.",
    metaTitle: "Modelle webcam mature online 18+",
    metaDescription: "Modelle webcam mature online con filtro su tag mature o età dichiarata.",
    badges: ["Mature", "18+", "Verified age data"],
    canonicalPath: "/modelle-mature/",
    related: ["modelle-curvy", "modelle-brune", "modelle-online-ora", "modelle-in-chat-privata"],
    sitemapSafe: true,
    match: isMature,
  },
  {
    slug: "modelle-italiane",
    title: "Modelle webcam italiane",
    intro:
      "Modelle webcam italiane o in lingua italiana 18+ filtrate solo quando paese, lingua, tag o categorie indicano chiaramente Italia o italiano.",
    metaTitle: "Modelle webcam italiane online 18+",
    metaDescription: "Modelle webcam italiane online con corrispondenza su paese o lingua disponibili.",
    badges: ["Italiane", "Italiano", "18+"],
    canonicalPath: "/modelle-italiane/",
    related: ["modelle-online-ora", "modelle-hd", "modelle-in-chat-privata", "nuove-modelle-webcam"],
    sitemapSafe: true,
    match: isItalian,
  },
  {
    slug: "modelle-hd",
    title: "Modelle webcam HD",
    intro:
      "Profili webcam 18+ con indicazione HD o alta definizione nei campi tecnici, nei tag o nelle categorie disponibili.",
    metaTitle: "Modelle webcam HD online 18+",
    metaDescription: "Modelle webcam HD online filtrate da campi tecnici e tag reali.",
    badges: ["HD", "Live", "18+"],
    canonicalPath: "/modelle-hd/",
    related: ["modelle-online-ora", "nuove-modelle-webcam", "modelle-bionde", "modelle-italiane"],
    sitemapSafe: true,
    match: isHd,
  },
  {
    slug: "nuove-modelle-webcam",
    title: "Nuove modelle webcam",
    intro:
      "Nuove modelle webcam 18+ mostrate solo quando i dati live segnalano esplicitamente profili nuovi con flag o tag dedicati.",
    metaTitle: "Nuove modelle webcam online 18+",
    metaDescription: "Scopri nuove modelle webcam online quando i dati indicano profili recenti o nuovi.",
    badges: ["Nuove", "18+", "Aggiornate"],
    canonicalPath: "/nuove-modelle-webcam/",
    related: ["modelle-online-ora", "modelle-hd", "modelle-italiane", "modelle-asiatiche"],
    sitemapSafe: true,
    match: isNew,
  },
  {
    slug: "modelle-online-ora",
    title: "Modelle webcam online ora",
    intro:
      "Una vista 18+ dedicata ai profili online adesso, costruita dai campi live disponibili e aggiornata periodicamente durante la giornata.",
    metaTitle: "Modelle webcam online ora 18+",
    metaDescription: "Modelle webcam online ora filtrate da stato live, online o disponibile.",
    badges: ["Online ora", "Live", "18+"],
    canonicalPath: "/modelle-online-ora/",
    related: ["modelle-hd", "nuove-modelle-webcam", "modelle-in-chat-privata", "modelle-italiane"],
    sitemapSafe: true,
    match: isOnline,
  },
  {
    slug: "modelle-in-chat-privata",
    title: "Modelle in chat privata",
    intro:
      "Profili 18+ disponibili per chat privata quando i dati espongono campi o tag coerenti con stanza privata o private chat.",
    metaTitle: "Modelle webcam in chat privata 18+",
    metaDescription: "Modelle webcam in chat privata filtrate solo da metadati reali.",
    badges: ["Private", "18+", "Stanze"],
    canonicalPath: "/modelle-in-chat-privata/",
    related: ["modelle-online-ora", "modelle-hd", "modelle-mature", "modelle-italiane"],
    match: isPrivate,
  },
  {
    slug: "modelle-tattoo",
    title: "Modelle webcam tattoo",
    intro:
      "Modelle webcam 18+ con tattoo o tatuaggi mostrati solo quando tag, categorie o campi descrittivi li dichiarano esplicitamente.",
    metaTitle: "Modelle webcam tattoo online 18+",
    metaDescription: "Modelle webcam tattoo online filtrate da tag e categorie reali.",
    badges: ["Tattoo", "18+", "Live"],
    canonicalPath: "/modelle-tattoo/",
    related: ["modelle-rosse", "modelle-curvy", "modelle-online-ora", "modelle-hd"],
    match: (model) => appearanceMatches(model, ["tatoo", "tattoo"]),
  },
  {
    slug: "modelle-curvy",
    title: "Modelle webcam curvy",
    intro:
      "Profili curvy 18+ selezionati solo quando i dati includono tag o categorie esplicite come curvy, plus size o valori equivalenti.",
    metaTitle: "Modelle webcam curvy online 18+",
    metaDescription: "Modelle webcam curvy online filtrate da metadati reali e disponibili.",
    badges: ["Curvy", "18+", "Discovery"],
    canonicalPath: "/modelle-curvy/",
    related: ["modelle-mature", "modelle-latine", "modelle-brune", "modelle-online-ora"],
    match: (model) => buildMatches(model, ["above average", "large"]),
  },
] satisfies Omit<ModelCategory, "minimumModelCount">[];

export const categories: ModelCategory[] = modelCategories.map((category) => ({
  ...category,
  minimumModelCount: CATEGORY_MIN_INDEXABLE_MODELS,
}));

export function getCategoryBySlug(slug: string): ModelCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getModelsByCategory(categorySlug: string, models: LiveModel[]): LiveModel[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return models.filter(category.match);
}

export function getRelatedCategories(category: ModelCategory): ModelCategory[] {
  return category.related.map(getCategoryBySlug).filter((item): item is ModelCategory => Boolean(item));
}

export function getSitemapCategoryPaths(): string[] {
  return categories.filter((category) => category.sitemapSafe).map((category) => category.canonicalPath);
}
