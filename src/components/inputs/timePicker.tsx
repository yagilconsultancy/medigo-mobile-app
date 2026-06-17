import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";

const ITEM_HEIGHT = 40;
const SCREEN_WIDTH = Dimensions.get("window").width;

interface TimePickerProps {
  initialHour?: number;
  initialMinute?: number;
  onChange?: (time: string) => void;
  selectedDate?: string;
  minMinutesFromNow?: number;
}

// Get current time in device's local timezone (correct for all Canadian provinces)
const getLocalNow = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
};

// Parse a YYYY-MM-DD string as local date (not UTC)
const parseLocalDateString = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
};

const TimePicker: React.FC<TimePickerProps> = ({
  initialHour,
  initialMinute,
  onChange,
  selectedDate,
  minMinutesFromNow = 20,
}) => {
  const { colors } = useTheme();

  // Check if selected date is today using local timezone
  const isToday = useCallback((): boolean => {
    if (!selectedDate) return false;
    const localNow = getLocalNow();
    const selected = parseLocalDateString(selectedDate);
    return (
      selected.year === localNow.year &&
      selected.month === localNow.month &&
      selected.day === localNow.day
    );
  }, [selectedDate]);

  // Calculate minimum allowed time in local timezone
  const getMinTime = useCallback(() => {
    if (!isToday()) return { hour: 0, minute: 0 };

    const now = new Date();
    const minTime = new Date(now.getTime() + minMinutesFromNow * 60 * 1000);
    return {
      hour: minTime.getHours(),
      minute: minTime.getMinutes(),
    };
  }, [isToday, minMinutesFromNow]);

  const getAvailableHours = useCallback((): number[] => {
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    if (!isToday()) return allHours;
    const { hour: minHour } = getMinTime();
    return allHours.filter((h) => h >= minHour);
  }, [isToday, getMinTime]);

  const getAvailableMinutes = useCallback(
    (hour: number): number[] => {
      const allMinutes = Array.from({ length: 60 }, (_, i) => i);
      if (!isToday()) return allMinutes;

      const { hour: minHour, minute: minMinute } = getMinTime();
      if (hour === minHour) {
        return allMinutes.filter((m) => m >= minMinute);
      }
      if (hour > minHour) return allMinutes;
      return [];
    },
    [isToday, getMinTime],
  );

  // Calculate valid initial hour
  const getInitialHour = useCallback((): number => {
    const hours = getAvailableHours();
    if (hours.length === 0) return 0;

    const { hour: minHour } = getMinTime();
    const preferred = initialHour ?? getLocalNow().hour;

    if (!isToday()) return preferred;
    return preferred >= minHour ? preferred : minHour;
  }, [initialHour, isToday, getMinTime, getAvailableHours]);

  // Calculate valid initial minute
  const getInitialMinute = useCallback(
    (hour: number): number => {
      const minutes = getAvailableMinutes(hour);
      if (minutes.length === 0) return 0;

      const { hour: minHour, minute: minMinute } = getMinTime();
      const preferred = initialMinute ?? getLocalNow().minute;

      if (!isToday()) return preferred;
      if (hour === minHour) {
        return preferred >= minMinute ? preferred : minMinute;
      }
      return preferred;
    },
    [initialMinute, isToday, getMinTime, getAvailableMinutes],
  );

  const hours = getAvailableHours();
  const [selectedHour, setSelectedHour] = useState<number>(getInitialHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(() =>
    getInitialMinute(getInitialHour()),
  );

  const hourRef = useRef<ScrollView>(null);
  const minuteRef = useRef<ScrollView>(null);
  const initialScrollDone = useRef(false);

  // Scroll to correct position on mount
  useEffect(() => {
    if (initialScrollDone.current) return;

    const hourIndex = hours.indexOf(selectedHour);
    const minuteList = getAvailableMinutes(selectedHour);
    const minuteIndex = minuteList.indexOf(selectedMinute);

    const timer = setTimeout(() => {
      if (hourIndex >= 0) {
        hourRef.current?.scrollTo({
          y: hourIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
      if (minuteIndex >= 0) {
        minuteRef.current?.scrollTo({
          y: minuteIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
      initialScrollDone.current = true;

      // Fire initial onChange so parent has correct value
      if (onChange) {
        const formatted = `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;
        onChange(formatted);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // When selectedDate changes, revalidate selected time
  useEffect(() => {
    const availableHours = getAvailableHours();
    let newHour = selectedHour;
    let newMinute = selectedMinute;
    let changed = false;

    if (!availableHours.includes(selectedHour)) {
      newHour = availableHours[0] ?? 0;
      changed = true;
    }

    const availableMinutes = getAvailableMinutes(newHour);
    if (!availableMinutes.includes(selectedMinute)) {
      newMinute = availableMinutes[0] ?? 0;
      changed = true;
    }

    if (changed) {
      setSelectedHour(newHour);
      setSelectedMinute(newMinute);

      const hourIndex = availableHours.indexOf(newHour);
      const minuteIndex = availableMinutes.indexOf(newMinute);

      setTimeout(() => {
        if (hourIndex >= 0) {
          hourRef.current?.scrollTo({
            y: hourIndex * ITEM_HEIGHT,
            animated: true,
          });
        }
        if (minuteIndex >= 0) {
          minuteRef.current?.scrollTo({
            y: minuteIndex * ITEM_HEIGHT,
            animated: true,
          });
        }
      }, 100);

      if (onChange) {
        const formatted = `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
        onChange(formatted);
      }
    }
  }, [selectedDate]);

  // When hour changes, revalidate minutes
  useEffect(() => {
    const availableMinutes = getAvailableMinutes(selectedHour);
    if (!availableMinutes.includes(selectedMinute)) {
      const newMinute = availableMinutes[0] ?? 0;
      setSelectedMinute(newMinute);

      const minuteIndex = availableMinutes.indexOf(newMinute);
      setTimeout(() => {
        if (minuteIndex >= 0) {
          minuteRef.current?.scrollTo({
            y: minuteIndex * ITEM_HEIGHT,
            animated: true,
          });
        }
      }, 50);

      if (onChange) {
        const formatted = `${String(selectedHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
        onChange(formatted);
      }
    }
  }, [selectedHour]);

  const onScrollEnd = (
    e: any,
    list: number[],
    setter: (n: number) => void,
    type: "hour" | "minute",
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, list.length - 1));
    const value = list[clampedIndex];

    setter(value);

    if (onChange) {
      const hour = type === "hour" ? value : selectedHour;
      const minute = type === "minute" ? value : selectedMinute;
      const formatted = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      onChange(formatted);
    }
  };

  const renderList = (list: number[], selectedValue: number) =>
    list.map((item, index) => (
      <View key={index} style={styles.item}>
        <Text
          style={[
            styles.itemText,
            { color: colors.inputText },
            selectedValue === item && [
              styles.selectedText,
              { color: colors.titleText },
            ],
          ]}
        >
          {String(item).padStart(2, "0")}
        </Text>
      </View>
    ));

  const minutes = getAvailableMinutes(selectedHour);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.stroke,
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <View
        style={[styles.centerHighlight, { backgroundColor: colors.lightGray }]}
      />

      {/* Hours */}
      <ScrollView
        ref={hourRef}
        style={styles.scrollColumn}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScrollEndDrag={(e) =>
          onScrollEnd(e, hours, setSelectedHour, "hour")
        }
        onMomentumScrollEnd={(e) =>
          onScrollEnd(e, hours, setSelectedHour, "hour")
        }
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 1.5 }}
      >
        {renderList(hours, selectedHour)}
      </ScrollView>

      {/* Separator */}
      <View style={styles.separator}>
        <Text style={[styles.separatorText, { color: colors.titleText }]}>
          :
        </Text>
      </View>

      {/* Minutes */}
      <ScrollView
        ref={minuteRef}
        style={styles.scrollColumn}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScrollEndDrag={(e) =>
          onScrollEnd(e, minutes, setSelectedMinute, "minute")
        }
        onMomentumScrollEnd={(e) =>
          onScrollEnd(e, minutes, setSelectedMinute, "minute")
        }
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 1.5 }}
      >
        {renderList(minutes, selectedMinute)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * 4,
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.7,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 50,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollColumn: {
    flex: 1,
  },
  itemText: {
    fontSize: 20,
    fontFamily: "Medium",
  },
  selectedText: {
    fontFamily: "Medium",
  },
  centerHighlight: {
    position: "absolute",
    height: ITEM_HEIGHT,
    width: "100%",
    top: "50%",
    left: "28%",
    marginTop: -ITEM_HEIGHT / 2,
    zIndex: -1,
    borderRadius: 5,
  },
  separator: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  separatorText: {
    fontSize: 20,
    fontFamily: "Medium",
  },
});

export default TimePicker;
