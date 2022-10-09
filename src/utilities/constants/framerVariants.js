
export const mainContainerVariants = {
	initial: {
    y: 0,
    opacity: 0,
    scale: 0
  },
	hidden: {
    y: '100%',
    opacity: 0,
    scale: 1
  },
	visible: {
    opacity: 1,
    scale: 1,
		y: 0,
		transition: {
			delayChildren: 0.1,
			staggerChildren: 0.05,
		}
	},
};

export const itemVariants = {
	initial: { y: 20, opacity: 0  },
	hidden: { y: 0, opacity: 0  },
	visible: {
		y: 0,
		opacity: 1,
	},
};