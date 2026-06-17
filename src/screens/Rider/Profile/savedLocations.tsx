import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Plus, Star } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { useSavedLocations } from "../../../hooks/queries/useSavedLocations";
import { format } from "date-fns";
import LocationCard from "../../../components/cards/locationCard";
import { getLocationTypeStyles } from "../../../utils/getLocationTypeStyles";
import { SavedLocationsSkeleton } from "../../../components/skelentonAnimation/savedLocationsSkelenton";

const SavedLocationsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { data, isLoading } = useSavedLocations();

  const savedLocations = data?.data || [];
  const favoriteLocations = savedLocations.filter((loc) => loc.is_default);
  const regularLocations = savedLocations.filter((loc) => !loc.is_default);

  if (isLoading) {
    return <SavedLocationsSkeleton />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="Saved Locations" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text
          style={[
            styles.description,
            commonStyling.subtitle,
            { fontSize: 14, fontFamily: "Medium" },
          ]}
        >
          Manage your favorite pickup and destination locations
        </Text>

        {/* Action: Add New Location */}
        <TouchableOpacity
          style={[
            styles.addLocationCard,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
          onPress={() =>
            navigation.navigate("RiderProfileContentsStack", {
              screen: "AddLocationScreen",
            })
          }
        >
          <View style={styles.plusIconWrapper}>
            <Plus size={24} color="#3B82F6" />
          </View>
          <View style={styles.textContent}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontFamily: "Bold",
                  fontSize: 16,
                  color: colors.primaryColor,
                },
              ]}
            >
              Add New Location
            </Text>
            <Text
              style={[
                styles.addSub,
                commonStyling.subtitle,
                { fontFamily: "Medium", fontSize: 14 },
              ]}
            >
              Save a new pickup or destination
            </Text>
          </View>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primaryColor}
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            {/* --- FAVORITES SECTION --- */}
            {favoriteLocations.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text
                    style={[
                      styles.sectionLabel,
                      commonStyling.title,
                      { fontSize: 13, fontFamily: "Bold" },
                    ]}
                  >
                    FAVORITES
                  </Text>
                </View>
                {favoriteLocations.map((loc) => {
                  const { icon, bg } = getLocationTypeStyles(loc.location_type);
                  return (
                    <LocationCard
                      key={loc.id}
                      icon={icon}
                      bgColor={bg}
                      title={loc.label}
                      address={loc.address}
                      lastUsed={`Updated ${format(new Date(loc.updated_at), "MMM d, yyyy")}`}
                      isFavorite={true}
                      onPress={() =>
                        navigation.navigate("LocationDetailsScreen", {
                          locationId: loc.id,
                        })
                      }
                    />
                  );
                })}
              </>
            )}

            {/* --- ALL LOCATIONS SECTION --- */}
            <Text
              style={[
                styles.sectionLabel,
                commonStyling.title,
                { fontSize: 13, fontFamily: "Bold", marginVertical: 12 },
              ]}
            >
              ALL LOCATIONS
            </Text>
            {regularLocations.length > 0
              ? regularLocations.map((loc) => {
                  const { icon, bg } = getLocationTypeStyles(loc.location_type);
                  return (
                    <LocationCard
                      key={loc.id}
                      icon={icon}
                      bgColor={bg}
                      title={loc.label}
                      address={loc.address}
                      lastUsed={`Saved ${format(new Date(loc.created_at), "MMM d, yyyy")}`}
                      onPress={() =>
                        navigation.navigate("LocationDetailsScreen", {
                          locationId: loc.id,
                        })
                      }
                    />
                  );
                })
              : !favoriteLocations.length && (
                  <Text
                    style={[
                      commonStyling.subtitle,
                      { textAlign: "center", marginTop: 20 },
                    ]}
                  >
                    No saved locations yet.
                  </Text>
                )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  description: {
    marginBottom: 24,
    textAlign: "left",
  },

  addLocationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  plusIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: { flex: 1, marginLeft: 16 },
  addSub: { marginTop: 4 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLabel: {
    letterSpacing: 0.5,
    marginLeft: 8,
  },

  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  locationAddress: { marginTop: 4 },
  lastUsedText: { marginTop: 4 },
});

export default SavedLocationsScreen;
