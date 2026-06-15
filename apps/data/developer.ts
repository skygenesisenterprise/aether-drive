import type { ComponentProps } from "react";

import type { MaterialIcons } from "@expo/vector-icons";

export type IconName = ComponentProps<typeof MaterialIcons>["name"];
export type StatusTone = "blue" | "green" | "orange" | "red" | "gray";

export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
}

export interface AetherProduct {
  id: string;
  name: string;
  description: string;
  cta: string;
  icon: IconName;
  accent: string;
  audience: string;
}

export interface Guide {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  summary: string;
}

export interface DeveloperApp {
  id: string;
  name: string;
  product: string;
  type: string;
  environment: string;
  reviewStatus: string;
  statusTone: StatusTone;
  lastUpdated: string;
  permissions: string[];
  analytics: {
    installs: string;
    sessions: string;
    crashes: string;
  };
}

export const developerProfile = {
  name: "Alex Chen",
  role: "Lead Developer",
  organization: "Studio Chen",
  tier: "Registered Developer",
  verification: "Verified organization",
  memberSince: "March 2024",
  badges: ["Identity", "Store Beta", "Guilderia"],
};

export const programStatus = {
  tier: "Registered Developer",
  renewal: "Renews Oct 18, 2026",
  teams: "3 teams",
  agreements: "All agreements accepted",
};

export const announcements: Announcement[] = [
  {
    id: "edge-runtime",
    title: "Aether Edge Functions enter public beta",
    category: "Platform",
    date: "Today",
    summary: "Deploy lightweight workflows close to your users with signed runtime logs.",
  },
  {
    id: "store-guidelines",
    title: "Updated Aether Store review guidelines",
    category: "Publishing",
    date: "Jun 10",
    summary: "New privacy manifest checks and review notes are now visible before submission.",
  },
  {
    id: "identity-passkeys",
    title: "Identity passkeys for teams",
    category: "Security",
    date: "Jun 8",
    summary: "Aether Identity now supports passkey-only enrollment for developer accounts.",
  },
];

export const products: AetherProduct[] = [
  {
    id: "identity",
    name: "Aether Identity",
    description: "Authentication, passkeys, team access, and trust signals for Aether apps.",
    cta: "Explore Identity",
    icon: "verified-user",
    accent: "#2F6BFF",
    audience: "Security",
  },
  {
    id: "mail",
    name: "Aether Mail",
    description: "Transactional email, secure inbox workflows, and delivery diagnostics.",
    cta: "View Mail APIs",
    icon: "alternate-email",
    accent: "#0A84FF",
    audience: "Messaging",
  },
  {
    id: "edge",
    name: "Aether Edge",
    description: "Global functions, edge storage, and routing primitives for low-latency apps.",
    cta: "Start building",
    icon: "hub",
    accent: "#5E5CE6",
    audience: "Compute",
  },
  {
    id: "status",
    name: "Aether Status",
    description: "Incident feeds, health checks, and customer-facing status pages.",
    cta: "Check status",
    icon: "monitor-heart",
    accent: "#34A853",
    audience: "Reliability",
  },
  {
    id: "jobs",
    name: "Aether Jobs",
    description: "Background queues, scheduled jobs, and workflow observability.",
    cta: "Create a job",
    icon: "work-history",
    accent: "#FF9500",
    audience: "Automation",
  },
  {
    id: "guilderia",
    name: "Guilderia",
    description: "Bot frameworks, community tooling, and guild automation workflows.",
    cta: "Build a bot",
    icon: "smart-toy",
    accent: "#AF52DE",
    audience: "Community",
  },
  {
    id: "oblivionos",
    name: "OblivionOS",
    description: "Native platform capabilities, device services, and OS integration kits.",
    cta: "Read platform docs",
    icon: "memory",
    accent: "#111827",
    audience: "Platform",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Distribution, commerce, subscriptions, and partner discovery surfaces.",
    cta: "Prepare listing",
    icon: "storefront",
    accent: "#FF2D55",
    audience: "Publishing",
  },
];

export const guideCategories = ["Getting Started", "APIs", "SDKs", "Publishing", "Guilderia", "Security"];

export const guides: Guide[] = [
  {
    id: "first-app",
    title: "Build your first Aether app",
    category: "Getting Started",
    duration: "18 min",
    level: "Beginner",
    summary: "Create a project, configure Identity, and run a local preview.",
  },
  {
    id: "guilderia-bot",
    title: "Create a Guilderia bot",
    category: "Guilderia",
    duration: "24 min",
    level: "Intermediate",
    summary: "Register commands, test events, and submit your bot for review.",
  },
  {
    id: "identity",
    title: "Use Aether Identity",
    category: "APIs",
    duration: "16 min",
    level: "Beginner",
    summary: "Add secure sign-in, team roles, and developer-scoped tokens.",
  },
  {
    id: "publish",
    title: "Publish to the Aether Store",
    category: "Publishing",
    duration: "22 min",
    level: "Advanced",
    summary: "Prepare metadata, permissions, screenshots, and review notes.",
  },
];

export const developerApps: DeveloperApp[] = [
  {
    id: "nightowl",
    name: "NightOwl",
    product: "Aether Identity",
    type: "iOS App",
    environment: "Production",
    reviewStatus: "In Review",
    statusTone: "orange",
    lastUpdated: "Jun 5, 2026",
    permissions: ["Identity profile", "Push notifications", "Store listing"],
    analytics: {
      installs: "12.8K",
      sessions: "48.2K",
      crashes: "0.02%",
    },
  },
  {
    id: "guild-captain",
    name: "Guild Captain",
    product: "Guilderia",
    type: "Bot",
    environment: "Beta",
    reviewStatus: "Action Required",
    statusTone: "red",
    lastUpdated: "Yesterday",
    permissions: ["Guild messages", "Bot commands", "Member roles"],
    analytics: {
      installs: "2.1K",
      sessions: "9.4K",
      crashes: "0.10%",
    },
  },
  {
    id: "nimbus-mail",
    name: "Nimbus Mail Bridge",
    product: "Aether Mail",
    type: "Integration",
    environment: "Production",
    reviewStatus: "Approved",
    statusTone: "green",
    lastUpdated: "Jun 9, 2026",
    permissions: ["Mail send", "Delivery events", "Webhook signing"],
    analytics: {
      installs: "7.6K",
      sessions: "31.9K",
      crashes: "0.01%",
    },
  },
];

export const quickActions = [
  { title: "Submit App", subtitle: "Review", icon: "cloud-upload" as IconName },
  { title: "Docs", subtitle: "Guides", icon: "menu-book" as IconName },
  { title: "Discover", subtitle: "Products", icon: "explore" as IconName },
  { title: "Support", subtitle: "Help", icon: "support-agent" as IconName },
];
