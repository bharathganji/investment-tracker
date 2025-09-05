import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";

// Check if user is authenticated
export function isAuthenticated(user: User | null): boolean {
  try {
    const authenticated = !!user;
    console.debug(`User is authenticated: ${authenticated}`);
    return authenticated;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
}

// Get user's full name
export function getUserFullName(user: User | null): string {
  try {
    // Validate input
    if (!user) {
      console.warn("User is null or undefined when getting full name");
      return "";
    }

    // Try to get full name from user metadata
    if (user.user_metadata?.full_name) {
      return (user.user_metadata.full_name as string) || "";
    }

    // Fallback to email
    if (user.email) {
      return user.email?.split("@")[0] ?? "";
    }

    console.warn("Could not determine user full name, returning default");
    return "User";
  } catch (error) {
    console.error("Error getting user full name:", error);
    return "User";
  }
}

// Get user's initials from full name
export function getUserInitials(user: User | null): string {
  try {
    // Validate input
    if (!user) {
      console.warn("User is null or undefined when getting initials");
      return "U"; // Default to "U" for "User"
    }

    const fullName = getUserFullName(user);
    if (!fullName) {
      console.warn("User full name is empty when getting initials");
      return "U"; // Default to "U" for "User"
    }

    const initials = fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    console.debug(`User ${user.id} initials: ${initials}`);
    return initials;
  } catch (error) {
    console.error("Error getting user initials:", error);
    return "U";
  }
}

// Get user's avatar URL
export function getUserAvatarUrl(user: User | null): string {
  try {
    // Validate input
    if (!user) {
      console.warn("User is null or undefined when getting avatar URL");
      return "/default-avatar.png";
    }

    // Try to get avatar from user metadata
    if (user.user_metadata?.avatar_url) {
      const avatarUrl = (user.user_metadata.avatar_url as string) || "";
      if (avatarUrl) {
        console.debug(`Using user metadata avatar: ${avatarUrl}`);
        return avatarUrl;
      }
    }

    // Fallback to Gravatar
    if (user.email) {
      try {
        const emailHash = btoa(user.email).replace(/=/g, "");
        const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;
        console.debug(`Using Gravatar avatar: ${gravatarUrl}`);
        return gravatarUrl;
      } catch (gravatarError) {
        console.warn("Failed to generate Gravatar URL:", gravatarError);
      }
    }

    // Default avatar
    console.debug("Using default avatar");
    return "/default-avatar.png";
  } catch (error) {
    console.error("Error getting user avatar URL:", error);
    return "/default-avatar.png";
  }
}

// Format user's last sign in date
export function formatLastSignIn(
  dateString: string | null | undefined,
): string {
  // Validate input
  if (!dateString) {
    console.debug("No last sign in date provided, returning 'Never'");
    return "Never";
  }

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided for last sign in:", dateString);
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting last sign in date:", error);
    return "Invalid date";
  }
}

// Format user's account creation date
export function formatAccountCreation(dateString: string): string {
  // Validate input
  if (!dateString) {
    console.warn("No account creation date provided");
    return "Unknown";
  }

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided for account creation:", dateString);
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting account creation date:", error);
    return "Invalid date";
  }
}

// Check if session is expired
export function isSessionExpired(expiresAt: number | null): boolean {
  try {
    // Validate input
    if (!expiresAt) {
      console.debug("No expiration time provided, assuming expired");
      return true;
    }

    // Validate that expiresAt is a valid number
    if (typeof expiresAt !== "number" || isNaN(expiresAt)) {
      console.warn("Invalid expiration time provided:", expiresAt);
      return true;
    }

    const isExpired = Date.now() > expiresAt * 1000;
    console.debug(
      `Session expired check: ${isExpired} (now: ${Date.now()}, expiresAt: ${expiresAt})`,
    );
    return isExpired;
  } catch (error) {
    console.error("Error checking session expiry:", error);
    return true; // Default to expired if there's an error
  }
}

// Get time until session expires
export function getTimeUntilExpiry(expiresAt: number | null): string {
  try {
    // Validate input
    if (!expiresAt) {
      console.debug("No expiration time provided");
      return "Session expired";
    }

    // Validate that expiresAt is a valid number
    if (typeof expiresAt !== "number" || isNaN(expiresAt)) {
      console.warn("Invalid expiration time provided:", expiresAt);
      return "Session expired";
    }

    const now = Date.now();
    const expiryTime = expiresAt * 1000;
    const timeLeft = expiryTime - now;

    // Check if session is already expired
    if (timeLeft <= 0) {
      console.debug("Session already expired");
      return "Session expired";
    }

    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (minutes > 0) {
      console.debug(`Session expires in ${minutes}m ${seconds}s`);
      return `${minutes}m ${seconds}s`;
    }

    console.debug(`Session expires in ${seconds}s`);
    return `${seconds}s`;
  } catch (error) {
    console.error("Error calculating time until expiry:", error);
    return "Session expired";
  }
}

// Refresh session
export async function refreshSession() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error("Session refresh error:", error);
    throw error;
  }
}

// Sign out user
export async function signOut() {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}
