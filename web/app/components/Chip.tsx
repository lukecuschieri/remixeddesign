"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * Chip component aligned with Figma states:
 * - Default: secondary bg, primary border, primary text
 * - Hover: darker bg, lighter border
 * - Active: pressed darker bg, same border
 */
const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-pill)]",
        "px-[var(--spacing-tag-x)] py-[var(--spacing-tag-y)]",
        "text-style-label-medium transition-colors",
        /* Default (Figma 1-954) */
        "bg-bg-secondary text-text-primary border border-border-primary",
        /* Hover (Figma 1-953) */
        "hover:bg-[var(--color-chip-bg-hover)] hover:border-[var(--color-chip-border-hover)]",
        /* Active (Figma 1-958) */
        "active:bg-[var(--color-chip-bg-active)] active:border-[var(--color-chip-border-active)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className,
      ].join(" ")}
      {...props}
    />
  );
});

export default Chip;
