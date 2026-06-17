import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";
import Location from "../../../assets/icons/location";
import { fetchPlaceDetails } from "../../utils/googlePlaces";
import Constants from "expo-constants";
import LoadingSpinner from "../reuseables/loadingSpinner";

export interface Coordinates {
  latitude: number;
  longitude: number;
  address: string;
  place_id: string;
}

export interface PredictionItem {
  description: string;
  place_id: string;
}

export interface GoogleInputProps {
  placeholder: string;
  borderColor?: string;

  inputValue: string;
  setinputValue: (val: string) => void;

  predictions?: PredictionItem[];
  setPredictions?: (predictions: PredictionItem[]) => void;

  onPlaceSelected: (coords: Coordinates) => void;
  onPress?: () => void;
  dropdown: boolean;
  onFocus?: () => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export default function GoogleInput({
  placeholder,
  inputValue,
  setinputValue,
  predictions,
  setPredictions,
  onPlaceSelected,
  onPress,
  dropdown,
  onFocus,
  setLoading,
  loading,
}: GoogleInputProps) {
  const { colors } = useTheme();

  // 🔹 Fallback internal predictions when not passed from outside
  const [localPredictions, setLocalPredictions] = useState<PredictionItem[]>(
    [],
  );

  const finalPredictions = predictions ?? localPredictions;
  const finalSetPredictions = setPredictions ?? setLocalPredictions;

  const GOOGLE_KEY = Constants.expoConfig?.extra?.expoPublicGoogleKey;

  /** 🔍 Fetch autocomplete predictions */
  const fetchPredictionsFn = useCallback(
    async (text: string) => {
      if (text.length < 2) {
        finalSetPredictions([]);
        return;
      }

      setLoading(true);

      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text,
        )}&key=${GOOGLE_KEY}`;

        const res = await fetch(url);
        const json = await res.json();
        finalSetPredictions(json.predictions || []);
      } catch (e) {
        console.warn("Autocomplete error:", e);
      } finally {
        setLoading(false);
      }
    },
    [finalSetPredictions],
  );

  const handlePlaceDetails = async (placeId: string) => {
    const result = await fetchPlaceDetails(placeId, GOOGLE_KEY);

    if (!result) return;

    const resultWithId: Coordinates = {
      ...result,
      place_id: placeId,
    };

    onPlaceSelected(resultWithId);
  };

  return (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: colors.surfaceSecondary,
        },
      ]}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.titleText}
        value={inputValue}
        onChangeText={(text) => {
          setinputValue(text);

          fetchPredictionsFn(text);
        }}
        onFocus={onFocus}
        style={[
          styles.searchInput,
          {
            color: colors.subTitleText,
          },
        ]}
      />

      <View style={styles.iconButton}>
        {loading ? (
          <LoadingSpinner color={colors.krGreen} />
        ) : (
          <Location color={colors.titleText} />
        )}
      </View>

      {/* 🔽 Autocomplete Dropdown */}
      {dropdown && finalPredictions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={finalPredictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionRow}
                onPress={() => {
                  setinputValue(item.description);
                  finalSetPredictions([]);
                  handlePlaceDetails(item.place_id);
                  onPress?.();
                }}
              >
                <Text style={styles.predictionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    paddingRight: 40,
    marginBottom: 16,
  },
  input: {
    height: 36,
    fontSize: FONT_SIZES.BODY,
    fontFamily: "Regular",
    padding: 0,
    margin: 0,
  },
  iconButton: {
    position: "absolute",
    right: 15,
    top: 14,
  },
  dropdown: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "white",
    elevation: 5,
    zIndex: 999,
    borderRadius: 8,
    paddingVertical: 4,
    maxHeight: 250,
  },
  predictionRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 0.4,
    borderBottomColor: "#eee",
  },
  predictionText: {
    fontSize: 14,
    color: "#222",
  },
  searchInput: { flex: 1, fontSize: 15, paddingRight: 20 },
  searchContainer: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
