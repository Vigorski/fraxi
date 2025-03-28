import { IconType } from 'types/icons';

export const IconDirection: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline`}
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M12.2734 0.726562L1.71094 5.60156C0.492188 6.16016 0.898438 7.96289 2.19336 7.96289H6.66211V12.4316C6.66211 13.7266 8.46484 14.1328 9.02344 12.9141L13.8984 2.35156C14.3047 1.38672 13.2383 0.320312 12.2734 0.726562Z" />
    </svg>
  );
};
