"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Card, Chip } from "./index";
import FigmaIcon from "./icons/FigmaIcon";
import type { SanityCategory, SanityResource } from "@/lib/sanity";

const CARD_ACTIONS_BASE = [
  { label: "Remix in Figma", variant: "primary" as const, icon: <FigmaIcon className="text-text-primary-inverse" /> },
  { label: "View", variant: "secondary" as const },
];

interface ResourceLibraryContextValue {
  categories: SanityCategory[];
  resources: SanityResource[];
  selectedCategoryIds: Set<string>;
  toggleCategory: (categoryId: string) => void;
  filteredResources: SanityResource[];
}

const ResourceLibraryContext = createContext<ResourceLibraryContextValue | null>(null);

function useResourceLibrary() {
  const ctx = useContext(ResourceLibraryContext);
  if (!ctx) throw new Error("ResourceLibraryTags/Gallery must be used inside ResourceLibraryProvider");
  return ctx;
}

export interface ResourceLibraryProviderProps {
  categories: SanityCategory[];
  resources: SanityResource[];
  children: ReactNode;
}

export function ResourceLibraryProvider({
  categories,
  resources,
  children,
}: ResourceLibraryProviderProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const filteredResources = useMemo(() => {
    if (selectedCategoryIds.size === 0) return resources;
    return resources.filter(
      (r) => r.categoryRef != null && selectedCategoryIds.has(r.categoryRef)
    );
  }, [resources, selectedCategoryIds]);

  const value = useMemo(
    () => ({
      categories,
      resources,
      selectedCategoryIds,
      toggleCategory,
      filteredResources,
    }),
    [categories, resources, selectedCategoryIds, toggleCategory, filteredResources]
  );

  return (
    <ResourceLibraryContext.Provider value={value}>
      {children}
    </ResourceLibraryContext.Provider>
  );
}

export function ResourceLibraryTags() {
  const { categories, selectedCategoryIds, toggleCategory } = useResourceLibrary();
  const handledByPointerRef = useRef(false);

  const handlePointerDown = useCallback(
    (categoryId: string) => () => {
      handledByPointerRef.current = true;
      toggleCategory(categoryId);
    },
    [toggleCategory]
  );

  const handleClick = useCallback(
    (categoryId: string) => () => {
      if (handledByPointerRef.current) {
        handledByPointerRef.current = false;
        return;
      }
      toggleCategory(categoryId);
    },
    [toggleCategory]
  );

  return (
    <div className="relative flex items-center mt-6">
      <div className="shrink-0 flex items-center gap-3 bg-bg-primary z-10">
        <span className="text-sm font-medium">Tags</span>
        <span className="opacity-40 mr-1">|</span>
      </div>
      <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex flex-nowrap items-center gap-2 pl-2">
          {categories.map((category) => (
            <Chip
              key={category._id}
              className="shrink-0"
              selected={selectedCategoryIds.has(category._id)}
              onPointerDown={handlePointerDown(category._id)}
              onClick={handleClick(category._id)}
            >
              {category.title}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResourceLibraryGallery() {
  const { filteredResources } = useResourceLibrary();
  const router = useRouter();

  const getResourceSlug = useCallback((resource: SanityResource) => {
    return resource.slug ?? resource._id;
  }, []);

  return (
    <section
      className="grid w-full grid-cols-1 min-[380px]:grid-cols-2 min-[680px]:grid-cols-2 min-[920px]:grid-cols-3 min-[1280px]:grid-cols-4 min-[1460px]:grid-cols-5 gap-x-[48px] gap-y-[80px]"
      aria-label="Resource library"
    >
      {filteredResources.map((resource) => {
        const slug = getResourceSlug(resource);
        const actions = CARD_ACTIONS_BASE.map((action) =>
          action.label === "View"
            ? { ...action, onClick: () => router.push(`/resource/${slug}`) }
            : action
        );
        return (
          <Card
            key={resource._id}
            imageSrc={resource.imageUrl ?? undefined}
            imageAlt={resource.imageAlt ?? resource.name}
            imageFit="contain"
            title={resource.name}
            actions={actions}
            figmaCode={resource.figmaCode ?? undefined}
          />
        );
      })}
    </section>
  );
}
