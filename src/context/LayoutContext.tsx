import { createContext, useContext, useState, type ReactNode } from "react";

interface LayoutContextValue {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const LayoutContext = createContext<LayoutContextValue>({
  isFullscreen: false,
  toggleFullscreen: () => {},
});

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <LayoutContext.Provider
      value={{ isFullscreen, toggleFullscreen: () => setIsFullscreen((f) => !f) }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
