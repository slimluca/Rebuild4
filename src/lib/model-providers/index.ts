import { chaturbateProvider } from "@/lib/model-providers/chaturbate";
import type { ModelProvider } from "@/lib/model-providers/types";

export type { ModelFeedRequest, ModelFeedResult, ModelProviderName } from "@/lib/model-providers/types";

export const providers: Record<ModelProvider["name"], ModelProvider> = {
  chaturbate: chaturbateProvider,
};

export function getProviderMode(): "chaturbate" {
  return "chaturbate";
}
