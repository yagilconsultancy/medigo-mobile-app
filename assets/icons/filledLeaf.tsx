import Svg, { Path } from "react-native-svg";

interface LeafProps {
  color: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
}

const FilledLeaf: React.FC<LeafProps> = ({
  color,
  width = 24,
  height = 24,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
      <Path
        d="M7.19483 16.9467C6.6282 15.8265 6.33313 14.5887 6.3335 13.3333C6.3335 9.04667 9.66683 6 14.3335 5.33333C19.7762 4.556 22.1108 1.556 23.6668 0C28.3335 17.3333 19.6668 21.3333 14.3335 21.3333C12.9293 21.3337 11.5498 20.9644 10.3335 20.2627"
        fill={color}
      />
      <Path
        d="M1.00024 23.9996C1.66691 19.9996 4.27758 17.5142 10.3336 15.9996C14.6229 14.9276 17.6176 12.2396 19.6669 9.40625"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default FilledLeaf;
