import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMobileAuth } from "@/components/mobile/mobile-auth-provider";
import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

const user = {
  prenom: "Liam",
  nom: "Dispa",
  initials: "LD",
  organization: "Sky Genesis Enterprise",
  lastLogin: "12 juin 2026 à 12:27",
};

export default function UnlockScreen() {
  const insets = usePhoneSafeAreaInsets();
  const {
    biometricEnabled,
    biometricLabel,
    isAuthenticated,
    session,
    signOut,
    unlockWithBiometrics,
  } = useMobileAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const biometricButtonLabel = `Déverrouiller avec ${biometricLabel}`;

  const handleBiometric = React.useCallback(async () => {
    setIsSubmitting(true);
    setError("");

    const result = await unlockWithBiometrics();

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Authentification biométrique refusée.");
      return;
    }

    router.replace("/home");
  }, [unlockWithBiometrics]);

  const handlePassword = React.useCallback(() => {
    signOut();
    router.replace("/login");
  }, [signOut]);

  const handleSwitchAccount = React.useCallback(() => {
    signOut();
    router.replace("/login");
  }, [signOut]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (biometricEnabled) {
      void handleBiometric();
    }
  }, [biometricEnabled, handleBiometric, isAuthenticated]);

  const firstName = session?.user.firstName ?? user.prenom;
  const initials = `${session?.user.firstName?.[0] ?? user.initials[0]}${session?.user.lastName?.[0] ?? user.initials[1] ?? ""}`.trim();

  return (
    <ScreenTransition>
      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>Aether Bank</Text>
          </View>

          <View style={styles.welcomeCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
              <View style={styles.avatarBadge}>
                <MaterialIcons name="verified" size={12} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.welcomeTitle}>Bon retour, {firstName}</Text>
            <Text style={styles.welcomeSub}>Déverrouillez Aether Bank</Text>

            <View style={styles.userInfoCard}>
              <View style={styles.userInfoRow}>
                <MaterialIcons name="business" size={16} color="#6B7280" />
                <Text style={styles.userInfoText}>{user.organization}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <MaterialIcons name="access-time" size={16} color="#6B7280" />
                <Text style={styles.userInfoText}>
                  Dernière connexion : {user.lastLogin}
                </Text>
              </View>
            </View>

            {error ? (
              <View style={styles.notice}>
                <MaterialIcons name="info-outline" size={16} color="#92400E" />
                <Text style={styles.noticeText}>{error}</Text>
              </View>
            ) : null}

            <Pressable style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]} onPress={() => void handleBiometric()} disabled={isSubmitting}>
              <MaterialIcons name="fingerprint" size={22} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>{isSubmitting ? "Vérification..." : biometricButtonLabel}</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handlePassword}>
              <Text style={styles.secondaryButtonText}>
                Utiliser le mot de passe
              </Text>
            </Pressable>

            <Pressable onPress={handleSwitchAccount}>
              <Text style={styles.switchText}>Changer de compte</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <View style={styles.footerDot} />
              <Text style={styles.footerText}>Protected by Aether Identity</Text>
            </View>
            <Text style={styles.footerSub}>Powered by Sky Genesis Enterprise</Text>
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
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  brandName: {
    color: "#05070A",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  welcomeCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 24,
    gap: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#111827",
    marginBottom: 4,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  welcomeTitle: {
    color: "#05070A",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    textAlign: "center",
  },
  welcomeSub: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: -8,
  },
  userInfoCard: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    gap: 8,
    backgroundColor: "#F5F7FA",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userInfoText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
  },
  notice: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 12,
    padding: 11,
    backgroundColor: "#FFFBEB",
  },
  noticeText: {
    flex: 1,
    color: "#92400E",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  primaryButton: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  secondaryButton: {
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  switchText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
    gap: 4,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  footerText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
  },
  footerSub: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
});
