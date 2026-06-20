import type { LiveModel, RawModelRecord } from "@/lib/models";
import type { ModelFeedRequest, ModelFeedResult, ModelProvider } from "@/lib/model-providers/types";
import { FEED_REVALIDATE_SECONDS } from "@/lib/model-providers/types";

const CHATURBATE_DEFAULT_BASE_URL = "https://chaturbate.com/api/public/affiliates/onlinerooms/";
const CHATURBATE_ONLINE_SHOWS = ["public", "private", "group"];

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

function readBoolean(record: RawModelRecord, key: string): boolean | undefined {
  const value = record[key];
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "1", "yes"].includes(value.toLowerCase());
  return undefined;
}

function readNumber(record: RawModelRecord, key: string): number | undefined {
  const value = record[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function readAge(record: RawModelRecord): number | undefined {
  const age = readNumber(record, "age");
  return typeof age === "number" && age >= 18 && age <= 99 ? age : undefined;
}

function collectTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string | number => typeof item === "string" || typeof item === "number")
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[|,;/]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function hashtagTags(subject: string | undefined): string[] {
  if (!subject) return [];
  return Array.from(subject.matchAll(/#([\p{L}\p{N}_-]+)/gu), (match) => match[1]).filter(Boolean);
}

function normalizeToken(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function sanitizeDisplayName(value: string | undefined, fallback: string): string {
  const cleaned = (value ?? "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\b(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/\S*)?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || fallback;
}

function validImageUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return undefined;
    if (!/\.(?:jpg|jpeg|png|webp)(?:$|\?)/i.test(url.pathname)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function splitLanguages(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(/[|,;/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function asArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function requestLimit(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 500);
}

function shouldUseRevshareUrl(): boolean {
  return process.env.CHATURBATE_USE_REVSHARE !== "false";
}

export function buildChaturbateFeedUrl(request: ModelFeedRequest = {}): { url?: string; missingEnv: string[] } {
  const wm = process.env.CHATURBATE_WM;
  if (!wm) return { missingEnv: ["CHATURBATE_WM"] };

  const url = new URL(process.env.CHATURBATE_API_BASE_URL || CHATURBATE_DEFAULT_BASE_URL);
  const params = url.searchParams;
  params.set("wm", wm);
  params.set("client_ip", request.clientIp || "request_ip");
  params.set("format", process.env.CHATURBATE_FORMAT || "json");
  params.set("limit", String(requestLimit(request.limit ?? process.env.CHATURBATE_LIMIT, 100)));

  if (typeof request.offset === "number" && request.offset >= 0) params.set("offset", String(request.offset));
  for (const gender of asArray(request.gender)) {
    if (gender) params.append("gender", gender);
  }
  for (const region of asArray(request.region)) {
    if (region) params.append("region", region);
  }
  if (typeof request.hd === "boolean") params.set("hd", String(request.hd));
  for (const tag of (request.tags ?? []).filter(Boolean).slice(0, 5)) {
    params.append("tag", tag);
  }

  return { url: url.toString(), missingEnv: [] };
}

function normalizeChaturbateRoom(item: unknown): LiveModel | undefined {
  const record = asRecord(item);
  if (!record) return undefined;

  const username = firstString(record, ["username"]);
  if (!username) return undefined;

  const roomSubject = firstString(record, ["room_subject"]);
  const tags = Array.from(new Set([...collectTags(record.tags), ...hashtagTags(roomSubject)]));
  const spokenLanguages = splitLanguages(record.spoken_languages);
  const currentShow = normalizeToken(firstString(record, ["current_show"]));
  const chatRoomUrl =
    shouldUseRevshareUrl() && firstString(record, ["chat_room_url_revshare"])
      ? firstString(record, ["chat_room_url_revshare"])
      : firstString(record, ["chat_room_url"]);
  const image = validImageUrl(firstString(record, ["image_url_360x270"])) ?? validImageUrl(firstString(record, ["image_url"]));

  if (!image) return undefined;

  return {
    provider: "chaturbate",
    id: username,
    performerId: username,
    name: sanitizeDisplayName(firstString(record, ["display_name"]), username),
    slug: username,
    profileUrl: `/go/model?provider=chaturbate&username=${encodeURIComponent(username)}`,
    chatRoomUrl,
    image,
    thumbnail: image,
    previewImage: image,
    tags,
    categories: tags,
    gender: firstString(record, ["gender"]),
    country: firstString(record, ["country"]),
    location: firstString(record, ["location"]),
    language: spokenLanguages[0],
    languages: spokenLanguages,
    spokenLanguages,
    age: readAge(record),
    isOnline: currentShow !== "away" && CHATURBATE_ONLINE_SHOWS.includes(currentShow),
    status: firstString(record, ["current_show"]),
    isNew: readBoolean(record, "is_new"),
    isHd: readBoolean(record, "is_hd"),
    showType: firstString(record, ["current_show"]),
    chatType: firstString(record, ["current_show"]),
    isPrivate: currentShow === "private",
    bannedCountries: [],
    features: tags,
    style: tags,
    interests: tags,
    appearances: tags,
    willingnesses: [],
    sexualPreferences: [],
    numUsers: readNumber(record, "num_users"),
    numFollowers: readNumber(record, "num_followers"),
    secondsOnline: readNumber(record, "seconds_online"),
    roomSubject,
  };
}

function extractRooms(data: unknown): unknown[] {
  const record = asRecord(data);
  if (!record) return [];
  return Array.isArray(record.results) ? record.results : [];
}

export const chaturbateProvider: ModelProvider = {
  name: "chaturbate",
  async getModels(request: ModelFeedRequest): Promise<ModelFeedResult> {
    const built = buildChaturbateFeedUrl(request);
    if (!built.url) {
      return { provider: "chaturbate", models: [], available: false, missingEnv: built.missingEnv, fieldNames: [] };
    }

    try {
      const response = await fetch(built.url, { next: { revalidate: FEED_REVALIDATE_SECONDS } });
      if (!response.ok) {
        return {
          provider: "chaturbate",
          models: [],
          available: false,
          missingEnv: [],
          fieldNames: [],
          error: `Chaturbate feed returned ${response.status}`,
        };
      }

      const data: unknown = await response.json();
      const rooms = extractRooms(data);
      const fieldNames = rooms[0] && asRecord(rooms[0]) ? Object.keys(asRecord(rooms[0]) ?? {}) : [];
      const models = rooms
        .map(normalizeChaturbateRoom)
        .filter((model): model is LiveModel => Boolean(model))
        .slice(0, request.limit ?? 100);
      return { provider: "chaturbate", models, available: true, missingEnv: [], fieldNames };
    } catch (error) {
      return {
        provider: "chaturbate",
        models: [],
        available: false,
        missingEnv: [],
        fieldNames: [],
        error: error instanceof Error ? error.message : "Chaturbate feed request failed",
      };
    }
  },
  async getRedirectUrl(id: string, request: ModelFeedRequest): Promise<string | undefined> {
    const result = await this.getModels({ ...request, limit: request.limit ?? Number(process.env.CHATURBATE_LIMIT || 100) });
    return result.models.find((model) => model.performerId === id || model.id === id)?.chatRoomUrl;
  },
};
