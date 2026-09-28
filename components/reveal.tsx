"use client";
import { useEffect, useRef } from "react";
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.animate(
              [
                { opacity: 0.65, transform: "translateY(14px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" },
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={element} className={className}>
      {children}
    </div>
  );
}
