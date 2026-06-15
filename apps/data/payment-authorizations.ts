export type PaymentAuthorizationStatus =
  | "pending"
  | "approved"
  | "declined"
  | "expired"
  | "cancelled";

export type PaymentAuthorizationRiskLevel =
  | "low"
  | "normal"
  | "high";

export interface PaymentAuthorization {
  id: string;
  status: PaymentAuthorizationStatus;
  merchantName: string;
  merchantCategory?: string;
  amountMinor: number;
  currency: "EUR" | "USD" | "JPY";
  cardLast4: string;
  cardLabel: string;
  accountName: string;
  requestedAt: string;
  expiresAt: string;
  riskLevel: PaymentAuthorizationRiskLevel;
  challengeReason:
    | "online_payment"
    | "new_merchant"
    | "high_amount"
    | "unusual_activity";
  locationHint?: string;
}

const now = Date.now();

function isoOffset(minutesFromNow: number) {
  return new Date(now + minutesFromNow * 60 * 1000).toISOString();
}

function buildMockPaymentAuthorizations(): Record<string, PaymentAuthorization> {
  return {
    auth_ovh_pending: {
      id: "auth_ovh_pending",
      status: "pending",
      merchantName: "OVHcloud",
      merchantCategory: "Services numeriques",
      amountMinor: 5299,
      currency: "EUR",
      cardLast4: "4281",
      cardLabel: "Aether Black",
      accountName: "Aether Salary",
      requestedAt: isoOffset(-1),
      expiresAt: isoOffset(5),
      riskLevel: "normal",
      challengeReason: "online_payment",
      locationHint: "Paris, FR",
    },
    auth_high_risk: {
      id: "auth_high_risk",
      status: "pending",
      merchantName: "CryptoX Marketplace",
      merchantCategory: "Actifs numeriques",
      amountMinor: 184900,
      currency: "EUR",
      cardLast4: "4281",
      cardLabel: "Aether Black",
      accountName: "Aether Salary",
      requestedAt: isoOffset(-2),
      expiresAt: isoOffset(8),
      riskLevel: "high",
      challengeReason: "unusual_activity",
      locationHint: "Tallinn, EE",
    },
    auth_expired: {
      id: "auth_expired",
      status: "expired",
      merchantName: "GitHub",
      merchantCategory: "Abonnements logiciels",
      amountMinor: 2100,
      currency: "EUR",
      cardLast4: "4281",
      cardLabel: "Aether Black",
      accountName: "Aether Salary",
      requestedAt: isoOffset(-25),
      expiresAt: isoOffset(-5),
      riskLevel: "low",
      challengeReason: "new_merchant",
      locationHint: "Remote",
    },
  };
}

let paymentAuthorizationStore = buildMockPaymentAuthorizations();

export function getPaymentAuthorizationById(requestId: string) {
  return paymentAuthorizationStore[requestId] ?? null;
}

export function updatePaymentAuthorizationStatus(
  requestId: string,
  status: PaymentAuthorizationStatus,
) {
  const currentAuthorization = paymentAuthorizationStore[requestId];

  if (!currentAuthorization) {
    return null;
  }

  const nextAuthorization: PaymentAuthorization = {
    ...currentAuthorization,
    status,
  };

  paymentAuthorizationStore = {
    ...paymentAuthorizationStore,
    [requestId]: nextAuthorization,
  };

  return nextAuthorization;
}

export function resetPaymentAuthorizationMocks() {
  paymentAuthorizationStore = buildMockPaymentAuthorizations();
}
