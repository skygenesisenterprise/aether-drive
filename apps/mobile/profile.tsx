import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMobileAuth } from "@/components/mobile/mobile-auth-provider";
import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

// TODO: Connect Aether Identity profile endpoint
const profile = {
  name: "Liam Dispa",
  username: "@liamvonastoria",
  role: "Founder & President",
  organization: "Sky Genesis Enterprise",
  identityStatus: "Enterprise Verified",
  lastLogin: "12 juin 2026 à 12:27",
};

// TODO: Connect SGE API organization endpoint
const organization = {
  name: "Sky Genesis Enterprise",
  organizations: 4,
  financialAccounts: 12,
  activeRoles: 3,
};

// TODO: Connect Aether Ledger status endpoint
const systemStatus = {
  identity: "Connected",
  api: "Operational",
  ledger: "Operational",
};

const isDeveloperAccess = true;

const menuItems: { icon: IconName; label: string; badge?: string; route?: "/profile-notifications" | "/profile-infos" | "/profile-bank" | "/profile-security" | "/profile-document" | "/profile-org" | "/profile-financial" | "/profile-ledger" | "/profile-support" | "/profile-settings" }[] = [
  { icon: "inbox", label: "Boîte de réception", badge: "16", route: "/profile-notifications" },
  { icon: "person-outline", label: "Informations personnelles", route: "/profile-infos" },
  { icon: "account-balance", label: "Coordonnées bancaires", route: "/profile-bank" },
  { icon: "security", label: "Sécurité", route: "/profile-security" },
  { icon: "description", label: "Documents et relevés", route: "/profile-document" },
  // TODO: Connect documents and statements endpoint
  { icon: "business", label: "Organisation", route: "/profile-org" },
  // TODO: Connect financial permissions endpoint
  { icon: "lock-outline", label: "Permissions financières", route: "/profile-financial" },
  { icon: "book", label: "Aether Ledger", route: "/profile-ledger" },
  // TODO: Connect inbox notifications endpoint
  { icon: "headset-mic", label: "Support", route: "/profile-support" },
  { icon: "settings", label: "Paramètres", route: "/profile-settings" },
];

export default function ProfileScreen() {
  const insets = usePhoneSafeAreaInsets();
  const { biometricEnabled, biometricLabel, signOut } = useMobileAuth();

  return (
    <ScreenTransition direction="up">
      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Header />
          <UserHero />
          <SecurityCard biometricEnabled={biometricEnabled} biometricLabel={biometricLabel} />
          <MenuCard />
          <LogoutButton onPress={signOut} />
          <Footer />
        </ScrollView>
      </View>
    </ScreenTransition>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <MaterialIcons name="close" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function UserHero() {
  return (
    <View style={styles.heroSection}>
      <View style={styles.heroAvatar}>
        <Text style={styles.heroAvatarText}>LD</Text>
      </View>
      <Text style={styles.heroName}>{profile.name}</Text>
      <Text style={styles.heroUsername}>{profile.username}</Text>
      <View style={styles.heroDivider} />
      <Text style={styles.heroRole}>{profile.role}</Text>
      <Text style={styles.heroOrg}>{profile.organization}</Text>
      <View style={styles.heroVerified}>
        <MaterialIcons name="verified" size={14} color="#1F8A4C" />
        <Text style={styles.heroVerifiedText}>Verified Enterprise Account</Text>
      </View>
    </View>
  );
}

function SecurityCard({ biometricEnabled, biometricLabel }: { biometricEnabled: boolean; biometricLabel: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderIcon}>
          <MaterialIcons name="shield" size={20} color="#111827" />
        </View>
        <Text style={styles.cardTitle}>Sécurité du compte</Text>
      </View>

      <View style={styles.securityRows}>
        <View style={styles.securityRow}>
          <MaterialIcons name={biometricEnabled ? "check-circle" : "info-outline"} size={16} color={biometricEnabled ? "#1F8A4C" : "#6B7280"} />
          <Text style={styles.securityRowText}>{biometricEnabled ? `${biometricLabel} activé` : `${biometricLabel} désactivé`}</Text>
        </View>
        <View style={styles.securityRow}>
          <MaterialIcons name="check-circle" size={16} color="#1F8A4C" />
          <Text style={styles.securityRowText}>MFA activé</Text>
        </View>
        <View style={styles.securityRow}>
          <MaterialIcons name="access-time" size={16} color="#6B7280" />
          <Text style={styles.securityRowTextSecondary}>
            Dernière connexion : aujourd'hui à 12:27
          </Text>
        </View>
      </View>
    </View>
  );
}

function MenuCard() {
  return (
    <View style={styles.card}>
      {menuItems.map((item, index) => (
        <Pressable
          key={item.label}
          onPress={() => {
            if (item.route) {
              router.push(item.route);
            }
          }}
          style={[
            styles.menuRow,
            index < menuItems.length - 1 && styles.menuRowBorder,
          ]}
        >
          <View style={styles.menuRowLeading}>
            <View style={styles.menuIcon}>
              <MaterialIcons name={item.icon} size={20} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </View>
          <View style={styles.menuRowTrailing}>
            {item.badge ? (
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>{item.badge}</Text>
              </View>
            ) : null}
            <MaterialIcons name="chevron-right" size={18} color="#9CA3AF" />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.logoutButton} onPress={onPress}>
      <MaterialIcons name="logout" size={18} color="#BD2E2E" />
      <Text style={styles.logoutText}>Se déconnecter</Text>
    </Pressable>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>Aether Bank</Text>
      <Text style={styles.footerVersion}>Version 1.0.0</Text>
    </View>
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
    marginBottom: 10,
  },
  closeButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "#111827",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  identityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
  },
  identityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  identityPillText: {
    color: "#374151",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
  },
  heroSection: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 20,
    marginBottom: 4,
  },
  heroAvatar: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 28,
    marginBottom: 14,
    backgroundColor: "#111827",
  },
  heroAvatarText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },
  heroName: {
    color: "#05070A",
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "900",
    textAlign: "center",
  },
  heroUsername: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  heroDivider: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginVertical: 12,
    backgroundColor: "#D1D5DB",
  },
  heroRole: {
    color: "#111827",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  heroOrg: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  heroVerified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EAF8EF",
  },
  heroVerifiedText: {
    color: "#1F8A4C",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
  },
  cardIdentity: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "#087BEA",
  },
  cardIdentityTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  cardIdentityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  cardIdentityCopy: {
    flex: 1,
  },
  cardIdentityTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
  },
  cardIdentitySubtitle: {
    color: "#D8EBFF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 2,
  },
  cardIdentityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  cardIdentityBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
  },
  cardIdentityFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  featureRowText: {
    color: "#D8EBFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },
  cardIdentityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  cardIdentityButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  card: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  cardTitle: {
    color: "#05070A",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  orgStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F5F7FA",
  },
  orgDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#D1D5DB",
  },
  statItem: {
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    color: "#05070A",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
  },
  cardActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#111827",
  },
  cardActionButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  securityRows: {
    gap: 10,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  securityRowText: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  securityRowTextSecondary: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuRowLeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  menuLabel: {
    color: "#111827",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    flex: 1,
  },
  menuRowTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuBadge: {
    minWidth: 22,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  menuBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "900",
  },
  devSection: {
    marginBottom: 14,
  },
  devSectionTitle: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 2,
  },
  menuIconDev: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  devLabel: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
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
  footerStatus: {
    alignItems: "center",
    gap: 2,
    marginTop: 6,
  },
  footerStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  footerStatusLabel: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  footerStatusValue: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  footerLogin: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    marginTop: 4,
  },
});
