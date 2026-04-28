import { ankorConfig } from "./config";
import type { ImageVariant } from "./types";

const VARIANT_TOKEN = "{imageVariant}";

export function resolveImage(url: string | null | undefined, variant: ImageVariant = "1280w"): string {
  if (!url) return "";
  let resolved = url.includes(VARIANT_TOKEN) ? url.replace(VARIANT_TOKEN, variant) : url;
  if (resolved.startsWith("/")) {
    resolved = `${ankorConfig.baseUrl}${resolved}`;
  }
  return resolved;
}

export function imageHostname(): string {
  try {
    return new URL(ankorConfig.baseUrl).hostname;
  } catch {
    return "api.ankor.io";
  }
}
