import * as React from "react";
import SearchDialog from "@/components/docs/SearchDialog";
import { RootProvider } from "fumadocs-ui/provider/next";

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
    >
      {children}
    </RootProvider>
  );
}
