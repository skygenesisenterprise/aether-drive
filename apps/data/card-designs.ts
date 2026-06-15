export type CardColorCategory = "Personnelle" | "Pro" | "Enfants" | "Cryptos";

export interface CardColorFormat {
  id: string;
  category: CardColorCategory;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    accent: string;
    text: string;
    mutedText: string;
    border: string;
  };
  network: "mastercard" | "visa";
}

export const cardColorCategories: CardColorCategory[] = ["Personnelle", "Pro", "Enfants", "Cryptos"];

export const cardColorFormats: CardColorFormat[] = [
  {
    id: "obsidian-black",
    category: "Personnelle",
    name: "Obsidian Black",
    description: "Noir premium avec lignes fines et finition métal.",
    colors: {
      background: "#0B0B0B",
      surface: "#18181B",
      accent: "#D4D4D8",
      text: "#FFFFFF",
      mutedText: "#A1A1AA",
      border: "#3F3F46",
    },
    network: "mastercard",
  },
  {
    id: "arctic-white",
    category: "Personnelle",
    name: "Arctic White",
    description: "Blanc minimal avec contraste noir.",
    colors: {
      background: "#F8FAFC",
      surface: "#FFFFFF",
      accent: "#111827",
      text: "#111827",
      mutedText: "#6B7280",
      border: "#D1D5DB",
    },
    network: "mastercard",
  },
  {
    id: "midnight-pro",
    category: "Pro",
    name: "Midnight Pro",
    description: "Noir corporate avec accent graphite.",
    colors: {
      background: "#111827",
      surface: "#1F2937",
      accent: "#9CA3AF",
      text: "#FFFFFF",
      mutedText: "#D1D5DB",
      border: "#374151",
    },
    network: "visa",
  },
  {
    id: "sterling-pro",
    category: "Pro",
    name: "Sterling Pro",
    description: "Gris clair professionnel pour cartes d'équipe.",
    colors: {
      background: "#E5E7EB",
      surface: "#F9FAFB",
      accent: "#111827",
      text: "#111827",
      mutedText: "#4B5563",
      border: "#CBD5E1",
    },
    network: "mastercard",
  },
  {
    id: "junior-blue",
    category: "Enfants",
    name: "Junior Blue",
    description: "Bleu doux avec contraste sécurisé.",
    colors: {
      background: "#DBEAFE",
      surface: "#EFF6FF",
      accent: "#2563EB",
      text: "#111827",
      mutedText: "#475569",
      border: "#BFDBFE",
    },
    network: "visa",
  },
  {
    id: "junior-mint",
    category: "Enfants",
    name: "Junior Mint",
    description: "Vert clair pour une carte quotidienne simple.",
    colors: {
      background: "#D1FAE5",
      surface: "#ECFDF5",
      accent: "#059669",
      text: "#111827",
      mutedText: "#475569",
      border: "#A7F3D0",
    },
    network: "mastercard",
  },
  {
    id: "bitcoin-ember",
    category: "Cryptos",
    name: "Bitcoin Ember",
    description: "Orange crypto avec fond profond.",
    colors: {
      background: "#0F0F0F",
      surface: "#1F1F1F",
      accent: "#F59E0B",
      text: "#FFFFFF",
      mutedText: "#D4D4D8",
      border: "#3F3F46",
    },
    network: "mastercard",
  },
  {
    id: "ether-violet",
    category: "Cryptos",
    name: "Ether Violet",
    description: "Violet froid pour portefeuille crypto.",
    colors: {
      background: "#312E81",
      surface: "#4338CA",
      accent: "#A5B4FC",
      text: "#FFFFFF",
      mutedText: "#E0E7FF",
      border: "#6366F1",
    },
    network: "visa",
  },
];

export const cardColorFormatsByCategory = cardColorCategories.reduce(
  (formatsByCategory, category) => ({
    ...formatsByCategory,
    [category]: cardColorFormats.filter((format) => format.category === category),
  }),
  {} as Record<CardColorCategory, CardColorFormat[]>,
);

export function getCardColorFormatsForCategory(category: CardColorCategory) {
  return cardColorFormatsByCategory[category];
}
