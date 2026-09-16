import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import miniLMEmbedder from "./miniLMEmbedder";

const EmbedderContext = createContext({
  isReady: false,
  isLoading: false,
  downloadProgress: 0,
  error: null,
  indexedCount: 0,
  analyzeText: async (text) => ({ harmful: [], isClean: true, extractedText: text }),
});

export const EmbedderProvider = ({ children, preload = true }) => {
  const [state, setState] = useState(miniLMEmbedder.getState());

  useEffect(() => {
    const unsubscribe = miniLMEmbedder.subscribe(setState);
    if (preload) {
      miniLMEmbedder.ensureReady().catch(() => {
        // Fallback to fuzzy matching remains available.
      });
    }
    return unsubscribe;
  }, [preload]);

  const value = useMemo(
    () => ({
      ...state,
      analyzeText: (text) => miniLMEmbedder.analyzeText(text),
    }),
    [state]
  );

  return (
    <EmbedderContext.Provider value={value}>{children}</EmbedderContext.Provider>
  );
};

export const useEmbedder = () => useContext(EmbedderContext);
