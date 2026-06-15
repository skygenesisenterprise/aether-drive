import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export interface MobileBiometricStatus {
  isSupported: boolean;
  isEnrolled: boolean;
  available: boolean;
  label: string;
  reason?: string;
}

export interface MobileBiometricAuthResult {
  success: boolean;
  error?: string;
}

function resolveBiometricLabel(types: LocalAuthentication.AuthenticationType[]) {
  const hasFacialRecognition = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const hasFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

  if (Platform.OS === "ios") {
    if (hasFacialRecognition) {
      return "Face ID";
    }

    if (hasFingerprint) {
      return "Touch ID";
    }
  }

  if (hasFingerprint && !hasFacialRecognition) {
    return "empreinte digitale";
  }

  return "biometrie";
}

export async function getMobileBiometricStatus(): Promise<MobileBiometricStatus> {
  if (Platform.OS === "web") {
    return {
      isSupported: false,
      isEnrolled: false,
      available: false,
      label: "biometrie",
      reason: "La biometrie n'est pas disponible sur le web.",
    };
  }

  const [hasHardware, isEnrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  const label = resolveBiometricLabel(types);

  if (!hasHardware) {
    return {
      isSupported: false,
      isEnrolled,
      available: false,
      label,
      reason: "Aucun capteur biométrique n'est disponible sur cet appareil.",
    };
  }

  if (!isEnrolled) {
    return {
      isSupported: true,
      isEnrolled: false,
      available: false,
      label,
      reason: "Aucune donnee biométrique n'est configuree sur cet appareil.",
    };
  }

  return {
    isSupported: true,
    isEnrolled: true,
    available: true,
    label,
  };
}

export async function authenticateWithDeviceBiometrics(promptMessage: string): Promise<MobileBiometricAuthResult> {
  if (Platform.OS === "web") {
    return {
      success: false,
      error: "La biometrie n'est pas disponible sur le web.",
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: "Annuler",
    disableDeviceFallback: true,
    fallbackLabel: "Utiliser le mot de passe",
  });

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    error: result.warning ?? result.error ?? "Authentification biométrique interrompue.",
  };
}
