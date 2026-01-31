import { Button, SegmentedControl } from "../components";
import LogoIcon from "../components/icons/LogoIcon";

export default function About() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-10">
      <header className="w-full">
        <div className="flex w-full items-center justify-between pt-0 pb-0">
          <SegmentedControl
            leading={<LogoIcon className="h-[18px] w-[18px] text-text-primary" />}
            items={[
              { label: "Library", href: "/" },
              { label: "About", href: "/about" },
            ]}
          />
          <Button variant="primary" size="medium">
            Follow
          </Button>
        </div>
      </header>

      <main className="w-full pt-10 pb-12 md:pb-16">
        <section className="mx-auto w-full max-w-[420px]">
          <div className="flex flex-col gap-[30px]">
            {/* Main title */}
            <h1 className="text-style-heading-h1 text-text-primary max-w-2xl leading-tight">
              From Inspiration to
              <br />
              creation in one click
            </h1>

            {/* Body text */}
            <div className="flex flex-col gap-6 text-style-body-large text-text-secondary leading-[24px]">
              <p>
                As a product designer part of my process has always been searching for apps or designs that inspired me. Things I wanted to remix into my own projects.
              </p>
              <p>
                The problem? I had to rebuild everything from scratch. Time-consuming.
              </p>
              <p>
                That&apos;s why I started Remixed.
              </p>
              <p>
                It&apos;s a curated library of fully editable Figma resources pulled from real apps, other designers, and even some of my own explorations. With one click you can copy a resource straight into your Figma file and start remixing.
              </p>
              <p>
                Remixed exists to make life easier for designers by saving time, fuelling inspiration, and helping great ideas come to life faster.
              </p>
              <p>
                If you want to keep up with new drops, you can follow me on X where I&apos;ll be posting updates. And if you&apos;ve got ideas or resources of your own, I&apos;d love to hear from you.
              </p>
            </div>

            {/* Separator */}
            <hr className="border-border-primary w-full" />

            {/* Footer: three columns — label large, text secondary (headers) / text primary (values) */}
            <footer className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
              <div className="flex flex-col gap-1">
                <span className="text-style-label-large text-text-secondary">
                  Launched
                </span>
                <span className="text-style-label-large text-text-primary">
                  2026
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-style-label-large text-text-secondary">
                  Created by
                </span>
                <span className="text-style-label-large text-text-primary">
                  Luke Cuschieri
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-style-label-large text-text-secondary">
                  Get Updates
                </span>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-style-label-large text-text-primary underline hover:opacity-80 transition-opacity w-fit"
                >
                  Follow me on X
                </a>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
