"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService, type AuthUser, type AuthState } from "@/lib/auth-service";
import { type Session } from "@supabase/supabase-js";

// Define the context type
interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session first
        const session = await authService.getSession();

        // Then get user if session exists
        let user = null;
        if (session?.user) {
          user = await authService.getCurrentUser();
        }

        setAuthState({
          user: user as AuthUser | null,
          session: session,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    void initializeAuth();
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const { data: authListener } = authService.subscribeToUserStatus((user) => {
      // Check if we're in an OAuth flow by looking at the URL
      const urlParams = new URLSearchParams(window.location.search);
      const isOAuthCallback = urlParams.has("code");

      // Don't update auth state during OAuth callback to prevent interference
      if (isOAuthCallback) {
        return;
      }

      setAuthState((prev) => ({
        ...prev,
        user: user,
        isAuthenticated: !!user,
      }));
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log("Calling authService.signOut()");
      await authService.signOut();
      console.log("Setting auth state to signed out");
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log("Auth state updated successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data, error } =
        await authService.supabaseClient.auth.refreshSession();
      if (error) throw error;

      if (data.session) {
        setAuthState((prev) => ({
          ...prev,
          session: data.session,
          user: data.session?.user as AuthUser,
          isAuthenticated: true,
        }));
      }

      return data.session;
    } catch (error) {
      console.error("Session refresh error:", error);
      return null;
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    ...authState,
    signInWithGoogle,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Create a hook to use the auth context with loading state handling
export function useAuthWithLoading() {
  const context = useAuth();

  // Return a function that components can use to safely access auth state
  // after ensuring it's loaded
  const waitForAuth = () => {
    return new Promise<{
      user: AuthUser | null;
      session: Session | null;
      isAuthenticated: boolean;
      isLoading: boolean;
    }>((resolve) => {
      // If already loaded, resolve immediately
      if (!context.isLoading) {
        resolve(context);
        return;
      }

      // Otherwise, wait for the next tick and check again
      const checkAuth = () => {
        if (!context.isLoading) {
          resolve(context);
        } else {
          // Continue checking
          setTimeout(checkAuth, 100);
        }
      };

      checkAuth();
    });
  };

  return {
    ...context,
    waitForAuth,
  };
}
