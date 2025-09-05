"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getSettings, saveSettings, type AppSettings } from "@/lib/settings";
import { useTheme } from "next-themes";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import {
  getUserFullName,
  getUserInitials,
  getUserAvatarUrl,
  formatAccountCreation,
  formatLastSignIn,
} from "@/lib/auth-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/lib/auth-service";

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const { user, session } = useAuth();
  const [settings, setSettings] = useState<AppSettings>({
    theme: "light",
    notifications: true,
    currency: "USD",
    timezone: "UTC",
    feeInputMethod: "fixed",
  });

  useEffect(() => {
    // Load settings from localStorage on component mount
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
  }, []);

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      // Save settings to localStorage
      saveSettings({ [key]: value });

      // If theme is changed, apply it immediately
      if (key === "theme") {
        setTheme(value as string);
      }

      return newSettings;
    });
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* User Profile Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Your account information
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={getUserAvatarUrl(user)}
                      alt={getUserFullName(user)}
                    />
                    <AvatarFallback className="text-lg">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xl font-semibold">
                      {getUserFullName(user)}
                    </h4>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h5 className="font-medium">Account Information</h5>
                    <div className="text-sm">
                      <p className="text-muted-foreground">User ID</p>
                      <p>{user?.id}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Role</p>
                      <p>{user?.app_metadata?.role ?? "user"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Authentication Provider
                      </p>
                      <p>{user?.app_metadata?.provider ?? "email"}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">Security Information</h5>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Account Created</p>
                      <p>
                        {user?.created_at
                          ? formatAccountCreation(user.created_at)
                          : "Unknown"}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Last Sign-in</p>
                      <p>
                        {session?.user?.last_sign_in_at
                          ? formatLastSignIn(session.user.last_sign_in_at)
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your application preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose between light and dark mode
                      </p>
                    </div>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        handleSettingChange("theme", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("notifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Currency</Label>
                      <p className="text-sm text-muted-foreground">
                        Default currency for display
                      </p>
                    </div>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        handleSettingChange("currency", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Timezone</Label>
                      <p className="text-sm text-muted-foreground">
                        Your local timezone
                      </p>
                    </div>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("timezone", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Fee Input Method</Label>
                      <p className="text-sm text-muted-foreground">
                        Default method for entering trade fees
                      </p>
                    </div>
                    <Select
                      value={settings.feeInputMethod}
                      onValueChange={(value) =>
                        handleSettingChange("feeInputMethod", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Value</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Account Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </ProtectedRoute>
  );
}
