import { IconType } from 'types/icons';

export const IconBell: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 24">
      <path
        d="M10.5,24c1.6,0,3-1.3,3-3h-6C7.5,22.7,8.8,24,10.5,24z M20.6,17c-0.9-1-2.6-2.4-2.6-7.3c0-3.6-2.5-6.5-6-7.3v-1
            C12,0.7,11.3,0,10.5,0C9.7,0,9,0.7,9,1.5v1C5.5,3.2,3,6.1,3,9.8C3,14.6,1.3,16,0.4,17C0.1,17.3,0,17.7,0,18c0,0.8,0.6,1.5,1.5,1.5
            h18c0.9,0,1.5-0.7,1.5-1.5C21,17.7,20.9,17.3,20.6,17z"
      />
    </svg>
  );
};
