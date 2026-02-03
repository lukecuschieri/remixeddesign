"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RemixInFigmaButton from "./RemixInFigmaButton";
import Button from "./Button";
import { sanityImageUrlWithFormat, type SanityResource } from "@/lib/sanity";

const TAG_LABEL_CLASS =
  "shrink-0 inline-flex items-center justify-center h-[28px] px-2 rounded-[var(--radius-pill)] bg-[#242424] text-[#AAAAAA] text-[12px] font-normal leading-normal cursor-default";

const TAGS_MAX_WIDTH_PX = 280;
const TOAST_COPY_DURATION_MS = 1500;
const TOAST_REMIX_DURATION_MS = 3000;
const TOAST_REMIX_MESSAGE = "Resource copied. Paste in Figma to remix.";
const TOAST_Z_INDEX = 9999;

export interface ResourceViewModalProps {
  resource: SanityResource | null;
  /** Current path segment used in URL (slug or _id fallback) */
  resourceSlug: string | null;
  /** Full resources list for prev/next navigation (same order as gallery) */
  resources?: SanityResource[];
  onClose: () => void;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PrevIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function NextIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/** Tags row: visible chips up to max width, then "+N more" with tooltip of hidden tags */
function ModalTags({ tags }: { tags: { _id: string; title: string }[] }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);
  const [moreHovered, setMoreHovered] = useState(false);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || tags.length === 0) {
      setVisibleCount(tags.length);
      return;
    }
    const maxW = TAGS_MAX_WIDTH_PX;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const gap = 8;
    const moreChipWidth = 72;
    let w = 0;
    let n = 0;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      const need = (i === 0 ? 0 : gap) + c.offsetWidth;
      if (n < children.length - 1 && w + need + gap + moreChipWidth > maxW) break;
      w += need;
      n++;
    }
    setVisibleCount(n);
  }, [tags.length]);

  const visibleTags = useMemo(() => tags.slice(0, visibleCount), [tags, visibleCount]);
  const hiddenTags = useMemo(() => tags.slice(visibleCount), [tags, visibleCount]);
  const overflowCount = hiddenTags.length;

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-col items-end max-w-[280px]">
      {/* Hidden row used only to measure tag widths */}
      <div
        ref={measureRef}
        className="flex items-center gap-2 absolute opacity-0 pointer-events-none"
        style={{ left: -9999 }}
        aria-hidden
      >
        {tags.map((tag) => (
          <span key={tag._id} className={TAG_LABEL_CLASS}>
            {tag.title}
          </span>
        ))}
      </div>
      {/* Visible row: only tags that fit + "+N more" */}
      <div className="flex flex-wrap items-center justify-end gap-2 w-full min-w-0 max-w-[280px]">
        {visibleTags.map((tag) => (
          <span key={tag._id} className={TAG_LABEL_CLASS}>
            {tag.title}
          </span>
        ))}
        {overflowCount > 0 && (
          <span
            className={`relative ${TAG_LABEL_CLASS}`}
            onMouseEnter={() => setMoreHovered(true)}
            onMouseLeave={() => setMoreHovered(false)}
          >
            +{overflowCount} more
            {moreHovered && hiddenTags.length > 0 && (
              <span
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 rounded-md bg-[#1a1a1a] text-text-primary text-style-label-small border border-border-primary whitespace-nowrap z-50 shadow-lg"
              >
                {hiddenTags.map((t) => t.title).join(", ")}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export function ResourceViewModal({
  resource,
  resourceSlug,
  resources = [],
  onClose,
}: ResourceViewModalProps) {
  const router = useRouter();
  const [copyToast, setCopyToast] = useState(false);
  const [remixToast, setRemixToast] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const list = resources.length > 0 ? resources : (resource ? [resource] : []);
  const currentIndex = list.findIndex((r) => (r.slug ?? r._id) === resourceSlug);
  const hasPrev = currentIndex >= 0 && list.length > 1;
  const hasNext = currentIndex >= 0 && list.length > 1;
  const prevSlug =
    hasPrev ? list[(currentIndex - 1 + list.length) % list.length].slug ?? list[(currentIndex - 1 + list.length) % list.length]._id : null;
  const nextSlug =
    hasNext ? list[(currentIndex + 1) % list.length].slug ?? list[(currentIndex + 1) % list.length]._id : null;

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (contentRef.current && contentRef.current.contains(e.target as Node)) return;
      onClose();
    },
    [onClose]
  );

  const handleCopyLink = useCallback(() => {
    if (!resourceSlug) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/resource/${resourceSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), TOAST_COPY_DURATION_MS);
    });
  }, [resourceSlug]);

  const handleRemix = useCallback(() => {
    if (!resource?.figmaCode?.trim()) return;
    const blob = new Blob([resource.figmaCode], { type: "text/html" });
    navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]).then(() => {
      setRemixToast(true);
      setTimeout(() => setRemixToast(false), TOAST_REMIX_DURATION_MS);
    });
  }, [resource]);

  const goPrev = useCallback(() => {
    if (prevSlug) router.replace(`/resource/${prevSlug}`);
  }, [prevSlug, router]);

  const goNext = useCallback(() => {
    if (nextSlug) router.replace(`/resource/${nextSlug}`);
  }, [nextSlug, router]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRemix();
        return;
      }
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleCopyLink();
        return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext, handleRemix, handleCopyLink]);

  if (!resource) return null;

  const tags = resource.tags ?? [];
  const sourceLabel = resource.sourceName ?? "Original source";
  const sourceUrl = resource.sourceUrl ?? "#";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70"
        aria-hidden
        onClick={handleBackdropClick}
      />
      <div
        className="fixed z-50 flex items-center justify-center p-[40px] inset-0 pointer-events-none"
        aria-modal
        role="dialog"
        aria-labelledby="resource-modal-title"
      >
        <div
          ref={contentRef}
          className="pointer-events-auto flex flex-col bg-bg-primary rounded-[24px] overflow-hidden p-[24px]"
          style={{
            width: "calc(100vw - 80px)",
            height: "calc(100vh - 80px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex shrink-0 items-center justify-between gap-4 px-6 py-4">
            <h2
              id="resource-modal-title"
              className="text-style-heading-h2 text-text-primary truncate min-w-0"
            >
              {resource.name}
            </h2>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                disabled={!hasPrev}
                className="p-1 rounded-full text-text-primary hover:bg-bg-secondary transition-colors cursor-custom disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous resource"
              >
                <PrevIcon className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!hasNext}
                className="p-1 rounded-full text-text-primary hover:bg-bg-secondary transition-colors cursor-custom disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next resource"
              >
                <NextIcon className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-text-primary hover:bg-bg-secondary transition-colors cursor-custom"
                aria-label="Close modal"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Main media area — image contained, never cropped */}
          <div className="flex-1 min-h-0 flex items-center justify-center bg-bg-primary p-6 relative">
            {resource.imageUrl ? (
              <div className="absolute inset-6 flex items-center justify-center">
                <Image
                  src={sanityImageUrlWithFormat(resource.imageUrl) ?? resource.imageUrl}
                  alt={resource.imageAlt ?? resource.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  unoptimized={resource.imageUrl.startsWith("https://cdn.sanity.io")}
                />
              </div>
            ) : (
              <div className="text-text-secondary text-style-label-medium">
                No image
              </div>
            )}
          </div>

          {/* Footer: three fixed-width areas, all bottom-aligned on same baseline */}
          <footer className="shrink-0 flex items-stretch px-6 py-4">
            {/* Left: Original Source — fixed width, content at bottom */}
            <div className="w-[280px] shrink-0 flex flex-col justify-end gap-1 min-w-0">
              <span className="text-style-label-small text-text-secondary">
                Original Source
              </span>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-style-label-large text-text-primary underline hover:text-text-secondary truncate max-w-[200px]"
              >
                {sourceLabel}
              </a>
            </div>

            {/* Center: Buttons — max-width 516px, always centered, aligned to bottom */}
            <div className="flex-1 min-w-0 flex justify-center items-end px-0">
              <div className="flex items-center gap-3 w-full max-w-[516px]">
                <RemixInFigmaButton
                  className="h-[56px] min-h-[56px] flex-1 min-w-0 text-[15px] leading-normal pl-4 pr-6 cursor-custom"
                  disabled={!resource.figmaCode?.trim()}
                  onClick={handleRemix}
                />
                <Button
                  variant="secondary"
                  size="small"
                  className="h-[56px] w-[160px] min-h-[56px] min-w-[160px] cursor-custom"
                  onClick={handleCopyLink}
                >
                  Share URL
                </Button>
              </div>
            </div>

            {/* Right: Tags — same fixed width, content at bottom */}
            <div className="w-[280px] shrink-0 flex justify-end items-end min-w-0">
              <ModalTags tags={tags} />
            </div>
          </footer>
        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          copyToast || remixToast ? (
            <div
              role="status"
              aria-live="polite"
              className={`fixed left-1/2 -translate-x-1/2 rounded-xl bg-[#2E2E2E] px-6 py-3 text-sm font-normal text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] ${remixToast ? "bottom-12" : "bottom-6"}`}
              style={{ zIndex: TOAST_Z_INDEX }}
            >
              {copyToast ? "Link copied to clipboard" : TOAST_REMIX_MESSAGE}
            </div>
          ) : null,
          document.body
        )}
    </>
  );
}

export default ResourceViewModal;
