import type { ComponentProps } from "react";

import type { MaterialIcons } from "@expo/vector-icons";

import type { CardColorCategory } from "@/data/card-designs";

export type CardCreateIconName = ComponentProps<typeof MaterialIcons>["name"];

export interface CardCreateOption {
  id: string;
  title: string;
  description: string;
  icon: CardCreateIconName;
  badge?: string;
}

export const cardCreateOptionsByCategory: Record<CardColorCategory, CardCreateOption[]> = {
  Personnelle: [
    {
      id: "personal-physical",
      title: "Carte physique",
      description: "Une carte premium pour vos paiements quotidiens et retraits.",
      icon: "credit-card",
      badge: "Populaire",
    },
    {
      id: "personal-virtual",
      title: "Carte virtuelle",
      description: "Une carte instantanée pour vos achats en ligne sécurisés.",
      icon: "smartphone",
    },
    {
      id: "personal-ephemeral",
      title: "Carte éphémère",
      description: "Les informations se réinitialisent après chaque paiement.",
      icon: "history",
    },
  ],
  Pro: [
    {
      id: "pro-team",
      title: "Carte collaborateur",
      description: "Attribuez une carte à un membre de votre équipe avec limites dédiées.",
      icon: "badge",
      badge: "Équipe",
    },
    {
      id: "pro-expense",
      title: "Carte dépenses",
      description: "Séparez abonnements, fournisseurs et dépenses opérationnelles.",
      icon: "receipt-long",
    },
    {
      id: "pro-virtual",
      title: "Carte virtuelle pro",
      description: "Créez une carte dédiée à un outil, un projet ou un fournisseur.",
      icon: "business-center",
    },
  ],
  Enfants: [
    {
      id: "kids-pocket",
      title: "Carte argent de poche",
      description: "Une carte simple avec plafonds et suivi parental.",
      icon: "child-care",
      badge: "Contrôle",
    },
    {
      id: "kids-online",
      title: "Carte en ligne enfant",
      description: "Activez uniquement les paiements numériques autorisés.",
      icon: "phonelink-lock",
    },
    {
      id: "kids-savings",
      title: "Carte objectif",
      description: "Associez la carte à un objectif d'épargne ou une cagnotte.",
      icon: "savings",
    },
  ],
  Cryptos: [
    {
      id: "crypto-spend",
      title: "Carte crypto",
      description: "Dépensez depuis vos soldes crypto avec conversion automatique.",
      icon: "currency-bitcoin",
      badge: "Crypto",
    },
    {
      id: "crypto-stable",
      title: "Carte stablecoin",
      description: "Payez depuis un solde stable avec suivi en devise locale.",
      icon: "toll",
    },
    {
      id: "crypto-virtual",
      title: "Carte virtuelle crypto",
      description: "Une carte instantanée dédiée aux paiements Web3 et abonnements.",
      icon: "token",
    },
  ],
};

export function getCardCreateOptionsForCategory(category: CardColorCategory) {
  return cardCreateOptionsByCategory[category];
}
