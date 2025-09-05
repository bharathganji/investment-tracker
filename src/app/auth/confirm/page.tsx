"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a more robust approach to prevent duplicate calls
  const isProcessingRef = useRef(false);
  const processedCodeRef = useRef<string | null>(null);

  // Memoize the callback handler to prevent recreation
  const handleAuthCallback = useCallback(async () => {
    // Early return if already processing
    if (isProcessingRef.current) {
      console.log("Already processing authentication callback");
      return;
    }

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Check if we've already processed this specific code
    if (code && processedCodeRef.current === code) {
      console.log("This authorization code has already been processed");
      return;
    }

    // Set processing flag immediately
    isProcessingRef.current = true;

    try {
      // Handle OAuth errors
      if (error) {
        setError(errorDescription ?? error);
        setLoading(false);
        toast.error("Authentication failed", {
          description: errorDescription ?? error,
        });
        return;
      }

      // Handle OAuth callback with authorization code
      if (code) {
        // Store the code being processed
        processedCodeRef.current = code;

        console.log("Starting OAuth code exchange for:", code);

        try {
          const { error: exchangeError } =
            await authService.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("OAuth exchange error:", exchangeError);
            const errorMessage =
              exchangeError instanceof Error
                ? exchangeError.message
                : typeof exchangeError === "string"
                  ? exchangeError
                  : JSON.stringify(exchangeError);

            // Handle specific errors
            if (
              errorMessage.includes("invalid_grant") ||
              errorMessage.includes("authorization code") ||
              errorMessage.includes("code verifier") ||
              errorMessage.includes("already been processed")
            ) {
              setError(
                "Authorization code has already been used or has expired. Please try signing in again.",
              );
              toast.error("Authentication failed", {
                description:
                  "Authorization code has already been used. Please try signing in again.",
              });
            } else {
              setError(
                `Failed to exchange OAuth authorization code for session: ${errorMessage}`,
              );
              toast.error("Authentication failed", {
                description: "Unable to complete the sign-in process",
              });
            }
            setLoading(false);
            return;
          }

          // Success - redirect to dashboard
          console.log("OAuth exchange successful, redirecting to dashboard");
          toast.success("Successfully signed in!");

          // Use setTimeout to ensure state is set before navigation
          setTimeout(() => {
            router.replace("/dashboard");
          }, 100);
        } catch (err) {
          console.error("OAuth callback error:", err);
          setError("Failed to complete authentication");
          toast.error("Authentication failed", {
            description: "Unable to complete the sign-in process",
          });
          setLoading(false);
        }
        return;
      }

      // No recognized parameters
      setError("Invalid authentication request");
      toast.error("Authentication failed", {
        description: "Invalid authentication request",
      });
      setLoading(false);
    } finally {
      // Only reset processing flag after a successful completion or error
      // Don't reset if we're about to redirect
      if (!code || error) {
        isProcessingRef.current = false;
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Add a small delay to ensure component is fully mounted
    const timeoutId = setTimeout(() => {
      void handleAuthCallback();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [handleAuthCallback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
      processedCodeRef.current = null;
    };
  }, []);

  if (loading) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icons.spinner className="h-8 w-8 animate-spin" />
          <p>Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <div className="h-8 w-8 text-destructive">!</div>
          </div>
          <h1 className="text-2xl font-bold">Authentication Failed</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.push("/login")}>Return to Login</Button>
        </div>
      </div>
    );
  }

  return null;
}
