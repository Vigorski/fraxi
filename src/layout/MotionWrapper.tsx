import { motion } from 'framer-motion';
import { FC, ReactElement } from 'react';
import { mainContainerVariants } from 'utilities/constants/framerVariants';

type MotionWrapperOwnProps = {
  children: ReactElement;
	className?: string;
  as?: keyof JSX.IntrinsicElements;
};

const MotionWrapper: FC<MotionWrapperOwnProps> = ({
  children,
  as = 'section',
  ...props
}) => {
	const Tag = motion[as as keyof typeof motion];

  return (
    <Tag
      variants={mainContainerVariants}
      initial="initial"
      animate="visible"
      exit="hidden"
      {...props}>
      {children}
    </Tag>
  );
};

export default MotionWrapper;
