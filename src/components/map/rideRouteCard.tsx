import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import EditIcon from "../../../assets/icons/edit";
import AddIcon from "../../../assets/icons/add";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";
import { MapPin } from "lucide-react-native";

type RideRouteCardProps = {
  pickup?: string;
  destination?: string;
  stops?: string[];

  showPickupEdit?: boolean;
  showDestinationEdit?: boolean;
  showAddStop?: boolean;
  showStops?: boolean;
  showStopsEdit?: boolean;
  onAddStop?: () => void;
  onEditPickup?: () => void;
  onEditDestination?: () => void;
  onEditStop?: (stopId: string) => void;
};

export default function RideRouteCard({
  pickup,
  destination,
}: RideRouteCardProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View>
      <View style={styles.locationRow}>
        <View style={styles.locationIconBgBlue}>
          <MapPin size={16} color="#2563EB" fill="#2563EB" />
        </View>
        <View style={styles.locationTextContainer}>
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 12,
                marginBottom: 4,
              },
            ]}
          >
            Pickup
          </Text>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 13,
                fontFamily: "SemiBold",
              },
            ]}
            numberOfLines={2}
          >
            {pickup}
          </Text>
        </View>
      </View>

      <View style={styles.routeLine} />

      <View style={styles.locationRow}>
        <View style={styles.locationIconBgYellow}>
          <MapPin size={16} color="#EAB308" fill="#EAB308" />
        </View>
        <View style={styles.locationTextContainer}>
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 12,
                marginBottom: 4,
              },
            ]}
          >
            Destination
          </Text>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 13,
                fontFamily: "SemiBold",
              },
            ]}
            numberOfLines={2}
          >
            {destination}
          </Text>
        </View>
      </View>
    </View>
  );
}

const RAIL_WIDTH = 36;
const DOT_OUTER = 20;
const DOT_INNER = 8;
const MID_OUTER = 18;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  leftRail: {
    width: RAIL_WIDTH,
    alignItems: "center",
  },
  railLine: {
    position: "absolute",
    top: 32,
    width: 2,
    left: RAIL_WIDTH / 2 - 1,
  },
  circleRow: {
    width: RAIL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  topOuterRing: {
    width: DOT_OUTER,
    height: DOT_OUTER,
    borderRadius: DOT_OUTER / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  topWhiteRing: {
    width: DOT_OUTER - 8,
    height: DOT_OUTER - 8,
    borderRadius: (DOT_OUTER - 8) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  topInnerDot: {
    width: DOT_INNER,
    height: DOT_INNER,
    borderRadius: DOT_INNER / 2,
  },
  middleOuterRing: {
    width: MID_OUTER,
    height: MID_OUTER,
    borderRadius: MID_OUTER / 2,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  middleInner: {
    width: MID_OUTER - 8,
    height: MID_OUTER - 8,
    borderRadius: (MID_OUTER - 8) / 2,
  },
  bottomOuterRing: {
    width: DOT_OUTER,
    height: DOT_OUTER,
    borderRadius: DOT_OUTER / 2,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomInner: {
    width: DOT_OUTER - 8,
    height: DOT_OUTER - 8,
    borderRadius: (DOT_OUTER - 8) / 2,
  },
  content: {
    flex: 1,
    paddingLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: FONT_SIZES.BODY,
  },
  iconBtn: {
    padding: 6,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  locationIconBgBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  locationIconBgYellow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEFCE8",
    justifyContent: "center",
    alignItems: "center",
  },
  locationTextContainer: { flex: 1 },

  routeLine: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginLeft: 16,
    marginVertical: 4,
  },
});
