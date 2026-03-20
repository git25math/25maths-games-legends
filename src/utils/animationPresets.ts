import type { MotionProps, Variants } from "motion/react";

// --- Tactical Curves ---
const energyEase = [0.22, 1, 0.36, 1]; // Fast out, slow in

// --- Page Warp: Deep Dive Transition ---
export const pageWarp: Variants = {
  initial: { scale: 1.15, opacity: 0, filter: 'blur(20px) brightness(1.5)' },
  animate: { 
    scale: 1, 
    opacity: 1, 
    filter: 'blur(0px) brightness(1)',
    transition: { duration: 0.8, ease: energyEase } 
  },
  exit: { 
    scale: 0.9, 
    opacity: 0, 
    filter: 'blur(10px) brightness(0)',
    transition: { duration: 0.4, ease: 'easeIn' } 
  }
};

// --- Terminal Assembly: Staggered HUD Entrance ---
export const terminalEntrance: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.5, ease: energyEase, staggerChildren: 0.08 } 
  }
};

export const tapScale: MotionProps = {
  whileTap: { scale: 0.95 },
};

export const hoverGlow: MotionProps = {
  whileHover: { 
    scale: 1.02, 
    boxShadow: "0 0 20px rgba(79, 70, 229, 0.3)",
    filter: 'brightness(1.1)'
  },
};

export const springIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: energyEase }
};

export const buttonBase: MotionProps = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.03 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

export const INPUT_FOCUS_CLASS = "focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 focus:outline-none";

export const DURATION = {
  quick: 0.15,
  normal: 0.3,
  slow: 0.5,
  entrance: 0.8,
} as const;

export const VICTORY_TIMING = {
  dimScreen: 300,
  shockwave: 600,
  badgeDrop: 1400,
  statsReveal: 2200,
  skillBadge: 3000,
  returnButton: 4000,
} as const;

export const BATTLE_TIMING = {
  advance: 600,
  shieldVictory: 300,
  defeatSound: 400,
  shake: 500,
} as const;

