export type RawModelRecord = Record<string, unknown>;

export type LiveModel = {
  id: string;
  performerId?: string;
  name: string;
  slug?: string;
  profileUrl?: string;
  chatRoomUrl?: string;
  image?: string;
  thumbnail?: string;
  previewImage?: string;
  tags: string[];
  categories: string[];
  hairColor?: string;
  ethnicity?: string;
  country?: string;
  language?: string;
  languages: string[];
  age?: number;
  isOnline?: boolean;
  status?: string;
  isNew?: boolean;
  isHd?: boolean;
  showType?: string;
  chatType?: string;
  isPrivate?: boolean;
  bodyType?: string;
  body?: string;
  bust?: string;
  breastSize?: string;
  build?: string;
  hairLength?: string;
  eyeColor?: string;
  streamQuality?: number;
  bannedCountries: string[];
  features: string[];
  style: string[];
  interests: string[];
  appearances: string[];
  willingnesses: string[];
  sexualPreferences: string[];
  modelRating?: string;
  chargeAmount?: string;
};

const FEED_REVALIDATE_SECONDS = 300;
const AWE_DEFAULT_BASE_URL = "https://atwmcd.com/api/model/feed";
const AWE_DEFAULT_IMAGE_SIZES = "320x180,320x240,800x600,896x504,1024x576,1024x768";
const ONLINE_STATUSES = ["free_chat", "member_chat", "private_chat"];

function asRecord(value: unknown): RawModelRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawModelRecord) : undefined;
}

function firstString(record: RawModelRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

function firstBoolean(record: RawModelRecord, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = normalizeToken(value);
      if (["true", "yes", "online", "new", "hd", "private", "1"].includes(normalized)) return true;
      if (["false", "no", "offline", "0"].includes(normalized)) return false;
    }
    if (typeof value === "number") return value === 1 ? true : value === 0 ? false : undefined;
  }
  return undefined;
}

function readAge(record: RawModelRecord): number | undefined {
  const value = record.age;
  if (typeof value === "number" && value >= 18 && value <= 99) return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (parsed >= 18 && parsed <= 99) return parsed;
  }
  return undefined;
}

function collectStrings(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string" || typeof item === "number") return [String(item)];
      const record = asRecord(item);
      if (!record) return [];
      return [record.name, record.slug, record.label, record.title, record.value]
        .filter((entry): entry is string | number => typeof entry === "string" || typeof entry === "number")
        .map(String);
    });
  }

  if (typeof value === "string") {
    return value
      .split(/[|,;/#]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "number") return [String(value)];
  return [];
}

function collectFieldStrings(record: RawModelRecord, keys: string[]): string[] {
  return keys.flatMap((key) => collectStrings(record[key]));
}

function readNumber(record: RawModelRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

function getNestedRecord(record: RawModelRecord, keys: string[]): RawModelRecord | undefined {
  let current: RawModelRecord | undefined = record;
  for (const key of keys) {
    current = current ? asRecord(current[key]) : undefined;
  }
  return current;
}

function getPersonRecords(record: RawModelRecord): RawModelRecord[] {
  const persons = record.persons;
  if (!Array.isArray(persons)) return [];
  return persons.map(asRecord).filter((person): person is RawModelRecord => Boolean(person));
}

function collectNestedPersonStrings(persons: RawModelRecord[], path: string[]): string[] {
  return persons.flatMap((person) => {
    if (path.length === 1) return collectStrings(person[path[0]]);
    const parent = getNestedRecord(person, path.slice(0, -1));
    return parent ? collectStrings(parent[path[path.length - 1]]) : [];
  });
}

export function normalizeToken(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function modelSearchValues(model: LiveModel): string[] {
  return [
    ...model.tags,
    ...model.categories,
    model.hairColor,
    model.ethnicity,
    model.country,
    model.language,
    ...model.languages,
    model.status,
    model.showType,
    model.chatType,
    model.bodyType,
    model.body,
    model.bust,
    model.breastSize,
    model.build,
    model.hairLength,
    model.eyeColor,
    ...model.features,
    ...model.style,
    ...model.interests,
    ...model.appearances,
    ...model.willingnesses,
    ...model.sexualPreferences,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeToken);
}

export function valueMatches(values: string[], terms: string[]): boolean {
  return values.some((value) => terms.some((term) => value === term || value.includes(term)));
}

export function normalizeModel(item: unknown, index: number): LiveModel | undefined {
  const record = asRecord(item);
  if (!record) return undefined;

  const performerId = firstString(record, ["performerId", "performer_id"]);
  const id = firstString(record, ["id", "modelId", "model_id", "username", "slug", "screenName"]) ?? performerId ?? String(index);
  const name = firstString(record, ["name", "username", "displayName", "screenName", "nickname"]);
  if (!name && !performerId) return undefined;

  const status = firstString(record, ["status", "onlineStatus", "state"]);
  const normalizedStatus = normalizeToken(status).replace(/\s+/g, "_");
  const isOnline =
    firstBoolean(record, ["isOnline", "online"]) ??
    (status
      ? ONLINE_STATUSES.includes(normalizedStatus) ||
        ["online", "live", "available", "in chat"].some((term) => normalizeToken(status).includes(term))
      : undefined);
  const details = asRecord(record.details);
  const persons = getPersonRecords(record);
  const bodyRecords = persons.map((person) => asRecord(person.body)).filter((body): body is RawModelRecord => Boolean(body));

  const appearances = details ? collectFieldStrings(details, ["appearances"]) : [];
  const willingnesses = details ? collectFieldStrings(details, ["willingnesses"]) : [];
  const languages = [
    ...collectFieldStrings(record, ["languages", "languageList"]),
    ...(details ? collectFieldStrings(details, ["languages"]) : []),
  ];
  const breastSize = firstString(record, ["breastSize", "breast_size"]) ?? firstString(bodyRecords[0] ?? {}, ["breastSize"]);
  const build = firstString(record, ["build"]) ?? firstString(bodyRecords[0] ?? {}, ["build"]);
  const hairColor = firstString(record, ["hairColor", "hair_color", "hair"]) ?? firstString(bodyRecords[0] ?? {}, ["hairColor"]);
  const hairLength = firstString(record, ["hairLength", "hair_length"]) ?? firstString(bodyRecords[0] ?? {}, ["hairLength"]);
  const eyeColor = firstString(record, ["eyeColor", "eye_color"]) ?? firstString(bodyRecords[0] ?? {}, ["eyeColor"]);
  const profilePictureUrl = firstString(record, ["profilePictureUrl"]);
  const image = firstString(record, ["image", "imageUrl", "image_url", "avatar", "picture"]) ?? profilePictureUrl;
  const chatRoomUrl = firstString(record, ["chatRoomUrl", "chat_room_url"]);
  const profileUrl = firstString(record, ["profileUrl", "profile_url", "url", "link"]) ?? chatRoomUrl;
  const streamQuality = details ? readNumber(details, ["streamQuality"]) : undefined;
  const isPrivate =
    firstBoolean(record, ["isPrivate", "privateChat", "private"]) ??
    (normalizedStatus ? normalizedStatus === "private_chat" : undefined);

  return {
    id,
    performerId,
    name: name ?? performerId ?? id,
    slug: firstString(record, ["slug", "username"]) ?? performerId,
    profileUrl,
    chatRoomUrl,
    image,
    thumbnail: firstString(record, ["thumbnail", "thumb", "thumbnailUrl", "thumbnail_url"]),
    previewImage: firstString(record, ["previewImage", "preview_image", "preview", "cover"]) ?? profilePictureUrl,
    tags: collectFieldStrings(record, ["tags", "tagList", "keywords"]),
    categories: collectFieldStrings(record, ["categories", "category", "categoryList"]),
    hairColor,
    ethnicity: firstString(record, ["ethnicity", "ethnicGroup"]),
    country: firstString(record, ["country", "countryCode", "locationCountry"]),
    language: firstString(record, ["language", "primaryLanguage"]),
    languages,
    age: readAge(record) ?? readAge(persons[0] ?? {}),
    isOnline,
    status,
    isNew: firstBoolean(record, ["isNew", "new"]),
    isHd: firstBoolean(record, ["isHd", "hd", "isHD"]) ?? (typeof streamQuality === "number" ? streamQuality >= 7 : undefined),
    showType: firstString(record, ["showType", "show_type"]),
    chatType: firstString(record, ["chatType", "chat_type"]),
    isPrivate,
    bodyType: firstString(record, ["bodyType", "body_type"]),
    body: firstString(record, ["body"]),
    bust: firstString(record, ["bust", "cupSize", "cup_size"]) ?? breastSize,
    breastSize,
    build,
    hairLength,
    eyeColor,
    streamQuality,
    bannedCountries: collectFieldStrings(record, ["bannedCountries"]),
    features: collectFieldStrings(record, ["features", "featureList"]),
    style: collectFieldStrings(record, ["style", "styles"]),
    interests: collectFieldStrings(record, ["interests", "interestList"]),
    appearances,
    willingnesses,
    sexualPreferences: collectNestedPersonStrings(persons, ["sexualPreference"]),
    modelRating: details ? firstString(details, ["modelRating"]) : undefined,
    chargeAmount: details ? firstString(details, ["chargeAmount"]) : undefined,
  };
}

function extractModelList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  if (!record) return [];

  for (const key of ["models", "results", "data", "items", "performers"]) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }

  const nested = asRecord(record.data);
  if (nested) {
    for (const key of ["models", "results", "items", "performers"]) {
      if (Array.isArray(nested[key])) return nested[key] as unknown[];
    }
  }

  return [];
}

function appendIfPresent(params: URLSearchParams, name: string, value: string | undefined) {
  if (value?.trim()) params.set(name, value.trim());
}

export function buildAweModelFeedUrl(): string | undefined {
  const legacyEndpoint = process.env.MODEL_API_URL || process.env.LIVEJASMIN_MODEL_API_URL;
  if (legacyEndpoint) return legacyEndpoint;

  const psId = process.env.AWE_PS_ID;
  const accessKey = process.env.AWE_ACCESS_KEY;
  if (!psId || !accessKey) return undefined;

  const baseUrl = process.env.AWE_MODEL_FEED_BASE_URL || AWE_DEFAULT_BASE_URL;
  const url = new URL(baseUrl);
  const params = url.searchParams;
  params.set("responseFormat", "json");
  params.set("category", process.env.AWE_MODEL_CATEGORY || "girl");
  params.set("showOffline", "0");
  params.set("extendedDetails", process.env.AWE_MODEL_EXTENDED_DETAILS || "1");
  params.set("imageSizes", process.env.AWE_MODEL_IMAGE_SIZES || AWE_DEFAULT_IMAGE_SIZES);
  params.set("imageType", process.env.AWE_MODEL_IMAGE_TYPE || "glamour");
  params.set("limit", process.env.AWE_MODEL_LIMIT || "100");
  params.set("siteId", process.env.AWE_SITE_ID || "jsm");
  params.set("psProgram", process.env.AWE_PS_PROGRAM || "revs");
  params.set("psId", psId);
  params.set("accessKey", accessKey);
  appendIfPresent(params, "campaignId", process.env.AWE_CAMPAIGN_ID);
  appendIfPresent(params, "subAffId", process.env.AWE_SUB_AFF_ID);
  return url.toString();
}

export function bannedCountryTokens(model: Pick<LiveModel, "bannedCountries">): string[] {
  return model.bannedCountries.map((value) => normalizeToken(value).toUpperCase()).filter(Boolean);
}

export function isModelAllowedForVisitorCountry(
  model: Pick<LiveModel, "bannedCountries">,
  visitorCountryCode?: string,
  visitorRegionCode?: string
): boolean {
  if (!visitorCountryCode) return true;
  const country = visitorCountryCode.trim().toUpperCase();
  const region = visitorRegionCode?.trim().toUpperCase();
  const banned = bannedCountryTokens(model);
  if (banned.includes(country)) return false;
  if (country === "US" && region && banned.includes(`US:${region}`)) return false;
  return true;
}

export function filterModelsForVisitorCountry(
  models: LiveModel[],
  visitorCountryCode?: string,
  visitorRegionCode?: string
): LiveModel[] {
  // Production deployments should pass country and region from trusted edge/CDN geo headers.
  // Local development may not have these headers, so unknown country keeps models visible for testing.
  return models.filter((model) => isModelAllowedForVisitorCountry(model, visitorCountryCode, visitorRegionCode));
}

export function getVisitorGeoFromHeaders(headersList: Headers): { country?: string; region?: string } {
  return {
    country:
      headersList.get("x-vercel-ip-country") ??
      headersList.get("cf-ipcountry") ??
      headersList.get("x-country-code") ??
      undefined,
    region:
      headersList.get("x-vercel-ip-country-region") ??
      headersList.get("x-region-code") ??
      undefined,
  };
}

export async function getLiveModels(
  limit = 80,
  visitorCountryCode?: string,
  visitorRegionCode?: string
): Promise<LiveModel[]> {
  const endpoint = buildAweModelFeedUrl();
  if (!endpoint) return [];

  try {
    // Live availability changes frequently; ISR keeps pages fresh without hammering the upstream feed.
    const response = await fetch(endpoint, { next: { revalidate: FEED_REVALIDATE_SECONDS } });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    const normalized = extractModelList(data)
      .map(normalizeModel)
      .filter((model): model is LiveModel => Boolean(model))
      .slice(0, limit);
    return filterModelsForVisitorCountry(normalized, visitorCountryCode, visitorRegionCode);
  } catch {
    return [];
  }
}

export async function getModelRedirectUrl(
  performerId: string,
  visitorCountryCode?: string,
  visitorRegionCode?: string
): Promise<string | undefined> {
  const models = await getLiveModels(Number(process.env.AWE_MODEL_LIMIT || 100), visitorCountryCode, visitorRegionCode);
  return models.find((model) => model.performerId === performerId || model.id === performerId)?.chatRoomUrl;
}

export function hasProfilePageReadyData(model: LiveModel): boolean {
  // Future model profile pages should be built only from verified feed fields and must avoid fake biography content.
  return Boolean(
    model.id &&
      model.name &&
      getStableModelSlug(model) &&
      (model.image || model.thumbnail || model.previewImage) &&
      (model.tags.length > 0 || model.categories.length > 0 || typeof model.isOnline === "boolean")
  );
}

export function getStableModelSlug(model: LiveModel): string | undefined {
  return model.slug ?? model.id;
}
