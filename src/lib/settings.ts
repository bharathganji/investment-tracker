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

export const getSettings = (): AppSettings => {
  try {
    const settingsData = localStorage.getItem(SETTINGS_KEY);
    if (!settingsData) return defaultSettings;

    const settings = JSON.parse(settingsData);
    return { ...defaultSettings, ...settings };
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