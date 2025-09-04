"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { getSettings } from "@/lib/settings";

export function CustomThemeProvider() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Load theme from settings and apply it
    const settings = getSettings();
    setTheme(settings.theme);

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

  return null;
}
