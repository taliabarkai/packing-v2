import { useEffect, useState } from "react";
import { StatusChipsReferencePage } from "./components/StatusChipsReferencePage";
import ReadyToPack from "./screens/ReadyToPack";
import AppShell from "./components/AppShell";
import { LayoutProvider } from "./context/LayoutContext";

function normalizePathFromHash(hash: string): string {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const path = raw || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export default function App() {
  const [path, setPath] = useState(() => normalizePathFromHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setPath(normalizePathFromHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (path === "/components/status-chips" || path === "/components") {
    return <StatusChipsReferencePage />;
  }

  return (
    <LayoutProvider>
      <AppShell userInitials="JD" defaultActiveNav="shipment">
        <ReadyToPack />
      </AppShell>
    </LayoutProvider>
  );
}
