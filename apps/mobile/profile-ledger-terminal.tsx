import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

interface LedgerTerminalLine {
  id: string;
  level: "info" | "success" | "warn" | "error";
  timestamp: string;
  message: string;
}

const terminalLines: LedgerTerminalLine[] = [
  { id: "log-1", level: "info", timestamp: "14:32:09", message: "[ledger-core] sync.start account=LED-AET-2024-001847 region=eu-west-1" },
  { id: "log-2", level: "success", timestamp: "14:32:10", message: "[ledger-core] sync.commit account=LED-AET-2024-001847 entries=18 latency=12ms" },
  { id: "log-3", level: "info", timestamp: "14:32:11", message: "[node-gateway] tx.broadcast hash=0x84fa...2ab9 network=aether-mainnet" },
  { id: "log-4", level: "warn", timestamp: "14:32:14", message: "[vault-bridge] retry scheduled account=LED-AET-2024-004587 reason=upstream_timeout" },
  { id: "log-5", level: "success", timestamp: "14:32:16", message: "[ledger-audit] merkle.root updated batch=2026-06-14T14:32 root=6f4c8e12..." },
  { id: "log-6", level: "error", timestamp: "14:32:18", message: "[node-gateway] peer quorum degraded peer=validator-03 status=heartbeat_missed" },
  { id: "log-7", level: "info", timestamp: "14:32:20", message: "[ops] healthcheck status=partial uptime=99.98 latency=12ms" },
];

const quickMetrics = [
  { label: "Node", value: "validator-eu-01" },
  { label: "Mode", value: "read / write" },
  { label: "Head", value: "#18,442,991" },
  { label: "Peer quorum", value: "11 / 12" },
];

export default function ProfileLedgerTerminalScreen() {
  const insets = usePhoneSafeAreaInsets();

  return (
    <ScreenTransition direction="up">
      <View style={styles.safeArea}>
        <ScrollView
          bounces={false}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable style={styles.headerButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={20} color="#111827" />
            </Pressable>
            <Pressable style={styles.headerButton}>
              <MaterialIcons name="more-horiz" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Ledger Terminal</Text>
            <Text style={styles.pageSubtitle}>Flux d'execution et journaux temps reel d'Aether Ledger.</Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <View style={styles.heroDot} />
                <Text style={styles.heroBadgeText}>Live</Text>
              </View>
              <Text style={styles.heroMeta}>validator-eu-01</Text>
            </View>
            <Text style={styles.heroTitle}>Acces operateur Ledger</Text>
            <Text style={styles.heroDescription}>
              Surveillez les synchronisations, les transactions diffusees et l'etat reseau depuis une vue terminal centralisee.
            </Text>
          </View>

          <View style={styles.metricsGrid}>
            {quickMetrics.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.primaryAction}>
              <MaterialIcons name="play-arrow" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Relancer</Text>
            </Pressable>
            <Pressable style={styles.secondaryAction}>
              <MaterialIcons name="download" size={18} color="#111827" />
              <Text style={styles.secondaryActionText}>Exporter</Text>
            </Pressable>
          </View>

          <View style={styles.terminalCard}>
            <View style={styles.terminalHeader}>
              <Text style={styles.terminalTitle}>stdout / ledger-runtime</Text>
              <Text style={styles.terminalMeta}>7 lignes</Text>
            </View>

            {terminalLines.map((line) => (
              <View key={line.id} style={styles.terminalLine}>
                <Text style={[styles.terminalLevel, styles[`terminalLevel${line.level}`]]}>{line.level.toUpperCase()}</Text>
                <Text style={styles.terminalTimestamp}>{line.timestamp}</Text>
                <Text style={styles.terminalMessage}>{line.message}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Ecran mocke pour l'instant. Connectez ensuite la source de logs runtime et les actions d'operateur Ledger.
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
  heroCard: {
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#0B1220",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(34, 197, 94, 0.16)",
  },
  heroDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#22C55E",
  },
  heroBadgeText: {
    color: "#86EFAC",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
  },
  heroMeta: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    marginTop: 14,
  },
  heroDescription: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
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
  metricLabel: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },
  metricValue: {
    color: "#05070A",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    marginBottom: 14,
  },
  primaryAction: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  secondaryAction: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  secondaryActionText: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  terminalCard: {
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#05070A",
  },
  terminalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  terminalTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
    fontFamily: "monospace",
  },
  terminalMeta: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },
  terminalLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  terminalLevel: {
    minWidth: 52,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
    fontFamily: "monospace",
  },
  terminalLevelinfo: {
    color: "#93C5FD",
  },
  terminalLevelsuccess: {
    color: "#86EFAC",
  },
  terminalLevelwarn: {
    color: "#FCD34D",
  },
  terminalLevelerror: {
    color: "#FCA5A5",
  },
  terminalTimestamp: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  terminalMessage: {
    flex: 1,
    color: "#E5E7EB",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 14,
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
