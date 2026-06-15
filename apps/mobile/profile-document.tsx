import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];
type DocumentFilter = "Tous" | "Relevés" | "Fiscaux" | "Identité" | "Contrats";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: Exclude<DocumentFilter, "Tous">;
  icon: IconName;
  size: string;
}

const filters: DocumentFilter[] = ["Tous", "Relevés", "Fiscaux", "Identité", "Contrats"];

const documents: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Relevé mai 2026",
    description: "Relevé mensuel du compte Aether Bank EUR.",
    date: "2 juin 2026",
    category: "Relevés",
    icon: "description",
    size: "245 Ko",
  },
  {
    id: "doc-2",
    title: "Relevé avril 2026",
    description: "Relevé mensuel du compte Aether Bank EUR.",
    date: "2 mai 2026",
    category: "Relevés",
    icon: "description",
    size: "238 Ko",
  },
  {
    id: "doc-3",
    title: "RIB - Personnel",
    description: "Relevé d'identité bancaire complet.",
    date: "15 mai 2026",
    category: "Relevés",
    icon: "receipt",
    size: "89 Ko",
  },
  {
    id: "doc-4",
    title: "Attestation de compte",
    description: "Certificat de possession du compte.",
    date: "3 mai 2026",
    category: "Identité",
    icon: "verified",
    size: "156 Ko",
  },
  {
    id: "doc-5",
    title: "Impôt sur le revenu 2025",
    description: "Déclaration fiscale annuelle.",
    date: "15 avril 2026",
    category: "Fiscaux",
    icon: "account-balance",
    size: "1.2 Mo",
  },
  {
    id: "doc-6",
    title: "Certificat fiscal 2024",
    description: "Attestation des revenus perçus.",
    date: "20 janvier 2026",
    category: "Fiscaux",
    icon: "account-balance",
    size: "342 Ko",
  },
  {
    id: "doc-7",
    title: "Conditions générales",
    description: "Contrat de service Aether Bank.",
    date: "1 janvier 2024",
    category: "Contrats",
    icon: "gavel",
    size: "890 Ko",
  },
  {
    id: "doc-8",
    title: "Politique de confidentialité",
    description: "RGPD et traitement des données.",
    date: "1 janvier 2024",
    category: "Contrats",
    icon: "policy",
    size: "456 Ko",
  },
  {
    id: "doc-9",
    title: "Pièce d'identité",
    description: "Carte d'identité front et verso.",
    date: "10 mars 2024",
    category: "Identité",
    icon: "badge",
    size: "2.1 Mo",
  },
  {
    id: "doc-10",
    title: "Justificatif de domicile",
    description: "Facture EDF datant de moins de 3 mois.",
    date: "10 mars 2024",
    category: "Identité",
    icon: "home",
    size: "1.5 Mo",
  },
  {
    id: "doc-11",
    title: "Relevé mars 2026",
    description: "Relevé mensuel du compte Aether Bank EUR.",
    date: "1 avril 2026",
    category: "Relevés",
    icon: "description",
    size: "241 Ko",
  },
  {
    id: "doc-12",
    title: "Relevé février 2026",
    description: "Relevé mensuel du compte Aether Bank EUR.",
    date: "2 mars 2026",
    category: "Relevés",
    icon: "description",
    size: "235 Ko",
  },
];

export default function ProfileDocumentScreen() {
  const insets = usePhoneSafeAreaInsets();
  const [activeFilter, setActiveFilter] = React.useState<DocumentFilter>("Tous");

  const visibleDocuments = documents.filter((doc) => {
    if (activeFilter === "Tous") {
      return true;
    }
    return doc.category === activeFilter;
  });

  const handleDocumentPress = React.useCallback((doc: DocumentItem) => {
    Alert.alert(doc.title, `${doc.description}\n\nTaille : ${doc.size}\nDate : ${doc.date}`, [
      { text: "Télécharger", onPress: () => Alert.alert("Téléchargement", `${doc.title} téléchargé.`, [{ text: "OK" }]) },
      { text: "Partager", onPress: () => Alert.alert("Partager", "Fonctionnalité à venir.", [{ text: "OK" }]) },
      { text: "Fermer", style: "cancel" },
    ]);
  }, []);

  const handleExportAll = React.useCallback(() => {
    Alert.alert("Exporter tous les documents", "Tous les documents seront exportés en ZIP.", [
      { text: "Annuler", style: "cancel" },
      { text: "Exporter" },
    ]);
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
            <Pressable style={styles.headerButton} onPress={handleExportAll}>
              <MaterialIcons name="file-download" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Documents et relevés</Text>
            <Text style={styles.pageSubtitle}>Consultez et téléchargez vos documents bancaires.</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialIcons name="folder" size={22} color="#111827" />
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryTitle}>{documents.length} documents</Text>
              <Text style={styles.summaryText}>Dernière mise à jour : 2 juin 2026</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((filter) => {
              const isActive = filter === activeFilter;
              const count = filter === "Tous" ? documents.length : documents.filter((d) => d.category === filter).length;
              return (
                <Pressable
                  key={filter}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {filter} ({count})
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.documentsCard}>
            {visibleDocuments.length > 0 ? (
              visibleDocuments.map((doc, index) => (
                <DocumentRow
                  key={doc.id}
                  document={doc}
                  isLast={index === visibleDocuments.length - 1}
                  onPress={() => handleDocumentPress(doc)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="folder-open" size={26} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>Aucun document</Text>
                <Text style={styles.emptyText}>Rien à afficher pour ce filtre.</Text>
              </View>
            )}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Les documents sont conservés conformément à la réglementation bancaire. Contactez le support pour toute demande spécifique.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScreenTransition>
  );
}

function DocumentRow({ document, isLast, onPress }: { document: DocumentItem; isLast: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.documentRow, !isLast && styles.documentRowBorder]} onPress={onPress}>
      <View style={styles.documentIcon}>
        <MaterialIcons name={document.icon} size={20} color="#111827" />
      </View>
      <View style={styles.documentCopy}>
        <View style={styles.documentTitleRow}>
          <Text style={styles.documentTitle}>{document.title}</Text>
          <Text style={styles.documentDate}>{document.date}</Text>
        </View>
        <Text style={styles.documentDescription}>{document.description}</Text>
        <View style={styles.documentMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{document.category}</Text>
          </View>
          <Text style={styles.documentSize}>{document.size}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
    </Pressable>
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
  summaryCard: {
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
  summaryIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    color: "#05070A",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  summaryText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 14,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
  },
  filterPillActive: {
    borderColor: "#111827",
    backgroundColor: "#111827",
  },
  filterText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  documentsCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  documentRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  documentIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  documentCopy: {
    flex: 1,
    minWidth: 0,
  },
  documentTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  documentTitle: {
    flex: 1,
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  documentDate: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  documentDescription: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  documentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  categoryBadgeText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
  },
  documentSize: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 36,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    marginTop: 10,
  },
  emptyText: {
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
