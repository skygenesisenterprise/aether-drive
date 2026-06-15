import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenTransition } from "@/components/mobile/screen-transition";
import { usePhoneSafeAreaInsets } from "@/components/mobile/use-phone-safe-area";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface OrgMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  status: "active" | "pending";
  joinedDate: string;
}

interface OrgSubOrganization {
  id: string;
  name: string;
  type: string;
  members: number;
  accounts: number;
  icon: IconName;
}

interface OrgInvitation {
  id: string;
  email: string;
  role: string;
  sentDate: string;
  status: "pending" | "accepted" | "expired";
}

const organization = {
  name: "Sky Genesis Enterprise",
  createdDate: "15 décembre 2023",
  plan: "Enterprise",
  members: 4,
  subOrganizations: 4,
  financialAccounts: 12,
  activeRoles: 3,
};

const members: OrgMember[] = [
  {
    id: "member-1",
    name: "Liam Dispa",
    role: "Founder & President",
    initials: "LD",
    status: "active",
    joinedDate: "15 décembre 2023",
  },
  {
    id: "member-2",
    name: "Sophie Laurent",
    role: "Chief Financial Officer",
    initials: "SL",
    status: "active",
    joinedDate: "2 janvier 2024",
  },
  {
    id: "member-3",
    name: "Thomas Martin",
    role: "Head of Operations",
    initials: "TM",
    status: "active",
    joinedDate: "10 janvier 2024",
  },
  {
    id: "member-4",
    name: "Emma Dubois",
    role: "Compliance Officer",
    initials: "ED",
    status: "active",
    joinedDate: "5 février 2024",
  },
];

const subOrganizations: OrgSubOrganization[] = [
  {
    id: "sub-1",
    name: "Aether Bank",
    type: "Service",
    members: 4,
    accounts: 6,
    icon: "account-balance",
  },
  {
    id: "sub-2",
    name: "SGE Europe",
    type: "Filiale",
    members: 3,
    accounts: 3,
    icon: "public",
  },
  {
    id: "sub-3",
    name: "Aether Office",
    type: "Département",
    members: 2,
    accounts: 2,
    icon: "business",
  },
  {
    id: "sub-4",
    name: "Vault Infrastructure",
    type: "Coffre",
    members: 4,
    accounts: 1,
    icon: "lock",
  },
];

const invitations: OrgInvitation[] = [
  {
    id: "inv-1",
    email: "jean.dupont@sg-enterprise.com",
    role: "Analyste financier",
    sentDate: "10 juin 2026",
    status: "pending",
  },
  {
    id: "inv-2",
    email: "marie.lefevre@sg-enterprise.com",
    role: "Responsable RH",
    sentDate: "5 juin 2026",
    status: "accepted",
  },
];

const orgRoles = [
  { title: "Founder & President", members: 1, permissions: "Accès total" },
  { title: "Chief Financial Officer", members: 1, permissions: "Gestion financière complète" },
  { title: "Head of Operations", members: 1, permissions: "Opérations et comptes" },
  { title: "Compliance Officer", members: 1, permissions: "Conformité et documents" },
];

export default function ProfileOrgScreen() {
  const insets = usePhoneSafeAreaInsets();

  const handleMemberPress = React.useCallback((member: OrgMember) => {
    Alert.alert(member.name, `Rôle : ${member.role}\nMembre depuis : ${member.joinedDate}`, [{ text: "OK" }]);
  }, []);

  const handleSubOrgPress = React.useCallback((subOrg: OrgSubOrganization) => {
    Alert.alert(subOrg.name, `Type : ${subOrg.type}\nMembres : ${subOrg.members}\nComptes : ${subOrg.accounts}`, [{ text: "OK" }]);
  }, []);

  const handleInvitationPress = React.useCallback((invitation: OrgInvitation) => {
    if (invitation.status === "pending") {
      Alert.alert(invitation.email, `Rôle : ${invitation.role}\nEnvoyée le : ${invitation.sentDate}`, [
        { text: "Révoquer", style: "destructive" },
        { text: "Renvoyer" },
        { text: "Fermer", style: "cancel" },
      ]);
    } else {
      Alert.alert(invitation.email, `Statut : ${invitation.status}`, [{ text: "OK" }]);
    }
  }, []);

  const handleInviteMember = React.useCallback(() => {
    Alert.alert("Inviter un membre", "Formulaire d'invitation — fonctionnalité à venir.", [{ text: "OK" }]);
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
              <MaterialIcons name="settings" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Organization</Text>
            <Text style={styles.pageSubtitle}>Gérez votre organisation et vos équipes.</Text>
          </View>

          <View style={styles.orgHeroCard}>
            <View style={styles.orgHeroIcon}>
              <MaterialIcons name="corporate-fare" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.orgHeroName}>{organization.name}</Text>
            <Text style={styles.orgHeroPlan}>{organization.plan}</Text>
            <Text style={styles.orgHeroDate}>Créée le {organization.createdDate}</Text>

            <View style={styles.orgHeroStats}>
              <View style={styles.orgHeroStat}>
                <Text style={styles.orgHeroStatValue}>{organization.members}</Text>
                <Text style={styles.orgHeroStatLabel}>Membres</Text>
              </View>
              <View style={styles.orgHeroStatDivider} />
              <View style={styles.orgHeroStat}>
                <Text style={styles.orgHeroStatValue}>{organization.subOrganizations}</Text>
                <Text style={styles.orgHeroStatLabel}>Organisations</Text>
              </View>
              <View style={styles.orgHeroStatDivider} />
              <View style={styles.orgHeroStat}>
                <Text style={styles.orgHeroStatValue}>{organization.financialAccounts}</Text>
                <Text style={styles.orgHeroStatLabel}>Comptes</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Membres</Text>
              <Pressable onPress={handleInviteMember}>
                <Text style={styles.sectionAction}>Inviter</Text>
              </Pressable>
            </View>
            {members.map((member, index) => (
              <Pressable
                key={member.id}
                style={[styles.memberRow, index < members.length - 1 && styles.memberRowBorder]}
                onPress={() => handleMemberPress(member)}
              >
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitials}>{member.initials}</Text>
                </View>
                <View style={styles.memberCopy}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
                <View style={[styles.statusBadge, member.status === "active" && styles.statusBadgeActive]}>
                  <Text style={[styles.statusText, member.status === "active" && styles.statusTextActive]}>
                    {member.status === "active" ? "Actif" : "En attente"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sous-organisations</Text>
            </View>
            {subOrganizations.map((subOrg, index) => (
              <Pressable
                key={subOrg.id}
                style={[styles.subOrgRow, index < subOrganizations.length - 1 && styles.subOrgRowBorder]}
                onPress={() => handleSubOrgPress(subOrg)}
              >
                <View style={styles.subOrgIcon}>
                  <MaterialIcons name={subOrg.icon} size={18} color="#111827" />
                </View>
                <View style={styles.subOrgCopy}>
                  <Text style={styles.subOrgName}>{subOrg.name}</Text>
                  <Text style={styles.subOrgType}>{subOrg.type}</Text>
                </View>
                <View style={styles.subOrgMeta}>
                  <Text style={styles.subOrgMetaText}>{subOrg.members} membres</Text>
                  <Text style={styles.subOrgMetaText}>{subOrg.accounts} comptes</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rôles et permissions</Text>
            </View>
            {orgRoles.map((role, index) => (
              <View
                key={role.title}
                style={[styles.roleRow, index < orgRoles.length - 1 && styles.roleRowBorder]}
              >
                <View style={styles.roleIcon}>
                  <MaterialIcons name="admin-panel-settings" size={18} color="#111827" />
                </View>
                <View style={styles.roleCopy}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.rolePermissions}>{role.permissions}</Text>
                </View>
                <View style={styles.roleCountBadge}>
                  <Text style={styles.roleCountText}>{role.members}</Text>
                </View>
              </View>
            ))}
          </View>

          {invitations.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Invitations en cours</Text>
              </View>
              {invitations.map((invitation, index) => (
                <Pressable
                  key={invitation.id}
                  style={[styles.inviteRow, index < invitations.length - 1 && styles.inviteRowBorder]}
                  onPress={() => handleInvitationPress(invitation)}
                >
                  <View style={styles.inviteIcon}>
                    <MaterialIcons name="mail-outline" size={18} color="#111827" />
                  </View>
                  <View style={styles.inviteCopy}>
                    <Text style={styles.inviteEmail}>{invitation.email}</Text>
                    <Text style={styles.inviteRole}>{invitation.role}</Text>
                    <Text style={styles.inviteDate}>{invitation.sentDate}</Text>
                  </View>
                  <View style={[styles.inviteBadge, styles[`inviteBadge${invitation.status}`]]}>
                    <Text style={[styles.inviteBadgeText, styles[`inviteBadgeText${invitation.status}`]]}>
                      {invitation.status === "pending" ? "En attente" : invitation.status === "accepted" ? "Acceptée" : "Expirée"}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.infoNote}>
            <MaterialIcons name="info-outline" size={14} color="#6B7280" />
            <Text style={styles.infoNoteText}>
              Gérez les membres et les permissions depuis le tableau de bord Aether Identity. Les changements sont synchronisés en temps réel.
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
  orgHeroCard: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    backgroundColor: "#111827",
  },
  orgHeroIcon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  orgHeroName: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "900",
    textAlign: "center",
  },
  orgHeroPlan: {
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 2,
  },
  orgHeroDate: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  orgHeroStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  orgHeroStat: {
    alignItems: "center",
    flex: 1,
  },
  orgHeroStatValue: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
  },
  orgHeroStatLabel: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  orgHeroStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
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
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  memberAvatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "#111827",
  },
  memberInitials: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  memberCopy: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  memberRole: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  statusBadgeActive: {
    backgroundColor: "#EAF8EF",
  },
  statusText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
  },
  statusTextActive: {
    color: "#1F8A4C",
  },
  subOrgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  subOrgRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  subOrgIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  subOrgCopy: {
    flex: 1,
    minWidth: 0,
  },
  subOrgName: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  subOrgType: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  subOrgMeta: {
    alignItems: "flex-end",
    marginRight: 4,
  },
  subOrgMetaText: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  roleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  roleIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  roleCopy: {
    flex: 1,
    minWidth: 0,
  },
  roleTitle: {
    color: "#05070A",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  rolePermissions: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  roleCountBadge: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  roleCountText: {
    color: "#111827",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  inviteRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  inviteIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  inviteCopy: {
    flex: 1,
    minWidth: 0,
  },
  inviteEmail: {
    color: "#05070A",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  inviteRole: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  inviteDate: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  inviteBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  inviteBadgePending: {
    backgroundColor: "#FEF3C7",
  },
  inviteBadgeAccepted: {
    backgroundColor: "#EAF8EF",
  },
  inviteBadgeExpired: {
    backgroundColor: "#FEF2F2",
  },
  inviteBadgeText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
  },
  inviteBadgeTextPending: {
    color: "#D97706",
  },
  inviteBadgeTextAccepted: {
    color: "#1F8A4C",
  },
  inviteBadgeTextExpired: {
    color: "#EF4444",
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
