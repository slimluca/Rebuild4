import type { LiveModel } from "@/lib/models";

export const FEED_REVALIDATE_SECONDS = 300;

export type ModelProviderName = "chaturbate";

export type ModelFeedRequest = {
  limit?: number;
  offset?: number;
  clientIp?: string;
  visitorCountryCode?: string;
  visitorRegionCode?: string;
  gender?: string | string[];
  region?: string | string[];
  tags?: string[];
  hd?: boolean;
};

export type ModelFeedResult = {
  provider: ModelProviderName;
  models: LiveModel[];
  available: boolean;
  missingEnv: string[];
  fieldNames: string[];
  error?: string;
};

export type ModelProvider = {
  name: ModelProviderName;
  getModels: (request: ModelFeedRequest) => Promise<ModelFeedResult>;
  getRedirectUrl: (id: string, request: ModelFeedRequest) => Promise<string | undefined>;
};
