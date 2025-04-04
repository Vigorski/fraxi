import { IconType } from 'types/icons';

export const IconBriefcase: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline svg-outlined`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
			strokeWidth='2px'>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
			<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
};
