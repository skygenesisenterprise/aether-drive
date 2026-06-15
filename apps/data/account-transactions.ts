import { type Account } from "@/data/accounts";
import { type Transaction } from "@/data/transactions";

const accountTransactions: Record<Account["id"], Transaction[]> = {
  "aether-salary": [
    { title: "Sky Genesis Enterprise", description: "Aujourd'hui, 14:30 · Versement entrant", amount: "+8,500.00 €", tone: "credit", icon: "business-center", category: "salary" },
    { title: "Netflix", description: "Aujourd'hui, 09:24 · Carte virtuelle", amount: "-15.99 €", tone: "debit", icon: "movie", category: "subscription" },
    { title: "Monoprix", description: "Hier, 12:42 · Paiement carte", amount: "-92.30 €", tone: "debit", icon: "shopping-bag", category: "food" },
    { title: "Aether Office", description: "Hier, 15:20 · Remboursement interne", amount: "+830.00 €", tone: "credit", icon: "workspaces", category: "transfer" },
    { title: "Amazon", description: "11 juin, 18:05 · Achat en ligne", amount: "-129.99 €", tone: "debit", icon: "shopping-cart", category: "shopping" },
    { title: "Spotify", description: "11 juin, 06:00 · Abonnement mensuel", amount: "-10.99 €", tone: "debit", icon: "music-note", category: "subscription" },
    { title: "Carrefour", description: "10 juin, 09:30 · Courses", amount: "-67.45 €", tone: "debit", icon: "local-grocery-store", category: "food" },
    { title: "Dividendes Aether", description: "2 juin, 12:00 · Revenus trimestriels", amount: "+320.00 €", tone: "credit", icon: "trending-up", category: "investment" },
  ],
  joint: [
    { title: "Loyer", description: "Aujourd'hui, 08:00 · Prélèvement mensuel", amount: "-1,200.00 €", tone: "debit", icon: "home", category: "housing" },
    { title: "Sophie Dispa", description: "Aujourd'hui, 11:20 · Alimentation du compte", amount: "+1,000.00 €", tone: "credit", icon: "favorite", category: "transfer" },
    { title: "Carrefour", description: "Hier, 18:10 · Courses hebdomadaires", amount: "-146.80 €", tone: "debit", icon: "local-grocery-store", category: "food" },
    { title: "EDF", description: "Hier, 09:15 · Electricite", amount: "-124.30 €", tone: "debit", icon: "bolt", category: "bills" },
    { title: "AXA Habitation", description: "12 juin, 10:00 · Assurance foyer", amount: "-42.30 €", tone: "debit", icon: "shield", category: "bills" },
    { title: "Remboursement CAF", description: "11 juin, 14:00 · Aide logement", amount: "+250.00 €", tone: "credit", icon: "home", category: "refund" },
    { title: "Crèche Mila", description: "10 juin, 07:45 · Garde mensuelle", amount: "-520.00 €", tone: "debit", icon: "child-care", category: "bills" },
  ],
  epargne: [
    { title: "Versement programme", description: "Aujourd'hui, 07:00 · Depuis Personnel", amount: "+500.00 €", tone: "credit", icon: "savings", category: "transfer" },
    { title: "IBKR Depot", description: "Hier, 09:00 · Compte titres", amount: "-500.00 €", tone: "debit", icon: "show-chart", category: "investment" },
    { title: "Dividendes Aether", description: "12 juin, 12:00 · Revenus trimestriels", amount: "+320.00 €", tone: "credit", icon: "trending-up", category: "investment" },
    { title: "Versement joint", description: "10 juin, 18:00 · Epargne foyer", amount: "+400.00 €", tone: "credit", icon: "favorite", category: "transfer" },
    { title: "Frais de garde titres", description: "8 juin, 08:15 · Custody fee", amount: "-14.00 €", tone: "debit", icon: "account-balance", category: "bills" },
  ],
  "sge-operations": [
    { title: "Client Dupont", description: "Aujourd'hui, 16:45 · Facture prestation", amount: "+1,200.00 €", tone: "credit", icon: "receipt", category: "services" },
    { title: "AWS Europe", description: "Aujourd'hui, 09:12 · Infrastructure cloud", amount: "-842.00 €", tone: "debit", icon: "cloud", category: "services" },
    { title: "Paie juin", description: "Hier, 18:00 · Masse salariale", amount: "-6,820.00 €", tone: "debit", icon: "groups", category: "salary" },
    { title: "TVA collectee", description: "Hier, 11:10 · Reservation fiscale", amount: "-2,150.00 €", tone: "debit", icon: "receipt-long", category: "bills" },
    { title: "Stripe Payout", description: "12 juin, 08:30 · Encaissement clients", amount: "+8,700.00 €", tone: "credit", icon: "payments", category: "services" },
    { title: "WeWork Bruxelles", description: "11 juin, 10:20 · Bureau flexible", amount: "-1,420.00 €", tone: "debit", icon: "business", category: "housing" },
    { title: "Cabinet Legal", description: "10 juin, 14:00 · Mission juridique", amount: "-950.00 €", tone: "debit", icon: "gavel", category: "services" },
  ],
};

export function getTransactionsForAccount(accountId?: string) {
  if (!accountId) {
    return accountTransactions["aether-salary"];
  }

  return accountTransactions[accountId as Account["id"]] ?? accountTransactions["aether-salary"];
}

export function prependTransactionsForAccounts(
  sourceAccountId: Account["id"],
  destinationAccountId: Account["id"],
  sourceTransaction: Transaction,
  destinationTransaction: Transaction
) {
  accountTransactions[sourceAccountId] = [
    sourceTransaction,
    ...(accountTransactions[sourceAccountId] ?? []),
  ];
  accountTransactions[destinationAccountId] = [
    destinationTransaction,
    ...(accountTransactions[destinationAccountId] ?? []),
  ];
}
