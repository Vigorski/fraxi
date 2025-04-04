import { IconType } from 'types/icons';

export const IconRoute: IconType = ({ className }) => {
  return (
    <svg
      className={`${className || ''} svg-inline svg-outlined`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      strokeWidth="32">
      <polyline points="400 304 448 352 400 400" /><polyline points="400 112 448 160 400 208" /><path d="M64,352h85.19a80,80,0,0,0,66.56-35.62L256,256" /><path d="M64,160h85.19a80,80,0,0,1,66.56,35.62l80.5,120.76A80,80,0,0,0,362.81,352H416" /><path d="M416,160H362.81a80,80,0,0,0-66.56,35.62L288,208" />
    </svg>
  );
};


