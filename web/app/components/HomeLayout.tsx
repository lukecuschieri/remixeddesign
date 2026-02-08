"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import SearchCommand from "./SearchCommand";
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <>
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto bg-bg-primary text-text-primary pt-5 px-10 pb-0"
      >
        <div className="flex min-h-full flex-col">
          <ResourceLibraryProvider
            categories={categories}
            resources={resources}
            openResourceModal={openResourceModal}
          >
            <header className="sticky top-0 z-20 w-full shrink-0 bg-transparent -mt-5 pt-5 pb-2">
            <div className="flex w-full items-center justify-between">
              <SegmentedControl
                leading={<LogoIcon className="h-[18px] w-[18px] text-text-primary" />}
                items={[
                  { label: "Library", href: "/" },
                  { label: "About", href: "/about" },
                ]}
              />
              <SearchCommand
                resources={resources}
                categories={categories}
                onSelect={openResourceModal}
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

            <main className="flex min-h-0 flex-1 flex-col w-full pt-20 pb-12 md:pb-16">
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

            {/* Spacer: min gap between grid and footer; grows to push footer to bottom when content is short */}
              <div className="min-h-24 flex-1" aria-hidden />
            </main>

            <div className="flex shrink-0 flex-col">
              <Footer />
            </div>
          </ResourceLibraryProvider>
        </div>
      </div>

      {effectiveResourceSlug && effectiveResourceForModal && (
        <ResourceViewModal
          resource={effectiveResourceForModal}
          resourceSlug={effectiveResourceSlug}
          resources={resources}
          onClose={closeResourceModal}
        />
      )}
    </>
  );
}
