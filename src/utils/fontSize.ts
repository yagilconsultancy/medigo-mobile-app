import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;

export const getFontSize = (size: number) => {
  const scale = SCREEN_WIDTH / guidelineBaseWidth;
  const newSize = size * scale;
  
  // Use roundToNearestPixel to avoid blurry text on high-density screens
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};