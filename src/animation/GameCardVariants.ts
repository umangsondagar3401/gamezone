import type { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.8,
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.33, 1, 0.68, 1],
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};
