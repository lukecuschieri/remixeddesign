"use client";

import { useRouter } from "next/navigation";
import { Button, SegmentedControl } from ".";
import {
  ResourceLibraryProvider,
  ResourceLibraryTags,
  ResourceLibraryGallery,
} from "./ResourceLibrary";
import { ResourceViewModal } from "./ResourceViewModal";
import LogoIcon from "./icons/LogoIcon";
import type { SanityCategory, SanityResource } from "@/lib/sanity";

export interface HomeLayoutProps {
  categories: SanityCategory[];
  resources: SanityResource[];
  /** When set, the resource modal is open (deep link). */
  resourceSlug?: string | null;
  resourceForModal?: SanityResource | null;
}

export function HomeLayout({
  categories,
  resources,
  resourceSlug = null,
  resourceForModal = null,
}: HomeLayoutProps) {
  const router = useRouter();

  const handleCloseModal = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-10">
      <header className="w-full">
        <div className="flex w-full items-center justify-between pt-0 pb-0">
          <SegmentedControl
            leading={<LogoIcon className="h-[18px] w-[18px] text-text-primary" />}
            items={[
              { label: "Library", href: "/" },
              { label: "About", href: "/about" },
            ]}
          />
          <Button variant="primary" size="medium">
            Follow
          </Button>
        </div>
      </header>

      <main className="w-full pt-10 pb-12 md:pb-16">
        <ResourceLibraryProvider categories={categories} resources={resources}>
          <section className="mb-10 md:mb-12 ml-0 mr-auto max-w-6xl">
            <h1 className="text-style-heading-h1 text-text-primary max-w-2xl">
              Curated Figma resources for your
              <br />
              next project. Ready to remix.
            </h1>
            <ResourceLibraryTags />
          </section>

          <div className="w-full">
            <ResourceLibraryGallery />
          </div>
        </ResourceLibraryProvider>
      </main>

      {resourceSlug && resourceForModal && (
        <ResourceViewModal
          resource={resourceForModal}
          resourceSlug={resourceSlug}
          resources={resources}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
