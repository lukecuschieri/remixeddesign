"use client";

import Link from "next/link";
import {
  Button,
  Tab,
  Tag,
  Chip,
  Card,
} from "./index";
import LibraryIcon from "./icons/LibraryIcon";
import FigmaIcon from "./icons/FigmaIcon";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border-primary border-b pb-10 last:border-0 last:pb-0">
      <h2 className="text-style-heading-h2 text-text-primary mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-style-label-large text-text-secondary mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-style-heading-h1 text-text-primary mb-2">
          Design system components
        </h1>
        <p className="text-style-body-large text-text-secondary mb-4">
          Preview of buttons, tabs, tags, and cards with states and variants.
        </p>
        <p className="text-style-label-medium text-text-secondary mb-12">
          <Link
            href="/"
            className="text-text-primary underline hover:no-underline"
          >
            ← Back to tokens
          </Link>
        </p>

        <div className="flex flex-col gap-14">
          <Section title="Navigation buttons">
            <Subsection title="Default / Active">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  isActive
                  leftIcon={<LibraryIcon className="text-text-primary" />}
                >
                  Library
                </Button>
                <Button variant="ghost">About</Button>
              </div>
            </Subsection>
          </Section>

          <Section title="Tabs">
            <Subsection title="Default / Selected">
              <div className="flex flex-wrap gap-2" role="tablist">
                <Tab>Tab</Tab>
                <Tab selected>Tab</Tab>
                <Tab>Tab</Tab>
              </div>
            </Subsection>
          </Section>

          <Section title="Buttons">
            <Subsection title="Primary (e.g. Follow)">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Follow</Button>
                <Button variant="primary" disabled>
                  Follow (disabled)
                </Button>
              </div>
            </Subsection>
            <Subsection title="Secondary (e.g. View)">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary">View</Button>
                <Button variant="secondary" disabled>
                  View (disabled)
                </Button>
              </div>
            </Subsection>
            <Subsection title="Primary with icon (e.g. Remix in Figma)">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  size="small"
                  leftIcon={<FigmaIcon className="text-text-primary-inverse" />}
                >
                  Remix in Figma
                </Button>
              </div>
            </Subsection>
            <Subsection title="Sizes">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="medium">
                  Medium
                </Button>
                <Button variant="secondary" size="small">
                  Small
                </Button>
              </div>
            </Subsection>
          </Section>

          <Section title="Tags">
            <Subsection title="Default / Strong variant">
              <div className="flex flex-wrap gap-2">
                <Tag variant="strong">Tag Text</Tag>
                <Tag variant="strong">Tag Text</Tag>
                <Tag variant="default">Tag text</Tag>
              </div>
            </Subsection>
          </Section>

          <Section title="Chip">
            <Subsection title="Default / Hover / Active (Figma-aligned)">
              <div className="flex flex-wrap gap-2">
                <Chip>Tag text</Chip>
                <Chip disabled>Tag text (disabled)</Chip>
              </div>
              <p className="text-style-label-small text-text-secondary mt-2">
                Hover and click to see hover and active states.
              </p>
            </Subsection>
          </Section>

          <Section title="Cards">
            <Subsection title="Default, Hover (with actions), With metadata">
              <div className="grid gap-6 sm:grid-cols-3">
                <Card
                  imageNode={
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#f5f0ff] to-[#ffd6e8]"
                      aria-hidden
                    />
                  }
                />
                <Card
                  imageNode={
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#f5f0ff] to-[#ffd6e8]"
                      aria-hidden
                    />
                  }
                  actions={[
                    {
                      label: "Remix in Figma",
                      variant: "primary",
                      icon: (
                        <FigmaIcon className="text-text-primary-inverse" />
                      ),
                    },
                    { label: "View", variant: "secondary" },
                  ]}
                />
                <Card
                  imageNode={
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#f5f0ff] to-[#ffd6e8]"
                      aria-hidden
                    />
                  }
                  description="Lorem ipsum dolor"
                />
              </div>
            </Subsection>
          </Section>
        </div>
      </main>
    </div>
  );
}
