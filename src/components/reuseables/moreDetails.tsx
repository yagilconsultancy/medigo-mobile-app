import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import DetailItem from "./detailItem";
import Car from "../../../assets/icons/car";
import Share from "../../../assets/icons/share";
import QuestionMark from "../../../assets/icons/questionMark";
import RightArrow from "../../../assets/icons/rightArrow";
import Attention from "../../../assets/icons/attention";
import EmergencySOSIcon from "../../../assets/icons/emergencySOSIcon";
import { useNavigation } from "@react-navigation/native";
import ModalComponent from "../modals/modal";
import Buttons from "../buttons/buttons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTriggerSOS } from "../../hooks/mutations/useRide";

interface TripProps {
  tripType?: string;
  pickUp: string;
  dropOff: string;
  tripId: string;
  driverId: string;
}

export default function MoreDetails({
  tripType,
  pickUp,
  dropOff,
  tripId,
  driverId,
}: TripProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const { mutate: triggerSOS, isPending } = useTriggerSOS();

  const handleSOSPress = () => {
    triggerSOS(
      {
        trip_id: tripId,
        notes: "Emergency triggered from Main Screen",
      },
      {
        onSuccess: (data) => {
          setShowSosModal(false);
          navigation.navigate("LocalAuthorities");
        },
        onError: (error) => {
          console.error("SOS UI Error:", error);
        },
      },
    );
  };

  return (
    <View>
      <View>
        <Text
          style={[
            commonStyling.title,
            {
              marginBottom: 12,
            },
          ]}
        >
          More Details
        </Text>
      </View>

      {/* Share ride */}
      <DetailItem
        title="Share ride details"
        iconLeft={<Car color={colors.krGreen} fill={false} />}
        iconRight={<Share />}
        onPress={() =>
          navigation.navigate("ShareTripProgress", {
            pickUp,
            dropOff,
            tripId,
            driverId,
          })
        }
        colors={colors}
      />

      {tripType !== "Along trip" && (
        <View>
          <DetailItem
            title="Chat support"
            iconLeft={<QuestionMark color={colors.krGreen} />}
            iconRight={<RightArrow />}
            onPress={() => {}}
            colors={colors}
          />

          {/* Report driver */}
          <DetailItem
            title="Report Driver"
            iconLeft={<Attention color={colors.krGreen} />}
            iconRight={<RightArrow />}
            onPress={() => navigation.navigate("ReportDriver", { tripId })}
            colors={colors}
          />

          {/* Emergency SOS */}
          <DetailItem
            title="Emergency SOS"
            iconLeft={<EmergencySOSIcon />}
            iconRight={<RightArrow />}
            onPress={() => setShowSosModal(true)}
            colors={colors}
          />
        </View>
      )}
      {/* SOS Modal */}
      <ModalComponent
        visible={showSosModal}
        onClose={() => setShowSosModal(false)}
        title="Activate Emergency SOS"
      >
        <Text style={[commonStyling.subtitle, styles.modalSubtitle]}>
          Your live location and trip details will be shared with your emergency
          contacts and local authorities for immediate help.
        </Text>

        <View>
          <Buttons
            type="danger"
            title="Send SOS alert"
            onPress={handleSOSPress}
            loading={isPending}
          />
        </View>
      </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  modalSubtitle: {
    marginBottom: 20,
    marginTop: 16,
  },
});
