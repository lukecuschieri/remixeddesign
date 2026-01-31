import { redirect } from "next/navigation";
import { HomeLayout } from "@/app/components/HomeLayout";
import {
  client,
  CATEGORIES_QUERY,
  RESOURCES_QUERY,
  RESOURCE_BY_SLUG_QUERY,
  type SanityCategory,
  type SanityResource,
} from "@/lib/sanity";

export const revalidate = 15;

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [categories, resources, resource] = await Promise.all([
    client.fetch<SanityCategory[]>(CATEGORIES_QUERY),
    client.fetch<SanityResource[]>(RESOURCES_QUERY),
    client.fetch<SanityResource | null>(RESOURCE_BY_SLUG_QUERY, { slug }),
  ]);

  if (!resource) {
    redirect("/");
  }

  const resourceSlug = resource.slug ?? resource._id;

  return (
    <HomeLayout
      categories={categories}
      resources={resources}
      resourceSlug={resourceSlug}
      resourceForModal={resource}
    />
  );
}
