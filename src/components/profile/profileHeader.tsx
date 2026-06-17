import React, { memo } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import Star from "../../../assets/icons/star";
import TooltipIcon from "../../../assets/icons/toolTipIcon";
import Copy from "../../../assets/icons/copy";
import ReferralProgress from "../../components/referralProgressBar";
import { UserProfileResponse } from "../../types/user.types";
import { FONT_SIZES } from "../../constants/sizes";

interface ProfileHeaderProps {
  colors: any;
  commonStyling: any;
  data: UserProfileResponse;
  ratings: number;
}

function ProfileHeader({
  colors,
  commonStyling,
  data,
  ratings,
}: ProfileHeaderProps) {
  return (
    <View style={[styles.header, { borderColor: colors.stroke }]}>
      <View style={styles.userInfo}>
        {data.profile_photo_url ? (
          <Image
            source={{ uri: data.profile_photo_url }}
            style={styles.avatar}
          />
        ) : (
          <Image
            source={require("../../../assets/images/noProfileImage.jpg")}
            style={styles.avatar}
          />
        )}
        <View>
          <Text style={commonStyling.title}>{data?.full_name}</Text>
          <View style={styles.ratingRow}>
            <Star />
            <Text style={commonStyling.subtitle}>{ratings}.00 Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.referralRow}>
        <Text style={[commonStyling.subtitle, { color: colors.titleText }]}>
          Referral points:
        </Text>
        <Text
          style={[
            commonStyling.subtitle,
            { color: colors.titleText, fontFamily: "Medium" },
          ]}
        >
          0 points
        </Text>
      </View>

      <ReferralProgress points={0} />

      <View style={styles.inviteRow}>
        <View style={styles.inviteLeft}>
          <TooltipIcon color={colors.titleText} />
          <Text
            style={[
              commonStyling.subtitle,
              { color: colors.titleText, fontSize: FONT_SIZES.BODY },
            ]}
          >
            Invite friends for more points
          </Text>
        </View>
        <View style={styles.codeRow}>
          <Text
            style={[
              commonStyling.subtitle,
              { color: colors.titleText, fontFamily: "Medium" },
            ]}
          >
            Code: KR16HS
          </Text>
          <Copy />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  avatar: {
    borderRadius: 40,
    width: 50,
    height: 50,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    marginTop: 4,
  },
  referralRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inviteRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  inviteLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
});

export default memo(ProfileHeader);
