import React from "react";
import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

interface CarProps {
  color: string;
  fill: boolean;
}

const Car: React.FC<CarProps> = ({ color, fill }) => {
  const { colors } = useTheme();
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20" fill="none">
      <Path
        d="M0.815707 9.66313C0.931144 9.03341 1.43891 8.38955 2.25833 7.83386C3.73376 6.83324 5.41888 6.83736 7.10557 6.77491C7.66534 6.75416 9.1684 6.74732 10.75 6.75091C12.3316 6.74732 13.8347 6.75416 14.3944 6.77491C16.0811 6.83736 17.7662 6.83324 19.2417 7.83386C20.0611 8.38955 20.5689 9.03341 20.6843 9.66313C20.7834 10.2036 20.7681 12.0584 20.6538 13.3673C20.5935 14.0573 20.5322 14.3932 20.4406 14.5344C20.1643 14.9603 19.3666 15.3185 18.1932 15.5434C17.092 15.7545 17.2557 15.75 10.75 15.75C4.24426 15.75 4.40801 15.7545 3.30683 15.5434C2.13339 15.3185 1.33573 14.9603 1.0594 14.5344C0.967843 14.3932 0.906492 14.0573 0.846197 13.3673C0.731878 12.0584 0.716602 10.2036 0.815707 9.66313Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill ? colors.buttonPrimary : "transparent"}
      />
      <Path
        d="M3.25 6.75L4.56325 2.24011C4.68387 1.94009 4.9183 1.68951 5.24868 1.57716C8.49166 0.474281 13.0083 0.474282 16.2513 1.57716C16.5817 1.68951 16.8161 1.94009 16.9368 2.24011L18.25 6.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.25 9.75L2.75 10.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.25 9.75L18.75 10.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.75 15.25L6.99567 14.6358C7.36101 13.7225 7.54368 13.2658 7.92461 13.0079C8.30553 12.75 8.79739 12.75 9.7811 12.75H11.7189C12.7026 12.75 13.1945 12.75 13.5754 13.0079C13.9563 13.2658 14.139 13.7225 14.5043 14.6358L14.75 15.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.75161 16.3123V17.1144C5.75167 17.9888 5.71338 18.1526 5.44942 18.4079C5.37218 18.4825 5.2152 18.5901 5.10062 18.6469C4.89999 18.7462 4.8327 18.75 3.27768 18.75C1.68772 18.75 1.65928 18.7483 1.41428 18.6376C1.2774 18.5757 1.10474 18.4521 1.03058 18.3628C0.768802 18.0478 0.756354 17.9549 0.753906 16.2959L0.754584 12.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill={fill ? colors.buttonPrimary : "transparent"}
      />
      <Path
        d="M15.7484 16.3123V17.1144C15.7483 17.9888 15.7866 18.1526 16.0506 18.4079C16.1278 18.4825 16.2848 18.5901 16.3994 18.6469C16.6 18.7462 16.6673 18.75 18.2223 18.75C19.8123 18.75 19.8407 18.7483 20.0857 18.6376C20.2226 18.5757 20.3953 18.4521 20.4694 18.3628C20.7312 18.0478 20.7436 17.9549 20.7461 16.2959L20.7454 12.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill={fill ? colors.buttonPrimary : "transparent"}
      />
      <Path
        d="M18.75 6.75L20.25 6.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.75 6.75L1.25 6.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Car;
