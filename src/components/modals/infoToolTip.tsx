// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   LayoutChangeEvent,
// } from "react-native";
// import ToolTipArrow from "../../../assets/icons/tooltipArrow";
// import { FONT_SIZES } from "../../constants/sizes";

// interface TooltipProps {
//   text: string;
//   top: number;
//   left: number;
//   children: React.ReactNode;
// }

// export default function InfoToolTip({
//   text,
//   children,
//   top,
//   left,
// }: TooltipProps) {
//   const [visible, setVisible] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const [iconPos, setIconPos] = useState({ x: 0, y: 0 });
//   const [tooltipWidth, setTooltipWidth] = useState(0);

//   const toggleTooltip = () => {
//     if (visible) {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 120,
//         useNativeDriver: true,
//       }).start(() => setVisible(false));
//     } else {
//       setVisible(true);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 120,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   const onIconLayout = (e: LayoutChangeEvent) => {
//     const { x, y } = e.nativeEvent.layout;
//     setIconPos({ x, y });
//   };

//   return (
//     <View style={{ position: "relative" }}>
//       {/* Icon */}
//       <TouchableOpacity onPress={toggleTooltip} onLayout={onIconLayout}>
//         {children}
//       </TouchableOpacity>

//       {/* Tooltip */}
//       {visible && (
//         <Animated.View
//           style={[
//             styles.tooltipContainer,
//             {
//               opacity: fadeAnim,
//             },
//           ]}
//         >
//           <View
//             style={[
//               styles.tooltipBox,
//               {
//                 top: top,
//                 left: left,
//               },
//             ]}
//             onLayout={(e) => setTooltipWidth(e.nativeEvent.layout.width)}
//           >
//             <Text style={styles.tooltipText}>{text}</Text>

//             <View
//               style={{
//                 position: "absolute",
//                 bottom: -10,
//                 right: 83,
//               }}
//             >
//               <ToolTipArrow />
//             </View>
//           </View>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tooltipContainer: {
//     zIndex: 999,
//   },

//   tooltipBox: {
//     backgroundColor: "#111",
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     width: 200,
//     position: "absolute",
//     zIndex: 999,
//   },

//   tooltipText: {
//     color: "white",
//     fontSize: FONT_SIZES.SMALL,
//     textAlign: "center",
//   },

//   arrow: {
//     alignSelf: "center",
//     width: 0,
//     height: 0,
//     marginTop: 6,
//     borderLeftWidth: 7,
//     borderRightWidth: 7,
//     borderTopWidth: 7,
//     borderLeftColor: "transparent",
//     borderRightColor: "transparent",
//     borderTopColor: "#111", // Arrow color
//   },
// });

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import ToolTipArrow from "../../../assets/icons/tooltipArrow";
import { FONT_SIZES } from "../../constants/sizes";

const TOOLTIP_WIDTH = 200;

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function InfoToolTip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const showTooltip = () => {
    // measure gives us the icon's position relative to the screen
    iconRef.current?.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => {
        setTooltipPos({
          // Center tooltip above the icon
          left: pageX + width / 50 - TOOLTIP_WIDTH / 1.95,
          // Place it above the icon with a small gap
          top: pageY - height - 57,
        });

        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }).start();
      },
    );
  };

  const hideTooltip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const toggleTooltip = () => {
    if (visible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };

  return (
    <View>
      <TouchableOpacity ref={iconRef} onPress={toggleTooltip} hitSlop={10}>
        {children}
      </TouchableOpacity>

      {/* Rendered in a Modal so it floats above everything — no zIndex issues */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={hideTooltip}
      >
        {/* Tapping outside dismisses the tooltip */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={hideTooltip}
        >
          <Animated.View
            style={[
              styles.tooltipBox,
              {
                opacity: fadeAnim,
                top: tooltipPos.top,
                left: tooltipPos.left,
              },
            ]}
          >
            <Text style={styles.tooltipText}>{text}</Text>

            <View
              style={{
                position: "absolute",
                bottom: -10,
                right: 83,
              }}
            >
              <ToolTipArrow />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  tooltipBox: {
    position: "absolute",
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    width: TOOLTIP_WIDTH,
  },
  tooltipText: {
    color: "white",
    fontSize: FONT_SIZES.SMALL,
    textAlign: "center",
  },
  arrow: {
    alignSelf: "center",
    marginTop: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#111",
  },
});
