"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

interface CursorPillProps {
  isVisible: boolean;
  label?: string;
  mouseX: number;
  mouseY: number;
}

export function CursorPill({
  isVisible,
  label = "View case ↗",
  mouseX,
  mouseY,
}: CursorPillProps) {
  const x = useMotionValue(mouseX);
  const y = useMotionValue(mouseY);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    x.set(mouseX);
    y.set(mouseY);
  }, [mouseX, mouseY, x, y]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{ duration: 0.2 }}
      style={{
        left: smoothX,
        top: smoothY,
        transform: "translate(-50%, -50%)",
      }}
      className="pointer-events-none fixed z-50 hidden md:flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold tracking-tight text-[#050507] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <span>{label}</span>
    </motion.div>
  );
}
