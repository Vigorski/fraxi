type VariantProperties = number | string | { [key: string]: number | string };

type CommonVariants = {
  [key: string]: { [key: string]: VariantProperties };
};

export const mainContainerVariants: CommonVariants = {
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

export const itemVariants: CommonVariants = {
  initial: { y: 20, opacity: 0 },
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
