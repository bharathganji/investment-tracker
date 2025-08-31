// Patch for missing React.ActionDispatch type in Next.js 15.5.2
// This is a workaround for the TypeScript error:
// "Namespace 'React' has no exported member 'ActionDispatch'"

import * as React from 'react';

declare module 'react' {
  // Define ActionDispatch type to match what Next.js expects
  type ActionDispatch<A> = (value: A) => void;
}