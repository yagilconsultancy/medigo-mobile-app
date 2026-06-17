import React, {
  forwardRef,
  useRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  ReactNode,
  useState,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type BottomSheetProps = {
  children: ReactNode;
  snapPoints: number[];
  backgroundColor?: string;
  isScrollable?: boolean;
  onHeightChange?: (height: number) => void;
};

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
  snapTo: (index?: number) => void;
};

const CustomBottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      snapPoints,
      backgroundColor,
      isScrollable = false,
      onHeightChange,
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    // State management
    const [isAtTop, setIsAtTop] = useState(true);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    // Animation refs
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const lastTranslateY = useRef(SCREEN_HEIGHT);

    // Scroll tracking refs
    const scrollOffsetY = useRef(0);
    const scrollViewRef = useRef<ScrollView>(null);

    // Gesture tracking refs
    const lastGestureDy = useRef(0);
    const isDraggingSheet = useRef(false);

    // Calculate snap points with safe area
    const { snapArray, minTranslateY, maxTranslateY } = useMemo(() => {
      const topInset = insets.top || 0;
      const bottomInset = insets.bottom || 0;
      const maxSheetHeight = SCREEN_HEIGHT - topInset;

      const adjusted = snapPoints.map((p) =>
        Math.min(Math.max(0, p - bottomInset), maxSheetHeight),
      );

      const offsets = adjusted.map((p) => Math.max(0, SCREEN_HEIGHT - p));
      const snapOffsets = offsets.map((o) => Math.max(o, topInset));

      return {
        snapArray: snapOffsets,
        minTranslateY: topInset,
        maxTranslateY: SCREEN_HEIGHT,
      };
    }, [snapPoints, insets]);

    // Optimized animation function

    const animateTo = useCallback(
      (toValue: number) => {
        Animated.spring(translateY, {
          toValue,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
          overshootClamping: true,
        }).start(() => {
          lastTranslateY.current = toValue;
        });

        // ADDED: Convert translateY offset back to a height and notify parent
        const height = SCREEN_HEIGHT - toValue;
        onHeightChange?.(height);
      },
      [translateY, onHeightChange], // ADD onHeightChange to deps
    );

    // Initialize sheet position
    useEffect(() => {
      if (snapArray.length > 0) {
        animateTo(snapArray[0]);
      }
    }, [snapArray, animateTo]);

    // Handle scroll events - optimized with useCallback
    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        scrollOffsetY.current = offsetY;

        // Update isAtTop state only when needed
        const newIsAtTop = offsetY <= 0;
        if (newIsAtTop !== isAtTop) {
          setIsAtTop(newIsAtTop);
        }
      },
      [isAtTop],
    );

    // Check if sheet is at its fully open position
    const isSheetFullyOpen = useCallback(() => {
      return Math.abs(lastTranslateY.current - snapArray[0]) < 5;
    }, [snapArray]);

    // Pan responder for sheet dragging
    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => false,

          onMoveShouldSetPanResponder: (
            _: GestureResponderEvent,
            gesture: PanResponderGestureState,
          ) => {
            const { dy } = gesture;

            // Ignore very small movements (noise)
            if (Math.abs(dy) < 5) return false;

            // If not scrollable, always handle pan
            if (!isScrollable) return true;

            const isDraggingDown = dy > 0;
            const isDraggingUp = dy < 0;
            const fullyOpen = isSheetFullyOpen();

            // CRITICAL FIX: When scrolling UP and there's scroll content above,
            // let ScrollView handle it
            if (isDraggingUp && !isAtTop && fullyOpen) {
              return false;
            }

            // When at top of scroll and dragging down, sheet takes over
            if (isAtTop && isDraggingDown && fullyOpen) {
              return true;
            }

            // If sheet is not fully open, sheet always takes over
            if (!fullyOpen) {
              return true;
            }

            // When at top of scroll and dragging up, sheet takes over
            if (isAtTop && isDraggingUp) {
              return true;
            }

            return false;
          },

          onPanResponderGrant: () => {
            isDraggingSheet.current = true;
            setScrollEnabled(false);

            translateY.stopAnimation((value) => {
              lastTranslateY.current =
                typeof value === "number" ? value : lastTranslateY.current;
            });
          },

          onPanResponderMove: (_, gesture) => {
            const { dy } = gesture;
            lastGestureDy.current = dy;

            let nextValue = lastTranslateY.current + dy;

            // Apply rubber band effect at boundaries
            if (nextValue < minTranslateY) {
              const overshoot = minTranslateY - nextValue;
              nextValue = minTranslateY - overshoot * 0.2;
            } else if (nextValue > maxTranslateY) {
              const overshoot = nextValue - maxTranslateY;
              nextValue = maxTranslateY + overshoot * 0.2;
            }

            translateY.setValue(nextValue);
          },

          onPanResponderRelease: (_, gesture) => {
            isDraggingSheet.current = false;
            setScrollEnabled(true);

            const { dy, vy } = gesture;
            const totalTarget = lastTranslateY.current + dy;

            // Fast swipe detection
            if (Math.abs(vy) > 0.5) {
              if (vy > 0) {
                // Swipe down - go to next snap point or close
                const currentIndex = snapArray.findIndex(
                  (snap) => Math.abs(snap - lastTranslateY.current) < 10,
                );
                const nextIndex = Math.min(
                  currentIndex + 1,
                  snapArray.length - 1,
                );
                animateTo(snapArray[nextIndex]);
              } else {
                // Swipe up - go to previous snap point or top
                const currentIndex = snapArray.findIndex(
                  (snap) => Math.abs(snap - lastTranslateY.current) < 10,
                );
                const prevIndex = Math.max(currentIndex - 1, 0);
                animateTo(snapArray[prevIndex]);
              }
            } else {
              // Slow drag - snap to nearest point
              const closest = snapArray.reduce((prev, curr) =>
                Math.abs(curr - totalTarget) < Math.abs(prev - totalTarget)
                  ? curr
                  : prev,
              );
              animateTo(closest);
            }
          },

          onPanResponderTerminate: () => {
            isDraggingSheet.current = false;
            setScrollEnabled(true);
          },
        }),
      [
        isScrollable,
        isAtTop,
        snapArray,
        minTranslateY,
        maxTranslateY,
        translateY,
        animateTo,
        isSheetFullyOpen,
      ],
    );

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        open: () => animateTo(snapArray[0]),
        close: () => animateTo(maxTranslateY),
        snapTo: (index = 0) => {
          const targetIndex = Math.max(
            0,
            Math.min(index, snapArray.length - 1),
          );
          animateTo(snapArray[targetIndex]);
        },
      }),
      [animateTo, snapArray, maxTranslateY],
    );

    return (
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            backgroundColor: backgroundColor ?? colors.surfacePrimary,
          },
        ]}
      >
        <View
          {...panResponder.panHandlers}
          style={[
            styles.handleContainer,
            {
              backgroundColor: backgroundColor,
              borderTopWidth: 1,
              borderTopColor: colors.stroke,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.gray }]} />
        </View>

        {/* Content area */}
        {isScrollable ? (
          <View style={styles.contentWrapper}>
            {/* Invisible pan handler overlay that only activates when needed */}
            <View
              {...panResponder.panHandlers}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="box-none"
            />

            <ScrollView
              ref={scrollViewRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              bounces={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={styles.scrollView}
              scrollEnabled={scrollEnabled && !isDraggingSheet.current}
            >
              {children}
            </ScrollView>
          </View>
        ) : (
          <View
            {...panResponder.panHandlers}
            style={[styles.contentWrapper, styles.staticContentOverlap]}
          >
            {children}
          </View>
        )}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: "hidden",
    paddingHorizontal: 20,
  },
  borderWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 10,
  },
  handleContainer: {
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    zIndex: 10,
    borderBottomWidth: 0,
    marginBottom: -50,
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
  },
  staticContentOverlap: {
    marginTop: 0,
    paddingTop: 0,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
});

export default CustomBottomSheet;
