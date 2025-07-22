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
    scale: 1.09,
    rotate: -3,
    boxShadow: "0 6px 24px 0 #a5b4fc44",
    transition: { type: "spring", bounce: 0.6, duration: 0.25 },
  },
  tap: { scale: 0.96, rotate: 2, transition: { duration: 0.1 } },
  selected: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderColor: "#4f46e5",
  },
  unselected: {
    backgroundColor: "#fff",
    color: "#1e293b",
    borderColor: "#d1d5db",
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
    scale: 1.04,
    boxShadow: "0 6px 24px 0 #6366f144",
    transition: { type: "spring", bounce: 0.5, duration: 0.2 },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};
