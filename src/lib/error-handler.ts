import { toast } from "sonner";

// Define error types
export interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

// Log error to console with additional context
export function logError(
  error: unknown,
  context?: string,
  details?: Record<string, unknown>,
) {
  const timestamp = Date.now();
  const errorInfo: AppError = {
    message: error instanceof Error ? error.message : String(error),
    code:
      error instanceof Error && "code" in error
        ? (error as { code: string }).code
        : undefined,
    details,
    timestamp,
  };

  console.error(
    `[${new Date(timestamp).toISOString()}] ${context ?? "App Error"}:`,
    errorInfo,
  );

  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === "production") {
    // Example: send to logging service
    // logToService(errorInfo);
  }
}

// Handle authentication errors
export function handleAuthError(error: unknown, operation: string) {
  logError(error, `Auth Error - ${operation}`);

  let message = "An authentication error occurred";

  if (error instanceof Error) {
    // Handle specific Supabase auth errors
    if ("code" in error && typeof error.code === "string") {
      switch (error.code) {
        case "invalid_credentials":
          message = "Invalid email or password";
          break;
        case "user_not_found":
          message = "User not found";
          break;
        case "email_exists":
          message = "Email already exists";
          break;
        case "invalid_token":
          message = "Invalid or expired token";
          break;
        default:
          message = error.message || "Authentication failed";
      }
    } else {
      message = error.message || "Authentication failed";
    }
  }

  toast.error(message, {
    description: "Please try again or contact support if the issue persists",
  });
}

// Handle network errors
export function handleNetworkError(error: unknown, operation: string) {
  logError(error, `Network Error - ${operation}`);

  let message = "A network error occurred";

  if (error instanceof Error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      message =
        "Network connection failed. Please check your internet connection.";
    } else {
      message = error.message || "Network request failed";
    }
  }

  toast.error(message, {
    description: "Please try again later",
  });
}

// Handle database errors
export function handleDatabaseError(error: unknown, operation: string) {
  logError(error, `Database Error - ${operation}`);

  let message = "A database error occurred";

  if (error instanceof Error) {
    // Handle specific Supabase database errors
    if ("code" in error && typeof error.code === "string") {
      switch (error.code) {
        case "23505": // Unique violation
          message = "Duplicate entry detected";
          break;
        case "23503": // Foreign key violation
          message = "Referential integrity violation";
          break;
        case "23502": // Not null violation
          message = "Required field is missing";
          break;
        default:
          message = error.message || "Database operation failed";
      }
    } else {
      message = error.message || "Database operation failed";
    }
  }

  toast.error(message, {
    description: "Please try again or contact support if the issue persists",
  });
}

// Handle general application errors
export function handleAppError(error: unknown, operation: string) {
  logError(error, `App Error - ${operation}`);

  let message = "An unexpected error occurred";

  if (error instanceof Error) {
    message = error.message || "An unexpected error occurred";
  }

  toast.error(message, {
    description: "Please try again or contact support if the issue persists",
  });
}

// Create a comprehensive error handler
export function handleError(
  error: unknown,
  operation: string,
  errorType?: "auth" | "network" | "database" | "app",
) {
  // If error type is specified, use specific handler
  if (errorType) {
    switch (errorType) {
      case "auth":
        return handleAuthError(error, operation);
      case "network":
        return handleNetworkError(error, operation);
      case "database":
        return handleDatabaseError(error, operation);
      case "app":
        return handleAppError(error, operation);
    }
  }

  // Otherwise, try to determine error type from error object
  if (error instanceof Error) {
    if ("code" in error) {
      // Likely a Supabase error
      if (typeof (error as { code: string }).code === "string") {
        const errorCode = (error as { code: string }).code;
        if (errorCode.startsWith("PGRST") || errorCode.startsWith("23")) {
          return handleDatabaseError(error, operation);
        } else {
          return handleAuthError(error, operation);
        }
      }
    }

    // Check for network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return handleNetworkError(error, operation);
    }
  }

  // Default to app error
  return handleAppError(error, operation);
}

// Create a wrapper for async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string,
  errorType?: "auth" | "network" | "database" | "app",
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    handleError(error, operationName, errorType);
    return null;
  }
}
