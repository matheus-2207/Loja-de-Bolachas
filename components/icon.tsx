import type { SVGProps } from "react";

const paths = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  basket: "M3 9h18l-2 11H5L3 9Zm4 0 5-6 5 6M9 13v3m6-3v3",
  menu: "M4 8h16M4 16h16",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "m5 12 4 4L19 6",
  gift: "M3 8h18v4H3V8Zm2 4v9h14v-9M12 8v13m0-13C7 8 5 7 5 5s5-3 7 3Zm0 0c5 0 7-1 7-3s-5-3-7 3Z",
  leaf: "M19 4C9 3 3 8 5 15s14 5 14-11ZM6 18l9-9",
  chat: "M21 11a9 9 0 0 1-9 9c-2 0-3-.4-4-1l-5 2 1-5a9 9 0 1 1 17-5ZM8 11h8m-8 4h5",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Zm-5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  back: "M20 12H5m6-6-6 6 6 6",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6",
  zoom: "M15 15l6 6M10 6v8M6 10h8M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
} as const;
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
