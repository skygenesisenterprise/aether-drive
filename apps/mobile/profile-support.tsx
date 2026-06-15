import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface SupportChannel {
  title: string;
  description: string;
  icon: IconName;
  action: string;
  available: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
  icon: IconName;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "pending" | "resolved";
  date: string;
  lastUpdate: string;
}

const supportChannels: SupportChannel[] = [
  {
    title: "Chat en direct",
    description: "Discutez avec un agent en temps réel.",
    icon: "chat",
    action: "Démarrer",
    available: true,
  },
  {
    title: "Email support",
    description: "Envoyez un email à support@aetherbank.com.",
    icon: "email",
    action: "Envoyer",
    available: true,
  },
  {
    title: "Appel téléphonique",
    description: "Appelez le +33 1 80 00 00 00 (FR).",
    icon: "phone",
    action: "Appeler",
    available: true,
  },
  {
    title: "Visioconférence",
    description: "Planifiez un appel vidéo avec un conseiller.",
    icon: "videocam",
    action: "Planifier",
    available: false,
  },
];

const faqItems: FAQItem[] = [
  {
    question: "Comment modifier mon mot de passe ?",
    answer: "Rendez-vous dans Sécurité > Mot de passe du compte.",
    icon: "lock",
  },
  {
    question: "Comment activer la 2FA ?",
    answer: "Allez dans Sécurité > Authentification > 2FA.",
    icon: "security",
  },
  {
    question: "Comment effectuer un virement ?",
    answer: "Utilisez le menu Entre mes comptes ou le bouton '+' depuis l'accueil.",
    icon: "send",
  },
  {
    question: "Comment télécharger un RIB ?",
    answer: "Accédez à Coordonnées bancaires > Télécharger RIB.",
    icon: "description",
  },
  {
    question: "Comment contacter le support ?",
    answer: "Utilisez le chat en direct ou appelez notre numéro dédié.",
    icon: "support-agent",
  },
];

const supportTickets: SupportTicket[] = [
  {
    id: "TK-2024-0042",
    subject: "Problème de connexion",
    status: "resolved",
    date: "10 juin 2026",
    lastUpdate: "11 juin 2026",
  },
  {
    id: "TK-2024-0058",
    subject: "Modification de limites",
    status: "pending",
    date: "12 juin 2026",
    lastUpdate: "12 juin 2026",
  },
  {
    id: "TK-2024-0061",
    subject: "Question IBAN international",
    status: "open",
    date: "13 juin 2026",
    lastUpdate: "13 juin 2026",
  },
];

export default function ProfileSupportScreen() {
  const insets = usePhoneSafeAreaInsets();

  const handleChannelPress = React.useCallback((channel: SupportChannel) => {
    if (!channel.available) {
      Alert.alert("Indisponible", "Ce canal de support n'est pas encore disponible.", [{ text: "OK" }]);
      return;
    }
    Alert.alert(channel.title, channel.description, [
      { text: "Annuler", style: "cancel" },
      { text: channel.action },
    ]);
  }, []);

  const handleFAQPress = React.useCallback((item: FAQItem) => {
    Alert.alert(item.question, item.answer, [{ text: "OK" }]);
  }, []);

  const handleTicketPress = React.useCallback((ticket: SupportTicket) => {
    Alert.alert(ticket.subject, `Référence : ${ticket.id}\nStatut : ${ticket.status}\nCréé le : ${ticket.date}\nDernière MAJ : ${ticket.lastUpdate}`, [
      { text: "Fermer", style: "cancel" },
    ]);
  }, []);

  const handleNewTicket = React.useCallback(() => {
    Alert.alert("Nouveau ticket", "Formulaire de création — fonctionnalité à venir.", [{ text: "OK" }]);
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
            <Text style={styles.pageTitle}>Support</Text>
            <Text style={styles.pageSubtitle}>Obtenez de l'aide et contactez l'équipe Aether Bank.</Text>
          </View>

          <View style={styles.emergencyCard}>
            <View style={styles.emergencyIcon}>
              <MaterialIcons name="warning" size={20} color="#EF4444" />
            </View>
            <View style={styles.emergencyCopy}>
              <Text style={styles.emergencyTitle}>Urgence sécurité</Text>
              <Text style={styles.emergencyText}>Si votre compte est compromis, appelez le +33 1 80 00 00 01 immédiatement.</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Canaux de contact</Text>
            </View>
            {supportChannels.map((channel, index) => (
              <Pressable
                key={channel.title}
                style={[styles.channelRow, index < supportChannels.length - 1 && styles.channelRowBorder]}
                onPress={() => handleChannelPress(channel)}
              >
                <View style={[styles.channelIcon, !channel.available && styles.channelIconDisabled]}>
                  <MaterialIcons name={channel.icon} size={18} color={channel.available ? "#111827" : "#9CA3AF"} />
                </View>
                <View style={styles.channelCopy}>
                  <Text style={[styles.channelTitle, !channel.available && styles.channelTitleDisabled]}>
                    {channel.title}
                  </Text>
                  <Text style={styles.channelDescription}>{channel.description}</Text>
                </View>
                <View style={[styles.channelAction, !channel.available && styles.channelActionDisabled]}>
                  <Text style={[styles.channelActionText, !channel.available && styles.channelActionTextDisabled]}>
                    {channel.action}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Questions fréquentes</Text>
            </View>
            {faqItems.map((item, index) => (
              <Pressable
                key={item.question}
                style={[styles.faqRow, index < faqItems.length - 1 && styles.faqRowBorder]}
                onPress={() => handleFAQPress(item)}
              >
                <View style={styles.faqIcon}>
                  <MaterialIcons name={item.icon} size={18} color="#111827" />
                </View>
                <View style={styles.faqCopy}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Text style={styles.faqAnswer} numberOfLines={2}>{item.answer}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes tickets</Text>
              <Pressable onPress={handleNewTicket}>
                <Text style={styles.sectionAction}>Nouveau</Text>
              </Pressable>
            </View>
            {supportTickets.map((ticket, index) => (
              <Pressable
                key={ticket.id}
                style={[styles.ticketRow, index < supportTickets.length - 1 && styles.ticketRowBorder]}
                onPress={() => handleTicketPress(ticket)}
              >
                <View style={[styles.ticketIcon, styles[`ticketIcon${ticket.status}`]]}>
                  <MaterialIcons
                    name={ticket.status === "open" ? "radio-button-unchecked" : ticket.status === "pending" ? "schedule" : "check-circle"}
                    size={16}
                    color={ticket.status === "open" ? "#D97706" : ticket.status === "pending" ? "#3B82F6" : "#1F8A4C"}
                  />
                </View>
                <View style={styles.ticketCopy}>
                  <View style={styles.ticketTitleRow}>
                    <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                    <Text style={styles.ticketId}>{ticket.id}</Text>
                  </View>
                  <Text style={styles.ticketMeta}>Créé le {ticket.date} · MAJ {ticket.lastUpdate}</Text>
                </View>
                <View style={[styles.ticketBadge, styles[`ticketBadge${ticket.status}`]]}>
                  <Text style={[styles.ticketBadgeText, styles[`ticketBadgeText${ticket.status}`]]}>
                    {ticket.status === "open" ? "Ouvert" : ticket.status === "pending" ? "En cours" : "Résolu"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Le support Aether Bank est disponible du lundi au vendredi, de 9h à 18h (CET). Les urgences sécurité sont disponibles 24/7.
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
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FEF2F2",
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  emergencyCopy: {
    flex: 1,
  },
  emergencyTitle: {
    color: "#991B1B",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  emergencyText: {
    color: "#B91C1C",
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
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  channelRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  channelIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  channelIconDisabled: {
    backgroundColor: "#F9FAFB",
  },
  channelCopy: {
    flex: 1,
    minWidth: 0,
  },
  channelTitle: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  channelTitleDisabled: {
    color: "#9CA3AF",
  },
  channelDescription: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  channelAction: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  channelActionDisabled: {
    backgroundColor: "#F3F4F6",
  },
  channelActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
  },
  channelActionTextDisabled: {
    color: "#9CA3AF",
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  faqRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  faqIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  faqCopy: {
    flex: 1,
    minWidth: 0,
  },
  faqQuestion: {
    color: "#05070A",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  faqAnswer: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  ticketRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  ticketIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  ticketIconopen: {
    backgroundColor: "#FEF3C7",
  },
  ticketIconpending: {
    backgroundColor: "#DBEAFE",
  },
  ticketIconresolved: {
    backgroundColor: "#EAF8EF",
  },
  ticketCopy: {
    flex: 1,
    minWidth: 0,
  },
  ticketTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  ticketSubject: {
    flex: 1,
    color: "#05070A",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  ticketId: {
    color: "#9CA3AF",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  ticketMeta: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  ticketBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  ticketBadgeopen: {
    backgroundColor: "#FEF3C7",
  },
  ticketBadgepending: {
    backgroundColor: "#DBEAFE",
  },
  ticketBadgeresolved: {
    backgroundColor: "#EAF8EF",
  },
  ticketBadgeText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
  },
  ticketBadgeTextopen: {
    color: "#D97706",
  },
  ticketBadgeTextpending: {
    color: "#3B82F6",
  },
  ticketBadgeTextresolved: {
    color: "#1F8A4C",
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
