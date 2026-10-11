import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  FileText,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import { useDriverDocuments } from "../../../hooks/queries/userDriverDocuments";
import { DocumentsSkeleton } from "../../../components/skelentonAnimation/documentsSkelenton";

const DOC_TITLES: Record<string, string> = {
  government_id_front: "Government ID (Front)",
  government_id_back: "Government ID (Back)",
  drivers_license_front: "Driver's License (Front)",
  drivers_license_back: "Driver's License (Back)",
  drivers_license: "Driver's License",
  vehicle_insurance: "Vehicle Insurance",
  vehicle_registration: "Vehicle Registration",
  medical_transport_certification: "Medical Transport Certification",
};

const docTitle = (type: string) =>
  DOC_TITLES[type] ||
  (type || "Document")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

type DocStatus = "VERIFIED" | "PENDING" | "REJECTED";

const docStatus = (raw?: string): DocStatus => {
  const v = (raw || "").toLowerCase();
  if (v === "approved" || v === "verified") return "VERIFIED";
  if (v === "rejected") return "REJECTED";
  return "PENDING";
};

const formatDocDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

// Whole days from now until the expiry date, or null when there is no date.
const daysUntil = (iso?: string | null): number | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const DocumentsScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { data, isLoading, refetch } = useDriverDocuments();
  const documents = data?.data || [];

  // Banner only when real data says something needs attention.
  const expiring = documents
    .map((d) => ({ d, days: daysUntil(d.expires_at) }))
    .filter((x) => x.days !== null && x.days <= 30)
    .sort((a, b) => (a.days as number) - (b.days as number))[0];
  const rejectedCount = documents.filter(
    (d) => docStatus(d.verification_status) === "REJECTED",
  ).length;
  let bannerText = "";
  if (expiring) {
    const days = expiring.days as number;
    bannerText =
      days < 0
        ? `${docTitle(expiring.d.document_type)} has expired.`
        : days === 0
          ? `${docTitle(expiring.d.document_type)} expires today.`
          : `${docTitle(expiring.d.document_type)} expires in ${days} day${days === 1 ? "" : "s"}.`;
  } else if (rejectedCount > 0) {
    bannerText = `${rejectedCount} document${rejectedCount === 1 ? " was" : "s were"} rejected. Please contact support to resubmit.`;
  }

  if (isLoading) {
    return <DocumentsSkeleton />;
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

      <Header title="Documents" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Required Banner (only when real data needs attention) */}
        {bannerText !== "" && (
          <View style={styles.warningBanner}>
            <View style={styles.warningHeader}>
              <View style={styles.warningTitleGroup}>
                <AlertCircle size={18} color="#B45309" />
                <Text style={styles.warningTitle}>Action Required</Text>
              </View>
            </View>
            <Text style={styles.warningText}>{bannerText}</Text>
          </View>
        )}

        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 11,
              fontFamily: "Bold",
            },
          ]}
        >
          REQUIRED DOCUMENTS
        </Text>

        {/* Document List */}
        {documents.length === 0 ? (
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 15,
                fontFamily: "Bold",
                textAlign: "center",
                marginTop: 16,
              },
            ]}
          >
            No uploaded document
          </Text>
        ) : (
          <View>
            {documents.map((doc) => {
              const status = docStatus(doc.verification_status);
              const expiryText = formatDocDate(doc.expires_at);
              const uploadedText = formatDocDate(doc.created_at);
              return (
              <TouchableOpacity
                key={doc.id}
                style={[
                  styles.docCard,
                  {
                    borderBottomColor: colors.lightPrimaryBlueBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.docIcon,
                    {
                      backgroundColor:
                        status === "VERIFIED"
                          ? "#ECFDF5"
                          : status === "REJECTED"
                            ? "#FEF2F2"
                            : "#EFF6FF",
                    },
                  ]}
                >
                  <FileText
                    size={20}
                    color={
                      status === "VERIFIED"
                        ? "#10B981"
                        : status === "REJECTED"
                          ? "#EF4444"
                          : "#3B82F6"
                    }
                  />
                </View>
                <View style={styles.docInfo}>
                  <View style={styles.docHeaderRow}>
                    <Text
                      style={[
                        commonStyling.title,
                        {
                          fontSize: 15,
                          fontFamily: "Bold",
                        },
                      ]}
                    >
                      {docTitle(doc.document_type)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        status === "VERIFIED"
                          ? styles.statusVerified
                          : status === "PENDING"
                            ? styles.statusPending
                            : styles.statusRejected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          status === "VERIFIED"
                            ? { color: "#10B981" }
                            : status === "PENDING"
                              ? { color: "#3B82F6" }
                              : { color: "#EF4444" },
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.docSub,
                      commonStyling.subtitle,
                      {
                        fontSize: 11,
                        fontFamily: "Medium",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {status === "REJECTED" && doc.rejection_reason
                      ? doc.rejection_reason
                      : doc.file_name}
                  </Text>
                  {expiryText !== "" && (
                    <Text
                      style={[
                        commonStyling.title,
                        {
                          fontSize: 12,
                        },
                      ]}
                    >
                      Expires {expiryText}
                    </Text>
                  )}
                  {uploadedText !== "" && (
                    <Text
                      style={[
                        styles.docMetaSmall,
                        commonStyling.subtitle,
                        {
                          fontSize: 11,
                        },
                      ]}
                    >
                      Uploaded {uploadedText}
                    </Text>
                  )}
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Requirements Footer */}
        <View
          style={[
            styles.requirementsContainer,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          <Text
            style={[
              styles.reqTitle,
              {
                fontSize: 14,
                fontFamily: "Bold",
                color: colors.primaryColor,
              },
            ]}
          >
            Document Requirements
          </Text>
          {[
            "High-quality scans or photos (PDF or JPEG)",
            "All information clearly visible and readable",
            "Documents must be current and not expired",
            "File size should not exceed 5 MB per document",
          ].map((text, i) => (
            <View key={i} style={styles.reqRow}>
              <CheckCircle2 size={16} color="#3B82F6" />
              <Text
                style={[
                  styles.reqText,
                  {
                    fontSize: 12,
                    color: colors.primaryColor,
                    fontFamily: "Regular",
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  scrollContent: { padding: 20 },

  warningBanner: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    marginBottom: 24,
  },
  warningHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  warningTitleGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  warningTitle: { fontSize: 14, fontFamily: "Bold", color: "#92400E" },
  renewLink: { fontSize: 12, fontFamily: "Bold", color: "#B45309" },
  warningText: {
    fontSize: 12,
    fontFamily: "Regular",
    lineHeight: 18,
    color: "#B45309",
  },

  sectionLabel: {
    letterSpacing: 1,
    marginBottom: 16,
  },

  docCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  docInfo: { flex: 1, marginLeft: 16 },
  docHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  docSub: { marginBottom: 6 },
  docMetaSmall: { marginTop: 2 },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusVerified: { backgroundColor: "#ECFDF5" },
  statusPending: { backgroundColor: "#EFF6FF" },
  statusExpiring: { backgroundColor: "#FFFBEB" },
  statusRejected: { backgroundColor: "#FEF2F2" },
  statusText: { fontSize: 10, fontWeight: "900" },

  uploadBox: {
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1,
    alignItems: "center",
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadSub: { marginTop: 4 },

  requirementsContainer: {
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
  },
  reqTitle: {
    marginBottom: 16,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  reqText: {
    flex: 1,
    lineHeight: 18,
  },
});

export default DocumentsScreen;
