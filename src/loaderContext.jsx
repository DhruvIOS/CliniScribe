import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext({
  showGlobalLoader: false,
  setShowGlobalLoader: (_v) => {},
});

export function RouteLoaderProvider({ children }) {
  const [showGlobalLoader, setShowGlobalLoader] = useState(false);
  return (
    <LoaderContext.Provider value={{ showGlobalLoader, setShowGlobalLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useRouteLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useRouteLoader must be used within RouteLoaderProvider');
  return ctx;
}
