import { getProviderMode, providers, type ModelFeedRequest, type ModelFeedResult } from "@/lib/model-providers";

export type RawModelRecord = Record<string, unknown>;

export type LiveModel = {
  provider?: "chaturbate";
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
  gender?: string;
  hairColor?: string;
  ethnicity?: string;
  country?: string;
  location?: string;
  language?: string;
  languages: string[];
  spokenLanguages?: string[];
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
  numUsers?: number;
  numFollowers?: number;
  secondsOnline?: number;
  roomSubject?: string;
};

export type LiveModelContext = {
  country?: string;
  region?: string;
  visitorCountryCode?: string;
  visitorRegionCode?: string;
  clientIp?: string;
};

export type LiveModelOptions = Omit<ModelFeedRequest, "visitorCountryCode" | "visitorRegionCode" | "clientIp" | "limit">;

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
    model.gender,
    model.hairColor,
    model.ethnicity,
    model.country,
    model.location,
    model.language,
    ...model.languages,
    ...(model.spokenLanguages ?? []),
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
    model.roomSubject,
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
  const normalizedTerms = terms.map(normalizeToken);
  return values.some((value) => normalizedTerms.some((term) => value === term || value.includes(term)));
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
  return models.filter((model) => isModelAllowedForVisitorCountry(model, visitorCountryCode, visitorRegionCode));
}

export function getClientIpFromHeaders(headersList: Headers): string | undefined {
  const forwardedFor = headersList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    headersList.get("x-client-ip") ||
    undefined
  );
}

export function getVisitorGeoFromHeaders(headersList: Headers): LiveModelContext {
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
    visitorCountryCode:
      headersList.get("x-vercel-ip-country") ??
      headersList.get("cf-ipcountry") ??
      headersList.get("x-country-code") ??
      undefined,
    visitorRegionCode:
      headersList.get("x-vercel-ip-country-region") ??
      headersList.get("x-region-code") ??
      undefined,
    clientIp: getClientIpFromHeaders(headersList),
  };
}

export async function getLiveModelFeed(
  limit = 80,
  context: LiveModelContext = {},
  options: LiveModelOptions = {}
): Promise<ModelFeedResult> {
  const request: ModelFeedRequest = {
    ...options,
    limit,
    clientIp: context.clientIp,
    visitorCountryCode: context.visitorCountryCode,
    visitorRegionCode: context.visitorRegionCode,
  };
  const mode = getProviderMode();
  return providers[mode].getModels(request);
}

export async function getLiveModels(
  limit = 80,
  visitorCountryCode?: string,
  visitorRegionCode?: string,
  options: LiveModelOptions & { clientIp?: string } = {}
): Promise<LiveModel[]> {
  const result = await getLiveModelFeed(
    limit,
    {
      visitorCountryCode,
      visitorRegionCode,
      clientIp: options.clientIp,
    },
    options
  );
  return filterModelsForVisitorCountry(result.models, visitorCountryCode, visitorRegionCode);
}

export async function getModelRedirectUrl(
  id: string,
  visitorCountryCode?: string,
  visitorRegionCode?: string,
  options: LiveModelOptions & { clientIp?: string; provider?: "chaturbate" } = {}
): Promise<string | undefined> {
  const request: ModelFeedRequest = {
    ...options,
    limit: Number(process.env.CHATURBATE_LIMIT || 100),
    clientIp: options.clientIp,
    visitorCountryCode,
    visitorRegionCode,
  };

  const mode = getProviderMode();
  return providers[mode].getRedirectUrl(id, request);
}

export function hasProfilePageReadyData(model: LiveModel): boolean {
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
