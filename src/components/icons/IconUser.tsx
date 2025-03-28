import { IconType } from 'types/icons';

export const IconUser: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24">
      <path
        d="M12,13.5c3.7,0,6.8-3,6.8-6.8C18.8,3,15.7,0,12,0C8.3,0,5.3,3,5.3,6.8C5.3,10.5,8.3,13.5,12,13.5z M18,15h-2.6
            c-1,0.5-2.2,0.8-3.4,0.8c-1.2,0-2.4-0.2-3.4-0.8H6c-3.3,0-6,2.7-6,6v0.8C0,23,1,24,2.3,24h19.5c1.2,0,2.3-1,2.3-2.3V21
            C24,17.7,21.3,15,18,15z"
      />
    </svg>
  );
};
