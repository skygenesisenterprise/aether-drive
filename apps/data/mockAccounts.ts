export type AccountType = "personal" | "business" | "reserve" | "ledger_only";
export type Currency = "EUR" | "USD" | "JPY";
export type LedgerStatus = "confirmed" | "pending" | "error";
export type ProviderName = "Swan" | "Stripe" | "Wero" | "Internal";
export type SyncStatus = "synced" | "pending" | "failed" | "not_connected";
export type CardType = "virtual" | "physical";
export type CardStatus = "active" | "frozen" | "pending";
export type ApplePayStatus = "ready" | "not_added" | "unsupported";
export type TransactionType = "incoming" | "outgoing";
export type TransactionStatus = "confirmed" | "pending" | "failed";
export type TransactionMethod = "ledger" | "card" | "transfer" | "apple_pay" | "provider_sync";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  iban?: string;
  balance: {
    available: number;
    current: number;
    reserved: number;
    pendingIncoming: number;
    pendingOutgoing: number;
  };
  ledger: {
    sourceOfTruth: "aether_ledger";
    status: LedgerStatus;
    lastEntryId: string;
    lastSyncAt?: string;
  };
  provider?: {
    name: ProviderName;
    syncStatus: SyncStatus;
  };
  card?: {
    id: string;
    type: CardType;
    last4: string;
    status: CardStatus;
    applePayStatus: ApplePayStatus;
    monthlyLimit: number;
  };
  transactions: {
    id: string;
    label: string;
    amount: number;
    currency: Currency;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    method: TransactionMethod;
  }[];
}

export const mockAccounts: Account[] = [
  {
    id: "aether-salary",
    name: "Aether Salary",
    type: "personal",
    currency: "EUR",
    iban: "BE12 3456 7890 1234",
    balance: {
      available: 12450.80,
      current: 12750.80,
      reserved: 300.00,
      pendingIncoming: 8500.00,
      pendingOutgoing: 129.99,
    },
    ledger: {
      sourceOfTruth: "aether_ledger",
      status: "confirmed",
      lastEntryId: "ledger_entry_aeth_salary_042",
      lastSyncAt: "2026-06-12T10:24:00Z",
    },
    provider: {
      name: "Swan",
      syncStatus: "synced",
    },
    card: {
      id: "card_virtual_001",
      type: "virtual",
      last4: "4829",
      status: "active",
      applePayStatus: "ready",
      monthlyLimit: 5000,
    },
    transactions: [
      { id: "txn_001", label: "Sky Genesis Enterprise", amount: 8500.00, currency: "EUR", type: "incoming", status: "confirmed", date: "2026-06-12T14:30:00Z", method: "transfer" },
      { id: "txn_002", label: "Netflix", amount: 15.99, currency: "EUR", type: "outgoing", status: "confirmed", date: "2026-06-12T09:24:00Z", method: "card" },
      { id: "txn_003", label: "Monoprix", amount: 92.30, currency: "EUR", type: "outgoing", status: "confirmed", date: "2026-06-11T12:42:00Z", method: "card" },
      { id: "txn_004", label: "Aether Office", amount: 830.00, currency: "EUR", type: "incoming", status: "confirmed", date: "2026-06-11T15:20:00Z", method: "transfer" },
      { id: "txn_005", label: "Amazon", amount: 129.99, currency: "EUR", type: "outgoing", status: "pending", date: "2026-06-11T18:05:00Z", method: "card" },
      { id: "txn_006", label: "Spotify", amount: 10.99, currency: "EUR", type: "outgoing", status: "confirmed", date: "2026-06-11T06:00:00Z", method: "card" },
    ],
  },
  {
    id: "sge-operations",
    name: "SGE Operations",
    type: "business",
    currency: "EUR",
    iban: "BE99 8877 6655 4433",
    balance: {
      available: 89150.00,
      current: 89500.00,
      reserved: 350.00,
      pendingIncoming: 12400.00,
      pendingOutgoing: 4200.00,
    },
    ledger: {
      sourceOfTruth: "aether_ledger",
      status: "confirmed",
      lastEntryId: "ledger_entry_sge_ops_128",
      lastSyncAt: "2026-06-12T10:23:00Z",
    },
    provider: {
      name: "Stripe",
      syncStatus: "synced",
    },
    card: {
      id: "card_physical_002",
      type: "physical",
      last4: "1094",
      status: "active",
      applePayStatus: "ready",
      monthlyLimit: 25000,
    },
    transactions: [
      { id: "txn_sge_001", label: "Client Dupont", amount: 1200.00, currency: "EUR", type: "incoming", status: "confirmed", date: "2026-06-08T16:45:00Z", method: "transfer" },
      { id: "txn_sge_002", label: "Freelance Martin", amount: 2400.00, currency: "EUR", type: "incoming", status: "confirmed", date: "2026-06-04T19:00:00Z", method: "provider_sync" },
      { id: "txn_sge_003", label: "AWS Cloud", amount: 1850.00, currency: "EUR", type: "outgoing", status: "confirmed", date: "2026-06-03T08:00:00Z", method: "transfer" },
      { id: "txn_sge_004", label: "Notion Team", amount: 48.00, currency: "EUR", type: "outgoing", status: "confirmed", date: "2026-06-02T06:00:00Z", method: "card" },
      { id: "txn_sge_005", label: "Stripe Payout", amount: 8900.00, currency: "EUR", type: "incoming", status: "pending", date: "2026-06-01T00:00:00Z", method: "provider_sync" },
    ],
  },
  {
    id: "aether-reserve",
    name: "Aether Reserve",
    type: "reserve",
    currency: "EUR",
    iban: "BE11 2233 4455 6677",
    balance: {
      available: 34200.00,
      current: 34750.00,
      reserved: 550.00,
      pendingIncoming: 0,
      pendingOutgoing: 10000.00,
    },
    ledger: {
      sourceOfTruth: "aether_ledger",
      status: "confirmed",
      lastEntryId: "ledger_entry_reserve_089",
      lastSyncAt: "2026-06-12T09:15:00Z",
    },
    provider: {
      name: "Internal",
      syncStatus: "synced",
    },
    transactions: [
      { id: "txn_res_001", label: "Vault Deposit", amount: 10000.00, currency: "EUR", type: "incoming", status: "confirmed", date: "2026-06-10T14:00:00Z", method: "ledger" },
      { id: "txn_res_002", label: "Interest Credit Q2", amount: 420.00, currency: "EUR", type: "incoming", status: "confirmed", date: "2026-06-01T08:00:00Z", method: "ledger" },
      { id: "txn_res_003", label: "Allocation Stratégique", amount: 5000.00, currency: "EUR", type: "outgoing", status: "confirmed", date: "2026-05-28T10:00:00Z", method: "transfer" },
    ],
  },
];

export function getMockAccount(id: string): Account | undefined {
  return mockAccounts.find((a) => a.id === id);
}
