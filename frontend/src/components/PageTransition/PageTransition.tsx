import { useRef, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Lightweight page-transition wrapper.
 *
 * On every route change the old content fades/slides out instantly and the new
 * content fades/slides in over 280ms.  Only `opacity` and `transform` are
 * animated — both are GPU-composited, so there is zero layout thrash.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    const el = wrapperRef.current;
    if (!el) return;

    // Cancel any running animation before starting a new one.
    el.getAnimations().forEach((a) => a.cancel());

    el.animate(
      [
        { opacity: 0, transform: "translateY(8px) scale(0.995)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 280,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );
  }, [pathname]);

  return (
    <div ref={wrapperRef} style={{ willChange: "opacity, transform" }}>
      {children}
    </div>
  );
}
