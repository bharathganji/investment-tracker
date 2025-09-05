"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { getSettings } from "@/lib/settings";

export function CustomThemeProvider() {
  const { setTheme } = useTheme();
  const [initialThemeApplied, setInitialThemeApplied] = useState(false);

  useEffect(() => {
    // Load theme from settings and apply it
    const settings = getSettings();
    setTheme(settings.theme);
    setInitialThemeApplied(true);

    // Listen for changes to settings in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "investment-tracker-settings" && e.newValue) {
        try {
          const parsedSettings: unknown = JSON.parse(e.newValue);
          if (
            parsedSettings &&
            typeof parsedSettings === "object" &&
            "theme" in parsedSettings
          ) {
            const theme = (parsedSettings as { theme: string }).theme;
            if (
              typeof theme === "string" &&
              (theme === "light" || theme === "dark")
            ) {
              setTheme(theme);
            }
          }
        } catch (error) {
          console.error("Error parsing settings from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setTheme]);

  // Re-apply theme when component re-renders (e.g., after HMR)
  useEffect(() => {
    if (initialThemeApplied) {
      const settings = getSettings();
      setTheme(settings.theme);
    }
  }, [initialThemeApplied, setTheme]);

  return null;
}
