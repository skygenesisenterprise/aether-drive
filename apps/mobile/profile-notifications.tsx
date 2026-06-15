import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];
type NotificationFilter = "Toutes" | "Non lues" | "Sécurité" | "Transactions";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: Exclude<NotificationFilter, "Toutes" | "Non lues"> | "Compte";
  icon: IconName;
  unread?: boolean;
}

const filters: NotificationFilter[] = ["Toutes", "Non lues", "Sécurité", "Transactions"];

const notifications: NotificationItem[] = [
  {
    id: "security-login",
    title: "Nouvelle connexion approuvée",
    description: "Connexion à votre compte depuis Marseille, France.",
    time: "Il y a 8 min",
    category: "Sécurité",
    icon: "verified-user",
    unread: true,
  },
  {
    id: "card-declined",
    title: "Paiement refusé",
    description: "Hostinger · Solde insuffisant sur Liam Dispa Euro.",
    time: "Aujourd'hui, 15:20",
    category: "Transactions",
    icon: "credit-card-off",
    unread: true,
  },
  {
    id: "statement",
    title: "Relevé disponible",
    description: "Votre relevé mensuel de mai 2026 est prêt.",
    time: "Hier",
    category: "Compte",
    icon: "description",
  },
  {
    id: "mfa",
    title: "MFA confirmé",
    description: "Votre méthode de double authentification est active.",
    time: "10 juin",
    category: "Sécurité",
    icon: "lock",
  },
  {
    id: "incoming",
    title: "Virement reçu",
    description: "SGE Europe a crédité votre compte principal.",
    time: "8 juin",
    category: "Transactions",
    icon: "south-west",
  },
];

export default function ProfileNotificationsScreen() {
  const insets = usePhoneSafeAreaInsets();
  const [activeFilter, setActiveFilter] = React.useState<NotificationFilter>("Toutes");

  const visibleNotifications = notifications.filter((notification) => {
    if (activeFilter === "Toutes") {
      return true;
    }

    if (activeFilter === "Non lues") {
      return notification.unread;
    }

    return notification.category === activeFilter;
  });

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
              <MaterialIcons name="done-all" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Boîte de réception</Text>
            <Text style={styles.pageSubtitle}>Centre de notifications Aether Bank.</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialIcons name="notifications-active" size={22} color="#111827" />
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryTitle}>16 notifications</Text>
              <Text style={styles.summaryText}>2 éléments nécessitent votre attention.</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((filter) => {
              const isActive = filter === activeFilter;

              return (
                <Pressable
                  key={filter}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.notificationsCard}>
            {visibleNotifications.length > 0 ? (
              visibleNotifications.map((notification, index) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  isLast={index === visibleNotifications.length - 1}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="inbox" size={26} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>Aucune notification</Text>
                <Text style={styles.emptyText}>Rien à afficher pour ce filtre.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenTransition>
  );
}

function NotificationRow({ notification, isLast }: { notification: NotificationItem; isLast: boolean }) {
  return (
    <Pressable style={[styles.notificationRow, !isLast && styles.notificationRowBorder]}>
      <View style={styles.notificationIcon}>
        <MaterialIcons name={notification.icon} size={20} color="#111827" />
        {notification.unread ? <View style={styles.unreadDot} /> : null}
      </View>
      <View style={styles.notificationCopy}>
        <View style={styles.notificationTitleRow}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
        <Text style={styles.notificationDescription}>{notification.description}</Text>
        <Text style={styles.notificationCategory}>{notification.category}</Text>
      </View>
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
  notificationsCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  notificationRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
  },
  notificationRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  notificationIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  unreadDot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },
  notificationCopy: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  notificationTitle: {
    flex: 1,
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  notificationTime: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
  },
  notificationDescription: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  notificationCategory: {
    color: "#111827",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
    marginTop: 7,
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
});
