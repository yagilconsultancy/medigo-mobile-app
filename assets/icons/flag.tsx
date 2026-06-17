import Svg, { Path } from "react-native-svg";

function Flag() {
  return (
    <Svg width="20" height="22" viewBox="0 0 20 22" fill="none">
      <Path
        d="M0.75 20.75V12.75M0.75 12.75V1.75M0.75 12.75H4.75M0.75 1.75V0.75M0.75 1.75H12.75C13.8546 1.75 14.75 2.64543 14.75 3.75V5.75M14.75 5.75H16.75C17.8546 5.75 18.75 6.64543 18.75 7.75V15.75C18.75 16.8546 17.8546 17.75 16.75 17.75H6.75C5.64543 17.75 4.75 16.8546 4.75 15.75V12.75M14.75 5.75V10.75C14.75 11.8546 13.8546 12.75 12.75 12.75H4.75"
        stroke="#17B42F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default Flag;
