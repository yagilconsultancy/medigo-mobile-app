import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomInUp,
  ZoomOutDown,
} from "react-native-reanimated";
import { Calendar } from "react-native-calendars";
import useTheme from "../../hooks/useThemes";
import DownArrow from "../../../assets/icons/downArrow";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";

interface DatePickerProps {
  date?: string;
  setDate: (value: string) => void;
  setShowCalendar: (value: boolean) => void;
  visible: boolean;
  onPress: () => void;
  minAge?: number;
  minDate?: string;
  maxDate?: string;
}

// Add this helper at the top of the file outside the component
const parseLocalDate = (dateString: string): Date => {
  // Append T00:00:00 to force local time interpretation instead of UTC
  if (dateString.length === 10) {
    return new Date(`${dateString}T00:00:00`);
  }
  return new Date(dateString);
};

const CalendarComponent: React.FC<DatePickerProps> = ({
  date,
  setDate,
  setShowCalendar,
  visible,
  onPress,
  minAge,
  minDate,
  maxDate,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const [currentDate, setCurrentDate] = useState(
    date || new Date().toISOString().split("T")[0],
  );

  const parsedDate = parseLocalDate(currentDate);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  let calculatedMaxDate = maxDate;
  if (minAge) {
    const maxBirthDate = new Date();
    maxBirthDate.setFullYear(maxBirthDate.getFullYear() - minAge);

    calculatedMaxDate = `${maxBirthDate.getFullYear()}-${String(maxBirthDate.getMonth() + 1).padStart(2, "0")}-${String(maxBirthDate.getDate()).padStart(2, "0")}`;
  }

  const getYearRange = () => {
    let startYear = 1950;
    let endYear = new Date().getFullYear();

    if (minAge) {
      endYear = new Date().getFullYear() - minAge;
      startYear = endYear - 100;
    } else if (minDate && maxDate) {
      startYear = parseLocalDate(minDate).getFullYear();
      endYear = parseLocalDate(maxDate).getFullYear();
    }

    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i,
    ).reverse();
  };

  const years = getYearRange();

  const months = [
    { month: "January", label: "Jan" },
    { month: "February", label: "Feb" },
    { month: "March", label: "Mar" },
    { month: "April", label: "Apr" },
    { month: "May", label: "May" },
    { month: "June", label: "June" },
    { month: "July", label: "July" },
    { month: "August", label: "Aug" },
    { month: "September", label: "Sep" },
    { month: "October", label: "Oct" },
    { month: "November", label: "Nov" },
    { month: "December", label: "Dec" },
  ];

  const currentYear = parsedDate.getFullYear();
  const currentMonth = parsedDate.getMonth();

  const handleYearSelect = (year: number) => {
    const currentDay = parsedDate.getDate();
    const newDate = new Date(year, currentMonth, currentDay);
    const localDateString = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(newDate.getDate()).padStart(2, "0")}`;
    setCurrentDate(localDateString);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const currentDay = parsedDate.getDate();
    const newDate = new Date(currentYear, monthIndex, currentDay);
    const localDateString = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(newDate.getDate()).padStart(2, "0")}`;
    setCurrentDate(localDateString);
    setShowMonthPicker(false);
  };

  const CustomHeader = (props: any) => {
    const headerDate = parseLocalDate(currentDate);
    const year = headerDate.getFullYear();
    const month = months[headerDate.getMonth()];

    return (
      <View
        style={{
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.stroke,
        }}
      >
        <View style={[styles.headerContainer, { borderColor: colors.stroke }]}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                borderRightWidth: 1,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRightColor: colors.stroke,
              },
            ]}
            onPress={() => {
              setShowYearPicker(false);
              setShowMonthPicker(true);
            }}
          >
            <Text
              style={{
                color: colors.subTitleText,
                fontSize: FONT_SIZES.SUBTITLE,
                fontFamily: "Regular",
              }}
            >
              {month.label}
            </Text>
            <DownArrow />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setShowMonthPicker(false);
              setShowYearPicker(true);
            }}
          >
            <Text
              style={{
                color: colors.subTitleText,
                fontSize: FONT_SIZES.SUBTITLE,
                fontFamily: "Regular",
              }}
            >
              {year}
            </Text>
            <DownArrow />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={() => {
        // If a picker is open, close it first; otherwise close the calendar
        if (showYearPicker) return setShowYearPicker(false);
        if (showMonthPicker) return setShowMonthPicker(false);
        setShowCalendar(false);
      }}
    >
      {/* 2. Animate the backdrop fade separately */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={[commonStyling.overlay, StyleSheet.absoluteFill]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (showYearPicker) return setShowYearPicker(false);
            if (showMonthPicker) return setShowMonthPicker(false);
            setShowCalendar(false);
          }}
        />

        <Animated.View
          entering={ZoomInUp.springify().mass(0.5).damping(15).stiffness(120)}
          exiting={ZoomOutDown.duration(150)}
        >
          <View
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Calendar
              key={currentDate}
              style={[
                styles.calendar,
                {
                  borderWidth: 1,
                  borderColor: colors.stroke,
                  backgroundColor: colors.surfacePrimary,
                },
              ]}
              current={currentDate}
              minDate={minDate}
              maxDate={calculatedMaxDate || maxDate}
              onDayPress={(day) => {
                setDate(day.dateString);
                setCurrentDate(day.dateString);
                setShowCalendar(false);
                onPress();
              }}
              theme={{
                backgroundColor: colors.surfacePrimary,
                calendarBackground: colors.surfacePrimary,
                dayTextColor: colors.titleText,
                textDayFontFamily: "Regular",
                textDayFontSize: FONT_SIZES.BODY,
              }}
              markedDates={
                date
                  ? {
                      [date]: {
                        selected: true,
                        selectedColor: colors.krGreen,
                        selectedTextColor: "#fff",
                      },
                    }
                  : {}
              }
              customHeader={CustomHeader}
              onMonthChange={(month) => {
                setCurrentDate(month.dateString);
              }}
            />

            {/* Render Pickers LAST so they naturally sit on top */}
            {showYearPicker && (
              <View
                style={[
                  styles.pickerOverlay,
                  { backgroundColor: colors.surfacePrimary },
                ]}
              >
                <Text style={[commonStyling.title, { marginBottom: 12 }]}>
                  Select Year
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => handleYearSelect(year)}
                      style={[
                        styles.pickerItem,
                        year === currentYear && {
                          backgroundColor: colors.krGreen,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          year === currentYear && { color: "#fff" },
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {showMonthPicker && (
              <View
                style={[
                  styles.pickerOverlay,
                  { backgroundColor: colors.surfacePrimary },
                ]}
              >
                <Text style={[commonStyling.title, { marginBottom: 12 }]}>
                  Select Month
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month.month}
                      onPress={() => handleMonthSelect(index)}
                      style={[
                        styles.pickerItem,
                        index === currentMonth && {
                          backgroundColor: colors.krGreen,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          index === currentMonth && { color: "#fff" },
                        ]}
                      >
                        {month.month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 12,
    elevation: 4,
    width: 330,
    backgroundColor: "white",
  },
  // Sits flush over the calendar card, same size
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject, // Better than manual top/left/right/bottom
    borderRadius: 12,
    padding: 20,
    zIndex: 999, // For iOS
    elevation: 10, // CRITICAL FOR ANDROID
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: "55%",
    marginVertical: 16,
    borderRadius: 50,
    padding: 4,
  },
  headerButton: {
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    width: "50%",
    paddingVertical: 4,
  },
  scrollView: {
    marginTop: 4,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  pickerItemText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default CalendarComponent;
