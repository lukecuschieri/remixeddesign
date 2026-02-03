import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID ?? "14c1h0o1";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_DATASET ?? "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

export const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title
}`;

export type SanityCategory = {
  _id: string;
  title: string;
};

export const RESOURCES_QUERY = `*[_type == "resource"] | order(orderRank) {
  _id,
  name,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  figmaCode,
  "categoryRef": category._ref,
  sourceUrl,
  sourceName,
  "tags": tags[]->{ _id, title }
}`;

export type SanityResource = {
  _id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  figmaCode: string | null;
  categoryRef: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  tags: { _id: string; title: string }[] | null;
};

/**
 * Append Sanity Image Pipeline params so the CDN serves WebP/AVIF when supported.
 * Use this URL when displaying images (e.g. in <img src> or Next.js Image).
 */
export function sanityImageUrlWithFormat(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format`;
}

/** Fetch a single resource by slug or _id for modal / deep link. */
export const RESOURCE_BY_SLUG_QUERY = `*[_type == "resource" && (slug.current == $slug || _id == $slug)][0] {
  _id,
  name,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  figmaCode,
  "categoryRef": category._ref,
  sourceUrl,
  sourceName,
  "tags": tags[]->{ _id, title }
}`;
