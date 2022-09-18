import { JSX } from "https://esm.sh/v94/preact@10.11.0/jsx-runtime/src/index.d.ts";

const LOGO_SIZE = 40;

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  // size in pixels
  size?: number;
}

export default function TremTecLogo({
  size = LOGO_SIZE,
  ...props
}: Props) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <circle
          cx="130.5"
          cy="136.5"
          r="101.5"
          stroke="#0B1427"
          strokeWidth="12"
        />
        <path
          d="M0 128.978L12.146 111.693L128.467 90.2044L118.19 106.088L78.0146 114.029V182.234L64.4671 185.036V116.832L15.4161 125.708L0 128.978Z"
          fill="#0B1527"
          stroke="#353535"
        />
        <path
          d="M127.066 104.686L139.212 87.4015L255.533 65.9124L245.255 81.7956L205.08 89.7372V157.942L191.533 160.745V92.5402L142.482 101.416L127.066 104.686Z"
          fill="#0B1527"
          stroke="#353535"
        />
        <path
          d="M0 218.204L12.6131 200.453L256 154.672L245.723 170.555L0 218.204Z"
          fill="#0B1427"
          stroke="#353535"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="256" height="256" rx="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
