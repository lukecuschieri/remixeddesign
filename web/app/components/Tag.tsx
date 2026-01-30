"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export type TagVariant = "default" | "strong";

export interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TagVariant;
  children: React.ReactNode;
}

const Tag = forwardRef<HTMLButtonElement, TagProps>(function Tag(
  { variant = "default", className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      data-variant={variant}
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-pill)] px-[var(--spacing-tag-x)] py-[var(--spacing-tag-y)] text-style-label-medium transition-colors",
        "bg-bg-secondary text-text-primary border border-border-primary",
        "hover:bg-[#1a1a1a] hover:border-[#333] active:bg-[#222]",
        "data-[variant=strong]:bg-[#1a1a1a] data-[variant=strong]:border-[#333]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className,
      ].join(" ")}
      {...props}
    />
  );
});

export default Tag;
