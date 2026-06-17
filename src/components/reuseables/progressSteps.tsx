import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";

const { width } = Dimensions.get("window");

interface ProgressStepsProps {
  currentStep?: number;
  totalSteps?: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep = 1,
  totalSteps = 2,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = step <= currentStep;
        const isLast = index === steps.length - 1;

        return (
          <View key={step} style={[styles.stepWrapper, !isLast && { flex: 1 }]}>
            {/* Circle */}
            <View
              style={[
                styles.circle,
                isActive
                  ? {
                      backgroundColor: colors.krGreen,
                      borderColor: colors.krGreen,
                    }
                  : {
                      borderColor: colors.gray,
                    },
              ]}
            >
              <Text
                style={[
                  commonStyling.subtitle,
                  isActive
                    ? { color: colors.surfacePrimary }
                    : { color: colors.subTitleText },
                  {
                    fontSize: FONT_SIZES.SMALL,
                  },
                ]}
              >
                {step}
              </Text>
            </View>

            {/* Line (except last) */}
            {!isLast && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: isActive ? colors.krGreen : colors.gray,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default ProgressSteps;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  line: {
    flex: 1,
    height: 2,
  },
});
