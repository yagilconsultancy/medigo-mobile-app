import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

function ProfileSettings() {
  const { colors } = useTheme();
  return (
    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <Path
        d="M23 28.0233C18.9068 27.8327 14.7667 28.8127 11.1551 30.9632C8.32561 32.648 0.906729 36.0882 5.42532 40.3931C7.63262 42.496 10.091 44 13.1817 44H24"
        stroke={colors.buttonPrimaryText}
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M31 13C31 17.9706 26.9706 22 22 22C17.0294 22 13 17.9706 13 13C13 8.02944 17.0294 4 22 4C26.9706 4 31 8.02944 31 13Z"
        stroke={colors.buttonPrimaryText}
        stroke-width="3"
      />
      <Path
        d="M36 41.4286V44M36 41.4286C33.6864 41.4286 31.6481 40.2922 30.4526 38.5666M36 41.4286C38.3136 41.4286 40.3519 40.2922 41.5474 38.5666M36 28.5714C38.3137 28.5714 40.3522 29.708 41.5476 31.4338M36 28.5714C33.6863 28.5714 31.6478 29.708 30.4524 31.4338M36 28.5714V26M44 29.8571L41.5476 31.4338M28.0008 40.1429L30.4526 38.5666M28 29.8571L30.4524 31.4338M43.9992 40.1429L41.5474 38.5666M41.5476 31.4338C42.2545 32.4542 42.6667 33.6807 42.6667 35C42.6667 36.3195 42.2544 37.5461 41.5474 38.5666M30.4524 31.4338C29.7455 32.4542 29.3333 33.6807 29.3333 35C29.3333 36.3195 29.7456 37.5461 30.4526 38.5666"
        stroke={colors.buttonPrimaryText}
        stroke-width="3"
        stroke-linecap="round"
      />
    </Svg>
  );
}

export default ProfileSettings;
