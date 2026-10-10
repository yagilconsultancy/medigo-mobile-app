import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import {
  X,
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
  Car,
  CreditCard,
  Share2,
  Download,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { FONT_SIZES } from "../../../constants/sizes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRideDetail } from "../../../hooks/queries/useRideDetails";
import { format } from "date-fns";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDisplayText } from "../../../utils/formatText";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getReceiptHtml = (receipt: any) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #0f172a; padding: 32px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
        h1 { margin: 0 0 6px; font-size: 28px; }
        .muted { color: #64748b; }
        .badge { color: #047857; font-weight: 700; background: #ecfdf5; display: inline-block; padding: 8px 12px; border-radius: 10px; }
        .section { margin-top: 24px; }
        .section-title { color: #2563eb; font-size: 13px; font-weight: 800; letter-spacing: .8px; margin-bottom: 12px; }
        .row { display: flex; justify-content: space-between; gap: 24px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .label { color: #64748b; }
        .value { font-weight: 650; text-align: right; }
        .address { padding: 12px 0; }
        .total { font-size: 22px; color: #2563eb; font-weight: 800; }
        .footer { margin-top: 36px; text-align: center; color: #94a3b8; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>MediGo Receipt</h1>
          <div class="muted">Trip #${escapeHtml(receipt.tripId)}</div>
        </div>
        <div class="badge">PAYMENT COMPLETE</div>
      </div>

      <div class="section">
        <div class="section-title">TRIP DETAILS</div>
        <div class="row"><div class="label">Date</div><div class="value">${escapeHtml(receipt.date)}</div></div>
        <div class="row"><div class="label">Time</div><div class="value">${escapeHtml(receipt.time)}</div></div>
        <div class="address"><div class="label">Pickup</div><div class="value" style="text-align:left">${escapeHtml(receipt.pickup)}</div></div>
        <div class="address"><div class="label">Destination</div><div class="value" style="text-align:left">${escapeHtml(receipt.destination)}</div></div>
        <div class="row"><div class="label">Driver</div><div class="value">${escapeHtml(receipt.driver)}</div></div>
        <div class="row"><div class="label">Service Type</div><div class="value">${escapeHtml(receipt.serviceType)}</div></div>
        <div class="row"><div class="label">Ride Type</div><div class="value">${escapeHtml(receipt.rideType)}</div></div>
      </div>

      <div class="section">
        <div class="section-title">FARE BREAKDOWN</div>
        <div class="row"><div class="label">Base Fare</div><div class="value">${escapeHtml(receipt.baseFare)}</div></div>
        <div class="row"><div class="label">Service Fee</div><div class="value">${escapeHtml(receipt.serviceFee)}</div></div>
        <div class="row"><div class="label">Total</div><div class="total">${escapeHtml(receipt.total)}</div></div>
      </div>

      <div class="section">
        <div class="section-title">PAYMENT</div>
        <div class="row"><div class="label">Paid with</div><div class="value">${escapeHtml(receipt.paymentMethod)}</div></div>
      </div>

      <div class="footer">Questions about this receipt? Contact support@getmedigo.com</div>
    </body>
  </html>
`;

const ReceiptScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const rideId = route.params?.rideId;
  const { data, isLoading } = useRideDetail(rideId);
  const [isSharing, setIsSharing] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const ride: any = data?.data;
  const scheduledAt = ride?.scheduled_at ? new Date(ride.scheduled_at) : null;
  const baseFareAmount = Number(ride?.estimated_fare ?? 0);
  const totalAmount = Number(ride?.final_fare ?? ride?.estimated_fare ?? 0);
  const serviceFeeAmount = Math.max(totalAmount - baseFareAmount, 0);
  const receipt = {
    tripId: ride?.id ? String(ride.id).slice(0, 8).toUpperCase() : "N/A",
    date: scheduledAt ? format(scheduledAt, "MMM dd, yyyy") : "N/A",
    time: scheduledAt ? format(scheduledAt, "hh:mm a") : "N/A",
    pickup: ride?.pickup_address ?? "N/A",
    destination: ride?.destination_address ?? "N/A",
    driver: ride?.driver_name ?? "N/A",
    serviceType: formatDisplayText(ride?.trip_type) || "N/A",
    rideType: formatDisplayText(ride?.ride_type) || "N/A",
    baseFare: formatPrice(baseFareAmount, true),
    serviceFee: formatPrice(serviceFeeAmount, true),
    total: formatPrice(totalAmount, true),
    paymentMethod: ride?.payment_method ?? "Paid online",
    fileName: `medigo-receipt-${ride?.id ? String(ride.id).slice(0, 8) : "ride"}.pdf`,
  };

  const createReceiptPdf = async () => {
    const result = await Print.printToFileAsync({
      html: getReceiptHtml(receipt),
      base64: false,
    });
    const documentDirectory = FileSystem.documentDirectory;

    if (!documentDirectory) {
      return result.uri;
    }

    const destinationUri = `${documentDirectory}${receipt.fileName}`;

    await FileSystem.copyAsync({
      from: result.uri,
      to: destinationUri,
    });

    return destinationUri;
  };

  const shareReceipt = async () => {
    if (!ride) return;

    try {
      setIsSharing(true);
      const uri = await createReceiptPdf();

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Receipt ready", `PDF saved to ${uri}`);
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share MediGo receipt",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Share failed", "Unable to share this receipt right now.");
    } finally {
      setIsSharing(false);
    }
  };

  const downloadReceipt = async () => {
    if (!ride) return;

    try {
      setIsDownloading(true);
      const uri = await createReceiptPdf();

      if (
        Platform.OS === "android" &&
        FileSystem.StorageAccessFramework?.requestDirectoryPermissionsAsync
      ) {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const fileUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              receipt.fileName,
              "application/pdf",
            );

          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          Alert.alert("Downloaded", "Receipt PDF saved successfully.");
          return;
        }
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Save MediGo receipt",
          UTI: "com.adobe.pdf",
        });
        return;
      }

      Alert.alert("Downloaded", `Receipt PDF saved to ${uri}`);
    } catch (error) {
      Alert.alert("Download failed", "Unable to download this receipt right now.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!rideId) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
      >
        <StatusBar
          barStyle={theme === "light" ? "dark-content" : "light-content"}
        />
        <View style={styles.emptyState}>
          <Text style={[commonStyling.title, styles.emptyTitle]}>
            Receipt unavailable
          </Text>
          <Text style={[commonStyling.subtitle, styles.emptyText]}>
            This receipt needs a ride ID.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.emptyButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
      >
        <ActivityIndicator color={colors.primaryColor} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      {/* Header with Close Button */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: FONT_SIZES.TITLE2,
                fontFamily: "Bold",
              },
            ]}
          >
            Receipt
          </Text>
          <Text
            style={[
              styles.tripId,
              commonStyling.subtitle,
              {
                color: colors.textSecondary,
                fontSize: FONT_SIZES.BODY,
              },
            ]}
          >
            Trip #{receipt.tripId}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <X color={colors.textSecondary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Payment Status Badge */}
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.successBadge,
              {
                backgroundColor: colors.darkGreen,
              },
            ]}
          >
            <Text style={styles.successBadgeText}>✓ PAYMENT COMPLETE</Text>
          </View>
        </View>

        {/* TRIP DETAILS Section */}
        <SectionHeader
          icon={<FileText size={16} color="#3B82F6" />}
          title="TRIP DETAILS"
        />

        <DetailRow
          icon={<Calendar size={18} color="#64748B" />}
          label="Date"
          value={receipt.date}
        />
        <DetailRow
          icon={<Clock size={18} color="#64748B" />}
          label="Time"
          value={receipt.time}
        />

        {/* Pickup/Destination Timeline */}
        <View style={styles.timelineRow}>
          <View style={styles.timelineGraphic}>
            <View style={styles.dotBlue} />
            <View style={styles.line} />
            <View style={styles.dotBlue} />
          </View>
          <View style={styles.addressWrapper}>
            <View>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: FONT_SIZES.SMALL,
                  },
                ]}
              >
                PICKUP
              </Text>
              <Text
                style={[
                  styles.addressText,
                  commonStyling.title,
                  {
                    fontSize: FONT_SIZES.SMALL,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                {receipt.pickup}
              </Text>
            </View>
            <View style={[{ marginTop: 16 }]}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: FONT_SIZES.SMALL,
                  },
                ]}
              >
                DESTINATION
              </Text>
              <Text
                style={[
                  styles.addressText,
                  commonStyling.title,
                  {
                    fontSize: FONT_SIZES.SMALL,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                {receipt.destination}
              </Text>
            </View>
          </View>
        </View>

        <DetailRow
          icon={<User size={18} color="#64748B" />}
          label="Driver"
          value={receipt.driver}
        />
        <DetailRow
          icon={<Car size={18} color="#64748B" />}
          label="Service Type"
          value={receipt.serviceType}
        />
        <DetailRow
          icon={<Car size={18} color="#64748B" />}
          label="Ride Type"
          value={receipt.rideType}
        />

        <View
          style={[
            styles.sectionDivider,
            { backgroundColor: colors.lightPrimaryBlueBorder },
          ]}
        />

        {/* FARE BREAKDOWN Section */}
        <SectionHeader
          icon={<CreditCard size={16} color="#3B82F6" />}
          title="FARE BREAKDOWN"
        />

        <View
          style={[
            styles.breakdownCard,
            {
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        >
          <View style={styles.fareRow}>
            <Text style={[commonStyling.subtitle]}>Base Fare</Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: FONT_SIZES.BODY,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {receipt.baseFare}
            </Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={[commonStyling.subtitle]}>Service Fee</Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: FONT_SIZES.BODY,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {receipt.serviceFee}
            </Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.fareRow}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: FONT_SIZES.BODY,
                  fontFamily: "Bold",
                },
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: FONT_SIZES.TITLE,
                  color: colors.primaryColor,
                  fontFamily: "Bold",
                },
              ]}
            >
              {receipt.total}
            </Text>
          </View>
        </View>

        {/* Payment Method Card */}
        <View
          style={[
            styles.paymentMethodCard,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          <View style={styles.iconBox}>
            <CreditCard color="#3B82F6" size={20} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.paidWithLabel}>Paid with</Text>
            <Text
              style={[
                commonStyling.title,
                {
                  color: colors.primaryColor,
                  fontSize: FONT_SIZES.BODY,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {receipt.paymentMethod}
            </Text>
          </View>
        </View>

        <Text style={styles.footerContact}>
          Questions about this receipt? Contact support@getmedigo.com
        </Text>
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[
          styles.footerActions,
          {
            backgroundColor: colors.surfacePrimary,
            borderTopColor: colors.lightPrimaryBlueBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={shareReceipt}
          disabled={isSharing || isDownloading}
        >
          {isSharing ? (
            <ActivityIndicator color={colors.titleText} />
          ) : (
            <>
              <Share2 color={colors.titleText} size={20} />
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: FONT_SIZES.SUBTITLE,
                  },
                ]}
              >
                Share
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filledButton}
          onPress={downloadReceipt}
          disabled={isSharing || isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Download color="#FFF" size={20} />
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: FONT_SIZES.SUBTITLE,
                    color: "#ffffff",
                  },
                ]}
              >
                Download PDF
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SectionHeader = ({ icon, title }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View style={styles.sectionHeader}>
      {icon}
      <Text
        style={[
          styles.sectionHeaderText,
          commonStyling.title,
          {
            fontSize: FONT_SIZES.BODY,
            fontFamily: "SemiBold",
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const DetailRow = ({ icon, label, value }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  return (
    <View style={styles.detailRow}>
      <View>{icon}</View>
      <View style={{ marginLeft: 12 }}>
        <Text
          style={[
            styles.rowLabel,
            commonStyling.subtitle,
            {
              fontSize: FONT_SIZES.BODY,
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.rowValue,
            commonStyling.title,
            {
              fontSize: FONT_SIZES.BODY,
              fontFamily: "SemiBold",
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    alignItems: "center",
  },
  tripId: { marginTop: 2 },
  closeButton: { padding: 8 },

  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  badgeContainer: { marginBottom: 32 },
  successBadge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  successBadgeText: { color: "#10B981", fontSize: 12, fontWeight: "700" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionHeaderText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  rowLabel: { fontSize: 12, color: "#94A3B8" },
  rowValue: { fontSize: 15, fontWeight: "700", color: "#1E293B", marginTop: 2 },

  timelineRow: { flexDirection: "row", marginBottom: 20 },
  timelineGraphic: { width: 20, alignItems: "center", marginTop: 6 },
  dotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" },
  line: { width: 1, flex: 1, backgroundColor: "#E2E8F0", marginVertical: 4 },
  addressWrapper: { flex: 1, marginLeft: 12 },
  addressLabel: { fontSize: 10, color: "#94A3B8", letterSpacing: 1 },
  addressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 2,
  },

  sectionDivider: { height: 1, marginVertical: 24 },

  breakdownCard: { borderRadius: 16, padding: 20 },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  totalDivider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  paidWithLabel: { fontSize: 12, color: "#3B82F6" },

  footerContact: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 24,
  },

  footerActions: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  filledButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  filledButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ReceiptScreen;
