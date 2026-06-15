import * as React from "react";

import { MaterialIcons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

export type HomeWidgetId =
  | "activity"
  | "monthlySpending"
  | "beneficiaries"
  | "cards"
  | "categorySpending"
  | "scheduledTransfers"
  | "savingGoals"
  | "recentDocuments";

export interface HomeWidgetConfig {
  id: HomeWidgetId;
  enabled: boolean;
}

export interface HomeWidgetMeta {
  id: HomeWidgetId;
  title: string;
  description: string;
  icon: IconName;
}

export const homeWidgetMetas: HomeWidgetMeta[] = [
  { id: "activity", title: "Activite recente", description: "Vos dernieres transactions et mouvements.", icon: "schedule" },
  { id: "monthlySpending", title: "Depenses du mois", description: "Vue rapide des entrees et sorties du mois.", icon: "bar-chart" },
  { id: "beneficiaries", title: "Beneficiaires frequents", description: "Acces rapide a vos destinataires habituels.", icon: "people" },
  { id: "cards", title: "Mes cartes", description: "Etat et acces rapide a vos cartes bancaires.", icon: "credit-card" },
  { id: "categorySpending", title: "Depenses par categorie", description: "Repartition de vos achats par poste.", icon: "donut-small" },
  { id: "scheduledTransfers", title: "Virements planifies", description: "Vos prochains paiements automatiques.", icon: "event-repeat" },
  { id: "savingGoals", title: "Objectifs d'epargne", description: "Suivi de vos enveloppes et objectifs.", icon: "savings" },
  { id: "recentDocuments", title: "Documents recents", description: "Releves, RIB et attestations a portee de main.", icon: "description" },
];

export const defaultHomeWidgets: HomeWidgetConfig[] = [
  { id: "activity", enabled: true },
  { id: "monthlySpending", enabled: true },
  { id: "beneficiaries", enabled: true },
  { id: "cards", enabled: true },
  { id: "categorySpending", enabled: false },
  { id: "scheduledTransfers", enabled: false },
  { id: "savingGoals", enabled: false },
  { id: "recentDocuments", enabled: false },
];
