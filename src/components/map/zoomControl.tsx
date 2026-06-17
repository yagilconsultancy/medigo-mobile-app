import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ZoomControlProps {
  handleZoom: (isZoomingIn: boolean) => void;
  zoomLevel: number;
  MAX_ZOOM: number;
  MIN_ZOOM: number;
}

export default function ZoomControl({ handleZoom, zoomLevel, MAX_ZOOM, MIN_ZOOM }: ZoomControlProps) {

  return (
    <View style={styles.customZoomControls}>
      <TouchableOpacity
        style={styles.zoomButton}
        onPress={() => handleZoom(true)}
        disabled={zoomLevel === MAX_ZOOM}
      >
        <Text style={styles.zoomText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.zoomButton}
        onPress={() => handleZoom(false)}
        disabled={zoomLevel === MIN_ZOOM}
      >
        <Text style={styles.zoomText}>-</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  customZoomControls: {
    position: 'absolute',
    top: 60,      // ⭐ Adjust these values
    right: 30,       // ⭐ to position anywhere
    gap: 10,
  },
  zoomButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  zoomText: { fontSize: 24, fontWeight: 'bold' },

});
