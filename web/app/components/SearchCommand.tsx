"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { Search, X } from "lucide-react";
import Image from "next/image";
import RemixIcon from "./icons/RemixIcon";
import { sanityImageUrlWithFormat, type SanityCategory, type SanityResource } from "@/lib/sanity";

const TOAST_REMIX_DURATION_MS = 3000;
const TOAST_REMIX_MESSAGE = "Resource copied. Paste in Figma to remix.";

export interface SearchCommandProps {
  resources: SanityResource[];
  categories: SanityCategory[];
  onSelect: (slug: string) => void;
}

export default function SearchCommand({
  resources,
  categories,
  onSelect,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [remixToast, setRemixToast] = useState(false);

  const handleRemix = useCallback(
    (figmaCode: string | null | undefined) => {
      if (!figmaCode?.trim()) return;
      const blob = new Blob([figmaCode], { type: "text/html" });
      navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]).then(() => {
        setRemixToast(true);
        setTimeout(() => setRemixToast(false), TOAST_REMIX_DURATION_MS);
      });
    },
    []
  );

  // Build category lookup: _id -> title
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c._id, c.title));
    return map;
  }, [categories]);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      onSelect(slug);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-[36px] px-3 rounded-[8px] bg-[#1a1a1a] border border-[#292929] text-[#7C7C7C] text-[13px] hover:border-[#3a3a3a] hover:text-[#AAAAAA] transition-colors cursor-pointer"
      >
        <Search size={14} strokeWidth={1.5} />
        <span>Search</span>
        <kbd className="ml-2 hidden min-[480px]:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#292929] text-[11px] text-[#7C7C7C] font-mono">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[min(20vh,160px)] px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[560px]">
          <Command
            className="rounded-[12px] bg-[#1a1a1a] border border-[#292929] shadow-[0_16px_70px_rgba(0,0,0,0.5)] overflow-hidden"
            shouldFilter={false}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-4 border-b border-[#292929]">
              <Search size={16} strokeWidth={1.5} className="shrink-0 text-[#7C7C7C]" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search resources..."
                className="flex-1 h-[48px] bg-transparent text-[14px] text-[#f0efed] placeholder:text-[#7C7C7C] outline-none border-none"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 text-[#7C7C7C] hover:text-[#AAAAAA] transition-colors cursor-pointer"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Results */}
            <Command.List className="max-h-[360px] overflow-y-auto p-2 scrollbar-hide">
              <Command.Empty className="px-4 py-8 text-center text-[13px] text-[#7C7C7C]">
                No results found.
              </Command.Empty>

              <FilteredResults
                resources={resources}
                categoryMap={categoryMap}
                query={query}
                onSelect={handleSelect}
                onRemix={handleRemix}
              />
            </Command.List>

            {/* Footer hint */}
            <div className="flex items-center gap-3 px-4 py-2 border-t border-[#292929] text-[11px] text-[#7C7C7C]">
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#292929] font-mono text-[10px]">↑↓</kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#292929] font-mono text-[10px]">↵</kbd>
                open
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#292929] font-mono text-[10px]">esc</kbd>
                close
              </span>
            </div>
          </Command>
        </div>
      </div>

      {/* Remix toast */}
      {remixToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-12 left-1/2 z-[200] -translate-x-1/2 rounded-xl bg-[#2E2E2E] px-6 py-3 text-sm font-normal text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
        >
          {TOAST_REMIX_MESSAGE}
        </div>
      )}
    </>
  );
}

/** Client-side filtering + rendering of results */
function FilteredResults({
  resources,
  categoryMap,
  query,
  onSelect,
  onRemix,
}: {
  resources: SanityResource[];
  categoryMap: Map<string, string>;
  query: string;
  onSelect: (slug: string) => void;
  onRemix: (figmaCode: string | null | undefined) => void;
}) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return resources;

    return resources.filter((r) => {
      // Match by resource name
      if (r.name.toLowerCase().includes(q)) return true;
      // Match by tag titles
      if (r.tags?.some((t) => t.title.toLowerCase().includes(q))) return true;
      // Match by category/application name
      const catName = r.categoryRef ? categoryMap.get(r.categoryRef) : null;
      if (catName && catName.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [resources, categoryMap, query]);

  return (
    <>
      {filtered.map((resource) => {
        const slug = resource.slug ?? resource._id;
        const catName = resource.categoryRef
          ? categoryMap.get(resource.categoryRef)
          : null;

        return (
          <Command.Item
            key={resource._id}
            value={slug}
            onSelect={() => onSelect(slug)}
            className="group/item flex items-center gap-3 px-2 py-2 rounded-[8px] cursor-pointer text-[#f0efed] data-[selected=true]:bg-[#292929] transition-colors"
          >
            {/* Thumbnail */}
            <div className="shrink-0 w-[40px] h-[40px] rounded-[6px] overflow-hidden bg-[#242424] relative">
              {resource.imageUrl ? (
                <Image
                  src={sanityImageUrlWithFormat(resource.imageUrl) ?? resource.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                  unoptimized={resource.imageUrl.startsWith("https://cdn.sanity.io")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7C7C7C] text-[10px]">
                  —
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">
                {resource.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#7C7C7C] truncate">
                {catName && <span>{catName}</span>}
                {catName && resource.tags && resource.tags.length > 0 && (
                  <span className="text-[#3a3a3a]">·</span>
                )}
                {resource.tags && resource.tags.length > 0 && (
                  <span className="truncate">
                    {resource.tags.map((t) => t.title).join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Figma remix icon — visible on hover/selected */}
            {resource.figmaCode?.trim() && (
              <button
                type="button"
                className="shrink-0 hidden group-data-[selected=true]/item:flex items-center justify-center w-[28px] h-[28px] rounded-[6px] bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemix(resource.figmaCode);
                }}
                aria-label="Remix in Figma"
              >
                <RemixIcon className="w-[14px] h-[14px] text-white" />
              </button>
            )}
          </Command.Item>
        );
      })}
    </>
  );
}
