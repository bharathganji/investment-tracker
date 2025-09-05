import { createClient } from "@/lib/supabase/client";
import { type AuthSession, type User } from "@supabase/supabase-js";
import { toast } from "sonner";

// Define types for our authentication service
export interface AuthUser extends User {
  metadata?: {
    avatar_url?: string;
    full_name?: string;
    provider?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the authentication service
class AuthService {
  private supabase = createClient();
  private refreshInterval: NodeJS.Timeout | null = null;
  // Add a flag to prevent automatic refresh during OAuth flow
  private isOAuthFlow = false;
  // Track processed authorization codes to prevent duplicate exchanges
  private processedCodes = new Set<string>();
  // Track ongoing exchange requests
  private ongoingExchanges = new Set<string>();

  constructor() {
    // Set up auth state listener
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        void this.handleAuthStateChange(session);
      } else if (event === "SIGNED_OUT") {
        this.handleSignOut();
      }
    });
  }

  // Handle authentication state changes
  private async handleAuthStateChange(session: AuthSession | null) {
    if (session) {
      // Sync user data with our database
      await this.syncUserData(session.user);

      // Start session refresh if not already started
      if (!this.refreshInterval) {
        this.startSessionRefresh();
      }
    }
  }

  // Handle sign out
  private handleSignOut() {
    // Clear refresh interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    // Clear processed codes on sign out
    this.processedCodes.clear();
    this.ongoingExchanges.clear();
  }

  // Sign in with Google OAuth
  async signInWithGoogle() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
          scopes: "email profile",
        },
      });

      if (error) {
        toast.error("Failed to sign in with Google", {
          description: error.message,
        });
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  // Add method to handle OAuth flow with duplicate prevention
  async exchangeCodeForSession(code: string) {
    try {
      // Check if this code has already been processed
      if (this.processedCodes.has(code)) {
        console.log("Authorization code has already been processed");
        return {
          data: null,
          error: new Error("Authorization code has already been processed"),
        };
      }

      // Check if this code is currently being processed
      if (this.ongoingExchanges.has(code)) {
        console.log("Authorization code exchange is already in progress");
        // Wait a bit and return the same error to prevent race conditions
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
          data: null,
          error: new Error(
            "Authorization code exchange is already in progress",
          ),
        };
      }

      // Mark code as being processed immediately
      this.ongoingExchanges.add(code);
      this.processedCodes.add(code);

      // Set flag to prevent interference
      this.isOAuthFlow = true;
      console.log("Starting OAuth code exchange for:", code);

      // Check if we have a valid session before attempting exchange
      const currentSession = await this.getSession();
      if (currentSession?.user) {
        console.log("User is already authenticated, skipping code exchange");
        return {
          data: { session: currentSession, user: currentSession.user },
          error: null,
        };
      }

      const { data, error } =
        await this.supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("exchangeCodeForSession error:", error);
        // Check for specific PKCE errors
        if (
          error.message?.includes("code verifier") ||
          error.message?.includes("invalid_grant")
        ) {
          console.error("PKCE code verifier issue - likely duplicate call");
        }
        return { data: null, error };
      }

      // Handle successful authentication
      if (data.session) {
        await this.handleAuthStateChange(data.session);
      }

      console.log("OAuth code exchange completed successfully");
      return { data, error: null };
    } catch (error) {
      console.error("exchangeCodeForSession catch error:", error);
      return { data: null, error };
    } finally {
      // Reset flags after exchange attempt
      this.isOAuthFlow = false;
      this.ongoingExchanges.delete(code);
    }
  }

  // Sign out
  async signOut() {
    try {
      console.log("Starting sign out process");
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        toast.error("Failed to sign out", {
          description: error.message,
        });
        throw error;
      }

      // Clear refresh interval
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }

      console.log("Sign out completed successfully");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (user) {
        // Sync user data with our database
        await this.syncUserData(user);
      }

      return user;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }

  // Get current session
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return session;
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  }

  /**
   * Synchronizes user data with our database
   * @param user - The Supabase user object to sync
   */
  private async syncUserData(user: User): Promise<void> {
    try {
      // Prepare user data for upsert operation
      const userData = {
        id: user.id,
        email: user.email,
        full_name: (user.user_metadata?.full_name as string | null) ?? null,
        avatar_url: (user.user_metadata?.avatar_url as string | null) ?? null,
        provider: (user.app_metadata?.provider as string | null) ?? null,
        last_sign_in_at: new Date().toISOString(),
      };

      // Perform upsert operation - this handles both new and existing users
      const { error: upsertError } = await this.supabase
        .from("users")
        .upsert(userData, {
          onConflict: "id",
        });

      if (upsertError) {
        console.error("Error upserting user data:", upsertError);
        throw new Error(`Failed to sync user data: ${upsertError.message}`);
      }
    } catch (error) {
      console.error("Unexpected error during user sync:", error);
      // Re-throw the error so calling code can handle it appropriately
      throw error;
    }
  }

  // Start automatic session refresh
  private startSessionRefresh() {
    // Don't start refresh during OAuth flow
    if (this.isOAuthFlow) {
      return;
    }

    // Refresh session every 50 minutes (tokens expire in 60 minutes)
    this.refreshInterval = setInterval(
      () => {
        // Check again during execution to prevent refresh during OAuth
        if (this.isOAuthFlow) {
          return;
        }

        this.supabase.auth.refreshSession().catch((error) => {
          console.error("Session refresh error:", error);
          toast.error("Session expired", {
            description: "Please sign in again to continue",
          });
          // Redirect to login page
          window.location.href = "/login";
        });
      },
      50 * 60 * 1000,
    ); // 50 minutes
  }

  // Subscribe to user status changes
  subscribeToUserStatus(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        callback((session?.user as AuthUser) ?? null);
      } else if (event === "SIGNED_OUT") {
        callback(null);
      }
    });
  }

  // Subscribe to real-time user updates
  subscribeToUserUpdates(
    userId: string,
    callback: (user: Record<string, unknown>) => void,
  ) {
    return this.supabase
      .channel("user_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        },
      )
      .subscribe();
  }

  // Expose Supabase client for use in other components
  get supabaseClient() {
    return this.supabase;
  }
}

// Export singleton instance
export const authService = new AuthService();
