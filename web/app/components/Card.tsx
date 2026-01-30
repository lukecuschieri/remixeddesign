"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./Button";

export interface CardAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}

export interface CardProps {
  imageSrc?: string;
  imageAlt?: string;
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
  className?: string;
  children?: React.ReactNode;
}

function Card({
  imageSrc,
  imageAlt = "",
  imageNode,
  overlayTitle,
  overlaySubtitle,
  overlayTag,
  title,
  description,
  actions = [],
  className = "",
  children,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const showOverlay = isHovered && actions.length > 0;
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
          className="relative w-full overflow-hidden bg-bg-primary"
          style={{ aspectRatio: "291 / 360" }}
        >
          {imageNode ?? (imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover transition-opacity duration-200 group-hover:opacity-80"
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
            <div className="absolute inset-0 flex items-end justify-center gap-2 bg-black/20 p-3 backdrop-blur-0">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {actions.map((action, i) => (
                  <Button
                    key={i}
                    variant={action.variant ?? "secondary"}
                    size="small"
                    leftIcon={action.icon}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
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
    </article>
  );
}

export default Card;
