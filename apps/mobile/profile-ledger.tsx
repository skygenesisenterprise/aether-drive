import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface LedgerAccount {
  id: string;
  label: string;
  balance: string;
  currency: string;
  lastSync: string;
  status: "synced" | "syncing" | "error";
  icon: IconName;
}

interface LedgerEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
  icon: IconName;
}

interface LedgerMetric {
  label: string;
  value: string;
  icon: IconName;
}

const ledgerStatus = {
  overall: "Operational" as const,
  lastSync: "Aujourd'hui, 14:32",
  uptime: "99.98%",
  latency: "12ms",
  version: "v3.2.1",
};

const ledgerAccounts: LedgerAccount[] = [
  {
    id: "LED-AET-2024-001847",
    label: "Aether Bank EUR",
    balance: "€48 250,00",
    currency: "EUR",
    lastSync: "Il y a 2 min",
    status: "synced",
    icon: "account-balance",
  },
  {
    id: "LED-AET-2024-002193",
    label: "Aether Bank USD",
    balance: "$12 480,00",
    currency: "USD",
    lastSync: "Il y a 5 min",
    status: "synced",
    icon: "account-balance",
  },
  {
    id: "LED-AET-2024-003012",
    label: "SGE Europe",
    balance: "€143 800,00",
    currency: "EUR",
    lastSync: "Il y a 1 min",
    status: "synced",
    icon: "public",
  },
  {
    id: "LED-AET-2024-004587",
    label: "Vault Infrastructure",
    balance: "€284 500,00",
    currency: "EUR",
    lastSync: "En cours...",
    status: "syncing",
    icon: "lock",
  },
];

const ledgerEvents: LedgerEvent[] = [
  {
    id: "evt-1",
    type: "Transaction",
    description: "Virement SEPA reçu — +2 500,00 €",
    timestamp: "Aujourd'hui, 14:32",
    status: "success",
    icon: "south-west",
  },
  {
    id: "evt-2",
    type: "Synchronisation",
    description: "Sync complète pour LED-AET-2024-001847",
    timestamp: "Aujourd'hui, 14:30",
    status: "success",
    icon: "sync",
  },
  {
    id: "evt-3",
    type: "Transaction",
    description: "Paiement carte — -89,00 €",
    timestamp: "Aujourd'hui, 12:15",
    status: "success",
    icon: "credit-card",
  },
  {
    id: "evt-4",
    type: "Erreur",
    description: "Timeout sync pour LED-AET-2024-004587",
    timestamp: "Aujourd'hui, 11:45",
    status: "failed",
    icon: "error-outline",
  },
  {
    id: "evt-5",
    type: "Transaction",
    description: "Virement interne — -1 200,00 €",
    timestamp: "Aujourd'hui, 09:20",
    status: "success",
    icon: "swap-horiz",
  },
  {
    id: "evt-6",
    type: "Synchronisation",
    description: "Batch sync terminé — 4 comptes",
    timestamp: "Hier, 23:00",
    status: "success",
    icon: "sync",
  },
];

const ledgerMetrics: LedgerMetric[] = [
  { label: "Transactions today", value: "47", icon: "receipt" },
  { label: "Volume traité", value: "€124 890", icon: "euro" },
  { label: "Comptes actifs", value: "4", icon: "account-balance" },
  { label: "Taux de succès", value: "99.2%", icon: "check-circle" },
];

export default function ProfileLedgerScreen() {
  const insets = usePhoneSafeAreaInsets();

  const handleAccountPress = React.useCallback((account: LedgerAccount) => {
    Alert.alert(account.label, `ID : ${account.id}\nSolde : ${account.balance}\nDernière sync : ${account.lastSync}`, [
      { text: "Forcer la sync", onPress: () => Alert.alert("Synchronisation", "Sync lancée.", [{ text: "OK" }]) },
      { text: "Fermer", style: "cancel" },
    ]);
  }, []);

  const handleEventPress = React.useCallback((event: LedgerEvent) => {
    Alert.alert(event.type, `${event.description}\n\n${event.timestamp}`, [{ text: "OK" }]);
  }, []);

  const handleForceSyncAll = React.useCallback(() => {
    Alert.alert("Synchronisation globale", "Forcer la synchronisation de tous les comptes ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Synchroniser" },
    ]);
  }, []);

  const handleViewLogs = React.useCallback(() => {
    router.push("/profile-ledger-terminal");
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
            <Pressable style={styles.headerButton} onPress={handleViewLogs}>
              <MaterialIcons name="terminal" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Aether Ledger</Text>
            <Text style={styles.pageSubtitle}>Système de registry financier décentralisé.</Text>
          </View>

          <View style={[styles.statusCard, styles[`statusCard${ledgerStatus.overall}`]]}>
            <View style={styles.statusIconRow}>
              <View style={styles.statusIcon}>
                <MaterialIcons name="dns" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.statusCopy}>
                <Text style={styles.statusTitle}>{ledgerStatus.overall}</Text>
                <Text style={styles.statusVersion}>{ledgerStatus.version}</Text>
              </View>
              <View style={styles.statusIndicator} />
            </View>
            <View style={styles.statusStats}>
              <View style={styles.statusStat}>
                <Text style={styles.statusStatLabel}>Uptime</Text>
                <Text style={styles.statusStatValue}>{ledgerStatus.uptime}</Text>
              </View>
              <View style={styles.statusStatDivider} />
              <View style={styles.statusStat}>
                <Text style={styles.statusStatLabel}>Latence</Text>
                <Text style={styles.statusStatValue}>{ledgerStatus.latency}</Text>
              </View>
              <View style={styles.statusStatDivider} />
              <View style={styles.statusStat}>
                <Text style={styles.statusStatLabel}>Dernière sync</Text>
                <Text style={styles.statusStatValue}>{ledgerStatus.lastSync}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {ledgerMetrics.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <View style={styles.metricIcon}>
                  <MaterialIcons name={metric.icon} size={18} color="#111827" />
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Comptes synchronisés</Text>
              <Pressable onPress={handleForceSyncAll}>
                <Text style={styles.sectionAction}>Tout synchroniser</Text>
              </Pressable>
            </View>
            {ledgerAccounts.map((account, index) => (
              <Pressable
                key={account.id}
                style={[styles.accountRow, index < ledgerAccounts.length - 1 && styles.accountRowBorder]}
                onPress={() => handleAccountPress(account)}
              >
                <View style={styles.accountIcon}>
                  <MaterialIcons name={account.icon} size={18} color="#111827" />
                </View>
                <View style={styles.accountCopy}>
                  <Text style={styles.accountLabel}>{account.label}</Text>
                  <Text style={styles.accountId}>{account.id}</Text>
                  <Text style={styles.accountSync}>Dernière sync : {account.lastSync}</Text>
                </View>
                <View style={styles.accountRight}>
                  <Text style={styles.accountBalance}>{account.balance}</Text>
                  <View style={[styles.syncBadge, styles[`syncBadge${account.status}`]]}>
                    <View style={[styles.syncDot, styles[`syncDot${account.status}`]]} />
                    <Text style={[styles.syncText, styles[`syncText${account.status}`]]}>
                      {account.status === "synced" ? "Sync" : account.status === "syncing" ? "Sync..." : "Erreur"}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Journal d'activité</Text>
            </View>
            {ledgerEvents.map((event, index) => (
              <Pressable
                key={event.id}
                style={[styles.eventRow, index < ledgerEvents.length - 1 && styles.eventRowBorder]}
                onPress={() => handleEventPress(event)}
              >
                <View style={[styles.eventIcon, styles[`eventIcon${event.status}`]]}>
                  <MaterialIcons
                    name={event.icon}
                    size={16}
                    color={event.status === "success" ? "#1F8A4C" : event.status === "failed" ? "#EF4444" : "#D97706"}
                  />
                </View>
                <View style={styles.eventCopy}>
                  <View style={styles.eventTitleRow}>
                    <Text style={styles.eventType}>{event.type}</Text>
                    <Text style={styles.eventTime}>{event.timestamp}</Text>
                  </View>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Aether Ledger est le système de registry financier décentralisé. Toutes les transactions sont immuables et traçables.
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
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#111827",
  },
  statusCardOperational: {
    backgroundColor: "#111827",
  },
  statusCardDegraded: {
    backgroundColor: "#92400E",
  },
  statusCardDown: {
    backgroundColor: "#7F1D1D",
  },
  statusIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  statusIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  statusCopy: {
    flex: 1,
  },
  statusTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
  },
  statusVersion: {
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
  },
  statusStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  statusStat: {
    alignItems: "center",
    flex: 1,
  },
  statusStatLabel: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusStatValue: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  statusStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  metricCard: {
    width: "48%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FFFFFF",
  },
  metricIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    marginBottom: 10,
  },
  metricValue: {
    color: "#05070A",
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900",
  },
  metricLabel: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
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
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  accountRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  accountIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  accountCopy: {
    flex: 1,
    minWidth: 0,
  },
  accountLabel: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  accountId: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
    fontFamily: "monospace",
    marginTop: 2,
  },
  accountSync: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  accountRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  accountBalance: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  syncBadgesynced: {
    backgroundColor: "#EAF8EF",
  },
  syncBadgesyncing: {
    backgroundColor: "#FEF3C7",
  },
  syncBadgeerror: {
    backgroundColor: "#FEF2F2",
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6B7280",
  },
  syncDotsynced: {
    backgroundColor: "#1F8A4C",
  },
  syncDotsyncing: {
    backgroundColor: "#D97706",
  },
  syncDoterror: {
    backgroundColor: "#EF4444",
  },
  syncText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900",
  },
  syncTextsynced: {
    color: "#1F8A4C",
  },
  syncTextsyncing: {
    color: "#D97706",
  },
  syncTexterror: {
    color: "#EF4444",
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
  },
  eventRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  eventIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  eventIconsuccess: {
    backgroundColor: "#EAF8EF",
  },
  eventIconfailed: {
    backgroundColor: "#FEF2F2",
  },
  eventIconpending: {
    backgroundColor: "#FEF3C7",
  },
  eventCopy: {
    flex: 1,
    minWidth: 0,
  },
  eventTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  eventType: {
    color: "#05070A",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  eventTime: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
  eventDescription: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 2,
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
