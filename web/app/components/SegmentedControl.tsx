"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SegmentedControlItem {
  label: string;
  href: string;
}

export interface SegmentedControlProps {
  /** Optional leading slot (e.g. icon), rendered in a 32×32 cell */
  leading?: React.ReactNode;
  items: SegmentedControlItem[];
  className?: string;
}

/**
 * Segmented control: container with border/radius, optional leading icon,
 * and tabs with active (filled) and inactive (muted) states.
 * Active tab is derived from the current pathname.
 */
export default function SegmentedControl({
  leading,
  items,
  className = "",
}: SegmentedControlProps) {
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label="Navigation"
      className={[
        "inline-flex items-center gap-[var(--spacing-segmented)] rounded-[var(--radius-segmented)] border border-border-primary bg-bg-secondary p-[var(--spacing-segmented)]",
        className,
      ].join(" ")}
    >
      {leading != null && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center px-1"
          aria-hidden
        >
          {leading}
        </div>
      )}
      <div className="flex items-center">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              role="tab"
              aria-selected={active}
              data-state={active ? "Active" : "Default"}
              className={[
                "flex h-8 min-w-0 items-center justify-center rounded-[var(--radius-card)] px-[var(--spacing-segment-cell)] text-style-label-medium transition-colors leading-[20px]",
                active
                  ? "bg-[var(--color-segmented-active)] text-text-primary"
                  : "bg-bg-secondary text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
