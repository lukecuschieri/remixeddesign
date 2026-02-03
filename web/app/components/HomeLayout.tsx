"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer, SegmentedControl } from ".";
import {
  ResourceLibraryProvider,
  ResourceLibraryTags,
  ResourceLibraryGallery,
} from "./ResourceLibrary";
import { ResourceViewModal } from "./ResourceViewModal";
import LogoIcon from "./icons/LogoIcon";
import XLogoIcon from "./icons/XLogoIcon";
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
  const [clientModalSlug, setClientModalSlug] = useState<string | null>(null);

  const openResourceModal = useCallback((slug: string) => {
    setClientModalSlug(slug);
    window.history.pushState({ modal: slug }, "", `/resource/${slug}`);
  }, []);

  const closeResourceModal = useCallback(() => {
    if (clientModalSlug) {
      window.history.back();
    } else {
      router.push("/");
    }
  }, [router, clientModalSlug]);

  useEffect(() => {
    const handlePopState = () => {
      setClientModalSlug(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const effectiveResourceSlug =
    clientModalSlug ?? resourceSlug ?? null;
  const effectiveResourceForModal = clientModalSlug
    ? (resources.find((r) => (r.slug ?? r._id) === clientModalSlug) ?? null)
    : resourceForModal ?? null;

  return (
    <div className="min-h-0 bg-bg-primary text-text-primary pt-10 px-10 pb-10">
      <ResourceLibraryProvider
        categories={categories}
        resources={resources}
        openResourceModal={openResourceModal}
      >
        <header className="sticky top-0 z-20 -mx-10 -mt-10 w-[calc(100%+5rem)] bg-transparent px-10 pt-10 pb-0">
          <div className="flex w-full items-center justify-between pt-0 pb-0 min-h-[2.25rem]">
            <SegmentedControl
              leading={<LogoIcon className="h-[18px] w-[18px] text-text-primary" />}
              items={[
                { label: "Library", href: "/" },
                { label: "About", href: "/about" },
              ]}
            />
            <a
              href="https://x.com/lukecusc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-[var(--spacing-button-x)] py-[var(--spacing-button-y)] text-style-label-large bg-bg-inverse text-text-primary-inverse border border-border-primary hover:bg-[#e8e8e8] hover:border-[#1a1a1a] transition-colors"
            >
              Follow on <XLogoIcon className="h-[1em] w-[1em] shrink-0" />
            </a>
          </div>
        </header>

        <main className="w-full pt-20 pb-12 md:pb-16">
          <section className="mb-10 md:mb-12 ml-0 mr-auto max-w-6xl">
            <h1 className="text-style-heading-h1 text-text-primary max-w-2xl block">
              Curated Figma resources for your
              <br />
              next project. Ready to remix.
            </h1>
            <ResourceLibraryTags />
          </section>

          <div className="w-full">
            <ResourceLibraryGallery />
          </div>
        </main>

        <Footer />
      </ResourceLibraryProvider>

      {effectiveResourceSlug && effectiveResourceForModal && (
        <ResourceViewModal
          resource={effectiveResourceForModal}
          resourceSlug={effectiveResourceSlug}
          resources={resources}
          onClose={closeResourceModal}
        />
      )}
    </div>
  );
}
