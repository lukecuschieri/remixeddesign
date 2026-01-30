/**
 * Design system token constants
 * Use these for programmatic access (e.g. inline styles, tests, Storybook).
 * For styling, prefer CSS variables and Tailwind utilities from design-tokens.css.
 */

export const colors = {
  bg: {
    primary: "#0d0d0d",
    secondary: "#141414",
    tertiary: "#141414",
    inverse: "#ffffff",
  },
  border: {
    primary: "#292929",
  },
  text: {
    primary: "#f0efed",
    secondary: "#aaaaaa",
    primaryInverse: "#0d0d0d",
  },
} as const;

export const typography = {
  "heading-h1": {
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    fontSize: "27px",
    letterSpacing: "-0.5px",
  },
  "heading-h2": {
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    fontSize: "22px",
    letterSpacing: "-0.3px",
  },
  "label-medium": {
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    fontSize: "13px",
    letterSpacing: "0.1px",
  },
  "label-large": {
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    fontWeight: 500,
    fontSize: "14px",
    letterSpacing: "-0.3px",
  },
  "label-small": {
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    fontSize: "12px",
    letterSpacing: "-0.0075em",
  },
  "body-large": {
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    fontSize: "15px",
    letterSpacing: "-0.15px",
  },
} as const;

/** Tailwind class names for color tokens (backgrounds) */
export const bgClasses = {
  primary: "bg-bg-primary",
  secondary: "bg-bg-secondary",
  tertiary: "bg-bg-tertiary",
  inverse: "bg-bg-inverse",
} as const;

/** Tailwind class names for color tokens (text) */
export const textColorClasses = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  primaryInverse: "text-text-primary-inverse",
} as const;

/** Tailwind class names for border color */
export const borderClasses = {
  primary: "border-border-primary",
} as const;

/** Typography utility class names */
export const textStyleClasses = {
  "heading-h1": "text-style-heading-h1",
  "heading-h2": "text-style-heading-h2",
  "label-medium": "text-style-label-medium",
  "label-large": "text-style-label-large",
  "label-small": "text-style-label-small",
  "body-large": "text-style-body-large",
} as const;
