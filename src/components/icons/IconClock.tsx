import { IconType } from 'types/icons';

export const IconClock: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline svg-outlined`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
			strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
};
