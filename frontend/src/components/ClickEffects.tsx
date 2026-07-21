import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Effect = { id: string; x: number; y: number };

/**
 * Global adaptation of Originkit's Click Effects component.
 * It is rendered above the app but never receives pointer events.
 */
export default function ClickEffects() {
  const [effects, setEffects] = useState<Effect[]>([]);
  const startedEffects = useRef(new Set<string>());

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const createEffect = (event: PointerEvent) => {
      if (event.button !== 0 || reducedMotion.matches) return;

      const id = `${event.timeStamp}-${event.clientX}-${event.clientY}`;
      setEffects((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
    };

    window.addEventListener("pointerdown", createEffect);
    return () => window.removeEventListener("pointerdown", createEffect);
  }, []);

  const animateEffect = (element: HTMLDivElement | null, effect: Effect) => {
    if (!element || startedEffects.current.has(effect.id)) return;
    startedEffects.current.add(effect.id);

    const lines = element.querySelectorAll(".click-effect__line");
    const sparks = element.querySelectorAll(".click-effect__spark");
    const timeline = gsap.timeline({
      onComplete: () => {
        startedEffects.current.delete(effect.id);
        setEffects((current) => current.filter(({ id }) => id !== effect.id));
      },
    });

    timeline
      .fromTo(lines, { scale: 0.3, opacity: 1 }, { scale: 1.25, opacity: 0, duration: 0.38, ease: "power2.out", stagger: 0.015 })
      .fromTo(sparks, { x: 0, y: 0, scale: 1, opacity: 1 }, {
        x: (_, target) => Number(target.dataset.x),
        y: (_, target) => Number(target.dataset.y),
        scale: 0,
        opacity: 0,
        duration: 0.34,
        ease: "power2.out",
        stagger: 0.01,
      }, 0);
  };

  return (
    <div className="click-effects" aria-hidden="true">
      {effects.map((effect) => (
        <div
          className="click-effect"
          key={effect.id}
          ref={(element) => animateEffect(element, effect)}
          style={{ left: effect.x, top: effect.y }}
        >
          {[0, 90, 180, 270].map((rotation) => (
            <span className="click-effect__line" key={rotation} style={{ transform: `rotate(${rotation}deg)` }} />
          ))}
          {[30, 60, 120, 150, 210, 240, 300, 330].map((angle) => {
            const distance = 32;
            return (
              <span
                className="click-effect__spark"
                data-x={Math.cos((angle * Math.PI) / 180) * distance}
                data-y={Math.sin((angle * Math.PI) / 180) * distance}
                key={angle}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
