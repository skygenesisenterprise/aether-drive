import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMobileAuth } from "@/components/mobile/mobile-auth-provider";
import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  enabled: boolean;
  lastUpdated?: string;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  icon: IconName;
}

interface LoginEvent {
  id: string;
  device: string;
  location: string;
  time: string;
  status: "success" | "failed";
  icon: IconName;
}

const activeSessions: ActiveSession[] = [
  {
    id: "session-1",
    device: "iPhone 15 Pro",
    location: "Paris, France",
    lastActive: "En cours",
    isCurrent: true,
    icon: "smartphone",
  },
  {
    id: "session-2",
    device: "MacBook Pro",
    location: "Paris, France",
    lastActive: "Il y a 2 heures",
    isCurrent: false,
    icon: "laptop",
  },
  {
    id: "session-3",
    device: "iPad Air",
    location: "Lyon, France",
    lastActive: "Il y a 3 jours",
    isCurrent: false,
    icon: "tablet-mac",
  },
];

const loginHistory: LoginEvent[] = [
  {
    id: "login-1",
    device: "iPhone 15 Pro",
    location: "Paris, France",
    time: "Aujourd'hui, 14:27",
    status: "success",
    icon: "smartphone",
  },
  {
    id: "login-2",
    device: "MacBook Pro",
    location: "Paris, France",
    time: "Aujourd'hui, 09:15",
    status: "success",
    icon: "laptop",
  },
  {
    id: "login-3",
    device: "Navigateur inconnu",
    location: "Marseille, France",
    time: "Hier, 22:43",
    status: "failed",
    icon: "public",
  },
  {
    id: "login-4",
    device: "iPhone 15 Pro",
    location: "Paris, France",
    time: "11 juin, 18:30",
    status: "success",
    icon: "smartphone",
  },
  {
    id: "login-5",
    device: "Windows PC",
    location: "Lyon, France",
    time: "10 juin, 14:12",
    status: "failed",
    icon: "computer",
  },
];

export default function ProfileSecurityScreen() {
  const insets = usePhoneSafeAreaInsets();
  const {
    biometricAvailable,
    biometricEnabled,
    biometricLabel,
    biometricReason,
    disableBiometrics,
    enableBiometrics,
    lockSession,
  } = useMobileAuth();

  const securityFeatures = React.useMemo<SecurityFeature[]>(
    () => [
      {
        id: "2fa",
        title: "Authentification à deux facteurs",
        description: "Protégez votre connexion avec une double vérification.",
        icon: "security",
        enabled: true,
        lastUpdated: "Activé le 15 mai 2026",
      },
      {
        id: "biometric",
        title: biometricLabel === "Face ID" ? "Face ID" : biometricLabel === "Touch ID" ? "Touch ID" : "Biometrie",
        description: `Déverrouillage et validations avec ${biometricLabel}.`,
        icon: biometricLabel === "Face ID" ? "face" : "fingerprint",
        enabled: biometricEnabled,
        lastUpdated: biometricEnabled ? "Active sur cet appareil" : biometricAvailable ? "Disponible sur cet appareil" : "Non disponible sur cet appareil",
      },
      {
        id: "transaction-pin",
        title: "Code PIN transaction",
        description: "Code requis pour valider les virements.",
        icon: "pin",
        enabled: true,
        lastUpdated: "Modifié le 8 juin 2026",
      },
      {
        id: "login-notifications",
        title: "Notifications de connexion",
        description: "Recevez une alerte à chaque nouvelle connexion.",
        icon: "notifications-active",
        enabled: true,
      },
      {
        id: "auto-lock",
        title: "Verrouillage automatique",
        description: "Verrouille l'app lorsqu'elle passe en arriere-plan.",
        icon: "lock",
        enabled: biometricEnabled,
        lastUpdated: biometricEnabled ? "Lie a l'authentification biométrique" : "Activez la biometrie pour l'utiliser",
      },
    ],
    [biometricAvailable, biometricEnabled, biometricLabel],
  );

  const handleFeatureToggle = React.useCallback((feature: SecurityFeature) => {
    if (feature.id !== "biometric") {
      Alert.alert(
        feature.title,
        feature.enabled
          ? `Désactiver ${feature.title.toLowerCase()} ?`
          : `Activer ${feature.title.toLowerCase()} ?`,
        [
          { text: "Annuler", style: "cancel" },
          { text: feature.enabled ? "Désactiver" : "Activer" },
        ],
      );
      return;
    }

    if (feature.enabled) {
      Alert.alert("Désactiver la biométrie", `Retirer ${biometricLabel} de cet appareil ?`, [
        { text: "Annuler", style: "cancel" },
        {
          text: "Désactiver",
          style: "destructive",
          onPress: () => disableBiometrics(),
        },
      ]);
      return;
    }

    void enableBiometrics().then((result) => {
      if (!result.ok) {
        Alert.alert("Biometrie indisponible", result.error ?? "Impossible d'activer la biometrie.", [{ text: "OK" }]);
      }
    });
  }, [biometricLabel, disableBiometrics, enableBiometrics]);

  const handleSessionPress = React.useCallback((session: ActiveSession) => {
    if (session.isCurrent) {
      Alert.alert("Session actuelle", "C'est votre appareil actuel.", [{ text: "OK" }]);
    } else {
      Alert.alert("Fermer la session", `Déconnecter ${session.device} ?`, [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnecter", style: "destructive" },
      ]);
    }
  }, []);

  const handleLoginPress = React.useCallback((event: LoginEvent) => {
    Alert.alert(
      event.status === "success" ? "Connexion réussie" : "Connexion échouée",
      `${event.device} · ${event.location}\n${event.time}`,
      [{ text: "OK" }],
    );
  }, []);

  const handlePasswordChange = React.useCallback(() => {
    Alert.alert("Modifier le mot de passe", "Redirection vers la page de modification — fonctionnalité à venir.", [{ text: "OK" }]);
  }, []);

  const handleRevokeAll = React.useCallback(() => {
    Alert.alert("Révoquer toutes les sessions", "Déconnecter tous les appareils sauf celui-ci ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Révoquer", style: "destructive" },
    ]);
  }, []);

  const handleBiometricPrimaryAction = React.useCallback(async () => {
    if (biometricEnabled) {
      lockSession();
      return;
    }

    const result = await enableBiometrics();

    if (!result.ok) {
      Alert.alert("Biometrie indisponible", result.error ?? "Impossible d'activer la biometrie.", [{ text: "OK" }]);
      return;
    }

    Alert.alert("Biometrie activee", `${biometricLabel} est maintenant active sur cet iPhone.`, [{ text: "OK" }]);
  }, [biometricEnabled, biometricLabel, enableBiometrics, lockSession]);

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
            <Text style={styles.pageTitle}>Sécurité</Text>
            <Text style={styles.pageSubtitle}>Protégez votre compte et gérez vos accès.</Text>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <MaterialIcons name="verified-user" size={22} color="#1F8A4C" />
            </View>
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>Compte sécurisé</Text>
              <Text style={styles.statusText}>Tous les systèmes de protection sont actifs.</Text>
            </View>
          </View>

          <View style={styles.biometricCard}>
            <View style={styles.biometricHeader}>
              <View style={styles.biometricHeaderIcon}>
                <MaterialIcons name="fingerprint" size={20} color="#111827" />
              </View>
              <View style={styles.biometricHeaderCopy}>
                <Text style={styles.biometricTitle}>{biometricLabel}</Text>
                <Text style={styles.biometricSubtitle}>
                  {biometricEnabled
                    ? `${biometricLabel} est actif sur cet appareil.`
                    : biometricAvailable
                      ? `Activez ${biometricLabel} pour le tester directement sur votre iPhone.`
                      : biometricReason ?? "La biometrie n'est pas disponible sur cet appareil."}
                </Text>
              </View>
            </View>

            <Pressable style={styles.biometricPrimaryButton} onPress={() => void handleBiometricPrimaryAction()}>
              <Text style={styles.biometricPrimaryButtonText}>
                {biometricEnabled ? `Tester ${biometricLabel}` : `Activer ${biometricLabel}`}
              </Text>
            </Pressable>

            {biometricEnabled ? (
              <Pressable style={styles.biometricSecondaryButton} onPress={() => disableBiometrics()}>
                <Text style={styles.biometricSecondaryButtonText}>Desactiver</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mots de passe</Text>
            </View>
            <Pressable style={styles.passwordRow} onPress={handlePasswordChange}>
              <View style={styles.passwordIcon}>
                <MaterialIcons name="lock" size={18} color="#111827" />
              </View>
              <View style={styles.passwordCopy}>
                <Text style={styles.passwordLabel}>Mot de passe du compte</Text>
                <Text style={styles.passwordValue}>Dernière modification : 2 juin 2026</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Authentification</Text>
            </View>
            {securityFeatures.map((feature, index) => (
              <Pressable
                key={feature.title}
                style={[styles.featureRow, index < securityFeatures.length - 1 && styles.featureRowBorder]}
                onPress={() => handleFeatureToggle(feature)}
              >
                <View style={styles.featureIcon}>
                    <MaterialIcons name={feature.icon} size={18} color="#111827" />
                  </View>
                <View style={styles.featureCopy}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  {feature.lastUpdated ? (
                    <Text style={styles.featureMeta}>{feature.lastUpdated}</Text>
                  ) : null}
                </View>
                <View style={[styles.toggle, feature.enabled && styles.toggleEnabled]}>
                  <Text style={[styles.toggleText, feature.enabled && styles.toggleTextEnabled]}>
                    {feature.enabled ? "ON" : "OFF"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sessions actives</Text>
              <Pressable onPress={handleRevokeAll}>
                <Text style={styles.sectionAction}>Tout révoquer</Text>
              </Pressable>
            </View>
            {activeSessions.map((session, index) => (
              <Pressable
                key={session.id}
                style={[styles.sessionRow, index < activeSessions.length - 1 && styles.sessionRowBorder]}
                onPress={() => handleSessionPress(session)}
              >
                <View style={styles.sessionIcon}>
                  <MaterialIcons name={session.icon} size={18} color="#111827" />
                </View>
                <View style={styles.sessionCopy}>
                  <View style={styles.sessionTitleRow}>
                    <Text style={styles.sessionDevice}>{session.device}</Text>
                    {session.isCurrent ? (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Actuel</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.sessionLocation}>{session.location}</Text>
                  <Text style={styles.sessionTime}>{session.lastActive}</Text>
                </View>
                {!session.isCurrent ? (
                  <MaterialIcons name="close" size={18} color="#EF4444" />
                ) : null}
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Historique des connexions</Text>
            </View>
            {loginHistory.map((event, index) => (
              <Pressable
                key={event.id}
                style={[styles.loginRow, index < loginHistory.length - 1 && styles.loginRowBorder]}
                onPress={() => handleLoginPress(event)}
              >
                <View style={[styles.loginIcon, event.status === "failed" && styles.loginIconFailed]}>
                  <MaterialIcons name={event.icon} size={16} color={event.status === "failed" ? "#EF4444" : "#111827"} />
                </View>
                <View style={styles.loginCopy}>
                  <View style={styles.loginTitleRow}>
                    <Text style={styles.loginDevice}>{event.device}</Text>
                    <View style={[styles.loginStatus, event.status === "failed" && styles.loginStatusFailed]}>
                      <Text style={[styles.loginStatusText, event.status === "failed" && styles.loginStatusTextFailed]}>
                        {event.status === "success" ? "Réussi" : "Échoué"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.loginLocation}>{event.location}</Text>
                  <Text style={styles.loginTime}>{event.time}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Aether Identity gère l'ensemble des mécanismes d'authentification. En cas de doute, contactez le support immédiatement.
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
    backgroundColor: "#EAF8EF",
  },
  statusIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  statusCopy: {
    flex: 1,
  },
  statusTitle: {
    color: "#1F8A4C",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  statusText: {
    color: "#1F8A4C",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2,
  },
  biometricCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  biometricHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  biometricHeaderIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  biometricHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  biometricTitle: {
    color: "#05070A",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },
  biometricSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  biometricPrimaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    marginTop: 16,
    backgroundColor: "#111827",
  },
  biometricPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  biometricSecondaryButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  biometricSecondaryButtonText: {
    color: "#111827",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
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
    color: "#EF4444",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  passwordIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  passwordCopy: {
    flex: 1,
    minWidth: 0,
  },
  passwordLabel: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  passwordValue: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  featureIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  featureCopy: {
    flex: 1,
    minWidth: 0,
  },
  featureTitle: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  featureDescription: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  featureMeta: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
    marginTop: 4,
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
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  sessionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sessionIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  sessionCopy: {
    flex: 1,
    minWidth: 0,
  },
  sessionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sessionDevice: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#EAF8EF",
  },
  currentBadgeText: {
    color: "#1F8A4C",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900",
  },
  sessionLocation: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  sessionTime: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  loginRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  loginIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  loginIconFailed: {
    backgroundColor: "#FEF2F2",
  },
  loginCopy: {
    flex: 1,
    minWidth: 0,
  },
  loginTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginDevice: {
    color: "#05070A",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  loginStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#EAF8EF",
  },
  loginStatusFailed: {
    backgroundColor: "#FEF2F2",
  },
  loginStatusText: {
    color: "#1F8A4C",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900",
  },
  loginStatusTextFailed: {
    color: "#EF4444",
  },
  loginLocation: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  loginTime: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
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
