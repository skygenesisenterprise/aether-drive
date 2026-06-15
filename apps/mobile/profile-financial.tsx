import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface FinancialPermission {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  enabled: boolean;
}

interface TransactionLimit {
  id: string;
  type: string;
  dailyLimit: string;
  monthlyLimit: string;
  lastUsed: string;
  usagePercent: number;
  icon: IconName;
}

interface DelegatedAccess {
  id: string;
  name: string;
  role: string;
  initials: string;
  permissions: string[];
  grantedDate: string;
  status: "active" | "suspended";
}

interface ApprovalRequest {
  id: string;
  title: string;
  amount: string;
  requestedBy: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const financialPermissions: FinancialPermission[] = [
  {
    id: "perm-1",
    title: "Virements sortants",
    description: "Autoriser les transferts depuis vos comptes.",
    icon: "send",
    enabled: true,
  },
  {
    id: "perm-2",
    title: "Paiements par carte",
    description: "Autoriser les paiements et retraits.",
    icon: "credit-card",
    enabled: true,
  },
  {
    id: "perm-3",
    title: "Création de bénéficiaires",
    description: "Ajouter de nouveaux bénéficiaires.",
    icon: "person-add",
    enabled: true,
  },
  {
    id: "perm-4",
    title: "Modification de limites",
    description: "Modifier les plafonds de transaction.",
    icon: "tune",
    enabled: false,
  },
  {
    id: "perm-5",
    title: "Clôture de compte",
    description: "Fermer un compte financier.",
    icon: "delete-forever",
    enabled: false,
  },
  {
    id: "perm-6",
    title: "Investissements",
    description: "Effectuer des opérations d'investissement.",
    icon: "show-chart",
    enabled: false,
  },
];

const transactionLimits: TransactionLimit[] = [
  {
    id: "limit-1",
    type: "Virement SEPA",
    dailyLimit: "10 000,00 €",
    monthlyLimit: "50 000,00 €",
    lastUsed: "Aujourd'hui",
    usagePercent: 35,
    icon: "send",
  },
  {
    id: "limit-2",
    type: "Paiement carte",
    dailyLimit: "3 000,00 €",
    monthlyLimit: "15 000,00 €",
    lastUsed: "Hier",
    usagePercent: 18,
    icon: "credit-card",
  },
  {
    id: "limit-3",
    type: "Retrait DAB",
    dailyLimit: "800,00 €",
    monthlyLimit: "4 000,00 €",
    lastUsed: "10 juin",
    usagePercent: 42,
    icon: "local-atm",
  },
  {
    id: "limit-4",
    type: "Virement instantané",
    dailyLimit: "1 500,00 €",
    monthlyLimit: "10 000,00 €",
    lastUsed: "8 juin",
    usagePercent: 8,
    icon: "bolt",
  },
];

const delegatedAccess: DelegatedAccess[] = [
  {
    id: "del-1",
    name: "Sophie Laurent",
    role: "CFO",
    initials: "SL",
    permissions: ["Virements", "Consultation"],
    grantedDate: "2 janvier 2024",
    status: "active",
  },
  {
    id: "del-2",
    name: "Thomas Martin",
    role: "Operations",
    initials: "TM",
    permissions: ["Consultation", "Paiements"],
    grantedDate: "10 janvier 2024",
    status: "active",
  },
  {
    id: "del-3",
    name: "Emma Dubois",
    role: "Compliance",
    initials: "ED",
    permissions: ["Consultation"],
    grantedDate: "5 février 2024",
    status: "active",
  },
];

const approvalRequests: ApprovalRequest[] = [
  {
    id: "req-1",
    title: "Virement fournisseur",
    amount: "12 500,00 €",
    requestedBy: "Thomas Martin",
    date: "Aujourd'hui, 10:45",
    status: "pending",
  },
  {
    id: "req-2",
    title: "Dépôt investissement",
    amount: "25 000,00 €",
    requestedBy: "Sophie Laurent",
    date: "Hier, 16:20",
    status: "approved",
  },
  {
    id: "req-3",
    title: "Achat équipement",
    amount: "4 200,00 €",
    requestedBy: "Emma Dubois",
    date: "10 juin, 09:30",
    status: "rejected",
  },
];

export default function ProfileFinancialScreen() {
  const insets = usePhoneSafeAreaInsets();

  const handlePermissionToggle = React.useCallback((permission: FinancialPermission) => {
    Alert.alert(
      permission.title,
      permission.enabled
        ? `Désactiver ${permission.title.toLowerCase()} ?`
        : `Activer ${permission.title.toLowerCase()} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: permission.enabled ? "Désactiver" : "Activer" },
      ],
    );
  }, []);

  const handleLimitPress = React.useCallback((limit: TransactionLimit) => {
    Alert.alert(limit.type, `Limite journalière : ${limit.dailyLimit}\nLimite mensuelle : ${limit.monthlyLimit}\nDernière utilisation : ${limit.lastUsed}`, [
      { text: "Modifier", onPress: () => Alert.alert("Modifier", "Fonctionnalité à venir.", [{ text: "OK" }]) },
      { text: "Fermer", style: "cancel" },
    ]);
  }, []);

  const handleDelegatedPress = React.useCallback((access: DelegatedAccess) => {
    Alert.alert(access.name, `Rôle : ${access.role}\nPermissions : ${access.permissions.join(", ")}\nAccordé le : ${access.grantedDate}`, [
      { text: "Suspendre", style: "destructive" },
      { text: "Modifier" },
      { text: "Fermer", style: "cancel" },
    ]);
  }, []);

  const handleApprovalPress = React.useCallback((request: ApprovalRequest) => {
    if (request.status === "pending") {
      Alert.alert(request.title, `${request.amount}\nDemandé par : ${request.requestedBy}\n${request.date}`, [
        { text: "Rejeter", style: "destructive" },
        { text: "Approuver" },
        { text: "Fermer", style: "cancel" },
      ]);
    } else {
      Alert.alert(request.title, `${request.amount}\nStatut : ${request.status === "approved" ? "Approuvé" : "Rejeté"}`, [{ text: "OK" }]);
    }
  }, []);

  const handleAddDelegated = React.useCallback(() => {
    Alert.alert("Ajouter un accès délégué", "Formulaire d'ajout — fonctionnalité à venir.", [{ text: "OK" }]);
  }, []);

  return (
    <ScreenTransition direction="up">
      <View style={styles.safeArea}>
        <ScrollView
          bounces={false}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable style={styles.headerButton} onPress={() => router.replace("/profile")}>
              <MaterialIcons name="arrow-back" size={20} color="#111827" />
            </Pressable>
            <Pressable style={styles.headerButton}>
              <MaterialIcons name="help-outline" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Permissions financières</Text>
            <Text style={styles.pageSubtitle}>Contrôlez les accès et les limites de vos comptes.</Text>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <MaterialIcons name="shield" size={22} color="#111827" />
            </View>
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>3 permissions actives</Text>
              <Text style={styles.statusText}>Sur 6 permissions disponibles</Text>
            </View>
          </View>

          {approvalRequests.filter((r) => r.status === "pending").length > 0 && (
            <View style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <MaterialIcons name="pending-actions" size={20} color="#D97706" />
              </View>
              <View style={styles.alertCopy}>
                <Text style={styles.alertTitle}>{approvalRequests.filter((r) => r.status === "pending").length} demandes en attente</Text>
                <Text style={styles.alertText}>Approuvez ou rejetez les transactions soumises.</Text>
              </View>
            </View>
          )}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Permissions</Text>
            </View>
            {financialPermissions.map((permission, index) => (
              <Pressable
                key={permission.id}
                style={[styles.permissionRow, index < financialPermissions.length - 1 && styles.permissionRowBorder]}
                onPress={() => handlePermissionToggle(permission)}
              >
                <View style={styles.permissionIcon}>
                  <MaterialIcons name={permission.icon} size={18} color="#111827" />
                </View>
                <View style={styles.permissionCopy}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  <Text style={styles.permissionDescription}>{permission.description}</Text>
                </View>
                <View style={[styles.toggle, permission.enabled && styles.toggleEnabled]}>
                  <Text style={[styles.toggleText, permission.enabled && styles.toggleTextEnabled]}>
                    {permission.enabled ? "ON" : "OFF"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Limites de transaction</Text>
            </View>
            {transactionLimits.map((limit, index) => (
              <Pressable
                key={limit.id}
                style={[styles.limitRow, index < transactionLimits.length - 1 && styles.limitRowBorder]}
                onPress={() => handleLimitPress(limit)}
              >
                <View style={styles.limitIcon}>
                  <MaterialIcons name={limit.icon} size={18} color="#111827" />
                </View>
                <View style={styles.limitCopy}>
                  <Text style={styles.limitType}>{limit.type}</Text>
                  <Text style={styles.limitValues}>
                    {limit.dailyLimit} / jour · {limit.monthlyLimit} / mois
                  </Text>
                  <View style={styles.limitBar}>
                    <View style={[styles.limitBarFill, { width: `${limit.usagePercent}%` }]} />
                  </View>
                  <Text style={styles.limitUsage}>Utilisé ce mois : {limit.usagePercent}%</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Accès délégués</Text>
              <Pressable onPress={handleAddDelegated}>
                <Text style={styles.sectionAction}>Ajouter</Text>
              </Pressable>
            </View>
            {delegatedAccess.map((access, index) => (
              <Pressable
                key={access.id}
                style={[styles.delegatedRow, index < delegatedAccess.length - 1 && styles.delegatedRowBorder]}
                onPress={() => handleDelegatedPress(access)}
              >
                <View style={styles.delegatedAvatar}>
                  <Text style={styles.delegatedInitials}>{access.initials}</Text>
                </View>
                <View style={styles.delegatedCopy}>
                  <View style={styles.delegatedTitleRow}>
                    <Text style={styles.delegatedName}>{access.name}</Text>
                    <View style={[styles.statusBadge, access.status === "active" && styles.statusBadgeActive]}>
                      <Text style={[styles.statusText, access.status === "active" && styles.statusTextActive]}>
                        {access.status === "active" ? "Actif" : "Suspendu"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.delegatedRole}>{access.role} · {access.grantedDate}</Text>
                  <View style={styles.delegatedPermissions}>
                    {access.permissions.map((perm) => (
                      <View key={perm} style={styles.permissionTag}>
                        <Text style={styles.permissionTagText}>{perm}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Demandes d'approbation</Text>
            </View>
            {approvalRequests.map((request, index) => (
              <Pressable
                key={request.id}
                style={[styles.approvalRow, index < approvalRequests.length - 1 && styles.approvalRowBorder]}
                onPress={() => handleApprovalPress(request)}
              >
                <View style={styles.approvalIcon}>
                  <MaterialIcons
                    name={request.status === "pending" ? "schedule" : request.status === "approved" ? "check-circle" : "cancel"}
                    size={18}
                    color={request.status === "pending" ? "#D97706" : request.status === "approved" ? "#1F8A4C" : "#EF4444"}
                  />
                </View>
                <View style={styles.approvalCopy}>
                  <View style={styles.approvalTitleRow}>
                    <Text style={styles.approvalTitle}>{request.title}</Text>
                    <Text style={styles.approvalAmount}>{request.amount}</Text>
                  </View>
                  <Text style={styles.approvalMeta}>{request.requestedBy} · {request.date}</Text>
                </View>
                <View style={[styles.approvalBadge, styles[`approvalBadge${request.status}`]]}>
                  <Text style={[styles.approvalBadgeText, styles[`approvalBadgeText${request.status}`]]}>
                    {request.status === "pending" ? "En attente" : request.status === "approved" ? "Approuvé" : "Rejeté"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Les permissions financières sont gérées via Aether Identity. Contactez votre administrateur pour modifier les accès.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },
  titleBlock: {
    marginBottom: 14,
  },
  pageTitle: {
    color: "#05070A",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
  },
  pageSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    marginTop: 4,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  statusIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  statusCopy: {
    flex: 1,
  },
  statusTitle: {
    color: "#05070A",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  statusText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#D97706",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FEF3C7",
  },
  alertIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  alertCopy: {
    flex: 1,
  },
  alertTitle: {
    color: "#92400E",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  alertText: {
    color: "#B45309",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  sectionTitle: {
    color: "#05070A",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },
  sectionAction: {
    color: "#111827",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  permissionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  permissionIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  permissionCopy: {
    flex: 1,
    minWidth: 0,
  },
  permissionTitle: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  permissionDescription: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  toggle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  toggleEnabled: {
    backgroundColor: "#111827",
  },
  toggleText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
  },
  toggleTextEnabled: {
    color: "#FFFFFF",
  },
  limitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
  },
  limitRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  limitIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  limitCopy: {
    flex: 1,
    minWidth: 0,
  },
  limitType: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  limitValues: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  limitBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    backgroundColor: "#F3F4F6",
  },
  limitBarFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#111827",
  },
  limitUsage: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  delegatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  delegatedRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  delegatedAvatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "#111827",
  },
  delegatedInitials: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  delegatedCopy: {
    flex: 1,
    minWidth: 0,
  },
  delegatedTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  delegatedName: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  delegatedRole: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  delegatedPermissions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  permissionTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  permissionTagText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  statusBadgeActive: {
    backgroundColor: "#EAF8EF",
  },
  statusText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
  },
  statusTextActive: {
    color: "#1F8A4C",
  },
  approvalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  approvalRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  approvalIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  approvalCopy: {
    flex: 1,
    minWidth: 0,
  },
  approvalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  approvalTitle: {
    flex: 1,
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  approvalAmount: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  approvalMeta: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  approvalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  approvalBadgePending: {
    backgroundColor: "#FEF3C7",
  },
  approvalBadgeApproved: {
    backgroundColor: "#EAF8EF",
  },
  approvalBadgeRejected: {
    backgroundColor: "#FEF2F2",
  },
  approvalBadgeText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
  },
  approvalBadgeTextPending: {
    color: "#D97706",
  },
  approvalBadgeTextApproved: {
    color: "#1F8A4C",
  },
  approvalBadgeTextRejected: {
    color: "#EF4444",
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 4,
    marginBottom: 20,
  },
  infoNoteText: {
    flex: 1,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
});
