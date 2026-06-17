import { Dimensions, PixelRatio } from "react-native";
import { getFontSize } from "../utils/fontSize";

export const SCREEN_HEIGHT: number = Dimensions.get("window").height;
export const SCREEN_WIDTH: number = Dimensions.get("window").width;

export const windowHeight = (height: number | string): number => {
  if (!height) {
    return 0;
  }

  const parsed = parseFloat(height.toString());
  const tempHeight = SCREEN_HEIGHT * (parsed / 667);

  return PixelRatio.roundToNearestPixel(tempHeight);
};

export const windowWidth = (width: number | string): number => {
  if (!width) {
    return 0;
  }

  const parsed = parseFloat(width.toString());
  const tempWidth = SCREEN_WIDTH * (parsed / 480);

  return PixelRatio.roundToNearestPixel(tempWidth);
};

export const FONT_SIZES = {
  TINY: getFontSize(10),
  SMALL: getFontSize(11),
  BODY: getFontSize(12),
  SUBTITLE: getFontSize(14),
  BODYTITLE: getFontSize(18),
  BUTTONTEXT: getFontSize(16),
  BUTTON: getFontSize(16),
  TITLE: getFontSize(20),
  TITLE2: getFontSize(23),
  TITLE3: getFontSize(24),
  HERO: getFontSize(32),
  HERO2: getFontSize(36),
};
