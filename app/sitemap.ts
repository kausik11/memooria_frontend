import type { MetadataRoute } from "next";
import { api } from "@/services/api";
import type { CreatorResult } from "@/services/types";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const urls: MetadataRoute.Sitemap = ["", "/explore", "/join"].map((path) => ({
    url: `${base}${path}`,
  }));
  let page = 1,
    pages = 1;
  do {
    const result = await api<CreatorResult>(`/creators?limit=60&page=${page}`);
    urls.push(
      ...result.items.map((c) => ({ url: `${base}/creator/${c.slug}` })),
    );
    pages = result.pages;
    page++;
  } while (page <= pages);
  return urls;
}
