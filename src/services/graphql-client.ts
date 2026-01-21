import { GraphQLClient } from "graphql-request";

function normalizeUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
}

function getBaseUrl() {
  // ✅ Server-side
  if (typeof window === "undefined") {
    const envUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "";
    if (envUrl) return normalizeUrl(envUrl);
    return "http://localhost:4000";
  }

  // ✅ Client-side (browser)
  return window.location.origin;
}

export function getGqlClient(baseUrl?: string) {
  const resolvedBaseUrl = baseUrl ? normalizeUrl(baseUrl) : getBaseUrl();
  return new GraphQLClient(`${resolvedBaseUrl}/api/graphql`);
}
