"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** When true, applies selected/active filter style */
  selected?: boolean;
}

/**
 * Chip component aligned with Figma states:
 * - Default: secondary bg, primary border, primary text
 * - Hover: darker bg, lighter border
 * - Active: pressed darker bg, same border
 */
const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className = "", selected = false, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-pill)]",
        "px-[var(--spacing-tag-x)] py-[var(--spacing-tag-y)]",
        "text-style-label-medium transition-colors",
        /* Default (Figma 1-954) */
        "bg-bg-secondary text-text-primary border border-border-primary",
        /* Hover (Figma 1-953) */
        "hover:bg-[var(--color-chip-bg-hover)] hover:border-[var(--color-chip-border-hover)]",
        /* Active / pressed (Figma 1-958) */
        "active:bg-[var(--color-chip-bg-active)] active:border-[var(--color-chip-border-active)]",
        /* Selected filter state — keep on hover and active */
        selected &&
          "bg-white !text-black border-transparent hover:bg-white hover:border-transparent hover:!text-black active:bg-white active:border-transparent active:!text-black",
        "disabled:opacity-50 disabled:pointer-events-none",
        "cursor-custom",
        className,
      ].join(" ")}
      {...props}
    />
  );
});

export default Chip;
