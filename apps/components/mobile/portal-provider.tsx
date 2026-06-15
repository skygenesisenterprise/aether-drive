import * as React from "react";
import { StyleSheet, View } from "react-native";

interface PortalContextType {
  setPortalContent: (content: React.ReactNode | null) => void;
  hasPortalContent: boolean;
}

const PortalContext = React.createContext<PortalContextType>({
  setPortalContent: () => {},
  hasPortalContent: false,
});

export function usePortal() {
  return React.useContext(PortalContext);
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<React.ReactNode | null>(null);

  return (
    <PortalContext.Provider value={{ setPortalContent: setContent, hasPortalContent: content !== null }}>
      <View style={styles.host}>
        {children}
        {content}
      </View>
    </PortalContext.Provider>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    minHeight: "100%",
    alignSelf: "stretch",
  },
});
