import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface SettingItem {
  title: string;
  description: string;
  icon: IconName;
  type: "toggle" | "navigate" | "action";
  value?: boolean;
  route?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const settingSections: SettingSection[] = [
  {
    title: "Notifications",
    items: [
      {
        title: "Notifications push",
        description: "Recevez des alertes sur votre appareil.",
        icon: "notifications",
        type: "toggle",
        value: true,
      },
      {
        title: "Notifications email",
        description: "Recevez les alertes par email.",
        icon: "email",
        type: "toggle",
        value: true,
      },
      {
        title: "Alertes de sécurité",
        description: "Notifications critiques obligatoires.",
        icon: "shield",
        type: "toggle",
        value: true,
      },
      {
        title: "Promotions et offres",
        description: "Nouvelles fonctionnalités et avantages.",
        icon: "campaign",
        type: "toggle",
        value: false,
      },
    ],
  },
  {
    title: "Apparence",
    items: [
      {
        title: "Mode sombre",
        description: "Thème sombre pour l'interface.",
        icon: "dark-mode",
        type: "toggle",
        value: false,
      },
      {
        title: "Langue",
        description: "Français (FR)",
        icon: "language",
        type: "navigate",
      },
      {
        title: "Devise d'affichage",
        description: "EUR (€)",
        icon: "euro",
        type: "navigate",
      },
    ],
  },
  {
    title: "Confidentialité",
    items: [
      {
        title: "Données personnelles",
        description: "Gérez vos données et préférences RGPD.",
        icon: "privacy-tip",
        type: "navigate",
      },
      {
        title: "Historique d'activité",
        description: "Consultez votre historique d'actions.",
        icon: "history",
        type: "navigate",
      },
      {
        title: "Supprimer mon compte",
        description: "Supprimez définitivement votre compte.",
        icon: "delete-forever",
        type: "action",
      },
    ],
  },
  {
    title: "À propos",
    items: [
      {
        title: "Version",
        description: "1.0.0 (Build 2024.06.13)",
        icon: "info",
        type: "action",
      },
      {
        title: "Conditions d'utilisation",
        description: "Consultez nos CGU.",
        icon: "description",
        type: "navigate",
      },
      {
        title: "Politique de confidentialité",
        description: "Notre politique RGPD.",
        icon: "policy",
        type: "navigate",
      },
      {
        title: "Licences open source",
        description: "Crédits des bibliothèques utilisées.",
        icon: "code",
        type: "navigate",
      },
    ],
  },
];

export default function ProfileSettingsScreen() {
  const insets = usePhoneSafeAreaInsets();
  const [settings, setSettings] = React.useState(() => {
    const initial: Record<string, boolean> = {};
    settingSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.type === "toggle" && item.value !== undefined) {
          initial[item.title] = item.value;
        }
      });
    });
    return initial;
  });

  const handleToggle = React.useCallback((title: string) => {
    setSettings((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const handleItemPress = React.useCallback((item: SettingItem) => {
    if (item.type === "toggle") {
      handleToggle(item.title);
    } else if (item.type === "action") {
      if (item.title === "Supprimer mon compte") {
        Alert.alert(
          "Supprimer mon compte",
          "Cette action est irréversible. Toutes vos données seront supprimées.",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive" },
          ],
        );
      } else {
        Alert.alert(item.title, item.description, [{ text: "OK" }]);
      }
    } else if (item.type === "navigate" && item.route) {
      router.push(item.route as any);
    } else {
      Alert.alert(item.title, item.description, [{ text: "OK" }]);
    }
  }, [handleToggle]);

  const handleLogout = React.useCallback(() => {
    Alert.alert("Se déconnecter", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive" },
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
            <Pressable style={styles.headerButton}>
              <MaterialIcons name="info-outline" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Paramètres</Text>
            <Text style={styles.pageSubtitle}>Configurez votre expérience Aether Bank.</Text>
          </View>

          {settingSections.map((section) => (
            <View key={section.title} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.title}
                  style={[styles.settingRow, index < section.items.length - 1 && styles.settingRowBorder]}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={styles.settingIcon}>
                    <MaterialIcons name={item.icon} size={18} color="#111827" />
                  </View>
                  <View style={styles.settingCopy}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  </View>
                  {item.type === "toggle" ? (
                    <Switch
                      value={settings[item.title]}
                      onValueChange={() => handleToggle(item.title)}
                      trackColor={{ false: "#E5E7EB", true: "#111827" }}
                      thumbColor="#FFFFFF"
                    />
                  ) : item.type === "navigate" ? (
                    <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
                  ) : item.title === "Supprimer mon compte" ? (
                    <MaterialIcons name="chevron-right" size={18} color="#EF4444" />
                  ) : (
                    <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
                  )}
                </Pressable>
              ))}
            </View>
          ))}

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={18} color="#BD2E2E" />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Aether Bank</Text>
            <Text style={styles.footerVersion}>Version 1.0.0</Text>
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
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  settingIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  settingCopy: {
    flex: 1,
    minWidth: 0,
  },
  settingTitle: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  settingDescription: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  logoutText: {
    color: "#BD2E2E",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 8,
    gap: 4,
  },
  footerTitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  footerVersion: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
});
