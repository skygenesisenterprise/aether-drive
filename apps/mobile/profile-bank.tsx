import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface BankAccount {
  id: string;
  label: string;
  holder: string;
  iban: string;
  bic: string;
  currency: string;
  status: string;
  type: string;
  region: string;
  lastSync: string;
  ledgerAccountId: string;
}

const bankAccounts: BankAccount[] = [
  {
    id: "aether-eur-01",
    label: "Aether Bank EUR",
    holder: "Liam Dispa",
    iban: "FR76 1695 8000 0102 0456 7890 132",
    bic: "AEBAFRPP",
    currency: "EUR (€)",
    status: "Actif",
    type: "Compte courant",
    region: "France (SEPA)",
    lastSync: "Aujourd'hui, 14:32",
    ledgerAccountId: "LED-AET-2024-001847",
  },
  {
    id: "aether-usd-01",
    label: "Aether Bank USD",
    holder: "Liam Dispa",
    iban: "US64 AEBK 0000 0198 7654 3210",
    bic: "AEBKUS6S",
    currency: "USD ($)",
    status: "Actif",
    type: "Compte courant",
    region: "États-Unis",
    lastSync: "Aujourd'hui, 14:30",
    ledgerAccountId: "LED-AET-2024-002193",
  },
];

const recentIbanUsage = [
  { action: "Virement SEPA reçu", date: "12 juin 2026", amount: "+2 500,00 €" },
  { action: "Paiement carte", date: "11 juin 2026", amount: "-89,00 €" },
  { action: "Virement sortant", date: "10 juin 2026", amount: "-1 200,00 €" },
];

export default function ProfileBankScreen() {
  const insets = usePhoneSafeAreaInsets();
  const [activeAccountIndex, setActiveAccountIndex] = React.useState(0);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const activeAccount = bankAccounts[activeAccountIndex];

  const handleCopy = React.useCallback((field: string, value: string) => {
    setCopiedField(field);
    Alert.alert("Copié", `${field} copié dans le presse-papiers.`, [{ text: "OK" }]);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const handleShare = React.useCallback(() => {
    Alert.alert("Partager", "Partage des coordonnées bancaires — fonctionnalité à venir.", [{ text: "OK" }]);
  }, []);

  const handleDownloadRIB = React.useCallback(() => {
    Alert.alert("Télécharger RIB", "Génération du RIB en PDF — fonctionnalité à venir.", [{ text: "OK" }]);
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
            <Pressable style={styles.headerButton} onPress={handleDownloadRIB}>
              <MaterialIcons name="file-download" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Coordonnées bancaires</Text>
            <Text style={styles.pageSubtitle}>Gérez vos comptes et coordonnées bancaires.</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountSelector}
          >
            {bankAccounts.map((account, index) => {
              const isActive = index === activeAccountIndex;
              return (
                <Pressable
                  key={account.id}
                  style={[styles.accountPill, isActive && styles.accountPillActive]}
                  onPress={() => setActiveAccountIndex(index)}
                >
                  <Text style={[styles.accountPillText, isActive && styles.accountPillTextActive]}>
                    {account.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.ibanCard}>
            <View style={styles.ibanHeader}>
              <View style={styles.ibanIcon}>
                <MaterialIcons name="account-balance" size={22} color="#111827" />
              </View>
              <View style={styles.ibanCopy}>
                <Text style={styles.ibanTitle}>{activeAccount.label}</Text>
                <Text style={styles.ibanSubtitle}>{activeAccount.type} · {activeAccount.region}</Text>
              </View>
              <View style={[styles.statusBadge, activeAccount.status === "Actif" && styles.statusBadgeActive]}>
                <Text style={[styles.statusText, activeAccount.status === "Actif" && styles.statusTextActive]}>
                  {activeAccount.status}
                </Text>
              </View>
            </View>

            <View style={styles.ibanDivider} />

            <View style={styles.ibanField}>
              <Text style={styles.ibanLabel}>Titulaire du compte</Text>
              <Pressable style={styles.ibanValueRow} onPress={() => handleCopy("Titulaire", activeAccount.holder)}>
                <Text style={styles.ibanValue}>{activeAccount.holder}</Text>
                <MaterialIcons name="content-copy" size={16} color="#6B7280" />
              </Pressable>
            </View>

            <View style={styles.ibanField}>
              <Text style={styles.ibanLabel}>IBAN</Text>
              <Pressable style={styles.ibanValueRow} onPress={() => handleCopy("IBAN", activeAccount.iban)}>
                <Text style={[styles.ibanValue, styles.ibanValueMono]}>{activeAccount.iban}</Text>
                <MaterialIcons name={copiedField === "IBAN" ? "check" : "content-copy"} size={16} color={copiedField === "IBAN" ? "#1F8A4C" : "#6B7280"} />
              </Pressable>
            </View>

            <View style={styles.ibanField}>
              <Text style={styles.ibanLabel}>BIC / SWIFT</Text>
              <Pressable style={styles.ibanValueRow} onPress={() => handleCopy("BIC", activeAccount.bic)}>
                <Text style={[styles.ibanValue, styles.ibanValueMono]}>{activeAccount.bic}</Text>
                <MaterialIcons name={copiedField === "BIC" ? "check" : "content-copy"} size={16} color={copiedField === "BIC" ? "#1F8A4C" : "#6B7280"} />
              </Pressable>
            </View>

            <View style={styles.ibanField}>
              <Text style={styles.ibanLabel}>Devise</Text>
              <Text style={styles.ibanValue}>{activeAccount.currency}</Text>
            </View>

            <View style={styles.ibanActions}>
              <Pressable style={styles.ibanActionButton} onPress={() => handleCopy("IBAN", activeAccount.iban)}>
                <MaterialIcons name="content-copy" size={16} color="#111827" />
                <Text style={styles.ibanActionText}>Copier l'IBAN</Text>
              </Pressable>
              <Pressable style={styles.ibanActionButton} onPress={handleShare}>
                <MaterialIcons name="share" size={16} color="#111827" />
                <Text style={styles.ibanActionText}>Partager</Text>
              </Pressable>
              <Pressable style={styles.ibanActionButton} onPress={handleDownloadRIB}>
                <MaterialIcons name="file-download" size={16} color="#111827" />
                <Text style={styles.ibanActionText}>RIB</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Détails du compte</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="badge" size={18} color="#111827" />
              </View>
              <View style={styles.detailCopy}>
                <Text style={styles.detailLabel}>Identifiant Ledger</Text>
                <Text style={[styles.detailValue, styles.detailValueMono]}>{activeAccount.ledgerAccountId}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="access-time" size={18} color="#111827" />
              </View>
              <View style={styles.detailCopy}>
                <Text style={styles.detailLabel}>Dernière synchronisation</Text>
                <Text style={styles.detailValue}>{activeAccount.lastSync}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="public" size={18} color="#111827" />
              </View>
              <View style={styles.detailCopy}>
                <Text style={styles.detailLabel}>Réseau</Text>
                <Text style={styles.detailValue}>{activeAccount.region}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activité récente</Text>
            </View>

            {recentIbanUsage.map((usage, index) => (
              <View
                key={usage.date}
                style={[styles.usageRow, index < recentIbanUsage.length - 1 && styles.usageRowBorder]}
              >
                <View style={styles.usageIcon}>
                  <MaterialIcons
                    name={usage.amount.startsWith("+") ? "south-west" : "north-east"}
                    size={16}
                    color={usage.amount.startsWith("+") ? "#1F8A4C" : "#111827"}
                  />
                </View>
                <View style={styles.usageCopy}>
                  <Text style={styles.usageAction}>{usage.action}</Text>
                  <Text style={styles.usageDate}>{usage.date}</Text>
                </View>
                <Text style={[styles.usageAmount, usage.amount.startsWith("+") ? styles.creditAmount : styles.debitAmount]}>
                  {usage.amount}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Aether Ledger est la source de vérité pour toutes les coordonnées bancaires. Les modifications sont synchronisées en temps réel.
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
  accountSelector: {
    gap: 8,
    paddingBottom: 14,
  },
  accountPill: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  accountPillActive: {
    borderColor: "#111827",
    backgroundColor: "#111827",
  },
  accountPillText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  accountPillTextActive: {
    color: "#FFFFFF",
  },
  ibanCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  ibanHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ibanIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  ibanCopy: {
    flex: 1,
  },
  ibanTitle: {
    color: "#05070A",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  ibanSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2,
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
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
  },
  statusTextActive: {
    color: "#1F8A4C",
  },
  ibanDivider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: "#E5E7EB",
  },
  ibanField: {
    marginBottom: 14,
  },
  ibanLabel: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  ibanValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ibanValue: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  ibanValueMono: {
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  ibanActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  ibanActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  ibanActionText: {
    color: "#111827",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
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
    paddingVertical: 14,
  },
  sectionTitle: {
    color: "#05070A",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  detailIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  detailCopy: {
    flex: 1,
    minWidth: 0,
  },
  detailLabel: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  detailValue: {
    color: "#05070A",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  detailValueMono: {
    fontFamily: "monospace",
    letterSpacing: 0.3,
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  usageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  usageRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  usageIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  usageCopy: {
    flex: 1,
  },
  usageAction: {
    color: "#05070A",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  usageDate: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  usageAmount: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  creditAmount: {
    color: "#1F8A4C",
  },
  debitAmount: {
    color: "#111827",
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
