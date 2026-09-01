import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const TOTAL_MS = 4600;
const SCAN_MS = 1600;
const EMBED_MS = 1100;
const INSPECT_MS = TOTAL_MS - SCAN_MS - EMBED_MS;
const EASE = [0.22, 1, 0.36, 1] as const;

const COLS = 6;
const ROWS = 5;
const GAP = 28;
const ZOOM = 1.7;
const GLASS_X = [-48, 20, 52, -8];
const GLASS_Y = [-18, 16, -8, 10];

const POINTS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const n = Math.sin(i * 12.9898) * 43758.5453;
  return {
    x: (col - (COLS - 1) / 2) * GAP,
    y: (row - (ROWS - 1) / 2) * GAP,
    value: ((n - Math.floor(n)) * 2 - 1).toFixed(2),
  };
});

type Stage = "scan" | "embed" | "inspect";

function Doc({ label, scan }: { label: string; scan: boolean }) {
  return (
    <div className="relative h-[168px] w-[112px] overflow-hidden rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-[#120F17]">
      <p className="px-3 pt-3 text-[10px] font-medium tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <div className="mt-3 space-y-2 px-3">
        {[78, 62, 70, 48].map((width, index) => (
          <div
            key={index}
            className="h-px rounded-full bg-slate-200 dark:bg-white/15"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
      {scan && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-px bg-[#fa520f]"
          initial={{ top: "12%" }}
          animate={{ top: "88%" }}
          transition={{ duration: 1.4, ease: [0.45, 0, 0.2, 1] }}
        />
      )}
    </div>
  );
}

function DotField({ reveal }: { reveal: boolean }) {
  return (
    <div className="relative h-[148px] w-[180px]">
      {POINTS.map((point, index) => (
        <motion.span
          key={index}
          className="absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fa520f]"
          style={{ left: `calc(50% + ${point.x}px)`, top: `calc(50% + ${point.y}px)` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: reveal ? 1 : 0.25, scale: 1 }}
          transition={{ delay: index * 0.018, duration: 0.35, ease: EASE }}
        />
      ))}
    </div>
  );
}

function Magnifier() {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10"
      initial={{ opacity: 0, x: GLASS_X[0], y: GLASS_Y[0] }}
      animate={{ opacity: 1, x: GLASS_X, y: GLASS_Y }}
      transition={{
        opacity: { duration: 0.3 },
        x: { duration: INSPECT_MS / 1000, times: [0, 0.34, 0.68, 1], ease: "easeInOut" },
        y: { duration: INSPECT_MS / 1000, times: [0, 0.34, 0.68, 1], ease: "easeInOut" },
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className="relative size-[96px] overflow-hidden rounded-full border border-[#fa520f] bg-white/70 dark:bg-[#120F17]/70">
          <motion.div
            className="absolute left-1/2 top-1/2"
            initial={{ x: -GLASS_X[0] * ZOOM, y: -GLASS_Y[0] * ZOOM, scale: ZOOM }}
            animate={{
              x: GLASS_X.map((value) => -value * ZOOM),
              y: GLASS_Y.map((value) => -value * ZOOM),
            }}
            transition={{ duration: INSPECT_MS / 1000, times: [0, 0.34, 0.68, 1], ease: "easeInOut" }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              {POINTS.map((point, index) => (
                <span
                  key={index}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `calc(50% + ${point.x}px)`, top: `calc(50% + ${point.y}px)` }}
                >
                  <span className="mx-auto block size-1.5 rounded-full bg-[#fa520f]" />
                  <span className="mt-0.5 block font-mono text-[7px] leading-none text-slate-500 dark:text-slate-400">
                    {point.value}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
        <span className="absolute left-[86px] top-[86px] h-[28px] w-px origin-top-left rotate-45 bg-[#fa520f]" />
      </div>
    </motion.div>
  );
}

interface EmbeddingScanAnimationProps {
  open: boolean;
  onComplete: () => void;
  durationMs?: number;
  leftText?: string;
  rightText?: string;
}

export default function EmbeddingScanAnimation({
  open,
  onComplete,
  durationMs = TOTAL_MS,
}: EmbeddingScanAnimationProps) {
  const [stage, setStage] = useState<Stage>("scan");

  useEffect(() => {
    if (!open) {
      setStage("scan");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const scale = durationMs / TOTAL_MS;
    const t1 = window.setTimeout(() => setStage("embed"), SCAN_MS * scale);
    const t2 = window.setTimeout(() => setStage("inspect"), (SCAN_MS + EMBED_MS) * scale);
    const t3 = window.setTimeout(onComplete, durationMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [open, onComplete, durationMs]);

  const caption =
    stage === "scan" ? "Scanning" : stage === "embed" ? "Embedding" : "Inspecting";

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-white/90 px-6 backdrop-blur-sm dark:bg-[#030206]/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          role="status"
          aria-live="polite"
          aria-label={caption}
        >
          <div className="relative h-[220px] w-full max-w-md">
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-10"
              animate={{
                opacity: stage === "inspect" ? 0 : stage === "embed" ? 0.2 : 1,
                scale: stage === "embed" ? 0.92 : 1,
              }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Doc label="Problem" scan={stage === "scan"} />
              <Doc label="Solution" scan={stage === "scan"} />
            </motion.div>

            <AnimatePresence>
              {stage !== "scan" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <div className="relative">
                    <DotField reveal={stage === "embed"} />
                    {stage === "inspect" && <Magnifier />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-8 text-xs font-medium tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
            {caption}
          </p>
          <div className="mt-4 h-px w-24 overflow-hidden bg-slate-200 dark:bg-white/10">
            <motion.div
              className="h-full bg-[#fa520f]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: durationMs / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}
