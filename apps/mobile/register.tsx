import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useMobileAuth } from "@/components/mobile/mobile-auth-provider";
import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

// TODO: Connect registration endpoint
// TODO: Connect Aether Identity user creation
// TODO: Connect KYC onboarding later
// TODO: Connect privacy consent flow

const regions = ["Europe", "North America", "Asia-Pacific"];

export default function RegisterScreen() {
  const insets = usePhoneSafeAreaInsets();
  const { signIn } = useMobileAuth();
  const [prenom, setPrenom] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [region, setRegion] = React.useState(0);
  const [showRegion, setShowRegion] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  function handleSubmit() {
    setError("");
    setSuccess(false);

    if (!prenom || !nom || !email || !password || !confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setSuccess(true);
    signIn({ email, firstName: prenom, lastName: nom });
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
            <Text style={styles.brandName}>Aether Bank</Text>
          </View>

          <View style={styles.formCard}>
            {error ? (
              <View style={styles.notice}>
                <MaterialIcons name="error-outline" size={18} color="#C2410C" />
                <Text style={styles.noticeText}>{error}</Text>
              </View>
            ) : null}
            {success ? (
              <View style={[styles.notice, { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }]}>
                <MaterialIcons name="check-circle" size={18} color="#168A45" />
                <Text style={[styles.noticeText, { color: "#166534" }]}>
                  Compte créé. Redirection...
                </Text>
              </View>
            ) : null}

            <View style={styles.nameRow}>
              <View style={[styles.fieldBlock, { flex: 1 }]}>
                <Text style={styles.label}>Prénom</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Liam"
                    placeholderTextColor="#9CA3AF"
                    value={prenom}
                    onChangeText={setPrenom}
                    autoCapitalize="words"
                    textContentType="givenName"
                  />
                </View>
              </View>
              <View style={[styles.fieldBlock, { flex: 1 }]}>
                <Text style={styles.label}>Nom</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Dispa"
                    placeholderTextColor="#9CA3AF"
                    value={nom}
                    onChangeText={setNom}
                    autoCapitalize="words"
                    textContentType="familyName"
                  />
                </View>
              </View>
            </View>

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
                  placeholder="Minimum 8 caractères"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  textContentType="newPassword"
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Confirmation du mot de passe</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="lock-outline" size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Répétez le mot de passe"
                  placeholderTextColor="#9CA3AF"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                  textContentType="newPassword"
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Région de résidence</Text>
              <Pressable style={styles.inputWrap} onPress={() => setShowRegion(!showRegion)}>
                <MaterialIcons name="public" size={18} color="#6B7280" />
                <Text style={[styles.input, !region ? { color: "#9CA3AF" } : undefined]}>
                  {regions[region] || "Sélectionnez une région"}
                </Text>
                <MaterialIcons name="expand-more" size={18} color="#6B7280" />
              </Pressable>
              {showRegion && (
                <View style={styles.dropdown}>
                  {regions.map((r, i) => (
                    <Pressable
                      key={r}
                      style={[styles.dropdownItem, i === region && styles.dropdownItemActive]}
                      onPress={() => {
                        setRegion(i);
                        setShowRegion(false);
                      }}
                    >
                      <Text style={[styles.dropdownText, i === region && styles.dropdownTextActive]}>
                        {r}
                      </Text>
                      {i === region && (
                        <MaterialIcons name="check" size={16} color="#FFFFFF" />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Créer mon compte</Text>
            </Pressable>
          </View>

          <Pressable style={styles.switchLink} onPress={() => router.push("/login")}>
            <Text style={styles.switchText}>J'ai déjà un compte</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Protected by Aether Identity</Text>
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
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  brandSub: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  formCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 20,
    gap: 14,
    backgroundColor: "#FFFFFF",
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FDBA74",
    borderRadius: 12,
    padding: 11,
    backgroundColor: "#FFF7ED",
  },
  noticeText: {
    flex: 1,
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    gap: 10,
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
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemActive: {
    backgroundColor: "#111827",
  },
  dropdownText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },
  dropdownTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  privacyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#F5F7FA",
  },
  privacyText: {
    flex: 1,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  primaryButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#111827",
    marginTop: 2,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  switchLink: {
    alignItems: "center",
    marginTop: 20,
  },
  switchText: {
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
