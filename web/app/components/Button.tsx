"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "medium" | "small";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isActive?: boolean;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<
  ButtonVariant,
  { base: string; hover: string; active: string; disabled: string }
> = {
  primary: {
    base: "bg-bg-inverse text-text-primary-inverse border border-border-primary",
    hover: "hover:bg-[#e8e8e8] hover:border-[#1a1a1a]",
    active: "active:bg-[#e0e0e0]",
    disabled: "disabled:opacity-50 disabled:pointer-events-none",
  },
  secondary: {
    base: "bg-bg-secondary text-text-primary border border-border-primary",
    hover: "hover:bg-[#1a1a1a] hover:border-[#333]",
    active: "active:bg-[#222]",
    disabled: "disabled:opacity-50 disabled:pointer-events-none",
  },
  ghost: {
    base: "bg-transparent text-text-primary border border-transparent",
    hover: "hover:bg-bg-secondary hover:border-border-primary",
    active: "active:bg-[#1a1a1a]",
    disabled: "disabled:opacity-50 disabled:pointer-events-none",
  },
};

const sizeStyles: Record<ButtonSize, { root: string; gap: string }> = {
  medium: {
    root: "px-[var(--spacing-button-x)] py-[var(--spacing-button-y)] text-style-label-large",
    gap: "gap-2",
  },
  small: {
    root: "px-[var(--spacing-button-x-sm)] py-[var(--spacing-button-y-sm)] text-style-label-medium",
    gap: "gap-1.5",
  },
};

const activeStyles =
  "data-[active=true]:bg-bg-secondary data-[active=true]:border-border-primary";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "medium",
    isActive,
    leftIcon,
    className = "",
    disabled,
    ...props
  },
  ref
) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  return (
    <button
      ref={ref}
      type="button"
      data-active={isActive}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-pill)] transition-colors",
        v.base,
        !disabled && v.hover,
        !disabled && v.active,
        v.disabled,
        activeStyles,
        s.root,
        s.gap,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      {props.children}
    </button>
  );
});

export default Button;
