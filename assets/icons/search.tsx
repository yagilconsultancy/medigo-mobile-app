import React from "react";
import Svg, { Path } from "react-native-svg";

interface SearchProps {
  color?: string;
}

const Search: React.FC<SearchProps> = ({ color = "#1F1F1F" }) => {
  return (
    <Svg width={16} height={16} viewBox="0 0 12 12" fill="none">
      <Path
        d="M11.1667 11.1667L10.1 10.1M0.5 5.56667C0.5 2.76843 2.76842 0.5 5.56666 0.5C8.36491 0.5 10.6333 2.76843 10.6333 5.56667C10.6333 8.36492 8.36491 10.6333 5.56666 10.6333C2.76842 10.6333 0.5 8.36492 0.5 5.56667Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Search;
