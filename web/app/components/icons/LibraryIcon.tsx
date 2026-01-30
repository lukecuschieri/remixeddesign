export default function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M10 2L12.5 7.5L18 8L14 12L15 17.5L10 15L5 17.5L6 12L2 8L7.5 7.5L10 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
