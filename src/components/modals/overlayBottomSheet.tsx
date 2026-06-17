// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useRef,
//   ReactNode,
//   useEffect,
// } from "react";
// import {
//   Animated,
//   PanResponder,
//   StyleSheet,
//   View,
//   ViewStyle,
//   StyleProp,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import useTheme from "../../hooks/useThemes";
// import { commonStyles } from "../../styles/commonStyles";

// export interface OverlayBottomSheetRef {
//   open: () => void;
//   close: () => void;
// }

// type Props = {
//   height: number;
//   children: ReactNode;
//   style?: StyleProp<ViewStyle>;
//   overlay?: boolean;
//   minimumHeight?: number;
//   backgroundColor?: string;
//   initialOpen?: boolean; // New prop to prevent glitch
// };

// const OverlayBottomSheet = forwardRef<OverlayBottomSheetRef, Props>(
//   (
//     {
//       height,
//       children,
//       style,
//       overlay = true,
//       minimumHeight,
//       backgroundColor,
//       initialOpen = false,
//     },
//     ref,
//   ) => {
//     const insets = useSafeAreaInsets();
//     const { colors } = useTheme();
//     const commonStyling = commonStyles(colors);

//     const getClosedPosition = () => {
//       if (minimumHeight !== undefined) return height - minimumHeight;
//       return height + 50;
//     };

//     const closedPosition = getClosedPosition();

//     // Fix: Initialize the value based on the starting state
//     const translateY = useRef(
//       new Animated.Value(initialOpen ? 0 : closedPosition),
//     ).current;
//     const overlayOpacity = useRef(
//       new Animated.Value(
//         initialOpen
//           ? minimumHeight !== undefined
//             ? 0.6
//             : 1
//           : minimumHeight !== undefined
//             ? 0.4
//             : 0,
//       ),
//     ).current;

//     const isOpen = useRef(initialOpen);

//     const open = () => {
//       isOpen.current = true;
//       Animated.parallel([
//         Animated.spring(translateY, {
//           toValue: 0,
//           useNativeDriver: true,
//           tension: 40,
//           friction: 9,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: minimumHeight !== undefined ? 0.6 : 1,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     };

//     const close = () => {
//       isOpen.current = false;
//       Animated.parallel([
//         Animated.spring(translateY, {
//           toValue: closedPosition,
//           useNativeDriver: true,
//           tension: 40,
//           friction: 8,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: minimumHeight !== undefined ? 0.4 : 0,
//           duration: 150,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     };

//     useImperativeHandle(ref, () => ({ open, close }));

//     const panResponder = useRef(
//       PanResponder.create({
//         onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
//         onPanResponderGrant: () => {
//           translateY.stopAnimation();
//         },
//         onPanResponderMove: (_, g) => {
//           if (!isOpen.current) return;
//           if (g.dy > 0) {
//             const newValue = Math.min(g.dy, closedPosition);
//             translateY.setValue(newValue);
//           }
//         },
//         onPanResponderRelease: (_, g) => {
//           const threshold =
//             minimumHeight !== undefined ? closedPosition * 0.4 : height * 0.25;
//           if (g.dy > threshold || g.vy > 1.1) {
//             close();
//           } else {
//             open();
//           }
//         },
//       }),
//     ).current;

//     useEffect(() => {
//       // Sync position if height/minHeight change, but only if not open
//       if (!isOpen.current) {
//         translateY.setValue(closedPosition);
//       }
//     }, [height, minimumHeight]);

//     return (
//       <View style={StyleSheet.absoluteFill}>
//         {overlay && (
//           <Animated.View
//             style={[
//               StyleSheet.absoluteFillObject,
//               commonStyling.overlay,
//               { opacity: overlayOpacity },
//             ]}
//             pointerEvents={
//               isOpen.current || minimumHeight !== undefined ? "auto" : "none"
//             }
//           />
//         )}

//         <Animated.View
//           // Performance optimization for Android
//           renderToHardwareTextureAndroid={true}
//           style={[
//             styles.sheet,
//             style,
//             {
//               height: height + insets.bottom,
//               transform: [{ translateY }],
//               backgroundColor: backgroundColor || colors.lightGray,
//             },
//           ]}
//         >
//           <View {...panResponder.panHandlers} style={styles.handleBarContainer}>
//             <View
//               style={[styles.handleBar, { backgroundColor: colors.gray }]}
//             />
//           </View>

//           <View style={{ flex: 1 }}>{children}</View>
//         </Animated.View>
//       </View>
//     );
//   },
// );

// const styles = StyleSheet.create({
//   sheet: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     paddingHorizontal: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   handleBarContainer: {
//     paddingTop: 12,
//     paddingBottom: 10,
//     alignItems: "center",
//   },
//   handleBar: {
//     width: 40,
//     height: 5,
//     borderRadius: 3,
//   },
// });

// export default OverlayBottomSheet;

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  ReactNode,
  useEffect,
  useState, // Added useState
} from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableWithoutFeedback, // Added for tap-to-close
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";

export interface OverlayBottomSheetRef {
  open: () => void;
  close: () => void;
}

type Props = {
  height: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  overlay?: boolean;
  minimumHeight?: number;
  backgroundColor?: string;
  initialOpen?: boolean;
};

const OverlayBottomSheet = forwardRef<OverlayBottomSheetRef, Props>(
  (
    {
      height,
      children,
      style,
      overlay = true,
      minimumHeight,
      backgroundColor,
      initialOpen = false,
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const commonStyling = commonStyles(colors);

    // Track state in state variable to trigger re-renders for pointerEvents
    const [active, setActive] = useState(initialOpen);

    const getClosedPosition = () => {
      if (minimumHeight !== undefined) return height - minimumHeight;
      return height + 100; // Extra padding to ensure it's off-screen
    };

    const closedPosition = getClosedPosition();
    const translateY = useRef(
      new Animated.Value(initialOpen ? 0 : closedPosition),
    ).current;
    const overlayOpacity = useRef(
      new Animated.Value(initialOpen ? 1 : 0),
    ).current;

    const open = () => {
      setActive(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 9,
        }),
        Animated.timing(overlayOpacity, {
          toValue: minimumHeight !== undefined ? 0.6 : 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const close = () => {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: closedPosition,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setActive(false));
    };

    useImperativeHandle(ref, () => ({ open, close }));

    const panResponder = useRef(
      PanResponder.create({
        // Start responding if the user drags down
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
        onPanResponderMove: (_, g) => {
          // Only allow dragging downwards
          if (g.dy > 0) {
            translateY.setValue(g.dy);
          }
        },
        onPanResponderRelease: (_, g) => {
          // If dragged more than 20% of the height or swiped fast
          if (g.dy > height * 0.2 || g.vy > 0.5) {
            close();
          } else {
            open();
          }
        },
      }),
    ).current;

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={active ? "auto" : "none"}
      >
        {overlay && (
          <TouchableWithoutFeedback onPress={close}>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                commonStyling.overlay,
                {
                  opacity: overlayOpacity,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        <Animated.View
          renderToHardwareTextureAndroid={true}
          style={[
            styles.sheet,
            style,
            {
              height: height + insets.bottom,
              transform: [{ translateY }],
              backgroundColor: colors.surfacePrimary,
            },
          ]}
        >
          {/* Draggable Handle Area */}
          <View {...panResponder.panHandlers} style={styles.handleBarContainer}>
            <View
              style={[styles.handleBar, { backgroundColor: colors.stroke }]}
            />
          </View>

          <View style={{ flex: 1 }}>{children}</View>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  handleBarContainer: {
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
});

export default OverlayBottomSheet;
