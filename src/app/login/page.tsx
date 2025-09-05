"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, isAuthenticated, isLoading } = useAuth();
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Redirect authenticated users to homepage
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Don't render anything while checking auth state
  if (isLoading) {
    return null;
  }

  // If user is authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsLoadingState(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold">
            Investment <span className="text-primary">Tracker</span>
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Continue with
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoadingState}
            size="lg"
          >
            {isLoadingState ? (
              <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-5 w-5" />
            )}
            Sign in with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
