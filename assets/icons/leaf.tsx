import Svg, { Path } from "react-native-svg";

interface LeafProps {
  color: string;
  width?: number | string;
  height?: number | string;
}

const Leaf: React.FC<LeafProps> = ({ color, width = 24, height = 24 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.646 15.71C7.22103 14.8699 6.99973 13.9415 7 13C7 9.785 9.5 7.5 13 7C17.082 6.417 18.833 4.167 20 3C23.5 16 17 19 13 19C11.9469 19.0003 10.9122 18.7233 10 18.197"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M3 20.9997C3.5 17.9997 5.458 16.1357 10 14.9997C13.217 14.1957 15.463 12.1797 17 10.0547"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default Leaf;
