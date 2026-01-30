import {
  Button,
  Card,
  Chip,
  SegmentedControl,
} from "./components";
import FigmaIcon from "./components/icons/FigmaIcon";
import LogoIcon from "./components/icons/LogoIcon";

const FILTER_TAGS = [
  "UI Element",
  "Desktop",
  "Mobile",
  "Presentation",
  "Apps",
];

const RESOURCE_CARDS = [
  {
    overlayTitle: "Beachfront party at Viento del Mar",
    overlaySubtitle: "July 28, 2024",
    overlayTag: "Nightlife",
    description: "Lorem ipsum dolor",
    gradient: "from-amber-900/80 via-orange-800/60 to-amber-950/80",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-violet-900/70 via-purple-800/50 to-indigo-950/80",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-slate-700/80 via-slate-600/60 to-slate-800/80",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-slate-800/70 via-slate-700/50 to-slate-900/80",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-fuchsia-900/60 via-purple-800/50 to-indigo-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-rose-900/70 via-red-800/50 to-amber-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-indigo-900/70 via-blue-800/50 to-cyan-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-zinc-700/80 via-zinc-600/60 to-zinc-800/80",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-teal-900/60 via-cyan-800/50 to-blue-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-emerald-900/70 via-green-800/50 to-teal-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-slate-800/70 via-slate-700/50 to-slate-900/80",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-pink-900/60 via-rose-800/50 to-orange-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-sky-900/70 via-blue-800/50 to-indigo-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-violet-800/70 via-purple-700/50 to-fuchsia-900/70",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
  {
    description: "Lorem ipsum dolor",
    gradient: "from-neutral-800/80 via-neutral-700/60 to-neutral-900/80",
    actions: [
      { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
      { label: "View", variant: "secondary" as const },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-10">
      <header className="w-full">
        <div className="flex w-full items-center justify-between pt-0 pb-4">
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

      <main className="w-full py-12 md:py-16">
        <section className="mb-10 md:mb-12 ml-0 mr-auto max-w-6xl">
          <h1 className="text-style-heading-h1 text-text-primary max-w-2xl">
            Curated Figma resources for your next project. Ready to remix.
          </h1>
          <div className="relative flex items-center mt-6">
            {/* Fixed left label */}
            <div className="shrink-0 flex items-center gap-3 bg-bg-primary z-10">
              <span className="text-sm font-medium">Tags</span>
              <span className="opacity-40">|</span>
            </div>

            {/* Scrollable chips area (only this scrolls) */}
            <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scrollbar-hide">
              <div className="flex flex-nowrap items-center gap-3 pl-2">
                {FILTER_TAGS.map((label) => (
                  <Chip key={label} className="shrink-0">
                    {label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="w-full">
          <section
            className="grid w-full grid-cols-1 min-[380px]:grid-cols-2 min-[680px]:grid-cols-2 min-[920px]:grid-cols-3 min-[1280px]:grid-cols-4 min-[1460px]:grid-cols-5 gap-x-[48px] gap-y-[80px]"
            aria-label="Resource library"
          >
            {RESOURCE_CARDS.map((card, i) => (
            <Card
              key={i}
              imageNode={
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
                  aria-hidden
                />
              }
              overlayTitle={card.overlayTitle}
              overlaySubtitle={card.overlaySubtitle}
              overlayTag={card.overlayTag}
              description={card.description}
              actions={card.actions}
            />
          ))}
          </section>
        </div>
      </main>
    </div>
  );
}
