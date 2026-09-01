import { type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleText from "../../../components/ui/particle-text/particle-text";

type Spark = {
  left: string;
  top: string;
  size: number;
  opacity: number;
  delay: string;
};

const sparks: Spark[] = [
  { left: "12%", top: "25%", size: 4, opacity: 0.5, delay: "0s" },
  { left: "20%", top: "65%", size: 3, opacity: 0.35, delay: "0.6s" },
  { left: "28%", top: "35%", size: 5, opacity: 0.28, delay: "1.1s" },
  { left: "45%", top: "18%", size: 3, opacity: 0.38, delay: "0.2s" },
  { left: "62%", top: "70%", size: 4, opacity: 0.45, delay: "1.4s" },
  { left: "75%", top: "30%", size: 3, opacity: 0.32, delay: "0.9s" },
  { left: "85%", top: "58%", size: 5, opacity: 0.3, delay: "1.8s" },
];

export default function AuthBrandVisual({ caption }: { caption: string }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Free-floating Particle Text with zero bounding box/background */}
      <div className="relative h-[240px] sm:h-[280px] w-full flex items-center justify-center">
        {/* Soft ambient neon radial glow */}
        <div className="absolute left-1/2 top-1/2 h-44 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-500/25 dark:via-purple-500/25 dark:to-pink-500/25 blur-3xl pointer-events-none" />

        {/* Interactive Particle Text Effect - Loads animation only once, repels interactively */}
        <div className="relative z-10 size-full flex items-center justify-center cursor-crosshair">
          <ParticleText
            text="IdeaForge"
            fontSize="clamp(3.4rem, 6.5vw, 5.4rem)"
            fontWeight={900}
            fontFamily='"Geist Variable", ui-sans-serif, system-ui, sans-serif'
            color="#6366f1"
            highlightColor="#a855f7"
            particleSize={2.2}
            density={3.5}
            scatter={170}
            gatherDuration={1500}
            stagger={380}
            pointerRepel={55}
            repelRadius={130}
            idleDrift={0.7}
            trigger="mount"
            playOnce={true}
            glow={true}
            className="h-[240px] sm:h-[280px] w-full"
          />
        </div>

        {/* Floating Sparks */}
        {sparks.map((spark, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-indigo-400/70 dark:bg-indigo-300/80 pointer-events-none animate-pulse"
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

      {/* Dynamic Animated Caption */}
      <div className="min-h-[56px] flex items-center justify-center mt-2 max-w-md mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="text-fg-mid dark:text-slate-300 text-base sm:text-lg text-center leading-relaxed font-normal"
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
