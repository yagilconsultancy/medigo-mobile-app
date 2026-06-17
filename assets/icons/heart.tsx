import React from "react";
import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

const Heart: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Svg width={22} height={19} viewBox="0 0 22 19" fill="none">
      <Path
        d="M15.75 3.88896C16.8545 3.88896 17.75 4.78439 17.75 5.88896M10.75 3.0915L11.4351 2.38897C13.566 0.203679 17.0209 0.203677 19.1518 2.38896C21.2255 4.51557 21.2892 7.94277 19.2961 10.1489L13.5697 16.4871C12.0484 18.171 9.45154 18.171 7.93026 16.4871L2.20393 10.1489C0.210783 7.94279 0.2745 4.51559 2.3482 2.38898C4.47912 0.20369 7.93404 0.203692 10.065 2.38898L10.75 3.0915Z"
        stroke={colors.buttonPrimary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Heart;
