"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import RemixIcon from "./icons/RemixIcon";

export interface RemixInFigmaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const RemixInFigmaButton = forwardRef<HTMLButtonElement, RemixInFigmaButtonProps>(
  function RemixInFigmaButton({ className = "", disabled, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={[
          "inline-flex h-[38px] min-h-[38px] items-center justify-center gap-0.5 rounded-full overflow-hidden",
          "pl-3 pr-6",
          "bg-white/75 text-[#0D0D0D]",
          "shadow-[0px_4px_14px_rgba(0,0,0,0.10)]",
          "text-xs font-medium leading-[18px]",
          "hover:bg-white hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] transition-colors transition-shadow duration-150",
          "disabled:opacity-50 disabled:pointer-events-none",
          className,
        ].join(" ")}
        {...props}
      >
        <span className="inline-flex shrink-0 w-[18px] h-[18px] items-center justify-center text-[#0D0D0D]">
          <RemixIcon className="w-[18px] h-[18px]" />
        </span>
        <span>Remix in Figma</span>
      </button>
    );
  }
);

export default RemixInFigmaButton;
