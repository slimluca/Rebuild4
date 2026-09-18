export const ATTRIBUTION_SOURCE: "modellewebcam";
export const TRACK_VALUES: readonly string[];
export function isTrackValue(value: unknown): value is string;
export function withAttribution(destination: string | URL, track: unknown): string;
export function withChaturbateAttribution(destination: string | URL, track: unknown): string | undefined;
