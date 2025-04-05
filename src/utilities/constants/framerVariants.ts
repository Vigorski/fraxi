import { Variants } from "framer-motion";

export const mainContainerVariants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

export const itemVariants: Variants = {
  initial: { y: 20, opacity: 0 },
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const sideMenuOverlayVariants: Variants = {
	hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

export const sideMenuContentVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
		transition: {
      type: "tween",
      duration: 0.1,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

export const sideMenuItemVariants: Variants = {
  hidden: { 
		opacity: 0,
		y: -10
	},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      stiffness: 100,
      damping: 15
    },
  },
};