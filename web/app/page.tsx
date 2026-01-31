import { HomeLayout } from "./components/HomeLayout";
import {
  client,
  CATEGORIES_QUERY,
  RESOURCES_QUERY,
  type SanityCategory,
  type SanityResource,
} from "@/lib/sanity";

export const revalidate = 15;

export default async function Home() {
  const [categories, resources] = await Promise.all([
    client.fetch<SanityCategory[]>(CATEGORIES_QUERY),
    client.fetch<SanityResource[]>(RESOURCES_QUERY),
  ]);

  return (
    <HomeLayout categories={categories} resources={resources} />
  );
}
