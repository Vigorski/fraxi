import { IconType } from 'types/icons';

export const IconPassword: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline svg-outlined`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
			strokeWidth="2px">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
};