export interface Account {
  id: string;
  type: string;
  balance: string;
  meta: string;
  label: string;
  currency: string;
  status: string;
  region: string;
  holder: string;
  iban: string;
  bic: string;
  ledgerAccountId: string;
  lastSync: string;
}

// TODO: Connect SGE API account list
export const accounts: Account[] = [
  {
    id: "aether-salary",
    type: "Personnel",
    balance: "€12,450.80",
    meta: "Solde disponible",
    label: "Personnel · EUR",
    currency: "EUR",
    status: "Vérifié",
    region: "Europe",
    holder: "Liam Dispa",
    iban: "BE12 3456 7890 1234",
    bic: "AETHBEBB",
    ledgerAccountId: "ledger_acc_personal_eur_001",
    lastSync: "Il y a 3 secondes",
  },
  {
    id: "joint",
    type: "Joint",
    balance: "€8,230.00",
    meta: "Compte joint",
    label: "Joint · EUR",
    currency: "EUR",
    status: "Vérifié",
    region: "Europe",
    holder: "Liam Dispa & Sophie Dispa",
    iban: "BE98 7654 3210 5678",
    bic: "AETHBEBB",
    ledgerAccountId: "ledger_acc_joint_eur_001",
    lastSync: "Il y a 10 secondes",
  },
  {
    id: "epargne",
    type: "Épargne",
    balance: "€34,200.00",
    meta: "Taux 2.5%",
    label: "Épargne · EUR",
    currency: "EUR",
    status: "Vérifié",
    region: "Europe",
    holder: "Liam Dispa",
    iban: "BE11 2233 4455 6677",
    bic: "AETHBEBB",
    ledgerAccountId: "ledger_acc_epargne_eur_001",
    lastSync: "Il y a 30 secondes",
  },
  {
    id: "sge-operations",
    type: "Professionnel",
    balance: "€89,150.00",
    meta: "SGE Belgium",
    label: "Professionnel · EUR",
    currency: "EUR",
    status: "Vérifié",
    region: "Europe",
    holder: "Sky Genesis Enterprise",
    iban: "BE99 8877 6655 4433",
    bic: "AETHBEBB",
    ledgerAccountId: "ledger_acc_pro_eur_001",
    lastSync: "Il y a 1 minute",
  },
];
