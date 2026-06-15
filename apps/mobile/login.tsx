import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useMobileAuth } from "@/components/mobile/mobile-auth-provider";
import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

// TODO: Connect Aether Identity / Keycloak SSO
// TODO: Connect SGE API authentication
// TODO: Connect secure token storage with expo-secure-store
// TODO: Open sso.skygenesisenterprise.com with expo-auth-session
// TODO: Configure redirect URI for mobile app
// TODO: Connect Keycloak / Aether Identity client

export default function LoginScreen() {
  const insets = usePhoneSafeAreaInsets();
  const { biometricAvailable, biometricEnabled, biometricLabel, isAuthenticated, isHydrating, signIn } = useMobileAuth();
  const [email, setEmail] = React.useState("admin@aetherbank.me");
  const [password, setPassword] = React.useState("admin123");

  function handleLogin() {
    signIn({ email });
  }

  function handleSSO() {
    // TODO: Open sso.skygenesisenterprise.com with expo-auth-session
  }

  if (isHydrating || isAuthenticated) {
    return null;
  }

  return (
    <ScreenTransition>
      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>Aether Drive</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="mail-outline" size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="liam@aethermail.me"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="lock-outline" size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  textContentType="password"
                />
              </View>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Se connecter</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.ssoButton} onPress={handleSSO}>
              <MaterialIcons name="fingerprint" size={20} color="#FFFFFF" />
              <Text style={styles.ssoButtonText}>Continuer avec Aether Identity</Text>
            </Pressable>

          </View>

          <View style={styles.linksRow}>
            <Pressable>
              <Text style={styles.linkText}>Mot de passe oublié</Text>
            </Pressable>
            <View style={styles.linkDivider} />
            <Pressable onPress={() => router.push("/register")}>
              <Text style={styles.linkText}>Créer un compte</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <View style={styles.footerDot} />
              <Text style={styles.footerText}>Protected by Aether Identity</Text>
            </View>
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
    marginBottom: 32,
  },
  brandName: {
    color: "#05070A",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  brandTagline: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
  },
  formCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 20,
    gap: 14,
    backgroundColor: "#FFFFFF",
  },
  fieldBlock: {
    gap: 6,
  },
  label: {
    color: "#111827",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
  },
  inputWrap: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 13,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    paddingVertical: 0,
  },
  primaryButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#111827",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  helperText: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: -4,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
  },
  ssoButton: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  ssoButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  ssoCaption: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: -2,
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 22,
  },
  linkDivider: {
    width: 1,
    height: 14,
    backgroundColor: "#D1D5DB",
  },
  linkText: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
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
