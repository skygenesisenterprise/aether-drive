export interface CardActivityItem {
  id: string;
  merchant: string;
  date: string;
  status: string;
  amount: string;
  iconLabel: string;
}

export interface PortfolioCardItem {
  id: string;
  title: string;
  subtitle: string;
  currency: string;
  colors: [string, string];
  network?: "mastercard" | "visa";
  compact?: boolean;
  last4: string;
  actions: Array<{
    id: string;
    label: string;
    icon: "visibility" | "ac-unit" | "settings";
  }>;
  activity: CardActivityItem[];
}

export const portfolioCards: PortfolioCardItem[] = [
  {
    id: "liam-dispa-euro",
    title: "Liam Dispa Euro",
    subtitle: "•• 5057, 06/29",
    currency: "EUR",
    colors: ["#D61E73", "#2957E8"],
    network: "mastercard",
    last4: "5057",
    actions: [
      { id: "details", label: "Afficher les informations", icon: "visibility" },
      { id: "freeze", label: "Geler", icon: "ac-unit" },
      { id: "settings", label: "Paramètres", icon: "settings" },
    ],
    activity: [
      { id: "h-1", merchant: "Hostinger", date: "1 mai, 15:20", status: "Solde insuffisant", amount: "112,93 €", iconLabel: "H" },
      { id: "h-2", merchant: "Hostinger", date: "26 avril, 15:20", status: "Solde insuffisant", amount: "112,93 €", iconLabel: "H" },
      { id: "h-3", merchant: "Hostinger", date: "26 avril, 15:20", status: "Solde insuffisant", amount: "112,93 €", iconLabel: "H" },
    ],
  },
  {
    id: "liam-dispa-yen",
    title: "Liam Dispa Yen",
    subtitle: "Prête à l'emploi",
    currency: "JPY",
    colors: ["#121212", "#3A3A3A"],
    network: "visa",
    last4: "3182",
    actions: [
      { id: "details", label: "Afficher les informations", icon: "visibility" },
      { id: "freeze", label: "Geler", icon: "ac-unit" },
      { id: "settings", label: "Paramètres", icon: "settings" },
    ],
    activity: [
      { id: "y-1", merchant: "JR East", date: "Aujourd'hui, 08:10", status: "Validée", amount: "4 800 ¥", iconLabel: "J" },
      { id: "y-2", merchant: "Muji", date: "Hier, 18:42", status: "Validée", amount: "12 400 ¥", iconLabel: "M" },
      { id: "y-3", merchant: "FamilyMart", date: "Hier, 11:09", status: "Validée", amount: "890 ¥", iconLabel: "F" },
    ],
  },
  {
    id: "liam-dispa-us",
    title: "Liam Dispa US",
    subtitle: "Prête à l'emploi",
    currency: "USD",
    colors: ["#F2F2F2", "#FFFFFF"],
    network: "mastercard",
    last4: "8841",
    actions: [
      { id: "details", label: "Afficher les informations", icon: "visibility" },
      { id: "freeze", label: "Geler", icon: "ac-unit" },
      { id: "settings", label: "Paramètres", icon: "settings" },
    ],
    activity: [
      { id: "u-1", merchant: "Notion", date: "Lun., 09:03", status: "Validée", amount: "$16.00", iconLabel: "N" },
      { id: "u-2", merchant: "Uber", date: "Dim., 22:18", status: "Validée", amount: "$24.80", iconLabel: "U" },
      { id: "u-3", merchant: "Apple", date: "Dim., 10:45", status: "Validée", amount: "$2.99", iconLabel: "A" },
    ],
  },
  {
    id: "ephemere",
    title: "Éphémère",
    subtitle: "Infos de carte réinitialisées à chaque paiement.",
    currency: "",
    colors: ["#E5E7EB", "#2F2F2F"],
    network: "mastercard",
    compact: true,
    last4: "2290",
    actions: [
      { id: "details", label: "Afficher les informations", icon: "visibility" },
      { id: "freeze", label: "Geler", icon: "ac-unit" },
      { id: "settings", label: "Paramètres", icon: "settings" },
    ],
    activity: [
      { id: "e-1", merchant: "Figma", date: "Aujourd'hui, 14:12", status: "Réinitialisée après paiement", amount: "18,00 €", iconLabel: "F" },
      { id: "e-2", merchant: "Claude", date: "Hier, 19:33", status: "Réinitialisée après paiement", amount: "20,00 €", iconLabel: "C" },
      { id: "e-3", merchant: "Rail Europe", date: "Hier, 08:06", status: "Réinitialisée après paiement", amount: "52,40 €", iconLabel: "R" },
    ],
  },
  {
    id: "crypto-card",
    title: "Crypto Card",
    subtitle: "Prête à l'emploi",
    currency: "Toutes cryptos",
    colors: ["#F59E0B", "#F97316"],
    network: "mastercard",
    last4: "6502",
    actions: [
      { id: "details", label: "Afficher les informations", icon: "visibility" },
      { id: "freeze", label: "Geler", icon: "ac-unit" },
      { id: "settings", label: "Paramètres", icon: "settings" },
    ],
    activity: [
      { id: "c-1", merchant: "Ledger Top Up", date: "Aujourd'hui, 13:28", status: "Converti depuis BTC", amount: "320,00 €", iconLabel: "₿" },
      { id: "c-2", merchant: "Binance Pay", date: "Hier, 21:03", status: "Validée", amount: "84,99 €", iconLabel: "B" },
      { id: "c-3", merchant: "Kraken", date: "Hier, 09:40", status: "Converti depuis ETH", amount: "150,00 €", iconLabel: "K" },
    ],
  },
];

export function getPortfolioCard(id?: string) {
  return portfolioCards.find((card) => card.id === id);
}
