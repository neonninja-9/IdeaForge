import { type CSSProperties } from "react";

type Spark = {
  left: string;
  top: string;
  size: number;
  opacity: number;
  delay: string;
};

const sparks: Spark[] = [
  { left: "14%", top: "30%", size: 4, opacity: 0.5, delay: "0s" },
  { left: "22%", top: "58%", size: 3, opacity: 0.35, delay: "0.6s" },
  { left: "30%", top: "42%", size: 5, opacity: 0.28, delay: "1.1s" },
  { left: "43%", top: "24%", size: 3, opacity: 0.38, delay: "0.2s" },
  { left: "58%", top: "62%", size: 4, opacity: 0.45, delay: "1.4s" },
  { left: "70%", top: "36%", size: 3, opacity: 0.32, delay: "0.9s" },
  { left: "82%", top: "52%", size: 5, opacity: 0.3, delay: "1.8s" },
];

export default function AuthBrandVisual({ caption }: { caption: string }) {
  return (
    <div className="w-full">
      <div className="relative h-[250px] w-full mb-5 -mt-10 overflow-hidden">
        <div className="absolute inset-x-8 top-8 bottom-12 rounded-[32px] border border-vivid/10 bg-white/30 shadow-[0_24px_80px_rgba(108,60,224,0.08)] backdrop-blur-sm" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(108,60,224,0.34) 1px, transparent 1.7px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.72) 38%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.72) 38%, transparent 72%)",
          }}
        />
        <div className="absolute left-1/2 top-1/2 h-28 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vivid/10 blur-3xl" />
        <img
          src="/ideaforge-text.svg"
          alt="IdeaForge"
          className="absolute left-1/2 top-1/2 w-[min(82%,520px)] -translate-x-1/2 -translate-y-1/2 animate-float drop-shadow-[0_18px_36px_rgba(108,60,224,0.16)]"
          loading="eager"
        />
        {sparks.map((spark, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-vivid animate-pulse"
            style={
              {
                left: spark.left,
                top: spark.top,
                width: spark.size,
                height: spark.size,
                opacity: spark.opacity,
                animationDelay: spark.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <p className="text-fg-mid text-lg max-w-md mx-auto leading-relaxed -mt-12">
        {caption}
      </p>
    </div>
  );
}
