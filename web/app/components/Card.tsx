"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Button from "./Button";
import RemixInFigmaButton from "./RemixInFigmaButton";

const TOAST_REMIX_DURATION_MS = 3000;
const TOAST_MESSAGE = "Resource copied. Paste in Figma to remix.";

export interface CardAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CardProps {
  imageSrc?: string;
  imageAlt?: string;
  /** How the image fits inside the card frame: cover (crop) or contain (letterbox) */
  imageFit?: "cover" | "contain";
  imageNode?: React.ReactNode;
  /** Overlay text at bottom of image (e.g. resource title) */
  overlayTitle?: string;
  /** Overlay subtitle (e.g. date) */
  overlaySubtitle?: string;
  /** Overlay tag label */
  overlayTag?: string;
  title?: string;
  description?: string;
  actions?: CardAction[];
  /** When set, "Remix in Figma" copies this to clipboard on click and shows a toast; when missing, that button is disabled */
  figmaCode?: string;
  /** Called when the card is clicked outside of action buttons (e.g. to open a detail view) */
  onCardClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

function Card({
  imageSrc,
  imageAlt = "",
  imageFit = "cover",
  imageNode,
  overlayTitle,
  overlaySubtitle,
  overlayTag,
  title,
  description,
  actions = [],
  figmaCode,
  onCardClick,
  className = "",
  children,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRemixClick = useCallback(async () => {
    if (!figmaCode?.trim()) return;
    try {
      const blob = new Blob([figmaCode], { type: "text/html" });
      await navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), TOAST_REMIX_DURATION_MS);
    } catch {
      // no-op if clipboard fails
    }
  }, [figmaCode]);

  const effectiveActions = actions.map((action, i) => {
    const isRemix = action.label === "Remix in Figma";
    if (isRemix) {
      return {
        ...action,
        disabled: !figmaCode || !figmaCode.trim(),
        onClick: figmaCode?.trim() ? handleRemixClick : undefined,
      };
    }
    return action;
  });

  const showOverlay = isHovered && effectiveActions.length > 0;
  const hasImage = imageSrc ?? imageNode;
  const hasMetadataOverlay =
    overlayTitle ?? overlaySubtitle ?? overlayTag;

  return (
    <article
      className={[
        "group inline-flex min-w-0 w-full flex-col items-stretch gap-[var(--spacing-card-gap)]",
        className,
      ].join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasImage && (
        <div
          className={`relative w-full overflow-hidden bg-bg-primary${onCardClick ? " cursor-pointer" : ""}`}
          style={{ aspectRatio: "291 / 360" }}
          onClick={onCardClick}
        >
          {imageNode ?? (imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className={
                imageFit === "contain"
                  ? "object-contain transition-opacity duration-200 group-hover:opacity-80"
                  : "object-cover transition-opacity duration-200 group-hover:opacity-80"
              }
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : null)}
          {hasMetadataOverlay && (
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3">
              {overlayTitle && (
                <span className="text-style-label-large text-white">
                  {overlayTitle}
                </span>
              )}
              {overlaySubtitle && (
                <span className="mt-0.5 text-style-label-small text-white/90">
                  {overlaySubtitle}
                </span>
              )}
              {overlayTag && (
                <span className="mt-2 inline-flex w-fit rounded-[var(--radius-pill)] bg-white/20 px-[var(--spacing-tag-x)] py-[var(--spacing-tag-y)] text-style-label-medium text-white">
                  {overlayTag}
                </span>
              )}
            </div>
          )}
          {showOverlay && (
            <div className="absolute inset-0 flex items-end justify-center bg-black/20 backdrop-blur-0 pointer-events-none">
              <div className="w-full pl-4 pr-4 pb-4 hidden min-[680px]:block">
                <div className="flex w-full items-center gap-2 pointer-events-auto">
                  {effectiveActions.map((action, i) =>
                    action.label === "Remix in Figma" ? (
                      <RemixInFigmaButton
                        key={i}
                        className="h-[38px] min-w-0 flex-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick?.();
                        }}
                        disabled={action.disabled}
                      />
                    ) : (
                      <Button
                        key={i}
                        variant={action.variant ?? "secondary"}
                        size="small"
                        leftIcon={action.icon}
                        className="h-[38px] w-[90px] shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick?.();
                        }}
                        disabled={action.disabled}
                      >
                        {action.label}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {(description ?? title) && (
        <div className="self-stretch flex flex-col justify-center text-center text-style-label-small text-text-secondary leading-[14.3px]">
          {description ?? title}
        </div>
      )}
      {children}

      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-12 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#2E2E2E] px-6 py-3 text-sm font-normal text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
        >
          {TOAST_MESSAGE}
        </div>
      )}
    </article>
  );
}

export default Card;
