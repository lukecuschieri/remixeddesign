"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Logo from Assets/Logo.svg — four-dots mark, inherits text color.
 */
function FooterLogo({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M6 12C9.31356 12.0001 12 14.6864 12 18C11.9998 21.3134 9.31345 23.9989 6 23.999C2.68649 23.999 0.000192798 21.3135 0 18C2.79318e-07 14.6864 2.68637 12 6 12ZM18 12C21.3136 12.0001 24 14.6864 24 18C23.9998 21.3134 21.3134 23.9989 18 23.999C14.6865 23.999 12.0002 21.3135 12 18C12 14.6864 14.6864 12 18 12ZM6 0C9.31346 7.67118e-05 11.9998 2.68656 12 6C12 9.31358 9.31356 11.9999 6 12C2.68637 12 -2.79318e-07 9.31363 0 6C0.000167457 2.68651 2.68647 -2.79309e-07 6 0ZM18 0C21.3135 7.67118e-05 23.9998 2.68656 24 6C24 9.31358 21.3136 11.9999 18 12C14.6864 12 12 9.31363 12 6C12.0002 2.68651 14.6865 -2.79309e-07 18 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Library", href: "/" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className="w-full shrink-0 border-t border-border-primary pt-[40px] pb-[80px]"
      role="contentinfo"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <Link
            href="/"
            className="inline-flex shrink-0 text-text-primary hover:opacity-80 transition-opacity"
            aria-label="Remixed Design home"
          >
            <FooterLogo className="h-8 w-8" />
        </Link>
        <p
            className="m-0 flex h-[50px] shrink-0 items-center justify-center text-text-primary"
            style={{ fontSize: 24, lineHeight: 1.2 }}
          >
            New resources uploaded weekly
          </p>
        <nav aria-label="Footer navigation" className="m-0 flex flex-wrap items-center justify-center gap-2 text-style-label-large">
            {NAV_ITEMS.map(({ label, href }, i) => (
              <span key={href} className="inline-flex items-center gap-2">
                {i > 0 && (
                  <span className="text-text-secondary" aria-hidden>
                    /
                  </span>
                )}
                <Link
                  href={href}
                  className={`uppercase tracking-wide transition-opacity hover:opacity-80 ${
                    pathname === href || (href === "/" && pathname === "/")
                      ? "text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {label}
                </Link>
              </span>
            ))}
            <span className="text-text-secondary" aria-hidden>
              /
            </span>
            <a
              href="https://x.com/lukecusc"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase tracking-wide text-text-secondary hover:opacity-80 transition-opacity"
            >
              Follow on x
            </a>
        </nav>
      </div>
    </footer>
  );
}
