import { IconType } from 'types/icons';

export const IconEmail: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline svg-outlined`}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="32px">
      <rect x="48" y="96" width="416" height="320" rx="40" ry="40" />
      <polyline points="112 160 256 272 400 160" />
    </svg>
  );
};
