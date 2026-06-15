import * as React from "react";

import {
  getPaymentAuthorizationById,
  updatePaymentAuthorizationStatus,
  type PaymentAuthorization,
  type PaymentAuthorizationStatus,
} from "@/data/payment-authorizations";

interface UsePaymentAuthorizationResult {
  authorization: PaymentAuthorization | null;
  status: PaymentAuthorizationStatus | null;
  isLoading: boolean;
  approve: () => Promise<PaymentAuthorization | null>;
  decline: () => Promise<PaymentAuthorization | null>;
  markExpired: () => PaymentAuthorization | null;
  remainingSeconds: number;
}

function getRemainingSeconds(authorization: PaymentAuthorization | null) {
  if (!authorization || authorization.status !== "pending") {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil((new Date(authorization.expiresAt).getTime() - Date.now()) / 1000),
  );
}

export function usePaymentAuthorization(requestId?: string): UsePaymentAuthorizationResult {
  const [authorization, setAuthorization] = React.useState<PaymentAuthorization | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);

  React.useEffect(() => {
    setIsLoading(true);

    if (!requestId) {
      setAuthorization(null);
      setRemainingSeconds(0);
      setIsLoading(false);
      return;
    }

    const nextAuthorization = getPaymentAuthorizationById(requestId);
    const resolvedAuthorization = nextAuthorization && getRemainingSeconds(nextAuthorization) === 0 && nextAuthorization.status === "pending"
      ? updatePaymentAuthorizationStatus(requestId, "expired")
      : nextAuthorization;

    setAuthorization(resolvedAuthorization);
    setRemainingSeconds(getRemainingSeconds(resolvedAuthorization));
    setIsLoading(false);
  }, [requestId]);

  React.useEffect(() => {
    if (!authorization || authorization.status !== "pending") {
      setRemainingSeconds(0);
      return;
    }

    setRemainingSeconds(getRemainingSeconds(authorization));

    const intervalId = setInterval(() => {
      const nextRemainingSeconds = getRemainingSeconds(getPaymentAuthorizationById(authorization.id));

      if (nextRemainingSeconds <= 0) {
        setAuthorization((currentAuthorization) => {
          if (!currentAuthorization || currentAuthorization.status !== "pending") {
            return currentAuthorization;
          }

          return updatePaymentAuthorizationStatus(currentAuthorization.id, "expired");
        });
        setRemainingSeconds(0);
        clearInterval(intervalId);
        return;
      }

      setRemainingSeconds(nextRemainingSeconds);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [authorization]);

  const updateStatus = React.useCallback(async (nextStatus: PaymentAuthorizationStatus) => {
    if (!requestId) {
      return null;
    }

    const nextAuthorization = updatePaymentAuthorizationStatus(requestId, nextStatus);
    setAuthorization(nextAuthorization);
    setRemainingSeconds(getRemainingSeconds(nextAuthorization));
    return nextAuthorization;
  }, [requestId]);

  const approve = React.useCallback(async () => {
    return updateStatus("approved");
  }, [updateStatus]);

  const decline = React.useCallback(async () => {
    return updateStatus("declined");
  }, [updateStatus]);

  const markExpired = React.useCallback(() => {
    if (!requestId) {
      return null;
    }

    const nextAuthorization = updatePaymentAuthorizationStatus(requestId, "expired");
    setAuthorization(nextAuthorization);
    setRemainingSeconds(0);
    return nextAuthorization;
  }, [requestId]);

  return {
    authorization,
    status: authorization?.status ?? null,
    isLoading,
    approve,
    decline,
    markExpired,
    remainingSeconds,
  };
}
