import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface PersonalField {
  label: string;
  value: string;
  icon: IconName;
  editable?: boolean;
}

interface SecuritySetting {
  title: string;
  description: string;
  icon: IconName;
  enabled: boolean;
}

const personalInfo: PersonalField[] = [
  { label: "Nom complet", value: "Liam Dispa", icon: "person" },
  { label: "Date de naissance", value: "15 mars 1992", icon: "cake" },
  { label: "Nationalité", value: "Française", icon: "flag" },
  { label: "Adresse", value: "12 Rue de la Paix, 75002 Paris", icon: "location-on" },
  { label: "Téléphone", value: "+33 6 12 34 56 78", icon: "phone" },
  { label: "Email", value: "liam.dispa@aetherbank.com", icon: "email" },
];

const accountDetails: PersonalField[] = [
  { label: "Identifiant client", value: "AET-2024-001847", icon: "badge" },
  { label: "Type de compte", value: "Particulier", icon: "account-circle" },
  { label: "Devise principale", value: "EUR (€)", icon: "euro" },
  { label: "Région", value: "Europe (SEPA)", icon: "public" },
  { label: "Membre depuis", value: "Janvier 2024", icon: "calendar-today" },
  { label: "Dernière connexion", value: "Aujourd'hui, 14:32", icon: "access-time" },
];

const securitySettings: SecuritySetting[] = [
  {
    title: "Authentification à deux facteurs",
    description: "Protégez votre compte avec une double vérification.",
    icon: "security",
    enabled: true,
  },
  {
    title: "Face ID / Empreinte digitale",
    description: "Connexion et paiements biométriques.",
    icon: "fingerprint",
    enabled: true,
  },
  {
    title: "Notifications de connexion",
    description: "Recevez une alerte à chaque connexion.",
    icon: "notifications-active",
    enabled: true,
  },
  {
    title: "Code PIN pour transactions",
    description: "Code requis pour les virements.",
    icon: "lock",
    enabled: false,
  },
];

const verificationDocuments = [
  { title: "Pièce d'identité", status: "Vérifié", icon: "badge" },
  { title: "Justificatif de domicile", status: "Vérifié", icon: "home" },
  { title: "Selfie de vérification", status: "Vérifié", icon: "camera-alt" },
];

export default function ProfileInfosScreen() {
  const insets = usePhoneSafeAreaInsets();

  const handleFieldPress = React.useCallback((field: PersonalField) => {
    if (field.editable) {
      Alert.alert(field.label, `Modifier ${field.label.toLowerCase()} — fonctionnalité à venir.`, [{ text: "OK" }]);
    } else {
      Alert.alert(field.label, field.value, [{ text: "OK" }]);
    }
  }, []);

  const handleSecurityPress = React.useCallback((setting: SecuritySetting) => {
    Alert.alert(setting.title, setting.description, [{ text: "OK" }]);
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
              <MaterialIcons name="edit" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Mes informations</Text>
            <Text style={styles.pageSubtitle}>Gérez vos données personnelles et la sécurité de votre compte.</Text>
          </View>

          <View style={styles.identityCard}>
            <View style={styles.identityAvatar}>
              <Text style={styles.identityInitials}>LD</Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.identityName}>Liam Dispa</Text>
              <Text style={styles.identityEmail}>liam.dispa@aetherbank.com</Text>
              <Text style={styles.identityMember}>Membre depuis janvier 2024</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>
              <Pressable>
                <Text style={styles.sectionAction}>Modifier</Text>
              </Pressable>
            </View>
            {personalInfo.map((field, index) => (
              <Pressable
                key={field.label}
                style={[styles.fieldRow, index < personalInfo.length - 1 && styles.fieldRowBorder]}
                onPress={() => handleFieldPress(field)}
              >
                <View style={styles.fieldIcon}>
                  <MaterialIcons name={field.icon} size={18} color="#111827" />
                </View>
                <View style={styles.fieldCopy}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Détails du compte</Text>
            </View>
            {accountDetails.map((field, index) => (
              <Pressable
                key={field.label}
                style={[styles.fieldRow, index < accountDetails.length - 1 && styles.fieldRowBorder]}
                onPress={() => handleFieldPress(field)}
              >
                <View style={styles.fieldIcon}>
                  <MaterialIcons name={field.icon} size={18} color="#111827" />
                </View>
                <View style={styles.fieldCopy}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Documents de vérification</Text>
            </View>
            {verificationDocuments.map((doc, index) => (
              <View
                key={doc.title}
                style={[styles.fieldRow, index < verificationDocuments.length - 1 && styles.fieldRowBorder]}
              >
                <View style={styles.fieldIcon}>
                  <MaterialIcons name={doc.icon} size={18} color="#111827" />
                </View>
                <View style={styles.fieldCopy}>
                  <Text style={styles.fieldLabel}>{doc.title}</Text>
                  <Text style={styles.fieldValue}>{doc.status}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="check-circle" size={16} color="#1F8A4C" />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sécurité</Text>
              <Pressable onPress={() => router.push("/profile-notifications")}>
                <Text style={styles.sectionAction}>Paramètres</Text>
              </Pressable>
            </View>
            {securitySettings.map((setting, index) => (
              <Pressable
                key={setting.title}
                style={[styles.fieldRow, index < securitySettings.length - 1 && styles.fieldRowBorder]}
                onPress={() => handleSecurityPress(setting)}
              >
                <View style={styles.fieldIcon}>
                  <MaterialIcons name={setting.icon} size={18} color="#111827" />
                </View>
                <View style={styles.fieldCopy}>
                  <Text style={styles.fieldLabel}>{setting.title}</Text>
                  <Text style={styles.fieldValue}>{setting.description}</Text>
                </View>
                <View style={[styles.toggleBadge, setting.enabled && styles.toggleBadgeEnabled]}>
                  <Text style={[styles.toggleText, setting.enabled && styles.toggleTextEnabled]}>
                    {setting.enabled ? "ON" : "OFF"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Vos données sont protégées conformément au RGPD. Modifiez ou supprimez vos informations depuis les paramètres.
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
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  identityAvatar: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    backgroundColor: "#111827",
  },
  identityInitials: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
  },
  identityCopy: {
    flex: 1,
  },
  identityName: {
    color: "#05070A",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  identityEmail: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  identityMember: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
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
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  fieldRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  fieldIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  fieldCopy: {
    flex: 1,
    minWidth: 0,
  },
  fieldLabel: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  fieldValue: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  toggleBadgeEnabled: {
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
