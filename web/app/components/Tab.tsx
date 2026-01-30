"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { selected = false, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={selected}
      data-selected={selected}
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-pill)] px-[var(--spacing-button-x)] py-[var(--spacing-button-y)] text-style-label-large transition-colors",
        "bg-bg-secondary text-text-primary border border-border-primary",
        "hover:bg-[#1a1a1a] hover:border-[#333] active:bg-[#222]",
        "data-[selected=true]:bg-bg-secondary data-[selected=true]:border-border-primary data-[selected=true]:ring-1 data-[selected=true]:ring-border-primary",
        "disabled:opacity-50 disabled:pointer-events-none",
        className,
      ].join(" ")}
      {...props}
    />
  );
});

export default Tab;
