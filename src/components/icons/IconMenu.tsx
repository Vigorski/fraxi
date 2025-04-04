import { IconType } from 'types/icons';

export const IconMenu: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline svg-outlined`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2px">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
};
