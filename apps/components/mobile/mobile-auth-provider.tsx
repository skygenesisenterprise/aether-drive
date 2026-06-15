import * as React from "react";

import { AppState, Platform } from "react-native";

import {
  authenticateWithDeviceBiometrics,
  getMobileBiometricStatus,
  type MobileBiometricStatus,
} from "@/components/mobile/mobile-biometrics";

interface MobileSessionUser {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface MobileSession {
  user: MobileSessionUser;
  authenticatedAt: string;
}

interface MobileAuthSnapshot {
  session: MobileSession | null;
  biometricsEnabled: boolean;
}

interface MobileBiometricActionResult {
  ok: boolean;
  error?: string;
}

interface MobileAuthContextValue {
  isAuthenticated: boolean;
  isHydrating: boolean;
  isLocked: boolean;
  session: MobileSession | null;
  biometricEnabled: boolean;
  biometricSupported: boolean;
  biometricAvailable: boolean;
  biometricLabel: string;
  biometricReason?: string;
  signIn: (user: MobileSessionUser) => void;
  signOut: () => void;
  lockSession: () => void;
  enableBiometrics: () => Promise<MobileBiometricActionResult>;
  disableBiometrics: () => void;
  unlockWithBiometrics: () => Promise<MobileBiometricActionResult>;
}

const STORAGE_KEY = "aether.mobile.session";

let nativeAuthSnapshot: MobileAuthSnapshot = {
  session: null,
  biometricsEnabled: false,
};

const MobileAuthContext = React.createContext<MobileAuthContextValue | undefined>(undefined);

function readStoredSnapshot(): MobileAuthSnapshot {
  if (Platform.OS !== "web") {
    return nativeAuthSnapshot;
  }

  try {
    const rawSnapshot = window.localStorage.getItem(STORAGE_KEY);
    if (!rawSnapshot) {
      return nativeAuthSnapshot;
    }

    const parsedSnapshot = JSON.parse(rawSnapshot) as Partial<MobileAuthSnapshot>;

    return {
      session: parsedSnapshot.session ?? null,
      biometricsEnabled: parsedSnapshot.biometricsEnabled ?? false,
    };
  } catch {
    return nativeAuthSnapshot;
  }
}

function persistSnapshot(snapshot: MobileAuthSnapshot) {
  nativeAuthSnapshot = snapshot;

  if (Platform.OS !== "web") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage failures for the mocked mobile flow.
  }
}

export function MobileAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<MobileSession | null>(null);
  const [isHydrating, setIsHydrating] = React.useState(true);
  const [isLocked, setIsLocked] = React.useState(false);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);
  const [biometricStatus, setBiometricStatus] = React.useState<MobileBiometricStatus>({
    isSupported: false,
    isEnrolled: false,
    available: false,
    label: "biometrie",
  });
  const appStateRef = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const snapshot = readStoredSnapshot();

    setSession(snapshot.session);
    setBiometricEnabled(snapshot.biometricsEnabled);
    setIsLocked(!!snapshot.session && snapshot.biometricsEnabled);
    setIsHydrating(false);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    getMobileBiometricStatus()
      .then((status) => {
        if (isMounted) {
          setBiometricStatus(status);
        }
      })
      .catch(() => {
        if (isMounted) {
          setBiometricStatus({
            isSupported: false,
            isEnrolled: false,
            available: false,
            label: "biometrie",
            reason: "Impossible de verifier la disponibilité biométrique.",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (!session || !biometricEnabled) {
        return;
      }

      if (previousState === "active" && nextAppState !== "active") {
        setIsLocked(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [biometricEnabled, session]);

  const persistCurrentSnapshot = React.useCallback((nextSession: MobileSession | null, nextBiometricEnabled: boolean) => {
    persistSnapshot({
      session: nextSession,
      biometricsEnabled: nextBiometricEnabled,
    });
  }, []);

  const signIn = React.useCallback((user: MobileSessionUser) => {
    const nextSession: MobileSession = {
      user,
      authenticatedAt: new Date().toISOString(),
    };

    persistCurrentSnapshot(nextSession, biometricEnabled);
    setSession(nextSession);
    setIsLocked(false);
  }, [biometricEnabled, persistCurrentSnapshot]);

  const signOut = React.useCallback(() => {
    persistCurrentSnapshot(null, biometricEnabled);
    setSession(null);
    setIsLocked(false);
  }, [biometricEnabled, persistCurrentSnapshot]);

  const lockSession = React.useCallback(() => {
    if (session && biometricEnabled) {
      setIsLocked(true);
    }
  }, [biometricEnabled, session]);

  const enableBiometrics = React.useCallback(async (): Promise<MobileBiometricActionResult> => {
    if (!session) {
      return {
        ok: false,
        error: "Vous devez etre connecte pour activer la biometrie.",
      };
    }

    const status = await getMobileBiometricStatus();
    setBiometricStatus(status);

    if (!status.available) {
      return {
        ok: false,
        error: status.reason ?? "La biometrie n'est pas disponible sur cet appareil.",
      };
    }

    const result = await authenticateWithDeviceBiometrics(`Activer ${status.label}`);
    if (!result.success) {
      return { ok: false, error: result.error };
    }

    setBiometricEnabled(true);
    setIsLocked(false);
    persistCurrentSnapshot(session, true);

    return { ok: true };
  }, [persistCurrentSnapshot, session]);

  const disableBiometrics = React.useCallback(() => {
    setBiometricEnabled(false);
    setIsLocked(false);
    persistCurrentSnapshot(session, false);
  }, [persistCurrentSnapshot, session]);

  const unlockWithBiometrics = React.useCallback(async (): Promise<MobileBiometricActionResult> => {
    const status = await getMobileBiometricStatus();
    setBiometricStatus(status);

    if (!status.available) {
      return {
        ok: false,
        error: status.reason ?? "La biometrie n'est pas disponible sur cet appareil.",
      };
    }

    const result = await authenticateWithDeviceBiometrics(`Déverrouiller avec ${status.label}`);
    if (!result.success) {
      return { ok: false, error: result.error };
    }

    setIsLocked(false);
    return { ok: true };
  }, []);

  const value = React.useMemo<MobileAuthContextValue>(
    () => ({
      isAuthenticated: !!session,
      isHydrating,
      isLocked,
      session,
      biometricEnabled,
      biometricSupported: biometricStatus.isSupported,
      biometricAvailable: biometricStatus.available,
      biometricLabel: biometricStatus.label,
      biometricReason: biometricStatus.reason,
      signIn,
      signOut,
      lockSession,
      enableBiometrics,
      disableBiometrics,
      unlockWithBiometrics,
    }),
    [biometricEnabled, biometricStatus.available, biometricStatus.isSupported, biometricStatus.label, biometricStatus.reason, disableBiometrics, enableBiometrics, isHydrating, isLocked, lockSession, session, signIn, signOut, unlockWithBiometrics],
  );

  return <MobileAuthContext.Provider value={value}>{children}</MobileAuthContext.Provider>;
}

export function useMobileAuth() {
  const context = React.useContext(MobileAuthContext);

  if (!context) {
    throw new Error("useMobileAuth must be used within a MobileAuthProvider");
  }

  return context;
}
