"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FanLevel, Language, UserPrefs } from "@/shared/types";
import { DEFAULT_PREFS } from "@/shared/constants";

export type ViewMode = "fan" | "creator";

interface PreferencesContextType {
  prefs: UserPrefs;
  setFanLevel: (level: FanLevel) => void;
  setLanguage: (lang: Language) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULT_PREFS);
  const [viewMode, setViewMode] = useState<ViewMode>("fan");

  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem("stands_fan_level") as FanLevel | null;
      const savedLang = localStorage.getItem("stands_language") as Language | null;
      const savedMode = localStorage.getItem("stands_view_mode") as ViewMode | null;

      if (savedLevel) setPrefs((prev) => ({ ...prev, fanLevel: savedLevel }));
      if (savedLang) setPrefs((prev) => ({ ...prev, language: savedLang }));
      if (savedMode) setViewMode(savedMode);
    } catch {
      // localStorage may fail in iframe/private mode
    }
  }, []);

  const setFanLevel = (fanLevel: FanLevel) => {
    setPrefs((prev) => {
      const updated = { ...prev, fanLevel };
      try {
        localStorage.setItem("stands_fan_level", fanLevel);
      } catch {}
      return updated;
    });
  };

  const setLanguage = (language: Language) => {
    setPrefs((prev) => {
      const updated = { ...prev, language };
      try {
        localStorage.setItem("stands_language", language);
      } catch {}
      return updated;
    });
  };

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem("stands_view_mode", mode);
    } catch {}
  };

  return (
    <PreferencesContext.Provider
      value={{
        prefs,
        setFanLevel,
        setLanguage,
        viewMode,
        setViewMode: handleSetViewMode,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
