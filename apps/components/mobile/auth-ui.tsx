import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";
import type { IconName } from "@/data/developer";

interface AuthScreenProps {
  children: React.ReactNode;
  footerAction: React.ReactNode;
  subtitle: string;
  title: string;
}

interface AuthFieldProps {
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  icon: IconName;
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  textContentType?: "emailAddress" | "password" | "name" | "newPassword";
  value: string;
}

interface AuthButtonProps {
  label: string;
  onPress: () => void;
}

interface AuthNoticeProps {
  icon?: IconName;
  message: string;
  tone?: "error" | "success";
}

export function AuthScreen({ children, footerAction, subtitle, title }: AuthScreenProps) {
  const insets = usePhoneSafeAreaInsets();
  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>Sky Genesis Enterprise</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {children}

          <Divider label="Or continue with" />
          <View style={styles.socialRow}>
            <SocialButton label="GH" />
            <SocialButton label="G" />
            <SocialButton label="DC" />
          </View>
        </View>

        <View style={styles.secureRow}>
          <MaterialIcons name="check-circle" size={17} color="#168A45" />
          <Text style={styles.secureText}>Secure SSL/TLS Connection</Text>
        </View>

        <View style={styles.footer}>
          {footerAction}
          <Text style={styles.footerLegal}>
            Any unauthorized access attempt is strictly prohibited and will be reported to the proper authorities.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export function AuthField({
  autoCapitalize = "none",
  icon,
  label,
  onChangeText,
  placeholder,
  secureTextEntry,
  textContentType,
  value,
}: AuthFieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <MaterialIcons name={icon} size={20} color="#6B7280" />
        <TextInput
          autoCapitalize={autoCapitalize}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          textContentType={textContentType}
          value={value}
        />
      </View>
    </View>
  );
}

export function AuthButton({ label, onPress }: AuthButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function AuthNotice({ icon, message, tone = "error" }: AuthNoticeProps) {
  const success = tone === "success";

  return (
    <View style={[styles.notice, success ? styles.noticeSuccess : styles.noticeError]}>
      <MaterialIcons name={icon ?? (success ? "check-circle" : "error-outline")} size={18} color={success ? "#168A45" : "#C2410C"} />
      <Text style={[styles.noticeText, { color: success ? "#166534" : "#9A3412" }]}>{message}</Text>
    </View>
  );
}

export function CheckboxRow({
  checked,
  label,
  onPress,
}: {
  checked: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.checkboxRow}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <MaterialIcons name="check" size={15} color="#FFFFFF" /> : null}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <Pressable style={styles.socialButton}>
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#D8DCE3",
    borderRadius: 18,
    padding: 22,
    gap: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#111827",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  brandBlock: {
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  brand: {
    color: "#0A5DB8",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800",
  },
  title: {
    color: "#05070A",
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "500",
  },
  fieldBlock: {
    gap: 7,
  },
  label: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },
  inputWrap: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFB",
  },
  input: {
    flex: 1,
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    paddingVertical: 0,
  },
  primaryButton: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#0A5DB8",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
  },
  noticeError: {
    borderColor: "#FDBA74",
    backgroundColor: "#FFF7ED",
  },
  noticeSuccess: {
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C9CED8",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    borderColor: "#0A5DB8",
    backgroundColor: "#0A5DB8",
  },
  checkboxLabel: {
    flex: 1,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  socialText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  secureText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  footer: {
    gap: 8,
  },
  footerLegal: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
  },
});
