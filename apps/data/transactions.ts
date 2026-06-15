import type { ComponentProps } from "react";

import type { MaterialIcons } from "@expo/vector-icons";

export type IconName = ComponentProps<typeof MaterialIcons>["name"];

export type TransactionCategory =
  | "shopping"
  | "subscription"
  | "transport"
  | "food"
  | "salary"
  | "bills"
  | "transfer"
  | "health"
  | "investment"
  | "services"
  | "refund"
  | "housing"
  | "other";

export interface Transaction {
  title: string;
  description: string;
  amount: string;
  tone: "credit" | "debit";
  icon: IconName;
  category: TransactionCategory;
}

export interface CategoryConfig {
  label: string;
  icon: IconName;
  color: string;
  bgColor: string;
}

export const categoryConfig: Record<TransactionCategory, CategoryConfig> = {
  shopping: { label: "Shopping", icon: "shopping-bag", color: "#7C3AED", bgColor: "#EDE9FE" },
  subscription: { label: "Abonnement", icon: "subscriptions", color: "#0891B2", bgColor: "#CFFAFE" },
  transport: { label: "Transport", icon: "directions-car", color: "#D97706", bgColor: "#FEF3C7" },
  food: { label: "Alimentation", icon: "restaurant", color: "#059669", bgColor: "#D1FAE5" },
  salary: { label: "Salaire", icon: "account-balance", color: "#1F8A4C", bgColor: "#DCFCE7" },
  bills: { label: "Factures", icon: "bolt", color: "#DC2626", bgColor: "#FEE2E2" },
  transfer: { label: "Virement", icon: "swap-horiz", color: "#2563EB", bgColor: "#DBEAFE" },
  health: { label: "Santé", icon: "local-hospital", color: "#BE185D", bgColor: "#FCE7F3" },
  investment: { label: "Investissement", icon: "show-chart", color: "#1F8A4C", bgColor: "#DCFCE7" },
  services: { label: "Prestation", icon: "code", color: "#7C3AED", bgColor: "#EDE9FE" },
  refund: { label: "Remboursement", icon: "healing", color: "#059669", bgColor: "#D1FAE5" },
  housing: { label: "Logement", icon: "apartment", color: "#92400E", bgColor: "#FEF3C7" },
  other: { label: "Autre", icon: "more-horiz", color: "#6B7280", bgColor: "#F3F4F6" },
};

export const transactions: Transaction[] = [
  { title: "Sky Genesis Enterprise", description: "Aujourd'hui, 14:30 · Versement entrant", amount: "+8,500.00 €", tone: "credit", icon: "business-center", category: "salary" },
  { title: "Netflix", description: "Aujourd'hui, 09:24 · Carte virtuelle", amount: "-15.99 €", tone: "debit", icon: "movie", category: "subscription" },
  { title: "Monoprix", description: "Hier, 12:42 · Paiement carte", amount: "-92.30 €", tone: "debit", icon: "shopping-bag", category: "food" },
  { title: "Aether Office", description: "Hier, 15:20 · Remboursement interne", amount: "+830.00 €", tone: "credit", icon: "workspaces", category: "transfer" },
  { title: "Amazon", description: "11 juin, 18:05 · Achat en ligne", amount: "-129.99 €", tone: "debit", icon: "shopping-cart", category: "shopping" },
  { title: "Spotify", description: "11 juin, 06:00 · Abonnement mensuel", amount: "-10.99 €", tone: "debit", icon: "music-note", category: "subscription" },
  { title: "Virement SGE", description: "10 juin, 11:15 · Salaire juin", amount: "+4,200.00 €", tone: "credit", icon: "account-balance", category: "salary" },
  { title: "Carrefour", description: "10 juin, 09:30 · Courses", amount: "-67.45 €", tone: "debit", icon: "local-grocery-store", category: "food" },
  { title: "Free Mobile", description: "9 juin, 08:00 · Forfait mobile", amount: "-19.99 €", tone: "debit", icon: "smartphone", category: "bills" },
  { title: "EDF", description: "8 juin, 10:00 · Facture électricité", amount: "-89.00 €", tone: "debit", icon: "bolt", category: "bills" },
  { title: "Client Dupont", description: "8 juin, 16:45 · Facture prestation", amount: "+1,200.00 €", tone: "credit", icon: "receipt", category: "services" },
  { title: "Uber Eats", description: "7 juin, 20:15 · Livraison", amount: "-24.50 €", tone: "debit", icon: "restaurant", category: "food" },
  { title: "SNCF", description: "7 juin, 07:30 · Billet TGV", amount: "-79.00 €", tone: "debit", icon: "train", category: "transport" },
  { title: "Orange", description: "6 juin, 09:00 · Facture internet", amount: "-42.99 €", tone: "debit", icon: "wifi", category: "bills" },
  { title: "Remboursement CAF", description: "6 juin, 14:00 · Aide logement", amount: "+250.00 €", tone: "credit", icon: "home", category: "refund" },
  { title: "Leroy Merlin", description: "5 juin, 16:30 · Bricolage", amount: "-156.00 €", tone: "debit", icon: "build", category: "shopping" },
  { title: "Doctolib", description: "5 juin, 11:00 · Consultation", amount: "-25.00 €", tone: "debit", icon: "local-hospital", category: "health" },
  { title: "Assurance AXA", description: "4 juin, 08:00 · Prélèvement auto", amount: "-54.00 €", tone: "debit", icon: "verified-user", category: "bills" },
  { title: "Freelance Martin", description: "4 juin, 19:00 · Projet web", amount: "+2,400.00 €", tone: "credit", icon: "code", category: "services" },
  { title: "Total Energie", description: "3 juin, 10:30 · Essence", amount: "-65.00 €", tone: "debit", icon: "local-gas-station", category: "transport" },
  { title: "Decathlon", description: "3 juin, 15:00 · Sport", amount: "-89.99 €", tone: "debit", icon: "directions-bike", category: "shopping" },
  { title: "Café Michel", description: "2 juin, 08:45 · Petit-déjeuner", amount: "-4.50 €", tone: "debit", icon: "local-cafe", category: "food" },
  { title: "Dividendes Aether", description: "2 juin, 12:00 · Revenus trimestriels", amount: "+320.00 €", tone: "credit", icon: "trending-up", category: "investment" },
  { title: "Zara", description: "1 juin, 14:20 · Vêtements", amount: "-120.00 €", tone: "debit", icon: "checkroom", category: "shopping" },
  { title: "IBKR Dépôt", description: "1 juin, 09:00 · Compte titres", amount: "-500.00 €", tone: "debit", icon: "show-chart", category: "investment" },
  { title: "Loyer", description: "30 mai, 08:00 · Appartement", amount: "-950.00 €", tone: "debit", icon: "apartment", category: "housing" },
  { title: "Vente Leboncoin", description: "29 mai, 18:30 · Meuble", amount: "+150.00 €", tone: "credit", icon: "sell", category: "refund" },
  { title: "Sephora", description: "29 mai, 11:00 · Beauté", amount: "-45.00 €", tone: "debit", icon: "spa", category: "shopping" },
  { title: "Uber", description: "28 mai, 23:00 · Course", amount: "-18.00 €", tone: "debit", icon: "local-taxi", category: "transport" },
  { title: "Cashback Aether", description: "28 mai, 10:00 · Fidélité", amount: "+12.50 €", tone: "credit", icon: "card-giftcard", category: "refund" },
  { title: "Fnac", description: "27 mai, 14:00 · Livre", amount: "-34.90 €", tone: "debit", icon: "menu-book", category: "shopping" },
  { title: "Sicap", description: "27 mai, 09:00 · Assurance habitation", amount: "-22.00 €", tone: "debit", icon: "shield", category: "bills" },
  { title: "Remboursement Sécu", description: "26 mai, 15:00 · Soins médicaux", amount: "+65.00 €", tone: "credit", icon: "healing", category: "refund" },
  { title: "McDonald's", description: "26 mai, 12:30 · Déjeuner", amount: "-11.50 €", tone: "debit", icon: "fastfood", category: "food" },
  { title: "Boursorama", description: "25 mai, 08:00 · Prélèvement compte", amount: "-7.99 €", tone: "debit", icon: "account-balance-wallet", category: "bills" },
];
