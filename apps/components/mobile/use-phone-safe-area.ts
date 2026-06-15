import * as React from "react";

import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WEB_PHONE_TOP_INSET = 52;

export function usePhoneSafeAreaInsets() {
  const insets = useSafeAreaInsets();

  return React.useMemo(
    () => ({
      ...insets,
      top: Platform.OS === "web" ? Math.max(insets.top, WEB_PHONE_TOP_INSET) : insets.top,
    }),
    [insets],
  );
}
