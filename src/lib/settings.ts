const SETTINGS_KEY = "investment-tracker-settings";

export interface AppSettings {
  theme: "light" | "dark";
  notifications: boolean;
  currency: string;
  timezone: string;
  feeInputMethod: "fixed" | "percentage";
}

export const defaultSettings: AppSettings = {
  theme: "light",
  notifications: true,
  currency: "USD",
  timezone: "UTC",
  feeInputMethod: "fixed",
};

export const isAppSettings = (obj: unknown): obj is AppSettings => {
  if (typeof obj !== "object" || obj === null) return false;

  const settings = obj as Record<string, unknown>;
  return (
    typeof settings.theme === "string" &&
    (settings.theme === "light" || settings.theme === "dark") &&
    typeof settings.notifications === "boolean" &&
    typeof settings.currency === "string" &&
    typeof settings.timezone === "string" &&
    typeof settings.feeInputMethod === "string" &&
    (settings.feeInputMethod === "fixed" ||
      settings.feeInputMethod === "percentage")
  );
};

export const getSettings = (): AppSettings => {
  try {
    const settingsData = localStorage.getItem(SETTINGS_KEY);
    if (!settingsData) return defaultSettings;

    const parsedSettings: unknown = JSON.parse(settingsData);
    if (isAppSettings(parsedSettings)) {
      return { ...defaultSettings, ...parsedSettings };
    }
    return defaultSettings;
  } catch (error) {
    console.error("Error loading settings:", error);
    return defaultSettings;
  }
};

export const saveSettings = (settings: Partial<AppSettings>): void => {
  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};
