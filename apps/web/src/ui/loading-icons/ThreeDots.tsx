import { SVGProps } from "react";

function ThreeDots({ height = 30, className }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={Number(height) * 4}
      height={height}
      viewBox="0 0 120 30"
      className={className}
    >
      <circle cx="15" cy="15" r="15" fill="currentColor">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="60" cy="15" r="9" fill="currentColor">
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="0.8s"
          values="9;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="fill-opacity"
          from="0.5"
          to="0.5"
          begin="0s"
          dur="0.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="105" cy="15" r="15" fill="currentColor">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        ></animate>
      </circle>
    </svg>
  );
}

export default ThreeDots;
