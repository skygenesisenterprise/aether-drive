import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";
import { MobileTokens } from "@/constants/theme";
import type { AetherProduct, DeveloperApp, Guide, IconName, StatusTone } from "@/data/developer";
import { useTheme } from "@/hooks/use-theme";

interface MobileScreenProps {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

interface SectionHeaderProps {
  title: string;
  action?: string;
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  accent?: string;
}

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
}

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: IconName;
  onPress?: () => void;
}

interface ProductCardProps {
  product: AetherProduct;
  onPress?: () => void;
}

interface GuideCardProps {
  guide: Guide;
  onPress?: () => void;
}

interface DeveloperAppCardProps {
  app: DeveloperApp;
  onPress?: () => void;
}

const badgeColors: Record<StatusTone, { backgroundColor: string; color: string }> = {
  blue: { backgroundColor: "#E8F1FF", color: "#1F64D8" },
  green: { backgroundColor: "#E9F8EF", color: "#23834F" },
  orange: { backgroundColor: "#FFF3E1", color: "#B56A00" },
  red: { backgroundColor: "#FDECEC", color: "#BD2E2E" },
  gray: { backgroundColor: "#EEF1F5", color: "#5D6675" },
};

export function MobileScreen({ children, eyebrow, title, subtitle }: MobileScreenProps) {
  const insets = usePhoneSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 6 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {eyebrow ? <Text style={[styles.eyebrow, { color: theme.primary }]}>{eyebrow}</Text> : null}
          <Text style={[styles.screenTitle, { color: theme.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {action ? <Text style={[styles.sectionAction, { color: theme.primary }]}>{action}</Text> : null}
    </View>
  );
}

export function InfoCard({ title, children, accent = "#0A84FF" }: InfoCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardTitleRow}>
        <View style={[styles.cardAccent, { backgroundColor: accent }]} />
        <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function StatusBadge({ label, tone = "gray" }: StatusBadgeProps) {
  const colors = badgeColors[tone];

  return (
    <View style={[styles.statusBadge, { backgroundColor: colors.backgroundColor }]}>
      <Text style={[styles.statusBadgeText, { color: colors.color }]}>{label}</Text>
    </View>
  );
}

export function QuickAction({ title, subtitle, icon, onPress }: QuickActionProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.quickAction, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.quickIconWrap}>
        <MaterialIcons name={icon} size={24} color={theme.primary} />
      </View>
      <Text style={[styles.quickTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.quickSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </Pressable>
  );
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={[styles.productIcon, { backgroundColor: `${product.accent}18` }]}>
        <MaterialIcons name={product.icon} size={28} color={product.accent} />
      </View>
      <View style={styles.flex}>
        <View style={styles.productTopRow}>
          <Text style={[styles.itemTitle, { color: theme.text }]}>{product.name}</Text>
          <StatusBadge label={product.audience} tone="blue" />
        </View>
        <Text style={[styles.itemBody, { color: theme.textSecondary }]}>{product.description}</Text>
        <Text style={[styles.cta, { color: theme.primary }]}>{product.cta}</Text>
      </View>
    </Pressable>
  );
}

export function GuideCard({ guide, onPress }: GuideCardProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.guideMetaRow}>
        <StatusBadge label={guide.category} tone="blue" />
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          {guide.duration} - {guide.level}
        </Text>
      </View>
      <Text style={[styles.itemTitle, { color: theme.text }]}>{guide.title}</Text>
      <Text style={[styles.itemBody, { color: theme.textSecondary }]}>{guide.summary}</Text>
    </Pressable>
  );
}

export function DeveloperAppCard({ app, onPress }: DeveloperAppCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.appCard, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.appIcon}>
        <Text style={styles.appIconText}>{app.name.slice(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.flex}>
        <View style={styles.productTopRow}>
          <Text style={[styles.itemTitle, { color: theme.text }]}>{app.name}</Text>
          <StatusBadge label={app.reviewStatus} tone={app.statusTone} />
        </View>
        <Text style={[styles.itemBody, { color: theme.textSecondary }]}>
          {app.product} - {app.type} - {app.environment}
        </Text>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>Updated {app.lastUpdated}</Text>
      </View>
    </Pressable>
  );
}

export function KeyValueRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();

  return (
    <View style={styles.keyValueRow}>
      <Text style={[styles.keyLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.keyValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 128,
    gap: 18,
  },
  header: {
    gap: 6,
    paddingTop: 8,
    paddingBottom: 2,
  },
  eyebrow: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  screenTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
  },
  screenSubtitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
  },
  sectionHeader: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "800",
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    borderWidth: 1,
    borderRadius: MobileTokens.radius.md,
    padding: 16,
    gap: 12,
    ...MobileTokens.shadow.card,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardAccent: {
    width: 8,
    height: 26,
    borderRadius: 999,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "800",
  },
  quickAction: {
    width: "48%",
    borderWidth: 1,
    borderRadius: MobileTokens.radius.md,
    padding: 14,
    gap: 8,
    ...MobileTokens.shadow.card,
  },
  quickIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF1FF",
  },
  quickTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
  },
  quickSubtitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  productCard: {
    borderWidth: 1,
    borderRadius: MobileTokens.radius.md,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    ...MobileTokens.shadow.card,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  productTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  appCard: {
    borderWidth: 1,
    borderRadius: MobileTokens.radius.md,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    ...MobileTokens.shadow.card,
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  appIconText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  flex: {
    flex: 1,
    gap: 7,
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
  },
  itemBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  cta: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  guideMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  metaText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  keyValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingVertical: 8,
  },
  keyLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
  },
  keyValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
});

export const mobileStyles = styles;
