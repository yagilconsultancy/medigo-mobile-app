import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import { useDriverDocuments } from "../../../hooks/queries/userDriverDocuments";
import { DocumentsSkeleton } from "../../../components/skelentonAnimation/documentsSkelenton";

const DocumentsScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { data, isLoading, refetch } = useDriverDocuments();
  const documents = data?.data || [];

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
        {/* Action Required Banner */}
        <View style={styles.warningBanner}>
          <View style={styles.warningHeader}>
            <View style={styles.warningTitleGroup}>
              <AlertCircle size={18} color="#B45309" />
              <Text style={styles.warningTitle}>Action Required</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.renewLink}>Renew Now</Text>
              <ChevronRight size={14} color="#B45309" />
            </TouchableOpacity>
          </View>
          <Text style={styles.warningText}>
            Auto Insurance expires in 12 days. Renew to avoid service
            interruption.
          </Text>
        </View>

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
            {documents.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={[
                  styles.docCard,
                  {
                    borderBottomColor: colors.lightPrimaryBlueBorder,
                  },
                ]}
              >
                <View style={[styles.docIcon, { backgroundColor: doc.iconBg }]}>
                  {doc.icon}
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
                      {doc.title}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        doc.status === "VERIFIED"
                          ? styles.statusVerified
                          : doc.status === "PENDING"
                            ? styles.statusPending
                            : styles.statusExpiring,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          doc.status === "VERIFIED"
                            ? { color: "#10B981" }
                            : doc.status === "PENDING"
                              ? { color: "#3B82F6" }
                              : { color: "#F59E0B" },
                        ]}
                      >
                        {doc.status}
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
                  >
                    {doc.sub}
                  </Text>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 12,
                      },
                    ]}
                  >
                    Expires {doc.expiry}
                  </Text>
                  <Text
                    style={[
                      styles.docMetaSmall,
                      commonStyling.subtitle,
                      {
                        fontSize: 11,
                      },
                    ]}
                  >
                    Uploaded {doc.uploaded}
                  </Text>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
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
