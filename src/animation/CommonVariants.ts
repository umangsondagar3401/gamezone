import type { Variants } from "framer-motion";

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (customDelay = 0.2) => ({
    opacity: 1,
    y: 0,
    transition: { delay: customDelay },
  }),
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: (customDelay = 0.1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: customDelay },
  }),
};

export const titleVariants: Variants = {
  hidden: { opacity: 0, y: -24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring", bounce: 0.3 },
  },
};

export const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.5, duration: 0.6 },
  },
  hover: {
    scale: 1.02,
    boxShadow: "var(--shadow-soft-indigo)",
    transition: { type: "spring", bounce: 0.6, duration: 0.25 },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
  selected: {
    backgroundColor: "var(--color-primary)",
    color: "var(--color-text-on-primary)",
    borderColor: "var(--color-primary)",
  },
  unselected: {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text-primary)",
    borderColor: "var(--color-border-subtle)",
  },
};

export const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.1,
      type: "spring",
      bounce: 0.22,
    },
  },
};

export const startBtnVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.5, duration: 0.7 },
  },
  hover: {
    scale: 1.03,
    boxShadow: "var(--shadow-strong-indigo)",
    transition: { type: "spring", bounce: 0.5, duration: 0.2 },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};
