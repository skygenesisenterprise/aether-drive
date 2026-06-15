import * as React from "react";

import { router, useGlobalSearchParams, usePathname } from "expo-router";

import { useMobileAuth } from "@/components/mobile/mobile-auth-provider";
import { getPaymentAuthorizationById } from "@/data/payment-authorizations";

interface PaymentAuthorizationRouteRequest {
  requestId: string;
}

interface NotificationSubscriptionLike {
  remove: () => void;
}

interface NotificationResponseLike {
  notification?: {
    request?: {
      content?: {
        data?: Record<string, unknown>;
      };
    };
  };
}

interface NotificationsModuleLike {
  addNotificationReceivedListener?: (
    callback: (notification: NotificationResponseLike) => void,
  ) => NotificationSubscriptionLike;
  addNotificationResponseReceivedListener?: (
    callback: (response: NotificationResponseLike) => void,
  ) => NotificationSubscriptionLike;
  getLastNotificationResponseAsync?: () => Promise<NotificationResponseLike | null>;
}

const listeners = new Set<(request: PaymentAuthorizationRouteRequest) => void>();

function getNotificationsModule(): NotificationsModuleLike | null {
  try {
    const maybeRequire = Function("return require")() as ((moduleName: string) => unknown);
    return maybeRequire("expo-notifications") as NotificationsModuleLike;
  } catch {
    return null;
  }
}

function extractRequestId(payload: NotificationResponseLike | null) {
  const candidate = payload?.notification?.request?.content?.data?.requestId;

  return typeof candidate === "string" ? candidate : null;
}

function dispatchAuthorizationRouteRequest(request: PaymentAuthorizationRouteRequest) {
  listeners.forEach((listener) => {
    listener(request);
  });
}

export function simulatePaymentAuthorizationRequest(requestId = "auth_ovh_pending") {
  dispatchAuthorizationRouteRequest({ requestId });
}

export function PaymentAuthorizationListener() {
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ requestId?: string }>();
  const { isAuthenticated, isHydrating } = useMobileAuth();
  const pendingRequestIdRef = React.useRef<string | null>(null);
  const lastPushRef = React.useRef<{ requestId: string; timestamp: number } | null>(null);

  const openAuthorization = React.useCallback((requestId: string) => {
    if (!getPaymentAuthorizationById(requestId)) {
      return;
    }

    if (isHydrating || !isAuthenticated) {
      pendingRequestIdRef.current = requestId;
      return;
    }

    const currentRequestId = typeof params.requestId === "string" ? params.requestId : null;
    const now = Date.now();

    if (pathname === "/authorize-payment" && currentRequestId === requestId) {
      return;
    }

    if (
      lastPushRef.current &&
      lastPushRef.current.requestId === requestId &&
      now - lastPushRef.current.timestamp < 1500
    ) {
      return;
    }

    lastPushRef.current = { requestId, timestamp: now };

    router.push({
      pathname: "/authorize-payment",
      params: { requestId },
    });
  }, [isAuthenticated, isHydrating, params.requestId, pathname]);

  React.useEffect(() => {
    const handleRequest = (request: PaymentAuthorizationRouteRequest) => {
      openAuthorization(request.requestId);
    };

    listeners.add(handleRequest);

    return () => {
      listeners.delete(handleRequest);
    };
  }, [openAuthorization]);

  React.useEffect(() => {
    if (!pendingRequestIdRef.current || isHydrating || !isAuthenticated) {
      return;
    }

    const requestId = pendingRequestIdRef.current;
    pendingRequestIdRef.current = null;
    openAuthorization(requestId);
  }, [isAuthenticated, isHydrating, openAuthorization]);

  React.useEffect(() => {
    const notifications = getNotificationsModule();

    if (!notifications) {
      // `expo-notifications` is optional in this prototype. Install it to activate
      // push tap handling and foreground payment verification routing.
      return;
    }

    const onNotification = (payload: NotificationResponseLike) => {
      const requestId = extractRequestId(payload);

      if (requestId) {
        openAuthorization(requestId);
      }
    };

    const responseSubscription = notifications.addNotificationResponseReceivedListener?.(onNotification);
    const receivedSubscription = notifications.addNotificationReceivedListener?.(onNotification);

    notifications.getLastNotificationResponseAsync?.()
      .then((response) => {
        const requestId = extractRequestId(response);

        if (requestId) {
          openAuthorization(requestId);
        }
      })
      .catch(() => {
        // Ignore notification bootstrap failures in the prototype flow.
      });

    return () => {
      responseSubscription?.remove();
      receivedSubscription?.remove();
    };
  }, [openAuthorization]);

  return null;
}
