import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useUnreadNotificationCount } from "../../hooks/queries/useUnreadNotificationCount";

/** Renders the given dot style only while there are unread notifications. */
const UnreadDot = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { data: unreadCount } = useUnreadNotificationCount();

  if (!unreadCount || unreadCount <= 0) {
    return null;
  }

  return <View style={style} />;
};

export default UnreadDot;
