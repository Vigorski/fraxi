import { IconType } from 'types/icons';

export const IconChevronBack: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline svg-outlined`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      strokeWidth="48px">
      <polyline points="328 112 184 256 328 400" />
    </svg>
  );
};
