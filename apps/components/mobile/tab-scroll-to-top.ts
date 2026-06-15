import * as React from "react";

import type { ScrollView } from "react-native";

export type MainTabRoute = "home" | "invest" | "transferts" | "vault" | "hub";

const listeners = new Map<MainTabRoute, Set<() => void>>();

function getRouteListeners(route: MainTabRoute) {
  const existingListeners = listeners.get(route);

  if (existingListeners) {
    return existingListeners;
  }

  const nextListeners = new Set<() => void>();
  listeners.set(route, nextListeners);
  return nextListeners;
}

export function emitTabScrollToTop(route: MainTabRoute) {
  getRouteListeners(route).forEach((listener) => {
    listener();
  });
}

export function subscribeToTabScrollToTop(route: MainTabRoute, listener: () => void) {
  const routeListeners = getRouteListeners(route);
  routeListeners.add(listener);

  return () => {
    routeListeners.delete(listener);
  };
}

export function useTabScrollToTop(
  route: MainTabRoute,
  scrollRef: React.RefObject<ScrollView | null>,
) {
  React.useEffect(() => {
    return subscribeToTabScrollToTop(route, () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  }, [route, scrollRef]);
}
